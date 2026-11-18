"use client";

import React, { useEffect, useState } from "react";
import { fetchSiteSettings, saveSiteSettings } from "@/lib/admin-data-service";
import { DbSiteSettings, ExperienceItem, EducationItem } from "@/lib/supabase/types";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useToast } from "@/components/admin/Toast";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<DbSiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cvFileUploading, setCvFileUploading] = useState(false);
  const { showToast } = useToast();
  const isConfigured = isSupabaseConfigured();

  // Form Fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [behance, setBehance] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [dribbble, setDribbble] = useState("");
  const [github, setGithub] = useState("");
  const [instagram, setInstagram] = useState("");
  const [availabilityText, setAvailabilityText] = useState("");
  const [availabilityEnabled, setAvailabilityEnabled] = useState(true);
  const [cvUrl, setCvUrl] = useState("");
  const [heroLine1, setHeroLine1] = useState("");
  const [heroLine2, setHeroLine2] = useState("");
  const [heroTagline, setHeroTagline] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [toolsInput, setToolsInput] = useState("");
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSiteSettings();
        setSettings(data);
        setEmail(data.email || "hello@sifulislamzehan.dev");
        setPhone(data.phone || "");
        setLocation(data.location || "");
        setCoordinates(data.coordinates || "");
        setBehance(data.behance || "");
        setLinkedin(data.linkedin || "");
        setDribbble(data.dribbble || "");
        setGithub(data.github || "");
        setInstagram(data.instagram || "");
        setAvailabilityText(data.availability_text || "");
        setAvailabilityEnabled(data.availability_enabled ?? true);
        setCvUrl(data.cv_url || "");
        setHeroLine1(data.hero_headline_line1 || "Designing digital");
        setHeroLine2(data.hero_headline_line2 || "experiences.");
        setHeroTagline(data.hero_headline_tagline || "Bringing ideas to life.");
        setShortBio(data.short_bio || "");
        setAboutText(data.about_text || "");
        setToolsInput(data.tools ? data.tools.join(", ") : "");
        setExperiences(
          data.experiences && Array.isArray(data.experiences)
            ? data.experiences
            : []
        );
        setEducation(
          data.education && Array.isArray(data.education)
            ? data.education
            : []
        );
      } catch {
        showToast("Failed to load site settings", "error");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [showToast]);

  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: "exp-" + Date.now(),
        role: "",
        company: "",
        location: "Dhaka, Bangladesh",
        period: "2024 — Present",
        description: "",
      },
    ]);
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof ExperienceItem,
    value: string
  ) => {
    setExperiences((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        id: "edu-" + Date.now(),
        degree: "",
        institution: "",
        period: "2020 — 2024",
        description: "",
      },
    ]);
  };

  const handleUpdateEducation = (
    index: number,
    field: keyof EducationItem,
    value: string
  ) => {
    setEducation((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveEducation = (index: number) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      showToast("Only PDF documents are allowed for CV upload", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("CV file size exceeds 10MB limit", "error");
      return;
    }

    setCvFileUploading(true);
    try {
      if (isConfigured) {
        const supabase = createClient();
        if (supabase) {
          const filePath = `documents/zehan-cv-${Date.now()}.pdf`;
          const { error: uploadError } = await supabase.storage
            .from("portfolio-images")
            .upload(filePath, file, {
              contentType: "application/pdf",
              upsert: true,
            });

          if (uploadError) throw new Error(uploadError.message);

          const { data: publicUrlData } = supabase.storage
            .from("portfolio-images")
            .getPublicUrl(filePath);

          setCvUrl(publicUrlData.publicUrl);
          showToast("CV PDF uploaded to cloud storage successfully!");
        }
      } else {
        const localUrl = URL.createObjectURL(file);
        setCvUrl(localUrl);
        showToast("CV file loaded locally (ready for saving)");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to upload CV", "error");
    } finally {
      setCvFileUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const toolsArray = toolsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<DbSiteSettings> = {
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        coordinates: coordinates.trim(),
        behance: behance.trim(),
        linkedin: linkedin.trim(),
        dribbble: dribbble.trim(),
        github: github.trim(),
        instagram: instagram.trim(),
        availability_text: availabilityText.trim(),
        availability_enabled: availabilityEnabled,
        cv_url: cvUrl.trim(),
        hero_headline_line1: heroLine1.trim(),
        hero_headline_line2: heroLine2.trim(),
        hero_headline_tagline: heroTagline.trim(),
        short_bio: shortBio.trim(),
        about_text: aboutText.trim(),
        tools: toolsArray,
        experiences: experiences.filter((e) => e.role.trim() || e.company.trim()),
        education: education.filter((e) => e.degree.trim() || e.institution.trim()),
      };

      const updated = await saveSiteSettings(payload);
      setSettings(updated);
      showToast("Site settings updated successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-text-muted">
        Loading site settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="type-label text-[10px] font-mono text-text-muted tracking-widest uppercase mb-1">
          GLOBAL CONFIGURATION // IDENTITY &amp; TELEMETRY
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-foreground">
          Site Settings &amp; Contact Editor
        </h1>
        <p className="type-body text-xs text-text-muted mt-1">
          Update contact info, availability badge, hero typography lines, and confirmed tooling stack.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: CONTACT & IDENTITY */}
        <div className="bg-background border border-border p-6 rounded space-y-4">
          <h2 className="type-label text-xs uppercase tracking-wider text-foreground">
            Contact &amp; Location
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="type-label text-[11px] font-mono text-text-muted">
                CONTACT EMAIL *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@sifulislamzehan.dev"
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label text-[11px] font-mono text-text-muted">
                PHONE (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXX-XXXXXX"
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label text-[11px] font-mono text-text-muted">
                LOCATION *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Dhaka, Bangladesh"
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label text-[11px] font-mono text-text-muted">
                COORDINATES
              </label>
              <input
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                placeholder="23.8103° N, 90.4125° E"
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: AVAILABILITY BADGE */}
        <div className="bg-[#F8F7F4] border border-border p-6 rounded space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="type-label text-xs uppercase tracking-wider text-foreground">
                Availability Badge
              </h2>
              <p className="text-[11px] font-mono text-text-muted">
                Controls the pulsing availability pill shown in the Hero and Contact sections.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono select-none">
              <input
                type="checkbox"
                checked={availabilityEnabled}
                onChange={(e) => setAvailabilityEnabled(e.target.checked)}
                className="rounded border-border accent-foreground"
              />
              Show Badge
            </label>
          </div>

          {availabilityEnabled && (
            <div className="space-y-1 pt-2">
              <label className="type-label text-[11px] font-mono text-text-muted">
                AVAILABILITY TEXT
              </label>
              <input
                type="text"
                value={availabilityText}
                onChange={(e) => setAvailabilityText(e.target.value)}
                placeholder="Available for freelance work • 2026"
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>
          )}
        </div>

        {/* SECTION 3: SOCIAL LINKS */}
        <div className="bg-background border border-border p-6 rounded space-y-4">
          <div>
            <h2 className="type-label text-xs uppercase tracking-wider text-foreground">
              Social Links &amp; Profiles
            </h2>
            <p className="text-[11px] font-mono text-text-muted">
              Empty links are automatically omitted from the live portfolio navigation and contact directory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="type-label text-[11px] font-mono text-text-muted">
                GITHUB URL
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/siful-islam-zehan"
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label text-[11px] font-mono text-text-muted">
                LINKEDIN URL
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label text-[11px] font-mono text-text-muted">
                BEHANCE URL
              </label>
              <input
                type="url"
                value={behance}
                onChange={(e) => setBehance(e.target.value)}
                placeholder="https://behance.net/..."
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label text-[11px] font-mono text-text-muted">
                DRIBBBLE URL
              </label>
              <input
                type="url"
                value={dribbble}
                onChange={(e) => setDribbble(e.target.value)}
                placeholder="https://dribbble.com/..."
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="type-label text-[11px] font-mono text-text-muted">
                INSTAGRAM OR OTHER PROFILE URL
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: HERO TYPOGRAPHY & BIO */}
        <div className="bg-background border border-border p-6 rounded space-y-4">
          <h2 className="type-label text-xs uppercase tracking-wider text-foreground">
            Hero Typography &amp; Narrative
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="type-label text-[11px] font-mono text-text-muted">
                HEADLINE LINE 1
              </label>
              <input
                type="text"
                value={heroLine1}
                onChange={(e) => setHeroLine1(e.target.value)}
                placeholder="Designing digital"
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="type-label text-[11px] font-mono text-text-muted">
                HEADLINE LINE 2
              </label>
              <input
                type="text"
                value={heroLine2}
                onChange={(e) => setHeroLine2(e.target.value)}
                placeholder="experiences."
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="type-label text-[11px] font-mono text-text-muted">
                HERO TAGLINE (Italic accent)
              </label>
              <input
                type="text"
                value={heroTagline}
                onChange={(e) => setHeroTagline(e.target.value)}
                placeholder="Bringing ideas to life."
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="type-label text-[11px] font-mono text-text-muted">
                SHORT BIO
              </label>
              <textarea
                rows={2}
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                placeholder="I work across UI/UX design, website design, product interfaces, and front-end implementation to create meaningful digital experiences."
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="type-label text-[11px] font-mono text-text-muted">
                ABOUT PHILOSOPHY STATEMENT
              </label>
              <textarea
                rows={2}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder="Clean design isn't just visual, it's how things work."
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: CAREER & WORK EXPERIENCE */}
        <div className="bg-background border border-border p-6 rounded space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="type-label text-xs uppercase tracking-wider text-foreground">
                Career &amp; Work Experience
              </h2>
              <p className="text-[11px] font-mono text-text-muted mt-1">
                Manage your professional positions and client collaborations (rendered in Chapter 05 About section).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddExperience}
              className="px-3 py-1.5 border border-border rounded text-xs font-mono hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
            >
              <span>+</span> Add Experience
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {experiences.length === 0 ? (
              <p className="text-xs font-mono text-text-muted italic py-4 text-center border border-dashed border-border rounded">
                No work experience entries yet. Click &quot;+ Add Experience&quot; to add one.
              </p>
            ) : (
              experiences.map((exp, index) => (
                <div
                  key={exp.id || index}
                  className="p-4 border border-border rounded bg-[#FAFAF8] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="type-label text-[11px] font-mono text-text-muted font-semibold">
                      EXPERIENCE #{String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="text-xs font-mono text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="type-label text-[10px] font-mono text-text-muted">
                        ROLE / TITLE *
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleUpdateExperience(index, "role", e.target.value)}
                        placeholder="e.g. UI/UX Designer & Front-End Designer"
                        className="w-full text-xs font-mono p-2 border border-border rounded bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="type-label text-[10px] font-mono text-text-muted">
                        COMPANY / CLIENT COLLABORATION *
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(index, "company", e.target.value)}
                        placeholder="e.g. Independent Practice / Tech Studio"
                        className="w-full text-xs font-mono p-2 border border-border rounded bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="type-label text-[10px] font-mono text-text-muted">
                        PERIOD / TIMELINE
                      </label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => handleUpdateExperience(index, "period", e.target.value)}
                        placeholder="e.g. 2023 — Present"
                        className="w-full text-xs font-mono p-2 border border-border rounded bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="type-label text-[10px] font-mono text-text-muted">
                        LOCATION (Optional)
                      </label>
                      <input
                        type="text"
                        value={exp.location || ""}
                        onChange={(e) => handleUpdateExperience(index, "location", e.target.value)}
                        placeholder="e.g. Dhaka, Bangladesh or Remote"
                        className="w-full text-xs font-mono p-2 border border-border rounded bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="type-label text-[10px] font-mono text-text-muted">
                      RESPONSIBILITIES &amp; SCOPE SUMMARY
                    </label>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => handleUpdateExperience(index, "description", e.target.value)}
                      placeholder="Summary of responsibilities, design deliverables, technical contributions..."
                      className="w-full text-xs font-mono p-2 border border-border rounded bg-background"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION 6: ACADEMIC & EDUCATION BACKGROUND */}
        <div className="bg-background border border-border p-6 rounded space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="type-label text-xs uppercase tracking-wider text-foreground">
                Academic &amp; Education Background
              </h2>
              <p className="text-[11px] font-mono text-text-muted mt-1">
                Manage your academic credentials and degrees (rendered in Chapter 05 About section).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddEducation}
              className="px-3 py-1.5 border border-border rounded text-xs font-mono hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
            >
              <span>+</span> Add Education
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {education.length === 0 ? (
              <p className="text-xs font-mono text-text-muted italic py-4 text-center border border-dashed border-border rounded">
                No education entries yet. Click &quot;+ Add Education&quot; to add one.
              </p>
            ) : (
              education.map((edu, index) => (
                <div
                  key={edu.id || index}
                  className="p-4 border border-border rounded bg-[#FAFAF8] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="type-label text-[11px] font-mono text-text-muted font-semibold">
                      CREDENTIAL #{String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="text-xs font-mono text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="type-label text-[10px] font-mono text-text-muted">
                        DEGREE / FIELD OF STUDY *
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(index, "degree", e.target.value)}
                        placeholder="e.g. B.Sc. in Computer Science & Engineering"
                        className="w-full text-xs font-mono p-2 border border-border rounded bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="type-label text-[10px] font-mono text-text-muted">
                        INSTITUTION / UNIVERSITY *
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(index, "institution", e.target.value)}
                        placeholder="e.g. University of Dhaka, Bangladesh"
                        className="w-full text-xs font-mono p-2 border border-border rounded bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="type-label text-[10px] font-mono text-text-muted">
                      PERIOD / TIMELINE
                    </label>
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => handleUpdateEducation(index, "period", e.target.value)}
                      placeholder="e.g. 2020 — 2024"
                      className="w-full text-xs font-mono p-2 border border-border rounded bg-background"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="type-label text-[10px] font-mono text-text-muted">
                      ACADEMIC FOCUS &amp; COURSEWORK (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={edu.description || ""}
                      onChange={(e) => handleUpdateEducation(index, "description", e.target.value)}
                      placeholder="Focus on Human-Computer Interaction, Front-End Architecture, Design Systems..."
                      className="w-full text-xs font-mono p-2 border border-border rounded bg-background"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION 7: CONFIRMED TOOLS */}
        <div className="bg-background border border-border p-6 rounded space-y-3">
          <h2 className="type-label text-xs uppercase tracking-wider text-foreground">
            Confirmed Tooling &amp; Software Stack
          </h2>
          <p className="text-[11px] font-mono text-text-muted">
            Comma-separated list of software tools you actively use (rendered in Chapter 05 About section).
          </p>
          <input
            type="text"
            value={toolsInput}
            onChange={(e) => setToolsInput(e.target.value)}
            placeholder="Figma, Adobe Photoshop, Adobe XD, Adobe Illustrator, Notion, Slack, Jira, Zeplin"
            className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
          />
        </div>

        {/* SECTION 8: CV FILE UPLOAD (PDF) */}
        <div className="bg-[#F8F7F4] border border-border p-6 rounded space-y-3">
          <h2 className="type-label text-xs uppercase tracking-wider text-foreground">
            Curriculum Vitae (PDF)
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleCvUpload}
              className="text-xs font-mono"
            />
            {cvFileUploading && (
              <span className="text-xs font-mono text-text-muted animate-pulse">
                Uploading PDF document...
              </span>
            )}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono underline text-foreground"
              >
                View Uploaded CV ↗
              </a>
            )}
          </div>
        </div>

        {/* SAVE ACTION BAR */}
        <div className="pt-4 border-t border-border flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-foreground text-background font-mono text-xs uppercase tracking-wider rounded hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Saving Settings..." : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
