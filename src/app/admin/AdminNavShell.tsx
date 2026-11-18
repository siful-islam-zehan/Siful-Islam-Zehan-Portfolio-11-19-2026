"use client";

import React from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AdminNavShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isConfigured, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  // While checking auth session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4 font-mono text-xs text-text-muted">
          <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          <span>AUTHENTICATING SECURE SESSION...</span>
        </div>
      </div>
    );
  }

  // If not logged in and not on login page, redirect to login
  if (!user && !isLoginPage) {
    if (typeof window !== "undefined") {
      router.push("/admin/login");
    }
    return null;
  }

  // If on login page, render children directly without dashboard chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  const navTabs = [
    { label: "Overview", href: "/admin" },
    { label: "Design Projects", href: "/admin/projects" },
    { label: "Developed Websites", href: "/admin/websites" },
    { label: "Messages", href: "/admin/messages" },
    { label: "Site Settings", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Admin Header */}
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <NextLink href="/admin" className="flex flex-col">
              <span className="font-serif text-xl leading-none text-foreground">ZEHAN</span>
              <span className="type-label text-[9px] text-text-muted font-mono tracking-widest">
                ADMIN CONSOLE
              </span>
            </NextLink>

            {/* Connection Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-pill bg-[#F8F7F4] border border-border text-[10px] font-mono">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isConfigured ? "bg-green-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <span className="text-text-muted">
                {isConfigured ? "SUPABASE LIVE (RLS ACTIVE)" : "LOCAL RESILIENT FALLBACK"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NextLink
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="type-label text-xs font-mono text-text-muted hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <span>View Public Site</span>
              <span>↗</span>
            </NextLink>

            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 border border-border rounded-pill type-label text-xs font-mono text-text-muted hover:text-foreground hover:border-foreground transition-colors cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <nav aria-label="Admin Navigation Tabs" className="border-t border-border/60 bg-[#F8F7F4]/50 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8">
            {navTabs.map((tab) => {
              const isActive =
                tab.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(tab.href);

              return (
                <NextLink
                  key={tab.href}
                  href={tab.href}
                  className={`py-3 type-label text-xs uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                    isActive
                      ? "border-foreground text-foreground font-semibold"
                      : "border-transparent text-text-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </NextLink>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-border py-4 bg-[#F8F7F4] text-[11px] font-mono text-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PORTFOLIO BACKEND // SIFUL ISLAM ZEHAN</span>
          <span>STRICT ROW LEVEL SECURITY • CLIENT CANVAS WEBP RESIZER</span>
        </div>
      </footer>
    </div>
  );
}
