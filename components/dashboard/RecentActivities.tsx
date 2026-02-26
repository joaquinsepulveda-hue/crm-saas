"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivities } from "@/lib/hooks/useActivities";
import { formatRelativeTime } from "@/lib/utils";
import { Phone, Mail, Calendar, FileText, CheckSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/lib/i18n/client";
import type { ActivityType } from "@/lib/types";

const ICONS: Record<ActivityType, React.ElementType> = {
  call: Phone, email: Mail, meeting: Calendar, note: FileText, task: CheckSquare,
};

export function RecentActivities() {
  const t = useT();
  const { activities, loading } = useActivities({ limit: 8 });

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{t.activities.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-7 h-7 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">{t.activities.noActivities}</p>
        ) : (
          activities.map((activity) => {
            const Icon = ICONS[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.created_at)}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
