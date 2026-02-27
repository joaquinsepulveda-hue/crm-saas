"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { contactSchema, ContactFormData } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/shared/TagInput";
import { toast } from "@/lib/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { CONTACT_STATUSES, CONTACT_SOURCES } from "@/lib/constants";
import { useT } from "@/lib/i18n/client";
import type { Contact } from "@/lib/types";

interface ContactFormProps {
  contact?: Contact;
  onSuccess?: () => void;
}

export function ContactForm({ contact, onSuccess }: ContactFormProps) {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>(contact?.tags ?? []);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("companies").select("id, name").order("name");
      if (data) setCompanies(data);
    };
    fetchCompanies();
  }, []);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact ? {
      first_name: contact.first_name, last_name: contact.last_name,
      email: contact.email ?? "", phone: contact.phone ?? "",
      title: contact.title ?? "", status: contact.status,
      company_id: contact.company_id ?? undefined,
      source: contact.source ?? undefined, tags: contact.tags, notes: contact.notes ?? "",
    } : { status: "lead", tags: [] },
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      ...data,
      tags,
      email: data.email || null,
      phone: data.phone || null,
      title: data.title || null,
      notes: data.notes || null,
      company_id: data.company_id || null,
    };

    let error;
    if (contact) {
      ({ error } = await supabase.from("contacts").update(payload).eq("id", contact.id));
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();
      if (!profile?.organization_id) {
        toast({ title: "Error", description: "Organización no encontrada. Completa el onboarding primero.", variant: "destructive" });
        setLoading(false);
        return;
      }
      ({ error } = await supabase.from("contacts").insert({ ...payload, organization_id: profile.organization_id }));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: contact ? "Contacto actualizado" : "Contacto creado" });
      onSuccess?.();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Nombre *</Label>
          <Input placeholder="Juan" {...register("first_name")} />
          {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Apellido *</Label>
          <Input placeholder="García" {...register("last_name")} />
          {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>{t.contacts.detail.email}</Label>
        <Input type="email" placeholder="juan@empresa.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>{t.contacts.detail.phone}</Label>
          <Input placeholder="+52 (55) 0000-0000" {...register("phone")} />
        </div>
        <div className="space-y-1.5">
          <Label>{t.contacts.detail.title}</Label>
          <Input placeholder="CEO" {...register("title")} />
        </div>
      </div>

      {companies.length > 0 && (
        <div className="space-y-1.5">
          <Label>{t.contacts.detail.company}</Label>
          <Select
            defaultValue={watch("company_id") ?? undefined}
            onValueChange={(v) => setValue("company_id", v === "none" ? null : v)}
          >
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>{t.contacts.detail.status}</Label>
          <Select defaultValue={contact?.status ?? "lead"} onValueChange={(v) => setValue("status", v as ContactFormData["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CONTACT_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{t.contacts.detail.source}</Label>
          <Select defaultValue={contact?.source ?? undefined} onValueChange={(v) => setValue("source", v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar fuente" /></SelectTrigger>
            <SelectContent>
              {CONTACT_SOURCES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Etiquetas</Label>
        <TagInput tags={tags} onChange={setTags} placeholder="Agregar etiquetas..." />
      </div>

      <div className="space-y-1.5">
        <Label>{t.contacts.detail.notes}</Label>
        <Textarea placeholder="Notas adicionales..." rows={3} {...register("notes")} />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {contact ? t.common.update : t.common.create} {t.contacts.title.slice(0, -1)}
        </Button>
      </div>
    </form>
  );
}
