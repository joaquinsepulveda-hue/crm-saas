"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, type ActivityFormData } from "@/lib/validations/activity";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/hooks/use-toast";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { useT } from "@/lib/i18n/client";
import { useState, useEffect } from "react";
import type { Activity } from "@/lib/types";

interface ActivityFormProps {
  activity?: Activity;
  defaultContactId?: string;
  defaultDealId?: string;
  onSuccess: () => void;
}

export function ActivityForm({ activity, defaultContactId, defaultDealId, onSuccess }: ActivityFormProps) {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<{ id: string; first_name: string; last_name: string }[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: activity ? {
      type: activity.type,
      title: activity.title,
      description: activity.description ?? undefined,
      contact_id: activity.contact_id ?? undefined,
      deal_id: activity.deal_id ?? undefined,
      due_at: activity.due_at ? activity.due_at.split("T")[0] : undefined,
      status: activity.status,
    } : {
      type: "call",
      status: "planned",
      contact_id: defaultContactId,
      deal_id: defaultDealId,
    },
  });

  useEffect(() => {
    const fetchContacts = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("contacts").select("id, first_name, last_name").order("first_name");
      if (data) setContacts(data);
    };
    fetchContacts();
  }, []);

  const onSubmit = async (data: ActivityFormData) => {
    setLoading(true);
    const supabase = createClient();

    let error;
    if (activity) {
      ({ error } = await supabase.from("activities").update(data).eq("id", activity.id));
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();
      if (!profile?.organization_id) {
        toast({ title: "Error", description: "Organización no encontrada. Completa el onboarding primero.", variant: "destructive" });
        setLoading(false);
        return;
      }
      ({ error } = await supabase.from("activities").insert({ ...data, organization_id: profile.organization_id, user_id: user!.id }));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: activity ? "Actividad actualizada" : "Actividad registrada" });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Tipo *</Label>
          <Select defaultValue={watch("type")} onValueChange={(v) => setValue("type", v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Estado</Label>
          <Select defaultValue={watch("status")} onValueChange={(v) => setValue("status", v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">{t.activities.statuses.planned}</SelectItem>
              <SelectItem value="completed">{t.activities.statuses.completed}</SelectItem>
              <SelectItem value="cancelled">{t.activities.statuses.cancelled}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">Título *</Label>
        <Input id="title" placeholder="Llamada de seguimiento con Carlos" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="due_at">Fecha límite</Label>
        <Input id="due_at" type="date" {...register("due_at")} />
      </div>

      {contacts.length > 0 && (
        <div className="space-y-1.5">
          <Label>Contacto</Label>
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

      <div className="space-y-1.5">
        <Label htmlFor="description">Notas</Label>
        <Textarea id="description" placeholder="Notas adicionales..." rows={3} {...register("description")} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t.common.loading : activity ? "Actualizar Actividad" : t.activities.logActivity}
      </Button>
    </form>
  );
}
