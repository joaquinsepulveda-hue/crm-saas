import { WorkspaceSetupForm } from "@/components/onboarding/WorkspaceSetupForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Set Up Your Workspace" };

export default function WorkspacePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Set up your workspace</h1>
        <p className="text-muted-foreground mt-2">Tell us about your company to personalize your CRM</p>
      </div>
      <WorkspaceSetupForm />
    </div>
  );
}
