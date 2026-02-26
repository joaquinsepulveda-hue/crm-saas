import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function GlassCard({ className, glow, ...props }: GlassCardProps) {
  return (
    <div className={cn("rounded-xl border glass", glow && "glow-indigo-sm", className)} {...props} />
  );
}
