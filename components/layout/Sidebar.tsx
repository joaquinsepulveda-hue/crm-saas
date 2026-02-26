"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Building2, Briefcase, ActivityIcon, BarChart3, Settings, LogOut, Zap } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useT } from "@/lib/i18n/client";

interface SidebarProps {
  profile?: { full_name: string; avatar_url?: string | null; role: string };
  orgName?: string;
}

export function Sidebar({ profile, orgName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();

  const NAV_ITEMS = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.nav.dashboard },
    { href: "/contacts", icon: Users, label: t.nav.contacts },
    { href: "/companies", icon: Building2, label: t.nav.companies },
    { href: "/deals", icon: Briefcase, label: t.nav.deals },
    { href: "/activities", icon: ActivityIcon, label: t.nav.activities },
    { href: "/reports", icon: BarChart3, label: t.nav.reports },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen border-r border-border" style={{ backgroundColor: "#0d0d14" }}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">{orgName ?? "CRM SaaS"}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile?.role ?? "member"}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 py-3">
        <nav className="px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                  isActive
                    ? "bg-primary/15 text-primary font-medium border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mt-6">
          <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{t.nav.settings}</p>
          <nav className="space-y-1">
            <Link
              href="/settings/workspace"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                pathname.startsWith("/settings")
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              {t.nav.settings}
            </Link>
          </nav>
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="text-xs bg-primary/20 text-primary">
              {getInitials(profile?.full_name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name ?? "User"}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 hover:text-destructive"
            title={t.nav.signOut}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
