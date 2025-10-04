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
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStatusColor = () => {
    if (isUnavailable) return "text-muted-foreground";
    if (percentage >= 90) return "text-destructive";
    if (percentage >= 75) return "text-chart-4";
    return "text-chart-3";
  };

  return (
    <Card className="p-6 relative overflow-visible hover-elevate transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color} bg-opacity-10`}>
          <Icon className={`h-5 w-5 text-white`} />
        </div>
        <div className="flex items-center gap-1">
          {isUnavailable ? (
            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
          ) : (
            <div className={`h-2 w-2 rounded-full ${percentage >= 90 ? 'bg-destructive' : 'bg-chart-3'} animate-pulse`} />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        {isUnavailable ? (
          <div className="flex flex-col items-center justify-center h-32">
            <span className="text-sm text-muted-foreground font-medium">
              Indisponível
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Não configurado
            </span>
          </div>
        ) : (
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
                  <stop offset="100%" className="text-purple-600" stopColor="currentColor" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold font-mono ${getStatusColor()}`}>
                {value.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground font-medium mt-1">
                {unit}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {isUnavailable ? "Não configurado" : `${percentage.toFixed(1)}% em uso`}
        </p>
      </div>
    </Card>
  );
}
