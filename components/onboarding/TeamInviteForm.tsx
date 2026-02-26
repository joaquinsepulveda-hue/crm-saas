"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/hooks/use-toast";
import { Plus, X, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MEMBER_ROLES } from "@/lib/constants";

interface InviteRow { email: string; role: string; }

export function TeamInviteForm() {
  const [invites, setInvites] = useState<InviteRow[]>([{ email: "", role: "member" }]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addRow = () => setInvites([...invites, { email: "", role: "member" }]);
  const removeRow = (i: number) => setInvites(invites.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof InviteRow, value: string) => {
    const updated = [...invites];
    updated[i] = { ...updated[i], [field]: value };
    setInvites(updated);
  };

  const handleSendInvites = async () => {
    const validInvites = invites.filter((r) => r.email.trim());
    if (validInvites.length === 0) { router.push("/onboarding/import"); return; }

    setLoading(true);
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();
      for (const invite of validInvites) {
        await supabase.from("invitations").insert({ organization_id: profile!.organization_id, email: invite.email, role: invite.role, invited_by: user!.id });
      }
      toast({ title: "Invitations sent!", description: `${validInvites.length} invite(s) sent.` });
      router.push("/onboarding/import");
    } catch {
      toast({ title: "Error", description: "Failed to send invitations", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      <div className="space-y-3">
        {invites.map((row, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              {i === 0 && <Label>Email</Label>}
              <Input type="email" placeholder="colleague@company.com" value={row.email} onChange={(e) => updateRow(i, "email", e.target.value)} />
            </div>
            <div className="w-32 space-y-1">
              {i === 0 && <Label>Role</Label>}
              <Select value={row.role} onValueChange={(v) => updateRow(i, "role", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MEMBER_ROLES.filter((r) => r.value !== "owner").map((role) => (
                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {invites.length > 1 && (
              <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(i)} className="h-9 w-9 flex-shrink-0">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add another
      </Button>
      <div className="flex gap-3 pt-2">
        <Button variant="ghost" onClick={() => router.push("/onboarding/import")} className="flex-1">Skip for now</Button>
        <Button onClick={handleSendInvites} disabled={loading} className="flex-1 gap-1.5">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          Send invites
        </Button>
      </div>
    </div>
  );
}
