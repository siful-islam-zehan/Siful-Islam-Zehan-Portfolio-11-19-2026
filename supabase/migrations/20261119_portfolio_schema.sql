-- ==============================================================================
-- SIFUL ISLAM ZEHAN (ZEHAN) — PORTFOLIO DATABASE SCHEMA & RLS POLICIES
-- Target: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. EXTENSIONS & HELPER FUNCTIONS
create extension if not exists "uuid-ossp";

-- Function to automatically update timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ==============================================================================
-- 2. TABLE: DESIGN PROJECTS (Feeds "Selected Works" & /works/[slug])
-- ==============================================================================
create table if not exists public.design_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'UI/UX Design',
  year text not null default '2025',
  summary text not null default '',
  role text[] not null default array['To be confirmed'],
  cover_image text not null,
  gallery jsonb not null default '[]'::jsonb, -- Array of { id, url, alt, caption, isDeviceMockup, order }
  external_url text default '',
  featured boolean not null default false,
  featured_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  contribution_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger for design_projects updated_at
drop trigger if exists tr_design_projects_updated_at on public.design_projects;
create trigger tr_design_projects_updated_at
  before update on public.design_projects
  for each row execute function update_updated_at_column();

-- ==============================================================================
-- 3. TABLE: DEVELOPED WEBSITES (Feeds "Digital Experiences" & Live Preview)
-- ==============================================================================
create table if not exists public.developed_websites (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  live_url text not null,
  cover_image text not null,
  screenshot_fallback text default '',
  category text not null default 'Website / Digital Experience',
  my_contribution text not null default 'To be confirmed',
  confirmed_technologies text[] not null default array[]::text[],
  year text not null default '2024',
  preview_mode text not null default 'iframe' check (preview_mode in ('iframe', 'external', 'image')),
  featured boolean not null default true,
  order_index integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  contribution_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger for developed_websites updated_at
drop trigger if exists tr_developed_websites_updated_at on public.developed_websites;
create trigger tr_developed_websites_updated_at
  before update on public.developed_websites
  for each row execute function update_updated_at_column();

-- ==============================================================================
-- 4. TABLE: SITE SETTINGS (Feeds Global Identity, Contact, Tools, Services)
-- ==============================================================================
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  email text not null default 'sifulislamzehan@gmail.com',
  phone text default '',
  location text not null default 'Dhaka, Bangladesh',
  coordinates text default '23.8103° N, 90.4125° E',
  behance text default '',
  linkedin text default '',
  dribbble text default '',
  github text default 'https://github.com/siful-islam-zehan',
  instagram text default '',
  availability_text text not null default 'Available for freelance work • 2026',
  availability_enabled boolean not null default true,
  cv_url text default '',
  hero_headline_line1 text not null default 'Designing digital',
  hero_headline_line2 text not null default 'experiences.',
  hero_headline_tagline text not null default 'Bringing ideas to life.',
  short_bio text not null default 'I work across UI/UX design, website design, product interfaces, and front-end implementation to create meaningful digital experiences.',
  about_text text not null default 'Clean design isn''t just visual, it''s how things work.',
  services jsonb not null default '[]'::jsonb,
  tools text[] not null default array[
    'Figma',
    'Adobe Photoshop',
    'Adobe XD',
    'Adobe Illustrator',
    'Notion',
    'Slack',
    'Jira',
    'Zeplin'
  ],
  updated_at timestamptz not null default now()
);

-- Trigger for site_settings updated_at
drop trigger if exists tr_site_settings_updated_at on public.site_settings;
create trigger tr_site_settings_updated_at
  before update on public.site_settings
  for each row execute function update_updated_at_column();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on all tables
alter table public.design_projects enable row level security;
alter table public.developed_websites enable row level security;
alter table public.site_settings enable row level security;

-- Clear previous policies if re-running
drop policy if exists "Public read published design projects" on public.design_projects;
drop policy if exists "Admin all design projects" on public.design_projects;

