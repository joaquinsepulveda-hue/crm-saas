import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { sendWelcomeEmail } from "@/lib/resend/send";

export async function POST(req: Request) {
  try {
    const { org_name, industry } = await req.json();

    // Verify the user is authenticated via server client (reads cookies)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Use service role to bypass RLS for org creation
    const service = createServiceClient();

    const slug = slugify(org_name) + "-" + Math.random().toString(36).slice(2, 6);

    const { data: org, error: orgError } = await service
      .from("organizations")
      .insert({ name: org_name, slug, industry })
      .select()
      .single();

    if (orgError) throw orgError;

    const { error: profileError } = await service
      .from("profiles")
      .update({ organization_id: org.id, role: "owner" })
      .eq("id", user.id);

    if (profileError) throw profileError;

    await service.rpc("seed_default_pipeline", { org_id: org.id });

    // Send welcome email — fire-and-forget, failure must not block onboarding
    if (user.email) {
      const firstName = (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "allí";
      sendWelcomeEmail(user.email, { firstName, workspaceName: org_name }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to create workspace" }, { status: 500 });
  }
}
