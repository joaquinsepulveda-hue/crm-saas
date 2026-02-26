import { z } from "zod";

export const dealSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200),
  value: z.number().min(0, "El valor debe ser positivo"),
  stage_id: z.string().uuid("Etapa inválida"),
  contact_id: z.string().uuid().optional().nullable(),
  company_id: z.string().uuid().optional().nullable(),
  assigned_to: z.string().uuid().optional().nullable(),
  close_date: z.string().optional().nullable(),
  notes: z.string().max(5000).optional().or(z.literal("")),
  lost_reason: z.string().max(500).optional().or(z.literal("")),
});

export type DealFormData = z.infer<typeof dealSchema>;
