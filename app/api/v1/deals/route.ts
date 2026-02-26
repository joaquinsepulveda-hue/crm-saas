import { NextRequest } from "next/server";
import { getOrgFromApiKey } from "@/lib/api/auth";
import { apiResponse, handleOptions } from "@/lib/api/cors";
import { createServiceClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/constants";

export function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const orgId = await getOrgFromApiKey(req);
  if (!orgId) return apiResponse({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const status = searchParams.get("status");

  const supabase = createServiceClient();
  let query = supabase
    .from("deals")
    .select("*, stage:pipeline_stages(*), contact:contacts(id, first_name, last_name)", { count: "exact" })
    .eq("organization_id", orgId)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) return apiResponse({ error: error.message }, { status: 500 });
  return apiResponse({ data, total: count, limit, offset });
}

export async function POST(req: NextRequest) {
  const orgId = await getOrgFromApiKey(req);
  if (!orgId) return apiResponse({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceClient();

  // Enforce plan deal limit
  const { data: org } = await supabase
    .from("organizations")
    .select("plan")
    .eq("id", orgId)
    .single();
  const planLimits = PLAN_LIMITS[(org?.plan ?? "free") as keyof typeof PLAN_LIMITS];
  if (planLimits.deals !== Infinity) {
    const { count } = await supabase
      .from("deals")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("status", "open");
    if ((count ?? 0) >= planLimits.deals) {
      return apiResponse({ error: `Plan limit reached (${planLimits.deals} open deals)` }, { status: 403 });
    }
  }

  const body = await req.json();
  const { data, error } = await supabase
    .from("deals")
    .insert({ ...body, organization_id: orgId })
    .select()
    .single();

  if (error) return apiResponse({ error: error.message }, { status: 400 });
  return apiResponse({ data }, { status: 201 });
}
