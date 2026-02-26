"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { useT } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const t = useT();
  const pathname = usePathname();

  const TABS = [
    { href: "/settings/workspace", label: t.settings.tabs.workspace },
    { href: "/settings/team", label: t.settings.tabs.team },
    { href: "/settings/billing", label: t.settings.tabs.billing },
    { href: "/settings/integrations", label: t.settings.tabs.integrations },
    { href: "/settings/notifications", label: t.settings.tabs.notifications },
    { href: "/settings/language", label: t.settings.tabs.language },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t.settings.title} description={t.settings.description} />

      <nav className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-3 py-2 text-sm whitespace-nowrap transition-colors border-b-2 -mb-px",
              pathname === tab.href
                ? "text-foreground border-primary"
                : "text-muted-foreground hover:text-foreground border-transparent hover:border-primary/50"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div>{children}</div>
    </div>
  );
}