drop policy if exists "Public read published developed websites" on public.developed_websites;
drop policy if exists "Admin all developed websites" on public.developed_websites;

drop policy if exists "Public read site settings" on public.site_settings;
drop policy if exists "Admin all site settings" on public.site_settings;

-- PUBLIC READ POLICIES:
-- 1. Anonymous & public visitors can ONLY read published rows
create policy "Public read published design projects"
  on public.design_projects
  for select
  using (status = 'published');

create policy "Public read published developed websites"
  on public.developed_websites
  for select
  using (status = 'published');

create policy "Public read site settings"
  on public.site_settings
  for select
  using (true);

-- ADMIN POLICIES:
-- 2. Authenticated admin users have full access (select, insert, update, delete, drafts)
create policy "Admin all design projects"
  on public.design_projects
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all developed websites"
  on public.developed_websites
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all site settings"
  on public.site_settings
  for all
  to authenticated
  using (true)
  with check (true);

-- ==============================================================================
-- 6. STORAGE BUCKET: portfolio-images
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = true;

-- Storage RLS: Public read, Authenticated admin write
drop policy if exists "Public read portfolio images" on storage.objects;
create policy "Public read portfolio images"
  on storage.objects
  for select
  using (bucket_id = 'portfolio-images');

drop policy if exists "Admin insert portfolio images" on storage.objects;
create policy "Admin insert portfolio images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'portfolio-images');

drop policy if exists "Admin update portfolio images" on storage.objects;
create policy "Admin update portfolio images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'portfolio-images');

drop policy if exists "Admin delete portfolio images" on storage.objects;
create policy "Admin delete portfolio images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'portfolio-images');

-- ==============================================================================
-- 7. HONEST SEED DATA (Seed ONLY the 3 allowed projects as DRAFTS + Settings)
-- ==============================================================================
-- Clean up any prior demo/placeholder rows first
delete from public.design_projects where slug not in ('grandpool', 'naijaradar', 'secure-note');
delete from public.developed_websites where title not in ('Grandpool', 'NaijaRadar', 'Secure Note');

-- Default Site Settings Record (ID = 1)
-- Location: Bangladesh. Everything else (phone, socials, CV, bio, experience, education, stats) stays empty.
insert into public.site_settings (
  id,
  email,
  phone,
  location,
  coordinates,
  behance,
  linkedin,
  dribbble,
  github,
  instagram,
  availability_text,
  availability_enabled,
  cv_url,
  hero_headline_line1,
  hero_headline_line2,
  hero_headline_tagline,
  short_bio,
  about_text,
  services,
  tools
) values (
  1,
  'sifulislamzehan@gmail.com',
  '',
  'Bangladesh',
  '',
  '',
  '',
  '',
  'https://github.com/siful-islam-zehan',
  '',
  'Available for freelance work • 2026',
  true,
  '',
  'Designing digital',
  'experiences.',
  'Bringing ideas to life.',
  '',
  '',
  '[]'::jsonb,
  array[]::text[]
)
on conflict (id) do update set
  email = excluded.email,
  phone = excluded.phone,
  location = excluded.location,
  coordinates = excluded.coordinates,
  behance = excluded.behance,
  linkedin = excluded.linkedin,
  dribbble = excluded.dribbble,
  github = excluded.github,
  instagram = excluded.instagram,
  cv_url = excluded.cv_url,
  short_bio = excluded.short_bio,
  about_text = excluded.about_text,
  services = excluded.services,
  tools = excluded.tools;

