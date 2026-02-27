"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DealForm } from "@/components/deals/DealForm";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/hooks/use-toast";
import { Calendar, DollarSign, MoreHorizontal, Pencil, Trophy, XCircle } from "lucide-react";
import type { Deal, PipelineStage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DealCardProps {
  deal: Deal;
  stages?: PipelineStage[];
  isDragging?: boolean;
  onRefresh: () => void;
}

function getCloseDateStyle(closeDate: string | null, status: string) {
  if (!closeDate || status !== "open") return "text-muted-foreground";
  const diffDays = Math.ceil((new Date(closeDate).getTime() - Date.now()) / 86400000);
  if (diffDays < 0) return "text-destructive font-medium";
  if (diffDays <= 7) return "text-amber-400 font-medium";
  return "text-muted-foreground";
}

export function DealCard({ deal, stages = [], isDragging, onRefresh }: DealCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [lostOpen, setLostOpen] = useState(false);
  const [lostReason, setLostReason] = useState("");
  const [updating, setUpdating] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: deal.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  const handleMarkWon = async () => {
    setUpdating(true);
    const supabase = createClient();
    const { error } = await supabase.from("deals").update({ status: "won" }).eq("id", deal.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "¡Negocio ganado! 🎉" });
      onRefresh();
    }
    setUpdating(false);
  };

  const handleMarkLost = async () => {
    setUpdating(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("deals")
      .update({ status: "lost", lost_reason: lostReason || null })
      .eq("id", deal.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Negocio marcado como perdido" });
      setLostOpen(false);
      setLostReason("");
      onRefresh();
    }
    setUpdating(false);
  };

  const closeDateStyle = getCloseDateStyle(deal.close_date, deal.status);

  return (
    <>
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
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            href={`/deals/${deal.id}`}
            className="flex-1 min-w-0"
            onClick={(e) => { if (isSortableDragging) e.preventDefault(); }}
          >
            <p className="text-sm font-medium leading-snug line-clamp-2">{deal.title}</p>
          </Link>

          {!isDragging && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {stages.length > 0 && (
                  <>
                    <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                      <Pencil className="w-3.5 h-3.5 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {deal.status === "open" && (
                  <>
                    <DropdownMenuItem onSelect={handleMarkWon} className="text-emerald-400 focus:text-emerald-400">
                      <Trophy className="w-3.5 h-3.5 mr-2" /> Marcar como ganado
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLostOpen(true)} className="text-destructive focus:text-destructive">
                      <XCircle className="w-3.5 h-3.5 mr-2" /> Marcar como perdido
                    </DropdownMenuItem>
                  </>
                )}
                {deal.status !== "open" && (
                  <DropdownMenuItem onSelect={async () => {
                    const supabase = createClient();
                    await supabase.from("deals").update({ status: "open", lost_reason: null }).eq("id", deal.id);
                    onRefresh();
                  }}>
                    Reabrir negocio
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

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
            <div className={cn("flex items-center gap-1 text-xs", closeDateStyle)}>
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
      </div>

      {/* Edit dialog */}
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

      {/* Lost reason dialog */}
      <Dialog open={lostOpen} onOpenChange={setLostOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Marcar como perdido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground">Razón de pérdida (opcional)</Label>
              <Textarea
                placeholder="ej. Precio, decidieron no comprar, eligieron a la competencia..."
                rows={3}
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setLostOpen(false)}>Cancelar</Button>
              <Button variant="destructive" className="flex-1" onClick={handleMarkLost} disabled={updating}>
                {updating ? "Guardando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
