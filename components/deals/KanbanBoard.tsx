"use client";

import { useState, useEffect, useRef } from "react";
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { createClient } from "@/lib/supabase/client";
import { KanbanColumn } from "./KanbanColumn";
import { DealCard } from "./DealCard";
import { toast } from "@/lib/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Deal, PipelineStage } from "@/lib/types";

interface KanbanBoardProps {
  deals: Deal[];
  stages: PipelineStage[];
  loading: boolean;
  onRefresh: () => void;
}

export function KanbanBoard({ deals: initialDeals, stages, loading, onRefresh }: KanbanBoardProps) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isDraggingRef = useRef(false);

  // Sync when the server data changes, but not while dragging.
  // Using a ref for the drag guard so this effect only re-runs on initialDeals changes,
  // not when activeId flips to null (which would overwrite the optimistic update).
  useEffect(() => {
    if (!isDraggingRef.current) setDeals(initialDeals);
  }, [initialDeals]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const activeDeal = activeId ? deals.find((d) => d.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    isDraggingRef.current = true;
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    isDraggingRef.current = false;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const dealId = active.id as string;
    const overId = over.id as string;

    // over.id is either a stage ID (dropped on empty column) or a deal ID (dropped on another card)
    const isStage = stages.some((s) => s.id === overId);
    const newStageId = isStage
      ? overId
      : deals.find((d) => d.id === overId)?.stage_id ?? overId;

    const stage = stages.find((s) => s.id === newStageId);
    if (!stage) return;

    // Optimistic update
    const prevDeals = [...deals];
    setDeals((prev) => prev.map((d) => d.id === dealId ? { ...d, stage_id: newStageId, stage } : d));

    const supabase = createClient();
    const { error } = await supabase.from("deals").update({ stage_id: newStageId }).eq("id", dealId);

    if (error) {
      setDeals(prevDeals);
      toast({ title: "Error", description: "No se pudo mover el negocio", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-72 flex-shrink-0 space-y-3">
            <Skeleton className="h-8 w-32" />
            {Array.from({ length: 3 }).map((_, j) => <Skeleton key={j} className="h-24 w-full rounded-xl" />)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.filter((s) => s.win_probability !== 100 && !(s.win_probability === 0 && s.position > 0)).map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            stages={stages}
            deals={deals.filter((d) => d.stage_id === stage.id)}
            onRefresh={onRefresh}
          />
        ))}
      </div>
      <DragOverlay>
        {activeDeal && <DealCard deal={activeDeal} isDragging onRefresh={() => {}} />}
      </DragOverlay>
    </DndContext>
  );
}
