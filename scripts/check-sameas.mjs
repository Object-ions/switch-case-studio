#!/usr/bin/env node
/**
 * Drift guard: index.html's Organization `sameAs` must equal src/data/social.js.
 *
 * WHY THIS EXISTS: social.js is the single source of truth for the studio's
 * profiles and feeds the footer icon row, but index.html is static and cannot
 * import a module — so the `sameAs` array is a hand-mirror. Every hand-mirror
 * in this repo has drifted at least once (Footer's SERVICES_LINKS kept stale
 * service names through a rename until a built-HTML grep caught it). A stale
 * `sameAs` is worse than most drift because it fails SILENTLY: the footer link
 * works, the page renders, and only the entity graph search engines build is
 * wrong — which is the entire point of shipping sameAs in the first place.
 *
 * Runs on prebuild. Exits non-zero on mismatch, which fails the build.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* social.js is an ES module with comments — read the URLs out of it rather
   than importing, so this stays dependency-free and works pre-transpile. */
const socialSrc = readFileSync(resolve(root, 'src/data/social.js'), 'utf8');
const expected = [...socialSrc.matchAll(/url:\s*'([^']+)'/g)].map((m) => m[1]);

const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const ld = html.match(
  /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/
);
if (!ld) {
  console.error('check:sameas — FAIL: no JSON-LD block found in index.html');
  process.exit(1);
}

let graph;
try {
  graph = JSON.parse(ld[1]);
} catch (err) {
  console.error(`check:sameas — FAIL: JSON-LD is not valid JSON — ${err.message}`);
  process.exit(1);
}

const org = (graph['@graph'] || []).find((n) => n['@type'] === 'Organization');
if (!org) {
  console.error('check:sameas — FAIL: no Organization node in the JSON-LD @graph');
  process.exit(1);
}

const actual = org.sameAs || [];
const missing = expected.filter((u) => !actual.includes(u));
const extra = actual.filter((u) => !expected.includes(u));

if (expected.length === 0) {
  console.error('check:sameas — FAIL: parsed 0 URLs from social.js (format changed?)');
  process.exit(1);
}

if (missing.length || extra.length) {
  console.error('check:sameas — FAIL: index.html sameAs has drifted from src/data/social.js');
  missing.forEach((u) => console.error(`  missing from index.html: ${u}`));
  extra.forEach((u) => console.error(`  not in social.js:         ${u}`));
  console.error('Fix: edit src/data/social.js first, then mirror into the sameAs array.');
  process.exit(1);
}

console.log(`check:sameas — OK (${actual.length} profiles in sync)`);
