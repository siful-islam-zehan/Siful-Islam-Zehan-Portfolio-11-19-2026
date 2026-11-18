import sharp from "sharp";
import fs from "fs";
import path from "path";

const projectsDir = path.resolve("./public/images/projects");

if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
}

async function run() {
  console.log("Generating project images in:", projectsDir);

  // 1. Process Grandpool
  const grandpoolRaw = path.join(projectsDir, "grandpool.png");
  if (fs.existsSync(grandpoolRaw)) {
    // Top cover: 1440 x 960
    await sharp(grandpoolRaw)
      .extract({ left: 0, top: 0, width: 1440, height: 960 })
      .webp({ quality: 85 })
      .toFile(path.join(projectsDir, "grandpool-cover.webp"));
    console.log("Created grandpool-cover.webp");

    // Gallery screen 1: features section (y: 960 to 1920)
    await sharp(grandpoolRaw)
      .extract({ left: 0, top: 960, width: 1440, height: 960 })
      .webp({ quality: 85 })
      .toFile(path.join(projectsDir, "grandpool-screen-1.webp"));

    // Gallery screen 2: details section (y: 1920 to 2880)
    await sharp(grandpoolRaw)
      .extract({ left: 0, top: 1920, width: 1440, height: 960 })
      .webp({ quality: 85 })
      .toFile(path.join(projectsDir, "grandpool-screen-2.webp"));
    console.log("Created grandpool gallery screens");
  }

  // Helper to create neutral SVG-based WebP placeholder
  async function createNeutralPlaceholder(fileName, title, subtitle, meta) {
    const svg = `
      <svg width="1440" height="960" viewBox="0 0 1440 960" xmlns="http://www.w3.org/2000/svg">
        <rect width="1440" height="960" fill="#F3F1EC" />
        <rect x="40" y="40" width="1360" height="880" fill="none" stroke="#DAD7D0" stroke-width="2" />
        <line x1="40" y1="120" x2="1400" y2="120" stroke="#DAD7D0" stroke-width="1" />
        <line x1="40" y1="840" x2="1400" y2="840" stroke="#DAD7D0" stroke-width="1" />
        
        <!-- Header bar -->
        <text x="80" y="85" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#85827B" letter-spacing="3">EXHIBITION ASSET ARCHIVE // 2026</text>
        <text x="1360" y="85" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#85827B" text-anchor="end" letter-spacing="2">${meta}</text>

        <!-- Center content -->
        <text x="720" y="420" font-family="Georgia, serif" font-size="64" font-weight="normal" fill="#171717" text-anchor="middle" letter-spacing="-1">${title}</text>
        <text x="720" y="490" font-family="system-ui, sans-serif" font-size="22" font-weight="500" fill="#85827B" text-anchor="middle" letter-spacing="0.5">${subtitle}</text>
        
        <!-- Center badge -->
        <rect x="560" y="550" width="320" height="44" rx="22" fill="#FFFFFF" stroke="#DAD7D0" stroke-width="1" />
        <text x="720" y="578" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#171717" text-anchor="middle" letter-spacing="2">AWAITING ASSET VERIFICATION</text>

        <!-- Footer bar -->
        <text x="80" y="880" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#85827B">ZEHAN DESIGN EXHIBITION</text>
        <text x="1360" y="880" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#85827B" text-anchor="end">ROLE: TO BE CONFIRMED</text>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .webp({ quality: 90 })
      .toFile(path.join(projectsDir, fileName));
    console.log(`Created ${fileName}`);
  }

  // 2. NaijaRadar
  await createNeutralPlaceholder(
    "naijaradar-cover.webp",
    "NaijaRadar",
    "Digital News &amp; Discovery Platform",
    "PREVIEW: IFRAME"
  );

  // 3. Secure Note
  await createNeutralPlaceholder(
    "secure-note-cover.webp",
    "Secure Note",
    "Encrypted Private Mobile Application",
    "PREVIEW: EXTERNAL"
  );

  console.log("All project images successfully generated.");
}

run().catch(console.error);
