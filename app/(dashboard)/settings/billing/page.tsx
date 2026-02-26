import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanCard } from "@/components/billing/PlanCard";
import { CurrentPlanBanner } from "@/components/billing/CurrentPlanBanner";
import { UsageMeter } from "@/components/billing/UsageMeter";
import { PLANS } from "@/lib/stripe/plans";
import { PLAN_LIMITS } from "@/lib/constants";
import { getT } from "@/lib/i18n/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
  const t = await getT();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("organization_id, role").eq("id", user.id).single();
  const { data: org } = await supabase.from("organizations").select("id, plan").eq("id", profile!.organization_id).single();

  if (!org) redirect("/dashboard");

  const isOwner = profile?.role === "owner";
  const plan = org.plan as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[plan];

  const [{ count: contactCount }, { count: dealCount }] = await Promise.all([
    supabase.from("contacts").select("*", { count: "exact", head: true }).eq("organization_id", org.id),
    supabase.from("deals").select("*", { count: "exact", head: true }).eq("organization_id", org.id).eq("status", "open"),
  ]);

  return (
    <div className="space-y-6 max-w-4xl">
      <CurrentPlanBanner plan={org.plan} />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t.settings.billing.usage}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UsageMeter label={t.settings.billing.contacts} used={contactCount ?? 0} limit={limits.contacts === Infinity ? null : limits.contacts} />
          <UsageMeter label={t.settings.billing.openDeals} used={dealCount ?? 0} limit={limits.deals === Infinity ? null : limits.deals} />
        </CardContent>
      </Card>

      <div>
        <h3 className="text-sm font-medium mb-4">{t.settings.billing.plans}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} currentPlan={org.plan} isOwner={isOwner} />
          ))}
        </div>
      </div>
    </div>
  );
}
