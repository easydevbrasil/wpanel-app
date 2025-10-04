import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface GaugeCardProps {
  title: string;
  value: number;
  maxValue: number;
  unit: string;
  icon: LucideIcon;
  color?: string;
}

export function GaugeCard({
  title,
  value,
  maxValue,
  unit,
  icon: Icon,
  color = "from-blue-500 to-purple-600",
}: GaugeCardProps) {
  const isUnavailable = maxValue === 0;
  const percentage = isUnavailable ? 0 : (value / maxValue) * 100;
  
  const startAngle = 180;
  const endAngle = 360;
  const totalAngle = endAngle - startAngle;
  const currentAngle = startAngle + (percentage / 100) * totalAngle;
  
  const needleLength = 65;
  const needleX = 90 + needleLength * Math.cos((currentAngle * Math.PI) / 180);
  const needleY = 90 + needleLength * Math.sin((currentAngle * Math.PI) / 180);

  const getStatusColor = () => {
    if (isUnavailable) return "text-muted-foreground";
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 75) return "text-orange-500";
    return "text-green-500";
  };

  const getGradientColor = () => {
    if (percentage >= 90) return "from-red-500 via-orange-500 to-yellow-500";
    if (percentage >= 75) return "from-orange-500 via-yellow-500 to-green-500";
    return "from-green-500 via-blue-500 to-purple-500";
  };

  const createArcPath = (startA: number, endA: number, radius: number) => {
    const start = {
      x: 90 + radius * Math.cos((startA * Math.PI) / 180),
      y: 90 + radius * Math.sin((startA * Math.PI) / 180),
    };
    const end = {
      x: 90 + radius * Math.cos((endA * Math.PI) / 180),
      y: 90 + radius * Math.sin((endA * Math.PI) / 180),
    };
    const largeArc = endA - startA > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  return (
    <Card className="p-6 relative overflow-visible hover-elevate transition-all duration-300 bg-gradient-to-br from-card to-card/80">
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex items-center gap-1.5">
          {isUnavailable ? (
            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
          ) : (
            <div className={`h-2 w-2 rounded-full ${percentage >= 90 ? 'bg-red-500' : percentage >= 75 ? 'bg-orange-500' : 'bg-green-500'} animate-pulse shadow-lg`} />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-2">
        {isUnavailable ? (
          <div className="flex flex-col items-center justify-center h-40">
            <span className="text-sm text-muted-foreground font-medium">
              Indisponível
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Não configurado
            </span>
          </div>
        ) : (
          <div className="relative w-44 h-44">
            <svg className="w-full h-full" viewBox="0 0 180 180">
              <defs>
                <linearGradient id={`gauge-gradient-${title}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className="text-green-500" stopColor="currentColor" />
                  <stop offset="50%" className="text-yellow-500" stopColor="currentColor" />
                  <stop offset="100%" className="text-red-500" stopColor="currentColor" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <circle cx="90" cy="90" r="70" fill="none" stroke="currentColor" strokeWidth="14" className="text-muted/10" />
              
              <path
                d={createArcPath(startAngle, currentAngle, 70)}
                fill="none"
                stroke={`url(#gauge-gradient-${title})`}
                strokeWidth="14"
                strokeLinecap="round"
                style={{ transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              />
              
              <line
                x1="90"
                y1="90"
                x2={needleX}
                y2={needleY}
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className={getStatusColor()}
                filter="url(#glow)"
                style={{ transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              />
              
              <circle cx="90" cy="90" r="8" fill="currentColor" className={getStatusColor()} filter="url(#glow)" />
              <circle cx="90" cy="90" r="4" fill="white" />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                {percentage.toFixed(0)}%
              </span>
              <span className={`text-3xl font-bold font-mono ${getStatusColor()} drop-shadow-lg`}>
                {value.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground font-medium mt-0.5 uppercase tracking-wider">
                {unit}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-1">
        <h3 className="text-sm font-bold text-foreground tracking-wide">{title}</h3>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className={`h-1.5 w-1.5 rounded-full ${percentage >= 90 ? 'bg-red-500' : percentage >= 75 ? 'bg-orange-500' : 'bg-green-500'}`} />
          <p className="text-xs text-muted-foreground font-medium">
            {isUnavailable ? "Não configurado" : `${percentage.toFixed(0)}% de ${maxValue.toFixed(0)}${unit}`}
          </p>
        </div>
      </div>
    </Card>
  );
}
