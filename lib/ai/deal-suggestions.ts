import { anthropic } from "./client";
import { Deal, Activity, DealSuggestions } from "@/lib/types";

export async function getDealSuggestions(
  deal: Deal,
  recentActivities: Activity[]
): Promise<DealSuggestions> {
  const activitiesSummary = recentActivities
    .slice(0, 5)
    .map((a) => `- ${a.type}: ${a.title} (${a.status})`)
    .join("\n");

  const prompt = `You are a CRM sales coach. Analyze this deal and provide actionable suggestions.

Deal Information:
- Title: ${deal.title}
- Value: $${deal.value.toLocaleString()}
- Stage: ${deal.stage?.name ?? "Unknown"}
- Status: ${deal.status}
- Expected Close: ${deal.expected_close_date ?? "Not set"}
- Contact: ${deal.contact ? `${deal.contact.first_name} ${deal.contact.last_name}` : "Unknown"}
- Company: ${deal.company?.name ?? deal.contact?.company?.name ?? "Unknown"}

Recent Activities (last 5):
${activitiesSummary || "No recent activities"}

Provide analysis including:
1. Urgency level (low/medium/high)
2. Deal health score (0-100)
3. 3-5 specific next actions
4. 2-4 risk factors

Respond with valid JSON only, no markdown:
{
  "urgency": "low" | "medium" | "high",
  "deal_health_score": number,
  "next_actions": string[],
  "risk_factors": string[]
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const parsed = JSON.parse(content.text);
  return { ...parsed, generated_at: new Date().toISOString() };
}
