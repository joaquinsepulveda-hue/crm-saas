import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Billing not configured" }, { status: 501 });
}
