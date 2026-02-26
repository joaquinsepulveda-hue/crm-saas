import Link from "next/link";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
        <p className="text-muted-foreground text-sm">Enter your email and we&apos;ll send you a reset link</p>
      </div>
      <ForgotPasswordForm />
      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  );
}
