#!/usr/bin/env node
/**
 * Permanent export of EVERY image and icon in the Figma file, straight from Figma's REST API
 * (no expiring links, no tool limits). Output: public/assets/figma/  +  manifest.json
 *
 *   1. Figma -> Settings -> Security -> Personal access tokens -> generate (scope: file_content:read)
 *   2. FIGMA_TOKEN=figd_xxx npm run assets:figma
 *
 * Optional: FIGMA_FILE_KEY (defaults to the SHOPLECT file), FIGMA_SCALE (raster scale, default 2)
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOKEN = process.env.FIGMA_TOKEN;
const KEY = process.env.FIGMA_FILE_KEY || 'py8OeE0iVbpAkZnYBT8tFs';
const SCALE = Number(process.env.FIGMA_SCALE || 2);
if (!TOKEN) { console.error('Set FIGMA_TOKEN first (see the header of this file).'); process.exit(1); }

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/assets/figma');
const api = (p) => fetch(`https://api.figma.com/v1${p}`, { headers: { 'X-Figma-Token': TOKEN } }).then(async (r) => {
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
});
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 48) || 'asset';
const VECTOR = new Set(['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'LINE', 'ELLIPSE', 'REGULAR_POLYGON', 'RECTANGLE']);

console.log('Reading file structure…');
const file = await api(`/files/${KEY}`);
const rasters = new Map(); // node id -> name (nodes with image fills)
const icons = new Map();   // node id -> name (small all-vector containers)

const onlyVectors = (n) => !n.children?.length ? VECTOR.has(n.type) : n.children.every(onlyVectors);
(function walk(n) {
  const box = n.absoluteBoundingBox;
  if (n.fills?.some((f) => f.type === 'IMAGE' && f.visible !== false)) rasters.set(n.id, n.name);
  else if (box && box.width <= 96 && box.height <= 96 && n.children?.length && onlyVectors(n) && ['FRAME', 'INSTANCE', 'COMPONENT', 'GROUP'].includes(n.type)) { icons.set(n.id, n.name); return; }
  else if (box && box.width <= 96 && box.height <= 96 && VECTOR.has(n.type) && n.type !== 'RECTANGLE') icons.set(n.id, n.name);
  n.children?.forEach(walk);
})(file.document);
console.log(`Found ${rasters.size} images and ${icons.size} icons.`);

await mkdir(out, { recursive: true });
const manifest = {};
async function exportBatch(map, format, scale) {
  const ids = [...map.keys()];
  for (let i = 0; i < ids.length; i += 60) {
    const chunk = ids.slice(i, i + 60);
    const q = `ids=${chunk.map(encodeURIComponent).join(',')}&format=${format}${format === 'svg' ? '&svg_outline_text=false' : `&scale=${scale}`}`;
    const { images } = await api(`/images/${KEY}?${q}`);
    for (const id of chunk) {
      const url = images?.[id];
      if (!url) continue;
      const name = `${slug(map.get(id))}-${id.replace(':', '_')}.${format}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      await writeFile(path.join(out, name), Buffer.from(await res.arrayBuffer()));
      manifest[name] = { nodeId: id, name: map.get(id) };
    }
    console.log(`  ${format}: ${Math.min(i + 60, ids.length)}/${ids.length}`);
  }
}
await exportBatch(rasters, 'png', SCALE);
await exportBatch(icons, 'svg');
await writeFile(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Done. ${Object.keys(manifest).length} files in public/assets/figma/`);
