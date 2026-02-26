import { NextRequest } from "next/server";
import { getOrgFromApiKey } from "@/lib/api/auth";
import { apiResponse, handleOptions } from "@/lib/api/cors";
import { createServiceClient } from "@/lib/supabase/server";

export function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const orgId = await getOrgFromApiKey(req);
  if (!orgId) return apiResponse({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const supabase = createServiceClient();
  const { data, count, error } = await supabase
    .from("companies")
    .select("*", { count: "exact" })
    .eq("organization_id", orgId)
    .range(offset, offset + limit - 1)
    .order("name");

  if (error) return apiResponse({ error: error.message }, { status: 500 });
  return apiResponse({ data, total: count, limit, offset });
}

export async function POST(req: NextRequest) {
  const orgId = await getOrgFromApiKey(req);
  if (!orgId) return apiResponse({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("companies")
    .insert({ ...body, organization_id: orgId })
    .select()
    .single();

  if (error) return apiResponse({ error: error.message }, { status: 400 });
  return apiResponse({ data }, { status: 201 });
}
