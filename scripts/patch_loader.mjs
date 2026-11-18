import fs from 'fs';
import path from 'path';

const file = path.resolve('node_modules', 'next', 'dist', 'compiled', '@next', 'font', 'dist', 'google', 'loader.js');
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  const target = 'const ext = /\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1];';
  const replacement = 'const match = /\\.(woff|woff2|eot|ttf|otf)/i.exec(googleFontFileUrl);\nconst ext = match ? match[1] : "woff2";\nif (!match) console.log("Non-standard font URL:", googleFontFileUrl);';
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Successfully patched font loader extension matching');
  } else {
    console.log('Target string already replaced or not found');
  }
}
