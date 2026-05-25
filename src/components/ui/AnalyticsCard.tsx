"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number; // positive or negative percentage
  description?: string;
  iconColorClass?: string;
  iconBgClass?: string;
}

export function AnalyticsCard({ title, value, icon: Icon, trend, description, iconColorClass = "text-primary", iconBgClass = "bg-primary/10" }: AnalyticsCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2 z-10 relative">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            
            {trend !== undefined && (
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-500/10 text-green-500' : isNegative ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'}`}>
                  {isPositive ? '+' : ''}{trend}%
                </span>
                <span className="text-xs text-muted-foreground">{description || "vs last month"}</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-2xl ${iconBgClass} flex items-center justify-center ${iconColorClass} z-10 relative group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
      </CardContent>
    </Card>
  );
}
