"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import NextLink from "next/link";

export default function AdminLoginPage() {
  const { user, signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  // If already logged in, redirect to admin overview
  if (user && typeof window !== "undefined") {
    router.push("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await signIn(email, password);
    setIsLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6 sm:p-12">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border pb-6 max-w-xl mx-auto w-full">
        <NextLink href="/" className="flex flex-col">
          <span className="font-serif text-2xl text-foreground">ZEHAN</span>
          <span className="type-label text-[9px] text-text-muted font-mono tracking-widest">
            AUTHENTICATION GATE
          </span>
        </NextLink>

        <NextLink
          href="/"
          className="type-label text-xs font-mono text-text-muted hover:text-foreground transition-colors"
        >
          ← Return to Public Exhibition
        </NextLink>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-12 bg-background border border-border p-8 rounded-sm shadow-sm space-y-6">
        <div>
          <div className="type-label text-[10px] font-mono text-text-muted tracking-widest uppercase mb-2">
            PRIVATE CONTROL PANEL
          </div>
          <h1 className="font-serif text-3xl font-normal text-foreground">
            Sign In to Admin
          </h1>
          <p className="type-body text-xs text-text-muted mt-2">
            Single administrator access for managing design case studies, developed websites, and portfolio settings.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-mono rounded">
            ✕ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="type-label text-xs text-foreground font-mono">
              ADMIN EMAIL
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@domain.com"
              className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="type-label text-xs text-foreground font-mono">
              PASSWORD
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[44px] py-3 bg-foreground text-background font-mono text-xs uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50 mt-4"
          >
            {isLoading ? "VERIFYING CREDENTIALS..." : "ACCESS DASHBOARD →"}
          </button>
        </form>

        {/* Configuration Notice */}
        <div className="pt-4 border-t border-border font-mono text-[11px] text-text-muted space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConfigured ? "bg-green-500" : "bg-neutral-400"
              }`}
            />
            <span>
              STATUS: {isConfigured ? "Supabase Live Connected" : "Supabase Offline / Not Configured"}
            </span>
          </div>
          {!isConfigured && (
            <p className="text-[10px] leading-relaxed bg-[#F8F7F4] p-3 rounded border border-border">
              To sign in, ensure <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set in your environment.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-xl mx-auto w-full pt-6 border-t border-border flex justify-between items-center text-xs font-mono text-text-muted">
        <span>SIFUL ISLAM ZEHAN // SECURE ADMIN CONSOLE</span>
        <span>NO PUBLIC SIGN-UP</span>
      </div>
    </div>
  );
}
