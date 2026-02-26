"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

const schema = z.object({ email: z.string().email("Invalid email address") });

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center space-y-3">
        <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
        <p className="font-medium">Check your email</p>
        <p className="text-sm text-muted-foreground">We sent a password reset link to your email address.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message as string}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </div>
    </form>
  );
}
