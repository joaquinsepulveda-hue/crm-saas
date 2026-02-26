"use client";

import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useEffect } from "react";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  profile?: { full_name: string; avatar_url?: string | null; role: string };
  orgName?: string;
}

export function MobileSidebar({ open, onClose, profile, orgName }: MobileSidebarProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 flex">
        <Sidebar profile={profile} orgName={orgName} />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
