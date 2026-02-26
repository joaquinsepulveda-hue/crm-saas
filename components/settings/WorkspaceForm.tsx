"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/hooks/use-toast";
import { useT } from "@/lib/i18n/client";
import { INDUSTRIES } from "@/lib/constants";
import { useState } from "react";
import type { Organization } from "@/lib/types";

const schema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  industry: z.string().optional(),
  website: z.string().url("Ingresa una URL válida").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

interface WorkspaceFormProps {
  organization: Organization;
}

export function WorkspaceForm({ organization }: WorkspaceFormProps) {
  const [loading, setLoading] = useState(false);
  const t = useT();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: organization.name,
      industry: organization.industry ?? undefined,
      website: organization.website ?? undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("organizations").update(data).eq("id", organization.id);
    if (error) toast({ title: t.common.error, description: error.message, variant: "destructive" });
    else toast({ title: "Espacio de trabajo actualizado" });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div className="space-y-1.5">
        <Label htmlFor="name">{`${t.settings.workspace.name} *`}</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>{t.settings.workspace.industry}</Label>
        <Select defaultValue={watch("industry")} onValueChange={(v) => setValue("industry", v)}>
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
        <Label htmlFor="website">{t.settings.workspace.website}</Label>
        <Input id="website" placeholder="https://tuempresa.com" {...register("website")} />
        {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>{t.settings.workspace.slug}</Label>
        <Input value={organization.slug} disabled className="bg-muted/40 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{t.settings.workspace.slugNote}</p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? t.common.saving : t.settings.workspace.save}
      </Button>
    </form>
  );
}
