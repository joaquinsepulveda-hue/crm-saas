import { Progress } from "@/components/ui/progress";

interface UsageMeterProps {
  label: string;
  used: number;
  limit: number | null;
}

export function UsageMeter({ label, used, limit }: UsageMeterProps) {
  const percentage = limit ? Math.min(Math.round((used / limit) * 100), 100) : 0;
  const isNearLimit = limit ? percentage >= 80 : false;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={isNearLimit ? "text-amber-400 font-medium" : "font-medium"}>
          {used.toLocaleString()} {limit ? `/ ${limit.toLocaleString()}` : "/ ∞"}
        </span>
      </div>
      {limit && (
        <Progress value={percentage} className={`h-1.5 ${isNearLimit ? "[&>div]:bg-amber-400" : ""}`} />
      )}
    </div>
  );
}
