import { HeroSection } from "@/components/hero/HeroSection";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { DigitalExperiences } from "@/components/sections/DigitalExperiences";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import {
  getPublishedDesignProjects,
  getPublishedDevelopedWebsites,
} from "@/lib/content";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export default async function HomePage() {
  const [designProjects, developedWebsites] = await Promise.all([
    getPublishedDesignProjects(),
    getPublishedDevelopedWebsites(),
  ]);

  return (
    <>
      {/* 01 Hero Section */}
      <HeroSection />

      {/* 02 Selected Works (Fed from Supabase Design Projects or static fallback) */}
      <SelectedWorks projects={designProjects} />

      {/* 03 Digital Experiences / Developed Websites (Fed from Supabase or static fallback) */}
      <DigitalExperiences projects={developedWebsites} />

      {/* 04 What I Do (Capabilities & Disciplines) */}
      <WhatIDo />

      {/* 05 About (Philosophy, Biography & Tools) */}
      <AboutSection />

      {/* 06 Contact (Inquiries, Form & Footer Marquee) */}
      <ContactSection />
    </>
  );
}
