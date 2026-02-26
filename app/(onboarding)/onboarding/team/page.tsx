import { TeamInviteForm } from "@/components/onboarding/TeamInviteForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Invite Your Team" };

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Invite your team</h1>
        <p className="text-muted-foreground mt-2">Great things happen with a great team</p>
      </div>
      <TeamInviteForm />
    </div>
  );
}
