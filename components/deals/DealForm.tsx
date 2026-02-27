"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dealSchema, type DealFormData } from "@/lib/validations/deal";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/hooks/use-toast";
import { useT } from "@/lib/i18n/client";
import type { PipelineStage, Deal } from "@/lib/types";
import { useState, useEffect } from "react";

interface DealFormProps {
  stages: PipelineStage[];
  deal?: Deal;
  onSuccess: () => void;
}

export function DealForm({ stages, deal, onSuccess }: DealFormProps) {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<{ id: string; first_name: string; last_name: string }[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: deal ? {
      title: deal.title,
      value: deal.value ?? undefined,
      stage_id: deal.stage_id,
      contact_id: deal.contact_id ?? undefined,
      company_id: deal.company_id ?? undefined,
      close_date: deal.close_date ? deal.close_date.split("T")[0] : undefined,
      notes: deal.notes ?? undefined,
    } : {
      stage_id: stages.find((s) => s.win_probability !== 100 && !(s.win_probability === 0 && s.position > 0))?.id,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [{ data: contactsData }, { data: companiesData }] = await Promise.all([
        supabase.from("contacts").select("id, first_name, last_name").order("first_name"),
        supabase.from("companies").select("id, name").order("name"),
      ]);
      if (contactsData) setContacts(contactsData);
      if (companiesData) setCompanies(companiesData);
    };
    fetchData();
  }, []);

  const onSubmit = async (data: DealFormData) => {
    setLoading(true);
    const supabase = createClient();

    let error;
    if (deal) {
      ({ error } = await supabase.from("deals").update(data).eq("id", deal.id));
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();
      if (!profile?.organization_id) {
        toast({ title: "Error", description: "Organización no encontrada. Completa el onboarding primero.", variant: "destructive" });
        setLoading(false);
        return;
      }
      ({ error } = await supabase.from("deals").insert({ ...data, organization_id: profile.organization_id }));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: deal ? "Negocio actualizado" : "Negocio creado" });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">{t.deals.form.title} *</Label>
        <Input id="title" placeholder="Licencia Enterprise - Acme Corp" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="value">{t.deals.form.value}</Label>
          <Input id="value" type="number" placeholder="10000" {...register("value", { valueAsNumber: true })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="close_date">{t.deals.form.closeDate}</Label>
          <Input id="close_date" type="date" {...register("close_date")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{t.deals.form.stage} *</Label>
        <Select defaultValue={watch("stage_id")} onValueChange={(v) => setValue("stage_id", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar etapa" />
          </SelectTrigger>
          <SelectContent>
            {stages
              .filter((s) => s.win_probability !== 100 && !(s.win_probability === 0 && s.position > 0))
              .map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors.stage_id && <p className="text-xs text-destructive">{errors.stage_id.message}</p>}
      </div>

      {contacts.length > 0 && (
        <div className="space-y-1.5">
          <Label>{t.deals.form.contact}</Label>
          <Select defaultValue={watch("contact_id") ?? undefined} onValueChange={(v) => setValue("contact_id", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Vincular contacto (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.first_name} {c.last_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {companies.length > 0 && (
        <div className="space-y-1.5">
          <Label>{t.deals.form.company}</Label>
          <Select defaultValue={watch("company_id") ?? undefined} onValueChange={(v) => setValue("company_id", v === "none" ? null : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Vincular empresa (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin empresa</SelectItem>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="notes">{t.deals.form.notes}</Label>
        <Textarea id="notes" placeholder="Notas sobre este negocio..." rows={3} {...register("notes")} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t.common.loading : deal ? `${t.common.update} ${t.deals.title.slice(0, -1)}` : `${t.common.create} ${t.deals.title.slice(0, -1)}`}
      </Button>
    </form>
  );
}
