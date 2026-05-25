"use client";

import * as React from "react";

// Bypassing next-themes to fix "Encountered a script tag" error in React 19 / Next.js 15
export function ThemeProvider({ children }: { children: React.ReactNode; [key: string]: any }) {
  return <>{children}</>;
}
