import { Phone, Mail, Users, FileText, CheckSquare } from "lucide-react";
import type { ActivityType } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<ActivityType, typeof Phone> = {
  call: Phone,
  email: Mail,
  meeting: Users,
  note: FileText,
  task: CheckSquare,
};

const COLORS: Record<ActivityType, string> = {
  call: "text-blue-400 bg-blue-400/10",
  email: "text-purple-400 bg-purple-400/10",
  meeting: "text-emerald-400 bg-emerald-400/10",
  note: "text-amber-400 bg-amber-400/10",
  task: "text-rose-400 bg-rose-400/10",
};

interface ActivityTypeIconProps {
  type: ActivityType;
  size?: "sm" | "md";
}

export function ActivityTypeIcon({ type, size = "md" }: ActivityTypeIconProps) {
  const Icon = ICONS[type] ?? FileText;
  const color = COLORS[type] ?? "text-muted-foreground bg-muted";

  return (
    <div className={cn("rounded-lg flex items-center justify-center flex-shrink-0", color, size === "sm" ? "w-7 h-7" : "w-9 h-9")}>
      <Icon className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
    </div>
  );
}
