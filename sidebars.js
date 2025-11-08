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

// Friendly overrides for some category labels shown in the sidebar.
/** @type {{[key:string]: string}} */
const LABEL_OVERRIDES = {
  projects: 'Projects',
  repositories: 'Repositories',
  technologies: 'Technologies & Stack',
  guidelines: 'Guidelines & Standards',
  identity: 'Visual Identity & UI Components',
  contribution: 'Contribution & Governance',
  architecture: 'Architecture',
};

/**
 * Read optional `_category_.json` metadata for a docs folder.
 * @param {string} dir
 */
function readCategoryMeta(dir) {
  try {
    const p = path.join(DOCS_DIR, dir, '_category_.json');
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    // ignore
  }
  const defaultLabel = dir.replace(/-/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase());
  return { label: LABEL_OVERRIDES[dir] || defaultLabel };
}

/**
 * List docs in a directory and normalize to sidebar ids.
 * @param {string} dir
 * @returns {string[]}
 */
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
  // dedupe items (avoid duplicates when both index.md and index.mdx exist)
  const uniqueItems = Array.from(new Set(items));
  // replace items with unique list
  items.length = 0;
  uniqueItems.forEach((i) => items.push(i));
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

/** @type {any[]} */
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
