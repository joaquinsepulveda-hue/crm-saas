import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Create Account" };

export default async function SignupPage() {
  const t = await getT();
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <span className="text-white font-bold text-lg">C</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t.auth.signup.title}</h1>
        <p className="text-muted-foreground text-sm">{t.auth.signup.description}</p>
      </div>
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
      <p className="text-center text-sm text-muted-foreground">
        {t.auth.signup.hasAccount}{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">{t.auth.signup.signIn}</Link>
      </p>
    </div>
  );
}
