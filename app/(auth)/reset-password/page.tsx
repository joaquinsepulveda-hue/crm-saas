import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Set New Password" };

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Set new password</h1>
        <p className="text-muted-foreground text-sm">Choose a strong password for your account</p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
