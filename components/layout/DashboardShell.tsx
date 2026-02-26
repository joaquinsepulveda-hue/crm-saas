"use client";

import { useState } from "react";
import { Topbar } from "./Topbar";
import { MobileSidebar } from "./MobileSidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  profile?: { full_name: string; avatar_url?: string | null; role: string };
  orgName?: string;
}

export function DashboardShell({ children, profile, orgName }: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <Topbar onMenuClick={() => setMobileSidebarOpen(true)} />
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        profile={profile}
        orgName={orgName}
      />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
