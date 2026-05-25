"use client";

import * as React from "react";
import { SidebarManager } from "@/components/manager/layout/SidebarManager";
import { TopNavbarManager } from "@/components/manager/layout/TopNavbarManager";
import { useManagerStore } from "@/store/useManagerStore";
import { useRouter } from "next/navigation";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter();
  const { isAuthenticated } = useManagerStore();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/manager/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20">
      <SidebarManager collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">
        <TopNavbarManager onMenuClick={() => setCollapsed(!collapsed)} />
        
        <main className="flex-1 overflow-x-hidden p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
