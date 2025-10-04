import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import * as si from "systeminformation";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

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
