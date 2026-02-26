import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";
import { sendTeamInviteEmail } from "@/lib/resend/send";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id, role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || !["owner", "admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { email, role } = await req.json();
  if (!email || !role) {
    return NextResponse.json({ error: "Email and role are required" }, { status: 400 });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const serviceSupabase = createServiceClient();

  const { data: org } = await serviceSupabase
    .from("organizations")
    .select("name")
    .eq("id", profile.organization_id)
    .single();

  const { error } = await serviceSupabase.from("invitations").insert({
    organization_id: profile.organization_id,
    email,
    role,
    token,
    status: "pending",
    invited_by: user.id,
    expires_at: expiresAt,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  try {
    await sendTeamInviteEmail(email, {
      inviterName: profile.full_name ?? "A team member",
      workspaceName: org?.name ?? "Your workspace",
      inviteToken: token,
      role,
    });
  } catch (err) {
    console.error("Failed to send invite email:", err);
  }

  return NextResponse.json({ success: true });
}
