"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface AIScoreButtonProps {
  contactId: string;
  currentScore: number | null;
}

export function AIScoreButton({ contactId, currentScore }: AIScoreButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleScore = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/score-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Scoring failed");
      toast({ title: "Lead calificado", description: `Puntuación: ${data.score} (${data.grade})` });
      router.refresh();
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Error al calificar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleScore} disabled={loading} className="gap-1.5">
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
      {currentScore !== null ? "Recalcular IA" : "Calificar con IA"}
    </Button>
  );
}
