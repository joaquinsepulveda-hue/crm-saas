import { createClient } from "@/lib/supabase/server";
import { getDealSuggestions } from "@/lib/ai/deal-suggestions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { dealId } = await request.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("organization_id, organizations(plan)").eq("id", user.id).single();
    const org = (Array.isArray(profile?.organizations) ? profile.organizations[0] : profile?.organizations) as { plan: string } | null;
    if (!["pro", "enterprise"].includes(org?.plan ?? "")) {
      return NextResponse.json({ error: "AI features require Pro or Enterprise plan" }, { status: 403 });
    }

    const { data: deal } = await supabase
      .from("deals")
      .select("*, stage:pipeline_stages(*), contact:contacts(*, company:companies(*)), company:companies(*)")
      .eq("id", dealId)
      .eq("organization_id", profile!.organization_id)
      .single();

    if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

    // Check cache (< 24h)
    if (deal.ai_suggestions_updated_at) {
      const age = Date.now() - new Date(deal.ai_suggestions_updated_at).getTime();
      if (age < 24 * 60 * 60 * 1000) return NextResponse.json(deal.ai_suggestions);
    }

    const { data: activities } = await supabase
      .from("activities")
      .select("*")
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false })
      .limit(5);

    const suggestions = await getDealSuggestions(deal, activities ?? []);

    await supabase.from("deals").update({
      ai_suggestions: suggestions,
      ai_suggestions_updated_at: new Date().toISOString(),
    }).eq("id", dealId);

    return NextResponse.json(suggestions);
  } catch (err) {
    console.error("Deal suggestions error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
