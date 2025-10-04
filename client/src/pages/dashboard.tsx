import { useState, useEffect } from "react";
import { GaugeCard } from "@/components/GaugeCard";
import { Cpu, HardDrive, MemoryStick, Cloud } from "lucide-react";
import { io, Socket } from "socket.io-client";

interface MetricData {
  value: number;
  max: number;
  unit: string;
}

interface Metrics {
  cpu: MetricData;
  ram: MetricData;
  storage: MetricData;
  cloud: MetricData;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics>({
    cpu: { value: 0, max: 100, unit: "%" },
    ram: { value: 0, max: 16, unit: "GB" },
    storage: { value: 0, max: 500, unit: "GB" },
    cloud: { value: 0, max: 500, unit: "GB" },
  });
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const socket: Socket = io(window.location.origin, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to metrics WebSocket");
      setConnected(true);
    });

    socket.on("metrics", (data: Metrics) => {
      setMetrics(data);
      setLastUpdate(new Date());
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from metrics WebSocket");
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const formatLastUpdate = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s atrás`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min atrás`;
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitoramento em tempo real dos recursos do servidor
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <GaugeCard
          title="CPU"
          value={metrics.cpu.value}
          maxValue={metrics.cpu.max}
          unit={metrics.cpu.unit}
          icon={Cpu}
          color="from-blue-500 to-purple-600"
        />
        <GaugeCard
          title="RAM"
          value={metrics.ram.value}
          maxValue={metrics.ram.max}
          unit={metrics.ram.unit}
          icon={MemoryStick}
          color="from-purple-500 to-pink-600"
        />
        <GaugeCard
          title="Storage"
          value={metrics.storage.value}
          maxValue={metrics.storage.max}
          unit={metrics.storage.unit}
          icon={HardDrive}
          color="from-indigo-500 to-blue-600"
        />
        <GaugeCard
          title="Proton Drive"
          value={metrics.cloud.value}
          maxValue={metrics.cloud.max}
          unit={metrics.cloud.unit}
          icon={Cloud}
          color="from-cyan-500 to-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-card border rounded-lg p-6 hover-elevate transition-all">
          <h3 className="text-lg font-semibold mb-4">Status da Conexão</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">WebSocket</span>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${connected ? 'bg-chart-3 animate-pulse' : 'bg-destructive'}`} />
                <span className={`text-sm font-mono ${connected ? 'text-chart-3' : 'text-destructive'}`}>
                  {connected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Última Atualização</span>
              <span className="text-sm text-muted-foreground font-mono">{formatLastUpdate()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Intervalo de Atualização</span>
              <span className="text-sm text-chart-1 font-mono">2s</span>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 hover-elevate transition-all">
          <h3 className="text-lg font-semibold mb-4">Métricas do Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">CPU Total</span>
              <span className="text-sm text-foreground font-mono">{metrics.cpu.max}{metrics.cpu.unit}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">RAM Total</span>
              <span className="text-sm text-foreground font-mono">{metrics.ram.max.toFixed(1)}{metrics.ram.unit}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Storage Total</span>
              <span className="text-sm text-foreground font-mono">{metrics.storage.max.toFixed(0)}{metrics.storage.unit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
