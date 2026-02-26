import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendActivityReminderEmail } from "@/lib/resend/send";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  // Find activities where remind_at <= now and reminder not yet sent
  const { data: activities } = await supabase
    .from("activities")
    .select("*, contact:contacts(first_name, last_name, email), profile:profiles!activities_assigned_to_fkey(id)")
    .lte("remind_at", new Date().toISOString())
    .eq("reminder_sent", false)
    .eq("status", "planned");

  if (!activities?.length) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;
  for (const activity of activities) {
    try {
      if (activity.contact?.email) {
        await sendActivityReminderEmail({
          to: activity.contact.email,
          contactName: `${activity.contact.first_name} ${activity.contact.last_name}`,
          activityTitle: activity.title,
          activityType: activity.type,
          dueAt: activity.due_at ?? activity.remind_at,
        });
      }

      await supabase
        .from("activities")
        .update({ reminder_sent: true })
        .eq("id", activity.id);

      sent++;
    } catch (err) {
      console.error("Failed to send reminder for activity", activity.id, err);
    }
  }

  return NextResponse.json({ sent });
}
