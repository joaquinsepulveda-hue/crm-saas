import { NextResponse } from "next/server";

// Stripe webhooks not active — billing is handled manually.
export async function POST() {
  return NextResponse.json({ received: true });
}
