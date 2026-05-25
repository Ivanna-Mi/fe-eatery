"use client";

import { Search, Bell, Menu } from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const { adminData, logout } = useAdminStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg bg-card border border-border/50 text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex relative items-center">
          <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search orders, menus, etc..." 
            className="pl-10 pr-4 py-2 w-72 rounded-full border border-border/50 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-card transition-colors text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background"></span>
        </button>

        <div className="w-px h-8 bg-border/50 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-foreground leading-tight">{adminData?.name || "Admin"}</p>
            <p className="text-xs text-muted-foreground">{adminData?.role || "Manager"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
            {adminData?.name?.charAt(0) || "A"}
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="ml-2 rounded-full border-primary/20 text-primary hover:bg-primary/5 hidden sm:flex">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
