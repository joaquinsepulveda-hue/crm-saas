import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import type { Metadata } from "next";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage() {
  const t = await getT();
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <span className="text-white font-bold text-lg">C</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t.auth.login.title}</h1>
        <p className="text-muted-foreground text-sm">{t.auth.login.description}</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-muted-foreground">
        {t.auth.login.noAccount}{" "}
        <Link href="/signup" className="text-primary hover:underline font-medium">{t.auth.login.signUp}</Link>
      </p>
    </div>
  );
}
