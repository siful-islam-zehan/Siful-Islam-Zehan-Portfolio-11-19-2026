"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAllDevelopedWebsites } from "@/lib/admin-data-service";
import { DbDevelopedWebsite } from "@/lib/supabase/types";
import { WebsiteForm } from "@/components/admin/WebsiteForm";
import { useToast } from "@/components/admin/Toast";

export default function EditWebsitePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { showToast } = useToast();

  const [website, setWebsite] = useState<DbDevelopedWebsite | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchAllDevelopedWebsites();
        const found = all.find((w) => w.id === id);
        if (!found) {
          showToast("Website record not found", "error");
          router.push("/admin/websites");
          return;
        }
        setWebsite(found);
      } catch {
        showToast("Error loading website data", "error");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, router, showToast]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-text-muted">
        Loading website details...
      </div>
    );
  }

  return <WebsiteForm initialData={website} isNew={false} />;
}
