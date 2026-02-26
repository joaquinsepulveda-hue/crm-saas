import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "El nombre de la empresa es requerido").max(200),
  domain: z.string().max(200).optional().or(z.literal("")),
  industry: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
});

export type CompanyFormData = z.infer<typeof companySchema>;
