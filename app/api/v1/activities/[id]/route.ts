import { NextRequest } from "next/server";
import { getOrgFromApiKey } from "@/lib/api/auth";
import { apiResponse, handleOptions } from "@/lib/api/cors";
import { createServiceClient } from "@/lib/supabase/server";

export function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getOrgFromApiKey(req);
  if (!orgId) return apiResponse({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*, contact:contacts(*)")
    .eq("id", id)
    .eq("organization_id", orgId)
    .single();

  if (error || !data) return apiResponse({ error: "Not found" }, { status: 404 });
  return apiResponse({ data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getOrgFromApiKey(req);
  if (!orgId) return apiResponse({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("activities")
    .update(body)
    .eq("id", id)
    .eq("organization_id", orgId)
    .select()
    .single();

  if (error) return apiResponse({ error: error.message }, { status: 400 });
  if (!data) return apiResponse({ error: "Not found" }, { status: 404 });
  return apiResponse({ data });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getOrgFromApiKey(req);
  if (!orgId) return apiResponse({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", id)
    .eq("organization_id", orgId);

  if (error) return apiResponse({ error: error.message }, { status: 400 });
  return apiResponse({ success: true });
}
