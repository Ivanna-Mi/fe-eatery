"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Skip NextAuth SessionProvider for Admin panel to avoid unnecessary DB calls
  // and NextAuth fetch errors since Admin uses a separate auth system (Zustand)
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
