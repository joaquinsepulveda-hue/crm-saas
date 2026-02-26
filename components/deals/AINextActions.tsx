"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/lib/hooks/use-toast";
import { Sparkles, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import type { DealSuggestions } from "@/lib/types";

interface AINextActionsProps {
  dealId: string;
  suggestions: DealSuggestions | null;
  updatedAt: string | null;
}

const URGENCY_COLORS = {
  low: "secondary",
  medium: "warning",
  high: "destructive",
} as const;

export function AINextActions({ dealId, suggestions: initialSuggestions, updatedAt }: AINextActionsProps) {
  const [suggestions, setSuggestions] = useState<DealSuggestions | null>(initialSuggestions);
  const [loading, setLoading] = useState(false);

  const isStale = !updatedAt || Date.now() - new Date(updatedAt).getTime() > 24 * 60 * 60 * 1000;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/deal-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al generar sugerencias");
      setSuggestions(data);
      toast({ title: "Sugerencias IA actualizadas" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Próximas Acciones IA
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1.5"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {suggestions ? (isStale ? "Actualizar" : "Regenerar") : "Generar"}
        </Button>
      </CardHeader>

      <CardContent>
        {!suggestions ? (
          <p className="text-sm text-muted-foreground">
            Haz clic en &ldquo;Generar&rdquo; para obtener recomendaciones de próximas acciones con IA.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Urgencia</span>
                <Badge variant={URGENCY_COLORS[suggestions.urgency] ?? "secondary"} className="capitalize text-xs">
                  {suggestions.urgency === "high" ? "Alta" : suggestions.urgency === "medium" ? "Media" : "Baja"}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Salud</span>
                <span className={`text-sm font-bold ${suggestions.deal_health_score >= 70 ? "text-emerald-400" : suggestions.deal_health_score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                  {suggestions.deal_health_score}/100
                </span>
              </div>
            </div>

            {suggestions.next_actions.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Acciones Recomendadas</p>
                {suggestions.next_actions.map((action, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            )}

            {suggestions.risk_factors.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Factores de Riesgo</p>
                {suggestions.risk_factors.map((risk, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{risk}</span>
                  </div>
                ))}
              </div>
            )}

            {updatedAt && (
              <p className="text-xs text-muted-foreground">
                Actualizado {new Date(updatedAt).toLocaleDateString("es-MX")}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
