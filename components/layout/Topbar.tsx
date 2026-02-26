"use client";

import { Bell, Search, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/i18n/client";

interface TopbarProps {
  title?: string;
  onMenuClick?: () => void;
}

export function Topbar({ title, onMenuClick }: TopbarProps) {
  const t = useT();
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 gap-4" style={{ backgroundColor: "#0d0d14" }}>
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        {title && <h2 className="font-semibold text-sm hidden sm:block">{title}</h2>}
      </div>

      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t.topbar.searchPlaceholder} className="pl-9 h-8 text-sm bg-muted/50 border-transparent focus:border-input" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="w-4 h-4" />
        </Button>
        <Button size="sm" className="h-8 gap-1.5 hidden sm:flex">
          <Plus className="w-3.5 h-3.5" />
          {t.topbar.newButton}
        </Button>
      </div>
    </header>
  );
}
