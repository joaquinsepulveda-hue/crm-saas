"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { KanbanBoard } from "@/components/deals/KanbanBoard";
import { ClosedDealsSection } from "@/components/deals/ClosedDealsSection";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DealForm } from "@/components/deals/DealForm";
import { useDeals } from "@/lib/hooks/useDeals";
import { useT } from "@/lib/i18n/client";

export default function DealsPage() {
  const t = useT();
  const [createOpen, setCreateOpen] = useState(false);
  const { deals, closedDeals, stages, loading, refetch } = useDeals();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.deals.title}
        description={`${deals.length} ${t.deals.openDeals}`}
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> {t.deals.addDeal}
          </Button>
        }
      />

      <KanbanBoard deals={deals} stages={stages} loading={loading} onRefresh={refetch} />

      <ClosedDealsSection deals={closedDeals} onRefresh={refetch} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.deals.addDeal}</DialogTitle>
          </DialogHeader>
          <DealForm stages={stages} onSuccess={() => { setCreateOpen(false); refetch(); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