-- 3 Allowed Websites seeded as DRAFTS with contribution_verified = false
insert into public.developed_websites (
  title,
  description,
  live_url,
  cover_image,
  screenshot_fallback,
  category,
  my_contribution,
  confirmed_technologies,
  year,
  preview_mode,
  featured,
  order_index,
  status,
  contribution_verified
) values
(
  'Grandpool',
  'Architectural digital experience created for an ultra-luxury private aquatic living and luxury resort lifestyle destination.',
  'https://siful-islam-zehan.github.io/Grandpool-design/',
  '/images/projects/grandpool-cover.webp',
  '',
  'Website Design / Demo',
  'To be confirmed',
  array['HTML5', 'CSS3', 'JavaScript'],
  '2024',
  'iframe',
  true,
  1,
  'draft',
  false
),
(
  'NaijaRadar',
  'A digital discovery and content publication platform engineered for rapid regional information dissemination and media aggregation.',
  'https://naijaradar.ng/',
  '/images/projects/naijaradar-cover.webp',
  '',
  'Website / Digital Experience',
  'To be confirmed',
  array['Next.js', 'TypeScript', 'Tailwind CSS'],
  '2024',
  'iframe',
  true,
  2,
  'draft',
  false
),
(
  'Secure Note',
  'An encrypted private note-taking mobile application emphasizing clear typographic hierarchy, biometric authentication, and focused utility.',
  'https://play.google.com/apps/test/com.engromjanali.securenote/2',
  '/images/projects/secure-note-cover.webp',
  '',
  'Mobile Application',
  'To be confirmed',
  array['Android', 'Biometric Auth'],
  '2024',
  'external',
  true,
  3,
  'draft',
  false
)
on conflict do nothing;

-- 3 Allowed Design Projects seeded as DRAFTS with contribution_verified = false
insert into public.design_projects (
  title,
  slug,
  category,
  year,
  summary,
  role,
  cover_image,
  gallery,
  external_url,
  featured,
  featured_order,
  status,
  contribution_verified
) values
(
  'Grandpool',
  'grandpool',
  'Website Design / Demo',
  '2024',
  'Architectural digital experience created for an ultra-luxury private aquatic living and luxury resort lifestyle destination.',
  array['To be confirmed'],
  '/images/projects/grandpool-cover.webp',
  '[
    {"id":"1","url":"/images/projects/grandpool-cover.webp","alt":"Grandpool Architecture Cover","caption":"Editorial hero overview","isDeviceMockup":false,"order":1},
    {"id":"2","url":"/images/projects/grandpool-screen-1.webp","alt":"Grandpool Desktop Layout","caption":"Poolside suite collection specification","isDeviceMockup":false,"order":2},
    {"id":"3","url":"/images/projects/grandpool-screen-2.webp","alt":"Grandpool Architectural Details","caption":"Spatial hierarchy & booking interaction","isDeviceMockup":false,"order":3}
  ]'::jsonb,
  'https://siful-islam-zehan.github.io/Grandpool-design/',
  true,
  1,
  'draft',
  false
),
(
  'NaijaRadar',
  'naijaradar',
  'Website / Digital Experience',
  '2024',
  'A digital discovery and content publication platform engineered for rapid regional information dissemination and media aggregation.',
  array['To be confirmed'],
  '/images/projects/naijaradar-cover.webp',
  '[
    {"id":"1","url":"/images/projects/naijaradar-cover.webp","alt":"NaijaRadar Platform Cover","caption":"Digital publication overview","isDeviceMockup":false,"order":1}
  ]'::jsonb,
  'https://naijaradar.ng/',
  true,
  2,
  'draft',
  false
),
(
  'Secure Note',
  'secure-note',
  'Mobile Application',
  '2024',
  'An encrypted private note-taking mobile application emphasizing clear typographic hierarchy, biometric authentication, and focused utility.',
  array['To be confirmed'],
  '/images/projects/secure-note-cover.webp',
  '[
    {"id":"1","url":"/images/projects/secure-note-cover.webp","alt":"Secure Note Application Cover","caption":"Encrypted interface display","isDeviceMockup":false,"order":1}
  ]'::jsonb,
  'https://play.google.com/apps/test/com.engromjanali.securenote/2',
  true,
  3,
  'draft',
  false
)
on conflict (slug) do nothing;
