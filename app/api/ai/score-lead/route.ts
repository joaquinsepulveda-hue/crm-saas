import { createClient } from "@/lib/supabase/server";
import { scoreContact } from "@/lib/ai/lead-scoring";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { contactId } = await request.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("organization_id, organizations(plan)").eq("id", user.id).single();
    const org = (Array.isArray(profile?.organizations) ? profile.organizations[0] : profile?.organizations) as { plan: string } | null;
    if (!["pro", "enterprise"].includes(org?.plan ?? "")) {
      return NextResponse.json({ error: "AI features require Pro or Enterprise plan" }, { status: 403 });
    }

    const { data: contact } = await supabase
      .from("contacts")
      .select("*, company:companies(*)")
      .eq("id", contactId)
      .eq("organization_id", profile!.organization_id)
      .single();

    if (!contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });

    const { count: activityCount } = await supabase.from("activities").select("*", { count: "exact", head: true }).eq("contact_id", contactId);
    const { count: dealCount } = await supabase.from("deals").select("*", { count: "exact", head: true }).eq("contact_id", contactId);

    const result = await scoreContact(contact, activityCount ?? 0, dealCount ?? 0);

    await supabase.from("contacts").update({
      lead_score: result.score,
      lead_score_breakdown: result.breakdown,
    }).eq("id", contactId);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Score lead error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
