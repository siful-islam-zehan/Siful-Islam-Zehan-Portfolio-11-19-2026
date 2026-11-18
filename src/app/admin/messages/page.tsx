"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useToast } from "@/components/admin/Toast";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tableMissing, setTableMissing] = useState(false);
  const { showToast } = useToast();
  const isConfigured = isSupabaseConfigured();

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    setTableMissing(false);

    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (
          error.code === "42P01" ||
          error.message.includes("contact_messages") ||
          error.message.includes("schema cache")
        ) {
          setTableMissing(true);
        } else {
          showToast(error.message, "error");
        }
        return;
      }

      setMessages(data || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load inquiries", "error");
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured, showToast]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient();
      if (!supabase) return;

      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: !currentStatus })
        .eq("id", id);

      if (error) throw new Error(error.message);

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: !currentStatus } : m))
      );
      showToast(!currentStatus ? "Marked as read" : "Marked as unread");
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const supabase = createClient();
      if (!supabase) return;

      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);

      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast("Message deleted successfully");
    } catch (err: any) {
      showToast(err.message || "Failed to delete message", "error");
    }
  };

  const filteredMessages = messages.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl text-foreground">Inquiries &amp; Messages</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-accent text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="type-label text-xs font-mono text-text-muted mt-1">
            Incoming project notes and inquiries submitted via the website contact form.
          </p>
        </div>

        <button
          onClick={loadMessages}
          disabled={isLoading}
          className="self-start sm:self-auto px-4 py-2 border border-border rounded text-xs font-mono hover:bg-neutral-100 disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          <span>↻</span> Refresh Messages
        </button>
      </div>

      {/* Database Setup Notice if table not created yet */}
      {tableMissing && (
        <div className="p-6 border border-amber-300 bg-amber-50 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm font-mono">
            <span>⚠</span> Supabase `contact_messages` Table Setup Needed
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            To store all website inquiries directly in your Supabase database, copy and run this quick SQL in your{" "}
            <strong>Supabase Dashboard → SQL Editor</strong>:
          </p>
          <pre className="p-3 bg-neutral-900 text-neutral-100 text-[11px] font-mono rounded overflow-x-auto select-all">
{`CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert contact messages"
  ON public.contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin read contact messages"
  ON public.contact_messages FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update contact messages"
  ON public.contact_messages FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete contact messages"
  ON public.contact_messages FOR DELETE USING (auth.role() = 'authenticated');

NOTIFY pgrst, 'reload schema';`}
          </pre>
          <p className="text-[11px] text-amber-700">
            Once executed, click the <strong>Refresh Messages</strong> button above.
          </p>
        </div>
      )}

      {/* Search Bar */}
      {!tableMissing && messages.length > 0 && (
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages by name, email, subject, or keywords..."
            className="w-full max-w-md text-xs font-mono p-2.5 border border-border rounded bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-mono text-text-muted hover:text-foreground cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Messages List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-mono text-text-muted">
          Loading contact messages...
        </div>
      ) : !tableMissing && filteredMessages.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-lg bg-background space-y-2">
          <p className="font-serif text-lg text-foreground">No inquiries yet</p>
          <p className="text-xs font-mono text-text-muted">
            {searchQuery
              ? "No messages match your search filter."
              : "When visitors submit the contact form on your portfolio, their messages will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 border rounded-lg transition-all ${
                msg.is_read
                  ? "border-border bg-background"
                  : "border-accent/40 bg-accent/[0.02] shadow-sm"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg text-foreground font-normal">
                      {msg.name}
                    </h3>
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="text-accent underline font-medium hover:text-accent/80"
                    >
                      {msg.email}
                    </a>
                    <span className="text-text-muted">•</span>
                    <span className="text-text-muted">
                      {new Date(msg.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="px-3 py-1.5 bg-foreground text-background text-xs font-mono rounded hover:bg-neutral-800"
                  >
                    Reply ↗
                  </a>
                  <button
                    onClick={() => toggleReadStatus(msg.id, msg.is_read)}
                    className="px-3 py-1.5 border border-border text-xs font-mono rounded hover:bg-neutral-100 cursor-pointer"
                  >
                    {msg.is_read ? "Mark Unread" : "Mark Read"}
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="px-2.5 py-1.5 text-xs font-mono text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 rounded cursor-pointer"
                    title="Delete message"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 space-y-2">
                <div className="type-label text-xs font-mono text-foreground font-semibold">
                  Subject: {msg.subject}
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed font-sans bg-[#FAFAF8] p-4 rounded border border-border/40">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
