// Downloads every Figma asset in figma-assets.json into public/assets. Run: npm run assets
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(path.join(root, 'scripts/figma-assets.json'), 'utf8'));
const out = path.join(root, 'public/assets');
await mkdir(out, { recursive: true });

let failed = 0;
for (const [name, url] of Object.entries(manifest)) {
  if (name.startsWith('_')) continue;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(path.join(out, name), Buffer.from(await res.arrayBuffer()));
    console.log('✓', name);
  } catch (e) {
    failed++;
    console.error('✗', name, e.message);
  }
}
if (failed) { console.error(`\n${failed} asset(s) failed (URLs may have expired).`); process.exit(1); }
