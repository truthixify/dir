#!/usr/bin/env node
// Validates every ideas/*.md frontmatter against schema/idea.schema.json,
// plus a few cross-checks the schema can't express (id == filename, no dup ids,
// referential integrity of supersedes/superseded_by).
//
// Run: npm run validate   (exits non-zero on any error — used by CI)

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import matter from "gray-matter";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ideasDir = join(root, "ideas");
const schema = JSON.parse(readFileSync(join(root, "schema", "idea.schema.json"), "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const files = readdirSync(ideasDir)
  .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  .sort();

const errors = [];
const ids = new Map();
const seen = [];

for (const file of files) {
  const path = join(ideasDir, file);
  let data;
  try {
    ({ data } = matter(readFileSync(path, "utf8")));
  } catch (e) {
    errors.push(`${file}: frontmatter is not valid YAML — ${e.message}`);
    continue;
  }

  if (!validate(data)) {
    for (const err of validate.errors) {
      errors.push(`${file}: ${err.instancePath || "(root)"} ${err.message}`);
    }
  }

  const expectedId = basename(file, ".md");
  if (data.id !== expectedId) {
    errors.push(`${file}: id "${data.id}" must equal filename "${expectedId}"`);
  }
  if (data.id) {
    if (ids.has(data.id)) errors.push(`${file}: duplicate id "${data.id}" (also in ${ids.get(data.id)})`);
    ids.set(data.id, file);
  }
  seen.push(data);
}

// Referential integrity for supersedes / superseded_by links.
for (const data of seen) {
  for (const key of ["supersedes", "superseded_by"]) {
    if (data[key] && !ids.has(data[key])) {
      errors.push(`${data.id}: ${key} points at unknown idea "${data[key]}"`);
    }
  }
}

if (errors.length) {
  console.error(`\n✖ ${errors.length} validation error(s):\n`);
  for (const e of errors) console.error("  - " + e);
  console.error("");
  process.exit(1);
}

console.log(`✓ ${files.length} idea file(s) valid.`);
