/**
 * Siful Islam Zehan (Zehan) — Personal Portfolio Core Data
 * Single source of truth for bio, identity, services, and navigation.
 * Editing data here never requires changing UI components.
 */

export interface NavItem {
  label: string;
  href: string;
  number: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
  isPlaceholder: boolean;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

export const PORTFOLIO_DATA = {
  identity: {
    fullName: "Siful Islam Zehan",
    displayName: "Zehan",
    role: "UI/UX Designer & Front-End Designer",
    positioning: "Designing digital experiences. Bringing ideas to life.",
    bio: "I work across UI/UX design, website design, product interfaces, and front-end implementation to create meaningful digital experiences.",
    location: "Bangladesh",
    coordinates: "",
    email: "hello@sifulislamzehan.dev",
    availability: "Available for freelance work • 2026",
  },

  navigation: [
    { label: "Works", href: "#works", number: "01" },
    { label: "Experiences", href: "#experiences", number: "02" },
    { label: "Services", href: "#services", number: "03" },
    { label: "About", href: "#about", number: "04" },
    { label: "Contact", href: "#contact", number: "05" },
  ] as NavItem[],

  socials: [
    {
      platform: "GitHub",
      url: "https://github.com/siful-islam-zehan",
      handle: "siful-islam-zehan",
      isPlaceholder: false,
    },
  ] as SocialLink[],

  tools: [
    "Figma",
    "Adobe Photoshop",
    "Adobe XD",
    "Adobe Illustrator",
    "Notion",
    "Slack",
    "Jira",
    "Zeplin",
  ],

  servicesIntro: {
    eyebrow: "02 — WHAT I DO",
    chapterLabel: "CHAPTER 04 // CAPABILITIES & DISCIPLINES",
    heading: "Beyond pixels. Into experiences.",
    description:
      "From the first idea to the final interface, I combine design thinking, visual creativity, and technical understanding to create meaningful digital experiences.",
  },

  services: [
    {
      id: "ui-ux",
      number: "01",
      title: "UI/UX Design",
      description:
        "I design intuitive digital experiences by transforming complex ideas into clear user journeys, thoughtful interfaces, and functional prototypes.",
      deliverables: [
        "User Flow",
        "Wireframing",
        "High-Fidelity UI",
        "Interactive Prototypes",
        "Figma Components",
        "Design Systems",
      ],
    },
    {
      id: "website-design",
      number: "02",
      title: "Website Design",
      description:
        "I create visually distinctive, responsive websites with strong typography, thoughtful layouts, and user-focused interactions.",
      deliverables: [
        "Landing Pages",
        "Portfolio Websites",
        "Corporate Websites",
        "Responsive Design",
        "Web Art Direction",
        "Micro-interactions",
      ],
    },
    {
      id: "product-saas",
      number: "03",
      title: "Product & SaaS Design",
      description:
        "I design scalable digital products and data-driven interfaces that make complex workflows easier to understand and use.",
      deliverables: [
        "SaaS Dashboards",
        "Admin Panels",
        "CRM Interfaces",
        "Data Visualization",
        "Component Libraries",
        "User Flows",
      ],
    },
    {
      id: "ux-audit-redesign",
      number: "04",
      title: "UX Audit & Redesign",
      description:
        "I evaluate existing digital experiences, identify usability issues, and redesign interfaces to improve clarity, consistency, and usability.",
      deliverables: [
        "UX Evaluation",
        "Heuristic Analysis",
        "Usability Issues",
        "Interface Redesign",
        "User Journey Mapping",
        "Design Recommendations",
      ],
    },
    {
      id: "frontend-impl",
      number: "05",
      title: "Front-End Implementation",
      description:
        "I bring design concepts to life by translating UI designs into responsive, functional web interfaces with attention to detail.",
      deliverables: [
        "HTML & CSS",
        "Responsive Layouts",
        "JavaScript",
        "React UI",
        "Tailwind CSS",
        "UI Implementation",
      ],
    },
    {
      id: "visual-graphic",
      number: "06",
      title: "Visual & Graphic Design",
      description:
        "I create purposeful visual assets and presentation materials that communicate ideas clearly and maintain a consistent visual identity.",
      deliverables: [
        "Presentation Design",
        "Pitch Decks",
        "Social Media Graphics",
        "Editorial Design",
        "Brand Assets",
        "Marketing Visuals",
      ],
    },
  ] as ServiceItem[],

  experiences: [] as ExperienceItem[],

  education: [] as EducationItem[],
};
