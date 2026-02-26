"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useT } from "@/lib/i18n/client";

const signupSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name, invite_token: inviteToken },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    });
    if (error) {
      toast({ title: t.common.error, description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    toast({ title: t.auth.signup.success, description: t.auth.signup.successDesc });
    router.push("/onboarding/workspace");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">{t.auth.signup.fullName}</Label>
          <Input id="full_name" placeholder="John Smith" {...register("full_name")} />
          {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t.auth.signup.workEmail}</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t.auth.signup.password}</Label>
          <Input id="password" type="password" placeholder="Min. 8 characters" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t.auth.signup.submit}
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {t.auth.signup.terms}
      </p>
    </form>
  );
}
