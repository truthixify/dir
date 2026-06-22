// Reads the ../ideas catalog at build time. Pure Node fs — no Vite glob path limits.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";

const ideasDir = join(dirname(fileURLToPath(import.meta.url)), "../../../ideas");

/** Numeric idea number from an id like "0007-foo" -> 7 */
export function ideaNumber(id) {
  return parseInt(String(id).slice(0, 4), 10);
}

/** All ideas, sorted by id, each with parsed frontmatter + rendered body html. */
export function getIdeas() {
  return readdirSync(ideasDir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const { data, content } = matter(readFileSync(join(ideasDir, f), "utf8"));
      return { ...data, num: ideaNumber(data.id), body: content, html: marked.parse(content) };
    })
    .sort((a, b) => a.num - b.num);
}

export const DIFFICULTY_ORDER = ["good-first", "intermediate", "advanced"];

export const DIFFICULTY_LABEL = {
  "good-first": "Good first",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const STATUS_LABEL = {
  draft: "Draft",
  open: "Open",
  claimed: "Claimed",
  building: "Building",
  shipped: "Shipped",
  exists: "Already exists",
  superseded: "Superseded",
};

// Maps a lifecycle status to a design.md state-color class (open is neutral on purpose).
export const STATE_CLASS = {
  draft: "muted",
  open: "open",
  claimed: "amber",
  building: "amber",
  shipped: "jade",
  exists: "muted",
  superseded: "crimson",
};
