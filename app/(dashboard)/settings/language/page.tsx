"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useT, useLang } from "@/lib/i18n/client";
import { Check } from "lucide-react";
export default function LanguagePage() {
  const t = useT();
  const { lang, setLang } = useLang();

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-sm">{t.settings.language.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{t.settings.language.description}</p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant={lang === "es" ? "default" : "outline"}
            className="justify-between"
            onClick={() => setLang("es")}
          >
            {t.settings.language.spanish}
            {lang === "es" && <Check className="w-4 h-4" />}
          </Button>
          <Button
            variant={lang === "en" ? "default" : "outline"}
            className="justify-between"
            onClick={() => setLang("en")}
          >
            {t.settings.language.english}
            {lang === "en" && <Check className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
