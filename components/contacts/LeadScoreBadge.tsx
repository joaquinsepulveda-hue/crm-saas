import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeadScoreBadgeProps {
  score: number | null;
  grade?: string | null;
  size?: "sm" | "md";
}

export function LeadScoreBadge({ score, grade, size = "md" }: LeadScoreBadgeProps) {
  if (score === null) return <span className="text-xs text-muted-foreground">Sin calificar</span>;

  const color = score >= 75 ? "text-emerald-400 bg-emerald-400/10" :
    score >= 50 ? "text-amber-400 bg-amber-400/10" :
    "text-red-400 bg-red-400/10";

  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 border", color, size === "sm" ? "text-xs" : "text-sm")}>
      <span className="font-bold">{grade ?? ""}</span>
      <span className="font-medium">{score}</span>
    </div>
  );
}
