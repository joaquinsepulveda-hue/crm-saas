"use client";

import { useOrganization } from "./useOrganization";
import { PLAN_LIMITS } from "@/lib/constants";
import type { PlanLimits } from "@/lib/types";

export function usePlanLimits(): PlanLimits & { plan: string; loading: boolean } {
  const { organization, loading } = useOrganization();
  const plan = organization?.plan ?? "free";
  const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.free;
  return { ...limits, plan, loading };
}
