import { GaugeCard } from "../GaugeCard";
import { Cpu, HardDrive, MemoryStick, Cloud } from "lucide-react";

export default function GaugeCardExample() {
  return (
    <div className="p-8 bg-background grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <GaugeCard
        title="CPU"
        value={45.3}
        maxValue={100}
        unit="%"
        icon={Cpu}
        color="from-blue-500 to-purple-600"
      />
      <GaugeCard
        title="RAM"
        value={12.8}
        maxValue={16}
        unit="GB"
        icon={MemoryStick}
        color="from-purple-500 to-pink-600"
      />
      <GaugeCard
        title="Storage"
        value={450}
        maxValue={500}
        unit="GB"
        icon={HardDrive}
        color="from-indigo-500 to-blue-600"
      />
      <GaugeCard
        title="Proton Drive"
        value={85}
        maxValue={500}
        unit="GB"
        icon={Cloud}
        color="from-cyan-500 to-blue-600"
      />
    </div>
  );
}
