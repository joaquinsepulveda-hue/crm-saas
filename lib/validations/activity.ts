import { z } from "zod";

export const activitySchema = z.object({
  type: z.enum(["call", "email", "meeting", "note", "task"]),
  title: z.string().min(1, "El título es requerido").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  contact_id: z.string().uuid().optional().nullable(),
  deal_id: z.string().uuid().optional().nullable(),
  due_at: z.string().optional().nullable(),
  remind_at: z.string().optional().nullable(),
  status: z.enum(["planned", "completed", "cancelled"]),
});

export type ActivityFormData = z.infer<typeof activitySchema>;
