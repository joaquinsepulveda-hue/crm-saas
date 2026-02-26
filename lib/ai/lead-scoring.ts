import { anthropic } from "./client";
import { Contact, LeadScoreBreakdown } from "@/lib/types";

export interface LeadScoreResult {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  breakdown: LeadScoreBreakdown;
}

export async function scoreContact(
  contact: Contact,
  activityCount: number,
  dealCount: number
): Promise<LeadScoreResult> {
  const prompt = `You are a CRM lead scoring expert. Score the following lead based on available data.

Contact Information:
- Name: ${contact.first_name} ${contact.last_name}
- Title: ${contact.title ?? "Unknown"}
- Email: ${contact.email ? "Present" : "Missing"}
- Phone: ${contact.phone ? "Present" : "Missing"}
- Status: ${contact.status}
- Source: ${contact.source ?? "Unknown"}
- Tags: ${contact.tags.join(", ") || "None"}
- Company: ${contact.company?.name ?? "Unknown"}
- Company Size: ${contact.company?.size ?? "Unknown"}
- Industry: ${contact.company?.industry ?? "Unknown"}

Engagement Data:
- Total Activities: ${activityCount}
- Associated Deals: ${dealCount}

Score this lead on a 0-100 scale and provide:
1. An overall score (0-100)
2. A grade (A=90-100, B=75-89, C=60-74, D=45-59, F=0-44)
3. Sub-scores for: engagement (0-40), fit (0-40), activity (0-20)
4. A brief 1-2 sentence summary
5. A recommended next action

Respond with valid JSON only, no markdown:
{
  "score": number,
  "grade": "A" | "B" | "C" | "D" | "F",
  "engagement": number,
  "fit": number,
  "activity": number,
  "summary": string,
  "recommended_action": string
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const parsed = JSON.parse(content.text);
  const breakdown: LeadScoreBreakdown = {
    ...parsed,
    scored_at: new Date().toISOString(),
  };

  return { score: parsed.score, grade: parsed.grade, breakdown };
}
