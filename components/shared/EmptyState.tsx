import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-muted-foreground" />
        </div>
      )}
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-4" size="sm">{action.label}</Button>
      )}
    </div>
  );
}
