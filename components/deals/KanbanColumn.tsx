"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DealCard } from "./DealCard";
import type { Deal, PipelineStage } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface KanbanColumnProps {
  stage: PipelineStage;
  stages: PipelineStage[];
  deals: Deal[];
  onRefresh: () => void;
}

export function KanbanColumn({ stage, stages, deals, onRefresh }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  const totalValue = deals.reduce((sum, d) => sum + (d.value ?? 0), 0);

  return (
    <div className="w-72 flex-shrink-0 flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color ?? "#6366f1" }} />
          <span className="text-sm font-medium">{stage.name}</span>
          <span className="text-xs text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">{deals.length}</span>
        </div>
        {totalValue > 0 && (
          <span className="text-xs text-muted-foreground">{formatCurrency(totalValue)}</span>
        )}
      </div>

      <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex flex-col gap-2 min-h-[200px] rounded-xl p-2 transition-colors ${
            isOver ? "bg-primary/5 ring-1 ring-primary/30" : "bg-muted/20"
          }`}
        >
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} stages={stages} onRefresh={onRefresh} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
