import { PlanName, PlanLimits } from "@/lib/types";
import { PLAN_LIMITS } from "@/lib/constants";

export interface Plan {
  id: PlanName;
  name: string;
  description: string;
  price: number;
  limits: PlanLimits;
  features: string[];
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for solo founders just getting started",
    price: 0,
    limits: PLAN_LIMITS.free,
    features: ["1 usuario", "100 contactos", "10 negocios", "Pipeline básico", "Soporte por email"],
  },
  {
    id: "starter",
    name: "Starter",
    description: "For small teams ready to grow",
    price: 29,
    limits: PLAN_LIMITS.starter,
    features: ["5 usuarios", "1,000 contactos", "Negocios ilimitados", "Etapas personalizadas", "Importación CSV", "Soporte prioritario"],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing teams that need AI and analytics",
    price: 79,
    limits: PLAN_LIMITS.pro,
    popular: true,
    features: ["15 usuarios", "Contactos ilimitados", "Negocios ilimitados", "IA: puntuación de leads", "IA: sugerencias de negocios", "Reportes avanzados", "Acceso REST API", "Integraciones"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large teams that need everything",
    price: 199,
    limits: PLAN_LIMITS.enterprise,
    features: ["Usuarios ilimitados", "Contactos ilimitados", "Negocios ilimitados", "Todo lo de Pro", "Integraciones personalizadas", "SLA garantizado", "Soporte dedicado", "Onboarding personalizado"],
  },
];

export function getPlanById(planId: PlanName): Plan {
  return PLANS.find((p) => p.id === planId) ?? PLANS[0];
}
