#!/usr/bin/env node
// Pin wso-api-client to a git tag/branch and refresh the lockfile. See README.

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PKG = path.join(ROOT, 'package.json');
const REPO = 'WilliamsStudentsOnline/wso-api-client';
const DEP = `git+https://github.com/${REPO}.git`;

function parseArgs(argv) {
  const args = { tag: null, latest: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--latest') args.latest = true;
    else if (a === '--tag') args.tag = argv[++i];
    else if (a.startsWith('--tag=')) args.tag = a.slice(6);
    else if (a === '--help' || a === '-h') {
      console.log('Usage: yarn codegen [--tag vYYYY.MM.DD|branch] [--latest]');
      process.exit(0);
    }
  }
  return args;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

// Parse vYYYY.MM.DD or vYYYY.MM.DD-N (and api-* fallbacks) for newest-first sort
function tagSortKey(name) {
  const m = String(name).match(/^v?(\d{4})\.(\d{1,2})\.(\d{1,2})(?:-(\d+))?$/);
  if (m) {
    return [
      Number(m[1]),
      Number(m[2]),
      Number(m[3]),
      m[4] != null ? Number(m[4]) : 0,
    ];
  }
  return null;
}

function cmpTagKeys(a, b) {
  for (let i = 0; i < 4; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

async function latestClientTag() {
  const tags = await fetchJson(
    `https://api.github.com/repos/${REPO}/tags?per_page=30`
  );
  const versioned = tags
    .map((t) => t.name)
    .filter((name) => /^v\d/.test(name) || name.startsWith('api-'))
    .map((name) => ({ name, key: tagSortKey(name) }))
    .filter((t) => t.key);

  versioned.sort((a, b) => cmpTagKeys(b.key, a.key));
  if (versioned[0]) return versioned[0].name;

  const fallback = tags.find(
    (t) => /^v\d/.test(t.name) || t.name.startsWith('api-')
  );
  if (fallback) return fallback.name;
  if (tags[0]) return tags[0].name;
  throw new Error('no tags found on wso-api-client');
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function resolveRef(args) {
  if (args.tag) return args.tag.trim();
  if (args.latest) return latestClientTag();
  if (!process.stdin.isTTY) return latestClientTag();
  const latest = await latestClientTag();
  const answer = (await prompt(`wso-api-client ref [default: ${latest}]: `)).trim();
  return answer || latest;
}

function setDependency(ref) {
  const pkg = JSON.parse(fs.readFileSync(PKG, 'utf8'));
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies['wso-api-client'] = `${DEP}#${ref}`;
  fs.writeFileSync(PKG, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`==> package.json → wso-api-client@${DEP}#${ref}`);
}

function yarnInstall() {
  console.log('==> yarn');
  const r = spawnSync('yarn', ['install'], { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status || 1);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const ref = await resolveRef(args);
  setDependency(ref);
  yarnInstall();
  console.log('==> done');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
