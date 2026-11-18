import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const width = 1200;
const height = 630;

const svgCard = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="#171717"/>
  
  <!-- Architectural Outer Border -->
  <rect x="32" y="32" width="${width - 64}" height="${height - 64}" fill="none" stroke="#DAD7D0" stroke-width="1" stroke-opacity="0.25"/>
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="none" stroke="#DAD7D0" stroke-width="1" stroke-opacity="0.12"/>
  
  <!-- Subtle Grid Lines -->
  <line x1="32" y1="120" x2="${width - 32}" y2="120" stroke="#DAD7D0" stroke-width="1" stroke-opacity="0.15"/>
  <line x1="32" y1="${height - 100}" x2="${width - 32}" y2="${height - 100}" stroke="#DAD7D0" stroke-width="1" stroke-opacity="0.15"/>
  <line x1="720" y1="120" x2="720" y2="${height - 100}" stroke="#DAD7D0" stroke-width="1" stroke-opacity="0.15"/>

  <!-- Top Metadata Header -->
  <text x="64" y="85" font-family="monospace, Courier" font-size="14" fill="#85827B" letter-spacing="3">SIFUL ISLAM ZEHAN // PORTFOLIO 2026</text>
  <text x="${width - 64}" y="85" font-family="monospace, Courier" font-size="14" fill="#85827B" text-anchor="end" letter-spacing="2">AVAILABLE FOR FREELANCE</text>

  <!-- Left Main Editorial Typographic Area -->
  <text x="64" y="240" font-family="Georgia, serif" font-size="78" fill="#F3F1EC" font-style="normal" font-weight="400">SIFUL ISLAM ZEHAN</text>
  <text x="64" y="320" font-family="Georgia, serif" font-size="34" font-style="italic" fill="#85827B">UI/UX Designer &amp; Front-End Designer</text>
  
  <text x="64" y="410" font-family="sans-serif, Arial" font-size="20" fill="#DAD7D0" font-weight="300" letter-spacing="0.5">"Designing digital experiences. Bringing ideas to life."</text>
  <text x="64" y="445" font-family="sans-serif, Arial" font-size="16" fill="#85827B" font-weight="300">Curated digital exhibition: systems, dashboards, websites, and front-end engineering.</text>

  <!-- Right Information Block -->
  <text x="760" y="180" font-family="monospace, Courier" font-size="13" fill="#85827B" letter-spacing="2">LOCATION &amp; COORDINATES</text>
  <text x="760" y="210" font-family="sans-serif, Arial" font-size="18" fill="#F3F1EC">Dhaka, Bangladesh (UTC+6)</text>
  
  <text x="760" y="280" font-family="monospace, Courier" font-size="13" fill="#85827B" letter-spacing="2">PRIMARY DISCIPLINES</text>
  <text x="760" y="310" font-family="sans-serif, Arial" font-size="16" fill="#DAD7D0">• UI/UX Design &amp; User Research</text>
  <text x="760" y="340" font-family="sans-serif, Arial" font-size="16" fill="#DAD7D0">• Design Systems &amp; SaaS Dashboards</text>
  <text x="760" y="370" font-family="sans-serif, Arial" font-size="16" fill="#DAD7D0">• Responsive Web &amp; Front-End Implementation</text>

  <!-- Bottom Coordinates Footer -->
  <text x="64" y="${height - 55}" font-family="monospace, Courier" font-size="14" fill="#85827B" letter-spacing="2">CANONICAL // HTTPS://SIFULISLAMZEHAN.DEV</text>
  <text x="${width - 64}" y="${height - 55}" font-family="monospace, Courier" font-size="14" fill="#85827B" text-anchor="end" letter-spacing="2">EXHIBITION ROOM 01–06</text>
</svg>
`;

async function main() {
  const outputPath = path.resolve('public', 'og-image.png');
  await sharp(Buffer.from(svgCard))
    .png({ quality: 95 })
    .toFile(outputPath);
  console.log('Generated OG image at:', outputPath);
}

main().catch(console.error);
