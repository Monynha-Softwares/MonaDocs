// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Dynamic sidebar generator.
 *
 * This file programmatically inspects the `docs/` directory and generates sidebar
 * categories for top-level folders that contain documentation. It preserves the
 * generated-index link pattern and tries to create deterministic ordering.
 *
 * If you need fully manual control over a specific category, replace or edit
 * the generated block below.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DOCS_DIR = path.join(__dirname, 'docs');

function readCategoryMeta(dir) {
  try {
    const p = path.join(DOCS_DIR, dir, '_category_.json');
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    // ignore
  }
  return { label: dir.replace(/-/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase()) };
}

function listDocsInDir(dir) {
  const base = path.join(DOCS_DIR, dir);
  if (!fs.existsSync(base)) return [];
  const entries = fs.readdirSync(base, { withFileTypes: true });
  const items = [];
  for (const ent of entries) {
    if (ent.name === '_category_.json') continue;
    const full = path.join(base, ent.name);
    if (ent.isFile() && /\.(md|mdx)$/.test(ent.name)) {
      const id = `${dir}/${ent.name.replace(/\.(md|mdx)$/, '')}`;
      items.push(id);
    } else if (ent.isDirectory()) {
      // prefer directory index.md/mdx
      const idxMd = path.join(full, 'index.md');
      const idxMdx = path.join(full, 'index.mdx');
      if (fs.existsSync(idxMd) || fs.existsSync(idxMdx)) {
        items.push(`${dir}/${ent.name}/index`);
      } else {
        const subfiles = fs.readdirSync(full).filter((n) => /\.(md|mdx)$/.test(n));
        subfiles.forEach((sf) => items.push(`${dir}/${ent.name}/${sf.replace(/\.(md|mdx)$/, '')}`));
      }
    }
  }
  // deterministic ordering: index first, then alpha
  items.sort((a, b) => {
    if (a.endsWith('/index') && !b.endsWith('/index')) return -1;
    if (b.endsWith('/index') && !a.endsWith('/index')) return 1;
    return a.localeCompare(b);
  });
  return items;
}

// Top-level folders we want to expose in the sidebar (in desired order).
const TOP_FOLDERS = [
  'projects',
  'repositories',
  'technologies',
  'guidelines',
  'identity',
  'contribution',
  'architecture',
];

const tutorialSidebar = ['intro'];

for (const folder of TOP_FOLDERS) {
  const items = listDocsInDir(folder);
  if (items.length === 0) continue;
  const meta = readCategoryMeta(folder);
  tutorialSidebar.push({
    type: 'category',
    label: meta.label || folder,
    link: {
      type: 'generated-index',
      description: (meta.link && meta.link.description) || `Documentation for ${meta.label || folder}`,
    },
    items,
  });
}

const sidebars = { tutorialSidebar };

export default sidebars;
