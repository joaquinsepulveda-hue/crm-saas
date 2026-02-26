"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DealForm } from "@/components/deals/DealForm";
import { Calendar, DollarSign, Pencil } from "lucide-react";
import type { Deal, PipelineStage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DealCardProps {
  deal: Deal;
  stages?: PipelineStage[];
  isDragging?: boolean;
  onRefresh: () => void;
}

export function DealCard({ deal, stages = [], isDragging, onRefresh }: DealCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: deal.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative group bg-card border border-border rounded-xl p-3 cursor-grab active:cursor-grabbing select-none",
        "hover:border-primary/40 hover:shadow-md transition-all",
        isDragging && "shadow-xl ring-1 ring-primary/50 rotate-1"
      )}
    >
      <Link
        href={`/deals/${deal.id}`}
        className="block"
        onClick={(e) => { if (isSortableDragging) e.preventDefault(); }}
      >
        <p className="text-sm font-medium leading-snug mb-2 line-clamp-2">{deal.title}</p>
      </Link>

      {deal.contact && (
        <p className="text-xs text-muted-foreground mb-2 truncate">
          {deal.contact.first_name} {deal.contact.last_name}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        {deal.value ? (
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
            <DollarSign className="w-3 h-3" />
            {formatCurrency(deal.value)}
          </div>
        ) : (
          <span />
        )}

        {deal.close_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {new Date(deal.close_date).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}
          </div>
        )}
      </div>

      {deal.status !== "open" && (
        <Badge
          variant={deal.status === "won" ? "success" : "destructive"}
          className="mt-2 text-xs"
        >
          {deal.status === "won" ? "Ganado" : "Perdido"}
        </Badge>
      )}

      {!isDragging && stages.length > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setEditOpen(true); }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Pencil className="w-3 h-3" />
        </Button>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Negocio</DialogTitle>
          </DialogHeader>
          <DealForm
            stages={stages}
            deal={deal}
            onSuccess={() => { setEditOpen(false); onRefresh(); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
