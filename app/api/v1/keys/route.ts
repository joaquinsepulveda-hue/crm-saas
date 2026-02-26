import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { createHash, randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("organization_id, role").eq("id", user.id).single();
  if (!profile || !["owner", "admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { name } = await req.json();
  const rawKey = `crm_${randomBytes(32).toString("hex")}`;
  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.slice(0, 12);

  const serviceSupabase = createServiceClient();

  // Delete existing keys for this org (one key at a time for simplicity)
  await serviceSupabase.from("api_keys").delete().eq("organization_id", profile.organization_id);

  const { error } = await serviceSupabase.from("api_keys").insert({
    organization_id: profile.organization_id,
    name: name ?? "REST API",
    key_hash: keyHash,
    key_prefix: keyPrefix,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ key: rawKey, prefix: keyPrefix });
}
