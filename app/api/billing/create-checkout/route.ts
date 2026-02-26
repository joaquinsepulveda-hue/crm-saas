import { NextResponse } from "next/server";

// Stripe integration not active — plan upgrades are handled manually via email.
export async function POST() {
  return NextResponse.json({ error: "Stripe not configured. Contact us to upgrade." }, { status: 501 });
}
