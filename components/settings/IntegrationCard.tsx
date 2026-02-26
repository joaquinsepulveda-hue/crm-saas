"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/lib/hooks/use-toast";
import { useT } from "@/lib/i18n/client";
import { Copy, Eye, EyeOff, RefreshCw, Loader2 } from "lucide-react";

interface IntegrationCardProps {
  name: string;
  description: string;
  apiKey: { id: string; key_prefix: string; name: string; created_at: string } | null;
  onRefresh: () => void;
}

export function IntegrationCard({ name, description, apiKey, onRefresh }: IntegrationCardProps) {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewKey(data.key);
      onRefresh();
    } catch (err: any) {
      toast({ title: t.common.error, description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t.common.copied });
  };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Badge variant={apiKey ? "success" : "secondary"} className="text-xs">
          {apiKey ? t.settings.integrations.active : t.settings.integrations.inactive}
        </Badge>
      </div>

      {newKey && (
        <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-lg p-3">
          <p className="text-xs text-emerald-400 font-medium mb-2">
            {t.settings.integrations.keyWarning}
          </p>
          <div className="flex items-center gap-2">
            <Input
              type={revealed ? "text" : "password"}
              value={newKey}
              readOnly
              className="font-mono text-xs h-8"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              title={t.settings.integrations.revealKey}
              onClick={() => setRevealed(!revealed)}
            >
              {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              title={t.settings.integrations.copyKey}
              onClick={() => handleCopy(newKey)}
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {apiKey && !newKey && (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {apiKey.key_prefix}••••••••••••••••
          </span>
          <span className="text-xs text-muted-foreground">
            {t.settings.integrations.createdAt} {new Date(apiKey.created_at).toLocaleDateString("es-MX")}
          </span>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        disabled={loading}
        className="gap-1.5 h-8 text-xs"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
        {apiKey ? t.settings.integrations.regenerateKey : t.settings.integrations.generateKey}
      </Button>
    </div>
  );
}
