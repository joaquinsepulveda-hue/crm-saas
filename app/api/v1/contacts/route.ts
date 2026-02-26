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
  const search = searchParams.get("search");

  const supabase = createServiceClient();
  let query = supabase
    .from("contacts")
    .select("*, company:companies(id, name)", { count: "exact" })
    .eq("organization_id", orgId)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
  }

  const { data, count, error } = await query;
  if (error) return apiResponse({ error: error.message }, { status: 500 });

  return apiResponse({ data, total: count, limit, offset });
}

export async function POST(req: NextRequest) {
  const orgId = await getOrgFromApiKey(req);
  if (!orgId) return apiResponse({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceClient();

  // Enforce plan contact limit
  const { data: org } = await supabase
    .from("organizations")
    .select("plan")
    .eq("id", orgId)
    .single();
  const planLimits = PLAN_LIMITS[(org?.plan ?? "free") as keyof typeof PLAN_LIMITS];
  if (planLimits.contacts !== Infinity) {
    const { count } = await supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId);
    if ((count ?? 0) >= planLimits.contacts) {
      return apiResponse({ error: `Plan limit reached (${planLimits.contacts} contacts)` }, { status: 403 });
    }
  }

  const body = await req.json();
  const { data, error } = await supabase
    .from("contacts")
    .insert({ ...body, organization_id: orgId })
    .select()
    .single();

  if (error) return apiResponse({ error: error.message }, { status: 400 });
  return apiResponse({ data }, { status: 201 });
}
