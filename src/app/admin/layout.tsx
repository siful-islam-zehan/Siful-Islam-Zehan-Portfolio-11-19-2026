import React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/admin/Toast";
import AdminNavShell from "./AdminNavShell";

export const metadata: Metadata = {
  title: "Admin Dashboard | Siful Islam Zehan Portfolio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminNavShell>{children}</AdminNavShell>
      </ToastProvider>
    </AuthProvider>
  );
}
