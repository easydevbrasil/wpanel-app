import { useState, useEffect } from "react";
import { GaugeCard } from "@/components/GaugeCard";
import { Cpu, HardDrive, MemoryStick, Cloud } from "lucide-react";

export default function DashboardPage() {
  // TODO: Remove mock data - replace with real WebSocket data
  const [metrics, setMetrics] = useState({
    cpu: 45.3,
    ram: 12.8,
    storage: 450,
    cloud: 85,
  });

  useEffect(() => {
    // TODO: Remove mock WebSocket - connect to real server
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.random() * 100,
        ram: Math.random() * 16,
        storage: 400 + Math.random() * 100,
        cloud: 50 + Math.random() * 100,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitoramento em tempo real dos recursos do servidor
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GaugeCard
          title="CPU"
          value={metrics.cpu}
          maxValue={100}
          unit="%"
          icon={Cpu}
          color="from-blue-500 to-purple-600"
        />
        <GaugeCard
          title="RAM"
          value={metrics.ram}
          maxValue={16}
          unit="GB"
          icon={MemoryStick}
          color="from-purple-500 to-pink-600"
        />
        <GaugeCard
          title="Storage"
          value={metrics.storage}
          maxValue={500}
          unit="GB"
          icon={HardDrive}
          color="from-indigo-500 to-blue-600"
        />
        <GaugeCard
          title="Proton Drive"
          value={metrics.cloud}
          maxValue={500}
          unit="GB"
          icon={Cloud}
          color="from-cyan-500 to-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-chart-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Sistema atualizado com sucesso</p>
                  <p className="text-xs text-muted-foreground">há {i} hora(s)</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Status do Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Uptime</span>
              <span className="text-sm text-chart-3 font-mono">99.9%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Conexões Ativas</span>
              <span className="text-sm text-chart-1 font-mono">24</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Última Atualização</span>
              <span className="text-sm text-muted-foreground font-mono">2 min atrás</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
