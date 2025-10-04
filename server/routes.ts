import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import * as si from "systeminformation";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    
    if (username === "admin" && password === "admin123") {
      req.session.userId = "admin";
      req.session.username = username;
      res.json({ success: true, user: { username } });
    } else {
      res.status(401).json({ success: false, message: "Credenciais inválidas" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err: Error | undefined) => {
      if (err) {
        res.status(500).json({ success: false, message: "Erro ao fazer logout" });
      } else {
        res.json({ success: true });
      }
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.session.userId) {
      res.json({ authenticated: true, user: { username: req.session.username } });
    } else {
      res.json({ authenticated: false });
    }
  });

  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  app.get("/api/plans/:id", async (req, res) => {
    try {
      const plan = await storage.getPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plan" });
    }
  });

  app.post("/api/plans", async (req, res) => {
    try {
      const plan = await storage.createPlan(req.body);
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to create plan" });
    }
  });

  app.patch("/api/plans/:id", async (req, res) => {
    try {
      const plan = await storage.updatePlan(req.params.id, req.body);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to update plan" });
    }
  });

  app.delete("/api/plans/:id", async (req, res) => {
    try {
      const success = await storage.deletePlan(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Plan not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete plan" });
    }
  });

  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // WebSocket connection for real-time metrics
  io.on("connection", (socket) => {
    console.log("Client connected to metrics socket");

    const sendMetrics = async () => {
      try {
        // Get CPU usage
        const cpuLoad = await si.currentLoad();
        const cpuUsage = cpuLoad.currentLoad;

        // Get memory usage
        const mem = await si.mem();
        const ramUsed = mem.used / (1024 * 1024 * 1024); // Convert to GB
        const ramTotal = mem.total / (1024 * 1024 * 1024);

        // Get disk usage
        const fsSize = await si.fsSize();
        const mainDisk = fsSize[0];
        const storageUsed = mainDisk ? mainDisk.used / (1024 * 1024 * 1024) : 0;
        const storageTotal = mainDisk ? mainDisk.size / (1024 * 1024 * 1024) : 0;

        // Get Proton Drive usage (via rclone if available)
        let protonDriveUsed = 0;
        let protonDriveTotal = 0;
        
        try {
          const { stdout } = await execAsync("rclone about proton: --json 2>/dev/null");
          const rcloneData = JSON.parse(stdout);
          if (rcloneData.used) {
            protonDriveUsed = rcloneData.used / (1024 * 1024 * 1024);
          }
          if (rcloneData.total) {
            protonDriveTotal = rcloneData.total / (1024 * 1024 * 1024);
          }
        } catch (error) {
          // rclone not available or not configured - set both to 0 (real unavailable state)
          protonDriveUsed = 0;
          protonDriveTotal = 0;
        }

        const metrics = {
          cpu: {
            value: cpuUsage,
            max: 100,
            unit: "%",
          },
          ram: {
            value: ramUsed,
            max: ramTotal,
            unit: "GB",
          },
          storage: {
            value: storageUsed,
            max: storageTotal,
            unit: "GB",
          },
          cloud: {
            value: protonDriveUsed,
            max: protonDriveTotal,
            unit: "GB",
          },
        };

        socket.emit("metrics", metrics);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    // Send metrics every 2 seconds
    const interval = setInterval(sendMetrics, 2000);
    sendMetrics(); // Send immediately on connection

    socket.on("disconnect", () => {
      console.log("Client disconnected from metrics socket");
      clearInterval(interval);
    });
  });

  return httpServer;
}
