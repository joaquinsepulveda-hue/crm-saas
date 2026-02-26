"use client";

import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/client";

interface CurrentPlanBannerProps {
  plan: string;
}

export function CurrentPlanBanner({ plan }: CurrentPlanBannerProps) {
  const t = useT();
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
      <p className="font-medium text-sm">{t.settings.billing.currentPlan}:</p>
      <Badge variant="secondary" className="capitalize text-sm px-3 py-0.5">{plan}</Badge>
    </div>
  );
}
