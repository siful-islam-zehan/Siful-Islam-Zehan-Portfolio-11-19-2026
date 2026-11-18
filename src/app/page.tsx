import { HeroSection } from "@/components/hero/HeroSection";
import { SelectedWorks } from "@/components/sections/SelectedWorks";
import { DigitalExperiences } from "@/components/sections/DigitalExperiences";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import {
  getPublishedDesignProjects,
  getPublishedDevelopedWebsites,
  getSiteSettings,
} from "@/lib/content";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export default async function HomePage() {
  const [designProjects, developedWebsites, siteSettings] = await Promise.all([
    getPublishedDesignProjects(),
    getPublishedDevelopedWebsites(),
    getSiteSettings(),
  ]);

  return (
    <>
      {/* 01 Hero Section */}
      <HeroSection
        socials={siteSettings.socials}
        availability={siteSettings.identity.availability}
        location={siteSettings.identity.location}
        email={siteSettings.identity.email}
        headlineLine1={siteSettings.heroLine1}
        headlineLine2={siteSettings.heroLine2}
        tagline={siteSettings.heroTagline}
        bio={siteSettings.identity.bio}
      />

      {/* 02 Selected Works (Fed from Supabase Design Projects or static fallback) */}
      <SelectedWorks projects={designProjects} />

      {/* 03 Digital Experiences / Developed Websites (Fed from Supabase or static fallback) */}
      <DigitalExperiences projects={developedWebsites} />

      {/* 04 What I Do (Capabilities & Disciplines) */}
      <WhatIDo />

      {/* 05 About (Philosophy, Biography & Tools) */}
      <AboutSection
        experiences={siteSettings.experiences}
        education={siteSettings.education}
        tools={siteSettings.tools as string[]}
        location={siteSettings.identity.location}
        coordinates={siteSettings.identity.coordinates}
        availability={siteSettings.identity.availability}
        aboutText={siteSettings.aboutText}
        shortBio={siteSettings.identity.bio}
      />

      {/* 06 Contact (Inquiries, Form & Footer Marquee) */}
      <ContactSection
        email={siteSettings.identity.email}
        socials={siteSettings.socials}
        location={siteSettings.identity.location}
        availability={siteSettings.identity.availability}
      />
    </>
  );
}
