import { NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createHash } from "crypto";

export async function getOrgFromApiKey(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const rawKey = authHeader.slice(7);
  const keyHash = createHash("sha256").update(rawKey).digest("hex");

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("api_keys")
    .select("organization_id")
    .eq("key_hash", keyHash)
    .single();

  return data?.organization_id ?? null;
}
