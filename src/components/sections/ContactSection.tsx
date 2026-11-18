"use client";

import React, { useState, useRef, useEffect } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion, MOTION_TOKENS } from "@/utils/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContactSectionProps {
  email?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ email }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [botField, setBotField] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusState, setStatusState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const emailAddress = email || PORTFOLIO_DATA.identity.email || "hello@sifulislamzehan.dev";

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      errors.name = "Full Name is required.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email Address is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address.";
      }
    }
    if (!formData.subject.trim()) {
      errors.subject = "Subject is required.";
    }
    if (!formData.message.trim()) {
      errors.message = "Message is required.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    // Honeypot spam protection
    if (botField.trim() !== "") {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStatusState("success");
      }, 500);
      return;
    }

    setIsSubmitting(true);
    setStatusState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          _gotcha: botField,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatusState("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setValidationErrors({});
      } else {
        setStatusState("error");
        setErrorMessage(
          data.error ||
            "Something went wrong. Please try again or contact me directly via email."
        );
      }
    } catch {
      setStatusState("error");
      setErrorMessage(
        "Something went wrong. Please try again or contact me directly via email."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Architectural Section Divider Line (Draws across on scroll)
      gsap.from(".contact-divider-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      // Background Watermark Numeral Parallax Scrub
      gsap.to(".contact-watermark", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Header entrance mask reveal
      gsap.from(".contact-header-line", {
        yPercent: 110,
        duration: MOTION_TOKENS.durationBase,
        ease: MOTION_TOKENS.easeBase,
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Giant email reveal
      gsap.from(".giant-email-text", {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: MOTION_TOKENS.easeBase,
        scrollTrigger: {
          trigger: ".giant-email-container",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact and Inquiries"
      className="relative w-full bg-dark-background text-dark-foreground pt-24 sm:pt-32 overflow-hidden"
    >
      {/* Architectural Top Divider Line */}
      <div className="contact-divider-line absolute top-0 left-0 w-full h-[1px] bg-white/15 pointer-events-none" />

      {/* Monumental Watermark Numeral with Scroll Parallax */}
      <div
        aria-hidden="true"
        className="contact-watermark absolute -right-6 md:right-8 lg:right-16 top-12 pointer-events-none select-none font-display text-[180px] sm:text-[260px] lg:text-[340px] font-black text-white/[0.04] leading-none -z-0 will-change-transform"
      >
        06
      </div>

      <div className="container-editorial relative z-10">
        {/* Section Header */}
        <div className="border-b border-white/15 pb-12 mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="overflow-hidden mb-3">
                <span className="contact-header-line block type-label text-[#85827B] tracking-widest">
                  CHAPTER 06 // COLLABORATION &amp; INQUIRIES
                </span>
              </div>
              <div className="overflow-hidden">
                <h2 className="contact-header-line type-display-l font-serif text-dark-foreground">
                  <span>Have an idea? </span>
                  <span className="font-serif-italic">Let&apos;s make it happen.</span>
                </h2>
              </div>
            </div>

            <div className="type-caption font-mono text-xs text-[#85827B]">
              DHAKA, BANGLADESH • OPEN FOR FREELANCE 2026
            </div>
          </div>
        </div>

        {/* 
          GIANT TYPOGRAPHIC EMAIL DISPLAY WITH COPY ACTION
        */}
        <div className="giant-email-container border border-white/15 p-8 sm:p-12 md:p-16 mb-16 bg-[#1f1f1f]/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3">
              <span className="type-label text-xs text-[#85827B] tracking-widest block font-mono">
                DIRECT INQUIRY CHANNEL
              </span>
              <a
                href={`mailto:${emailAddress}`}
                className="giant-email-text block type-h1 font-serif text-dark-foreground hover:opacity-75 transition-opacity break-all select-all"
              >
                {emailAddress}
              </a>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={copyEmail}
                className="px-6 py-3.5 border border-white/30 rounded-pill hover:border-white transition-colors type-label text-xs text-dark-foreground font-mono bg-[#171717]"
              >
                {copied ? "COPIED TO CLIPBOARD ✓" : "COPY EMAIL"}
              </button>
            </div>
          </div>
        </div>

        {/* 
          2-COLUMN CONTACT SPREAD: FORM + SOCIAL MATRIX
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-24 border-b border-white/15">
          {/* Left Column (7/12): Functional Formspree Contact Form */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <h3 className="type-h2 text-dark-foreground mb-2">Send a Project Note</h3>
              <p className="type-body text-[#85827B]">
                Fill in the details below. All submissions are dispatched directly to my inbox via Formspree.
              </p>
            </div>

            {statusState === "success" ? (
              <div className="border border-white/20 bg-[#1f1f1f] p-8 sm:p-12 space-y-6 animate-[fadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)]">
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-xl text-dark-foreground font-mono">
                  ✓
                </div>
                <div>
                  <h3 className="font-serif text-3xl sm:text-4xl text-dark-foreground mb-3">
                    Thank you for reaching out!
                  </h3>
                  <p className="type-body text-[#85827B] max-w-lg leading-relaxed">
                    Your message has been sent successfully. I&apos;ll get back to you as soon as possible.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusState("idle");
                      setErrorMessage(null);
                    }}
                    className="type-label text-xs font-mono text-dark-foreground border border-white/30 px-6 py-3 rounded-sm hover:border-white transition-colors"
                  >
                    ← Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
                {/* Honeypot Spam Protection Field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="_gotcha">Do not fill this field</label>
                  <input
                    id="_gotcha"
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="type-label text-xs text-[#85827B] block font-mono">
                      FULL NAME *
                    </label>
                    <input
                      id="fullName"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (validationErrors.name) {
                          setValidationErrors({ ...validationErrors, name: "" });
                        }
                      }}
                      placeholder="e.g. Siful Islam"
                      className={`w-full bg-[#1f1f1f] border px-4 py-3 text-dark-foreground text-sm focus:border-white focus:outline-none rounded-none placeholder:text-[#555] transition-colors ${
                        validationErrors.name ? "border-red-400" : "border-white/15"
                      }`}
                    />
                    {validationErrors.name && (
                      <span className="type-caption text-[11px] font-mono text-red-400 block">
                        {validationErrors.name}
                      </span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="type-label text-xs text-[#85827B] block font-mono">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (validationErrors.email) {
                          setValidationErrors({ ...validationErrors, email: "" });
                        }
                      }}
                      placeholder="name@company.com"
                      className={`w-full bg-[#1f1f1f] border px-4 py-3 text-dark-foreground text-sm focus:border-white focus:outline-none rounded-none placeholder:text-[#555] transition-colors ${
                        validationErrors.email ? "border-red-400" : "border-white/15"
                      }`}
                    />
                    {validationErrors.email && (
                      <span className="type-caption text-[11px] font-mono text-red-400 block">
                        {validationErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="type-label text-xs text-[#85827B] block font-mono">
                    SUBJECT *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                      if (validationErrors.subject) {
                        setValidationErrors({ ...validationErrors, subject: "" });
                      }
                    }}
                    placeholder="e.g. UI/UX Design System or Web Redesign"
                    className={`w-full bg-[#1f1f1f] border px-4 py-3 text-dark-foreground text-sm focus:border-white focus:outline-none rounded-none placeholder:text-[#555] transition-colors ${
                      validationErrors.subject ? "border-red-400" : "border-white/15"
                    }`}
                  />
                  {validationErrors.subject && (
                    <span className="type-caption text-[11px] font-mono text-red-400 block">
                      {validationErrors.subject}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="type-label text-xs text-[#85827B] block font-mono">
                    MESSAGE *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (validationErrors.message) {
                        setValidationErrors({ ...validationErrors, message: "" });
                      }
                    }}
                    placeholder="Tell me about your timeline, design requirements, and goals..."
                    className={`w-full bg-[#1f1f1f] border px-4 py-3 text-dark-foreground text-sm focus:border-white focus:outline-none rounded-none placeholder:text-[#555] transition-colors ${
                      validationErrors.message ? "border-red-400" : "border-white/15"
                    }`}
                  />
                  {validationErrors.message && (
                    <span className="type-caption text-[11px] font-mono text-red-400 block">
                      {validationErrors.message}
                    </span>
                  )}
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 border border-red-500/40 bg-red-950/20 text-xs font-mono text-red-300 space-y-1">
                    <p>✕ {errorMessage}</p>
                    <p className="text-[11px] text-[#85827B]">
                      Your message has been preserved. You can also write directly to:{" "}
                      <a href={`mailto:${emailAddress}`} className="text-white underline">
                        {emailAddress}
                      </a>
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <MagneticButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 bg-dark-foreground text-dark-background border border-dark-foreground rounded-sm hover:bg-transparent hover:text-dark-foreground transition-all type-label text-xs tracking-wider"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                        <span>Sending Message...</span>
                      </span>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </MagneticButton>
                </div>
              </form>
            )}
          </div>

          {/* Right Column (5/12): Social Links & Directory */}
          <div className="lg:col-span-5 space-y-8 lg:pl-8">
            <div>
              <h3 className="type-h2 text-dark-foreground mb-3">Connect Online</h3>
              <p className="type-body text-[#85827B] mb-6">
                Explore design work, code repositories, and professional updates across confirmed channels.
              </p>
            </div>

            {/* Social Channels List */}
            <div className="border border-white/15 divide-y divide-white/10 bg-[#1f1f1f]/40">
              {PORTFOLIO_DATA.socials.map((s) => (
                <div key={s.platform} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="type-label text-xs text-dark-foreground block">
                      {s.platform}
                    </span>
                    <span className="type-caption font-mono text-[11px] text-[#85827B]">
                      {s.handle}
                    </span>
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-label text-xs text-[#85827B] hover:text-dark-foreground transition-colors"
                  >
                    {s.isPlaceholder ? "PLACEHOLDER ↗" : "VISIT ↗"}
                  </a>
                </div>
              ))}
            </div>

            {/* Location & Availability Card */}
            <div className="border border-white/15 p-6 bg-[#1f1f1f]/30 space-y-2 font-mono text-xs text-[#85827B]">
              <div className="flex items-center gap-2 text-dark-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="type-label text-xs">AVAILABLE FOR FREELANCE • 2026</span>
              </div>
              <p>Based in Dhaka, Bangladesh (UTC+6). Working with global design teams and founders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 
        FOOTER HORIZONTAL MARQUEE TICKER
      */}
      <div className="w-full py-6 bg-black border-t border-white/10 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="type-label text-xs md:text-sm font-mono text-[#DAD7D0] tracking-[0.25em] mx-6 uppercase flex items-center gap-6"
            >
              <span>SIFUL ISLAM ZEHAN</span>
              <span className="text-[#85827B]">•</span>
              <span>UI/UX DESIGNER &amp; FRONT-END DESIGNER</span>
              <span className="text-[#85827B]">•</span>
              <span>DHAKA, BANGLADESH</span>
              <span className="text-[#85827B]">•</span>
              <span>&quot;DESIGNING DIGITAL EXPERIENCES. BRINGING IDEAS TO LIFE.&quot;</span>
              <span className="text-[#85827B]">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Baseline Copyright Footer */}
      <footer role="contentinfo" className="w-full py-6 bg-dark-background border-t border-white/10 text-xs font-mono text-[#85827B]">
        <div className="container-editorial flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} SIFUL ISLAM ZEHAN. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-dark-foreground transition-colors">
              BACK TO TOP ↑
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
};
