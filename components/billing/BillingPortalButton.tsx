"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "@/lib/hooks/use-toast";
import { useT } from "@/lib/i18n/client";

export function BillingPortalButton() {
  const t = useT();
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/create-portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
      else throw new Error("No portal URL");
    } catch {
      toast({ title: t.common.error, description: "Could not open billing portal", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleOpen} disabled={loading} className="gap-2">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
      {t.settings.billing.manageBilling}
    </Button>
  );
}
