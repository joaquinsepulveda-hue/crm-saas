"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/hooks/use-toast";
import { useT } from "@/lib/i18n/client";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  role: z.enum(["admin", "member", "viewer"]),
});

type FormData = z.infer<typeof schema>;

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function InviteUserDialog({ open, onOpenChange, onSuccess }: InviteUserDialogProps) {
  const [loading, setLoading] = useState(false);
  const t = useT();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "member" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Error al enviar invitación");
      }
      toast({
        title: t.settings.team.inviteSent,
        description: `${t.settings.team.inviteSentDesc} ${data.email}`,
      });
      reset();
      onSuccess();
    } catch (err: any) {
      toast({ title: t.common.error, description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t.settings.team.inviteTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">{`${t.settings.team.email} *`}</Label>
            <Input id="email" type="email" placeholder="colega@empresa.com" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>{t.settings.team.role}</Label>
            <Select defaultValue={watch("role")} onValueChange={(v) => setValue("role", v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{t.memberRoles.admin}</SelectItem>
                <SelectItem value="member">{t.memberRoles.member}</SelectItem>
                <SelectItem value="viewer">{t.memberRoles.viewer}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.common.saving : t.settings.team.sendInvite}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
