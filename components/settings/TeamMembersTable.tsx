"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/hooks/use-toast";
import { getInitials } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";
import type { Profile } from "@/lib/types";

interface TeamMembersTableProps {
  members: Profile[];
  currentUserId: string;
  isAdmin: boolean;
  onRefresh: () => void;
}

export function TeamMembersTable({ members, currentUserId, isAdmin, onRefresh }: TeamMembersTableProps) {
  const t = useT();
  const [removeId, setRemoveId] = useState<string | null>(null);

  const ROLE_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
    owner: "default",
    admin: "secondary",
    member: "outline",
    viewer: "outline",
  };

  const handleRemove = async () => {
    if (!removeId) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ organization_id: null, role: "member" })
      .eq("id", removeId);
    if (error) toast({ title: t.common.error, description: error.message, variant: "destructive" });
    else { toast({ title: t.settings.team.remove }); onRefresh(); }
    setRemoveId(null);
  };

  return (
    <>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{t.settings.team.memberHeader}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{t.settings.team.role}</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">{t.settings.team.joined}</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(member.full_name ?? "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.full_name ?? "—"}</p>
                      {member.id === currentUserId && (
                        <p className="text-xs text-muted-foreground">{t.settings.team.you}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={ROLE_VARIANTS[member.role] ?? "outline"} className="capitalize text-xs">
                    {t.memberRoles[member.role as keyof typeof t.memberRoles] ?? member.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {new Date(member.created_at).toLocaleDateString("es-MX")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {isAdmin && member.id !== currentUserId && member.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs hover:text-destructive"
                      onClick={() => setRemoveId(member.id)}
                    >
                      {t.settings.team.remove}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!removeId}
        onOpenChange={(open) => !open && setRemoveId(null)}
        title={t.settings.team.remove}
        description={t.common.confirm}
        confirmLabel={t.settings.team.remove}
        onConfirm={handleRemove}
        variant="destructive"
      />
    </>
  );
}
