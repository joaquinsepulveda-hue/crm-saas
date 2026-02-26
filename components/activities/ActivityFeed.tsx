"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ActivityTypeIcon } from "./ActivityTypeIcon";
import { ActivityForm } from "./ActivityForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/lib/hooks/use-toast";
import { Trash2, Calendar, ActivityIcon, Pencil } from "lucide-react";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";
import type { Activity } from "@/lib/types";

interface ActivityFeedProps {
  activities: Activity[];
  loading: boolean;
  onRefresh: () => void;
}

const STATUS_VARIANTS = {
  planned: "secondary",
  completed: "success",
  cancelled: "destructive",
} as const;

export function ActivityFeed({ activities, loading, onRefresh }: ActivityFeedProps) {
  const t = useT();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editActivity, setEditActivity] = useState<Activity | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const supabase = createClient();
    const { error } = await supabase.from("activities").delete().eq("id", deleteId);
    if (error) toast({ title: t.common.error, description: error.message, variant: "destructive" });
    else { toast({ title: "Actividad eliminada" }); onRefresh(); }
    setDeleteId(null);
  };

  const handleComplete = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("activities").update({ status: "completed" }).eq("id", id);
    if (error) toast({ title: t.common.error, description: error.message, variant: "destructive" });
    else { toast({ title: "Actividad completada" }); onRefresh(); }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-4 rounded-xl border bg-card">
            <Skeleton className="w-9 h-9 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return <EmptyState icon={ActivityIcon} title={t.activities.noActivities} description={t.activities.noActivitiesDesc} />;
  }

  return (
    <>
      <div className="space-y-2">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 p-4 rounded-xl border bg-card hover:border-primary/30 transition-colors group">
            <ActivityTypeIcon type={activity.type} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{activity.description}</p>
                  )}
                  {activity.contact && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activity.contact.first_name} {activity.contact.last_name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Badge variant={STATUS_VARIANTS[activity.status] ?? "secondary"} className="text-xs">
                    {t.activities.statuses[activity.status as keyof typeof t.activities.statuses] ?? activity.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {activity.due_at ? (
                    <>
                      <Calendar className="w-3 h-3" />
                      {formatDate(activity.due_at)}
                    </>
                  ) : (
                    formatRelativeTime(activity.created_at)
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {activity.status === "planned" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={() => handleComplete(activity.id)}
                    >
                      {t.activities.statuses.completed}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setEditActivity(activity)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:text-destructive"
                    onClick={() => setDeleteId(activity.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!editActivity} onOpenChange={(open) => !open && setEditActivity(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.common.edit} {t.activities.title.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          {editActivity && (
            <ActivityForm
              activity={editActivity}
              onSuccess={() => { setEditActivity(null); onRefresh(); }}
            />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="¿Eliminar actividad?"
        description="Esta acción no se puede deshacer."
        confirmLabel={t.common.delete}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
}
