"use client";

import { Button } from "@/components/ui/button";
import { Check, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/stripe/plans";
import { useT } from "@/lib/i18n/client";

// Set NEXT_PUBLIC_CONTACT_EMAIL in your .env to receive upgrade requests
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contacto@example.com";

interface PlanCardProps {
  plan: Plan;
  currentPlan: string;
  isOwner: boolean;
}

export function PlanCard({ plan, currentPlan, isOwner }: PlanCardProps) {
  const t = useT();
  const isCurrent = plan.id === currentPlan;

  const handleRequest = () => {
    const subject = encodeURIComponent(`Solicitud de plan ${plan.name}`);
    const body = encodeURIComponent(`Hola, me gustaría actualizar mi plan a ${plan.name} ($${plan.price}/mes).\n\nPor favor contáctenme para coordinar los siguientes pasos.`);
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`);
  };

  return (
    <div className={cn(
      "rounded-xl border p-6 flex flex-col gap-4 transition-all",
      isCurrent ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40",
      plan.popular && !isCurrent && "ring-1 ring-primary/30"
    )}>
      {plan.popular && !isCurrent && (
        <div className="self-start bg-primary/20 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
          {t.common.mostPopular}
        </div>
      )}

      <div>
        <h3 className="font-semibold capitalize">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground text-sm">/mo</span>
        </div>
      </div>

      <ul className="space-y-2 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <Button className="w-full" variant="outline" disabled>
          {t.settings.billing.currentPlan}
        </Button>
      ) : (
        <Button
          className="w-full gap-2"
          variant={plan.popular ? "default" : "outline"}
          disabled={!isOwner}
          onClick={handleRequest}
        >
          <Mail className="w-3.5 h-3.5" />
          {t.settings.billing.upgrade}
        </Button>
      )}
    </div>
  );
}
