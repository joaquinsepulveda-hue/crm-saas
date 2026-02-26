"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/hooks/use-toast";
import { Loader2 } from "lucide-react";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: { password: string }) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated!", description: "You can now sign in with your new password." });
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" placeholder="Min. 8 characters" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" placeholder="Repeat password" {...register("confirm")} />
          {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message as string}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update password
        </Button>
      </div>
    </form>
  );
}
