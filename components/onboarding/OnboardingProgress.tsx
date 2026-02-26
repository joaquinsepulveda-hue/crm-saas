"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { path: "/onboarding/workspace", label: "Workspace" },
  { path: "/onboarding/team", label: "Team" },
  { path: "/onboarding/import", label: "Import" },
];

export function OnboardingProgress() {
  const pathname = usePathname();
  const currentIndex = STEPS.findIndex((s) => s.path === pathname);

  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={step.path} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-primary/20 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}>
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={cn("text-xs font-medium", isCurrent ? "text-foreground" : "text-muted-foreground")}>
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn("w-16 h-[2px] mx-2 mb-4 transition-all", isCompleted ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
