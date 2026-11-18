"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAllDesignProjects } from "@/lib/admin-data-service";
import { DbDesignProject } from "@/lib/supabase/types";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { useToast } from "@/components/admin/Toast";

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { showToast } = useToast();

  const [project, setProject] = useState<DbDesignProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchAllDesignProjects();
        const found = all.find((p) => p.id === id || p.slug === id);
        if (!found) {
          showToast("Project not found", "error");
          router.push("/admin/projects");
          return;
        }
        setProject(found);
      } catch {
        showToast("Error loading project data", "error");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, router, showToast]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-text-muted">
        Loading project details...
      </div>
    );
  }

  return <ProjectForm initialData={project} isNew={false} />;
}
