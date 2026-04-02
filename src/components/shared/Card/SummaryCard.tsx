import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SummaryCardProps {
  label: string;
  amount: string;
  trend: "up" | "down";
  trendText: string;
  icon: ReactNode;
}

const SummaryCard = ({
  label,
  amount,
  trend,
  trendText,
  icon,
}: SummaryCardProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="rounded-lg bg-accent p-2">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{amount}</p>
      <div className="flex items-center gap-1 text-sm">
        {trend === "up" ? (
          <TrendingUp className="h-4 w-4 text-success" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive" />
        )}
        <span className={trend === "up" ? "text-success" : "text-destructive"}>
          {trendText}
        </span>
      </div>
    </div>
  );
};

export default SummaryCard;
