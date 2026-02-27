"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/lib/hooks/use-toast";
import { ChevronDown, ChevronUp, Trophy, XCircle, RotateCcw } from "lucide-react";
import type { Deal } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ClosedDealsSectionProps {
  deals: Deal[];
  onRefresh: () => void;
}

function ClosedDealRow({ deal, onRefresh }: { deal: Deal; onRefresh: () => void }) {
  const [reopening, setReopening] = useState(false);

  const handleReopen = async () => {
    setReopening(true);
    const supabase = createClient();
    const { error } = await supabase.from("deals").update({ status: "open", lost_reason: null }).eq("id", deal.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Negocio reabierto" });
      onRefresh();
    }
    setReopening(false);
  };

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/30 transition-colors group">
      <div className="flex-shrink-0">
        {deal.status === "won" ? (
          <Trophy className="w-4 h-4 text-emerald-400" />
        ) : (
          <XCircle className="w-4 h-4 text-destructive/70" />
        )}
      </div>

      <Link href={`/deals/${deal.id}`} className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate hover:text-primary transition-colors">{deal.title}</p>
        {deal.contact && (
          <p className="text-xs text-muted-foreground truncate">
            {deal.contact.first_name} {deal.contact.last_name}
            {deal.company && ` · ${deal.company.name}`}
          </p>
        )}
      </Link>

      <div className="hidden sm:block text-xs text-muted-foreground flex-shrink-0 w-24 text-right">
        {formatDate(deal.updated_at)}
      </div>

      {deal.value ? (
        <span className={cn(
          "text-sm font-semibold flex-shrink-0 w-24 text-right",
          deal.status === "won" ? "text-emerald-400" : "text-muted-foreground line-through"
        )}>
          {formatCurrency(deal.value)}
        </span>
      ) : (
        <span className="w-24" />
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleReopen}
        disabled={reopening}
        title="Reabrir negocio"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

export function ClosedDealsSection({ deals, onRefresh }: ClosedDealsSectionProps) {
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<"won" | "lost">("won");

  const wonDeals = deals.filter((d) => d.status === "won");
  const lostDeals = deals.filter((d) => d.status === "lost");
  const wonValue = wonDeals.reduce((s, d) => s + (d.value ?? 0), 0);
  const lostValue = lostDeals.reduce((s, d) => s + (d.value ?? 0), 0);

  const current = tab === "won" ? wonDeals : lostDeals;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Negocios cerrados</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Trophy className="w-3.5 h-3.5" />
              {wonDeals.length} ganados{wonDeals.length > 0 && ` · ${formatCurrency(wonValue)}`}
            </span>
            {lostDeals.length > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <XCircle className="w-3.5 h-3.5" />
                {lostDeals.length} perdidos
              </span>
            )}
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="p-3">
          {/* Tab pills */}
          <div className="flex gap-1 mb-3">
            <button
              onClick={() => setTab("won")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                tab === "won"
                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Ganados ({wonDeals.length})
            </button>
            <button
              onClick={() => setTab("lost")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                tab === "lost"
                  ? "bg-destructive/15 text-destructive ring-1 ring-destructive/30"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Perdidos ({lostDeals.length})
            </button>
          </div>

          {/* Column headers */}
          {current.length > 0 && (
            <div className="flex items-center gap-3 px-3 mb-1">
              <div className="w-4 flex-shrink-0" />
              <span className="flex-1 text-xs text-muted-foreground">Negocio</span>
              <span className="hidden sm:block text-xs text-muted-foreground w-24 text-right">Cerrado</span>
              <span className="text-xs text-muted-foreground w-24 text-right">Valor</span>
              <div className="w-7 flex-shrink-0" />
            </div>
          )}

          {/* Rows */}
          {current.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {tab === "won" ? "Aún no hay negocios ganados" : "Aún no hay negocios perdidos"}
            </p>
          ) : (
            <div className="space-y-0.5">
              {current.map((deal) => (
                <ClosedDealRow key={deal.id} deal={deal} onRefresh={onRefresh} />
              ))}
            </div>
          )}

          {tab === "won" && wonDeals.length > 0 && (
            <div className="flex justify-end mt-3 pt-3 border-t border-border">
              <span className="text-sm font-semibold text-emerald-400">
                Total ganado: {formatCurrency(wonValue)}
              </span>
            </div>
          )}
          {tab === "lost" && lostDeals.length > 0 && (
            <div className="flex justify-end mt-3 pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Valor total perdido: {formatCurrency(lostValue)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
