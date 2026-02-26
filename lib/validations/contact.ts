import { z } from "zod";

export const contactSchema = z.object({
  first_name: z.string().min(1, "El nombre es requerido").max(100),
  last_name: z.string().min(1, "El apellido es requerido").max(100),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  title: z.string().max(100).optional().or(z.literal("")),
  company_id: z.string().uuid().optional().nullable(),
  status: z.enum(["lead", "prospect", "customer", "churned"]),
  source: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  notes: z.string().max(5000).optional().or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactSchema>;
