"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, type CompanyFormData } from "@/lib/validations/company";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/hooks/use-toast";
import { COMPANY_SIZES, INDUSTRIES } from "@/lib/constants";
import { useT } from "@/lib/i18n/client";
import type { Company } from "@/lib/types";
import { useState } from "react";

interface CompanyFormProps {
  company?: Company;
  onSuccess: () => void;
}

export function CompanyForm({ company, onSuccess }: CompanyFormProps) {
  const t = useT();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: company ? {
      name: company.name,
      domain: company.domain ?? undefined,
      industry: company.industry ?? undefined,
      size: company.size ?? undefined,
      website: company.website ?? undefined,
      phone: company.phone ?? undefined,
      address: company.address ?? undefined,
    } : {},
  });

  const onSubmit = async (data: CompanyFormData) => {
    setLoading(true);
    const supabase = createClient();

    let error;
    if (company) {
      ({ error } = await supabase.from("companies").update(data).eq("id", company.id));
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();
      if (!profile?.organization_id) {
        toast({ title: "Error", description: "Organización no encontrada. Completa el onboarding primero.", variant: "destructive" });
        setLoading(false);
        return;
      }
      ({ error } = await supabase.from("companies").insert({ ...data, organization_id: profile.organization_id }));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: company ? "Empresa actualizada" : "Empresa creada" });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nombre de la empresa *</Label>
        <Input id="name" placeholder="Acme Corp" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="domain">{t.companies.detail.domain}</Label>
          <Input id="domain" placeholder="acme.com" {...register("domain")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website">{t.companies.detail.website}</Label>
          <Input id="website" placeholder="https://acme.com" {...register("website")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>{t.companies.detail.industry}</Label>
          <Select defaultValue={watch("industry") ?? undefined} onValueChange={(v) => setValue("industry", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar industria" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{t.companies.detail.size}</Label>
          <Select defaultValue={watch("size") ?? undefined} onValueChange={(v) => setValue("size", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tamaño" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">{t.companies.detail.phone}</Label>
        <Input id="phone" placeholder="+52 (55) 0000-0000" {...register("phone")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">{t.companies.detail.address}</Label>
        <Input id="address" placeholder="Av. Insurgentes 123, CDMX" {...register("address")} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t.common.loading : company ? `${t.common.update} ${t.companies.title.slice(0, -1)}` : `${t.common.create} ${t.companies.title.slice(0, -1)}`}
      </Button>
    </form>
  );
}
