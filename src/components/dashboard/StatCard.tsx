import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'accent';
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  const cardStyles = {
    default: 'bg-card/80 backdrop-blur-sm border-border hover:border-primary/40',
    primary: 'bg-gradient-to-br from-primary/15 via-primary/[0.08] to-transparent border-primary/30 hover:border-primary/50 hover:shadow-primary/10',
    success: 'bg-gradient-to-br from-success/15 via-success/[0.08] to-transparent border-success/30 hover:border-success/50 hover:shadow-success/10',
    warning: 'bg-gradient-to-br from-warning/15 via-warning/[0.08] to-transparent border-warning/30 hover:border-warning/50 hover:shadow-warning/10',
    destructive: 'bg-gradient-to-br from-destructive/15 via-destructive/[0.08] to-transparent border-destructive/30 hover:border-destructive/50 hover:shadow-destructive/10',
    accent: 'bg-gradient-to-br from-accent/15 via-accent/[0.08] to-transparent border-accent/30 hover:border-accent/50 hover:shadow-accent/10',
  };

  const iconContainerStyles = {
    default: 'bg-muted text-muted-foreground shadow-sm',
    primary: 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/30',
    success: 'bg-gradient-to-br from-success to-success/80 text-success-foreground shadow-xl shadow-success/30',
    warning: 'bg-gradient-to-br from-warning to-warning/80 text-warning-foreground shadow-xl shadow-warning/30',
    destructive: 'bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground shadow-xl shadow-destructive/30',
    accent: 'bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-xl shadow-accent/30',
  };

  const valueStyles = {
    default: 'text-foreground',
    primary: 'text-primary drop-shadow-sm',
    success: 'text-success drop-shadow-sm',
    warning: 'text-warning drop-shadow-sm',
    destructive: 'text-destructive drop-shadow-sm',
    accent: 'text-accent-foreground drop-shadow-sm',
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 group cursor-default",
      cardStyles[variant]
    )}>
      {/* Decorative corner accent with glow */}
      <div className={cn(
        "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40",
        variant === 'primary' && 'bg-primary',
        variant === 'success' && 'bg-success',
        variant === 'warning' && 'bg-warning',
        variant === 'destructive' && 'bg-destructive',
        variant === 'accent' && 'bg-accent',
        variant === 'default' && 'bg-muted-foreground',
      )} />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <p className={cn("text-4xl font-bold tracking-tight", valueStyles[variant])}>
              {value}
            </p>
          </div>
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md mt-2 tracking-wider",
              trend.isPositive 
                ? "bg-success/15 text-success" 
                : "bg-destructive/15 text-destructive"
            )}>
              {trend.isPositive ? "▲" : "▼"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className={cn(
          "p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
          iconContainerStyles[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className={cn(
        "absolute bottom-0 left-0 h-1 w-0 transition-all duration-700 group-hover:w-full",
        variant === 'primary' && 'bg-primary',
        variant === 'success' && 'bg-success',
        variant === 'warning' && 'bg-warning',
        variant === 'destructive' && 'bg-destructive',
        variant === 'accent' && 'bg-accent',
        variant === 'default' && 'bg-muted-foreground',
      )} />
    </div>
  );
}
