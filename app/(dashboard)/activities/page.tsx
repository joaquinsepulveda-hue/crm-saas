"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ActivityFeed } from "@/components/activities/ActivityFeed";
import { ActivityForm } from "@/components/activities/ActivityForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useActivities } from "@/lib/hooks/useActivities";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { useT } from "@/lib/i18n/client";

export default function ActivitiesPage() {
  const t = useT();
  const [createOpen, setCreateOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { activities, loading, refetch } = useActivities({
    type: typeFilter !== "all" ? typeFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.activities.title}
        description={`${activities.length} ${t.activities.title.toLowerCase()}`}
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> {t.activities.logActivity}
          </Button>
        }
      />

      <div className="flex gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder={t.activities.allTypes} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.activities.allTypes}</SelectItem>
            {ACTIVITY_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder={t.activities.allStatuses} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.activities.allStatuses}</SelectItem>
            <SelectItem value="planned">{t.activities.statuses.planned}</SelectItem>
            <SelectItem value="completed">{t.activities.statuses.completed}</SelectItem>
            <SelectItem value="cancelled">{t.activities.statuses.cancelled}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ActivityFeed activities={activities} loading={loading} onRefresh={refetch} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.activities.logActivity}</DialogTitle>
          </DialogHeader>
          <ActivityForm onSuccess={() => { setCreateOpen(false); refetch(); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
