<!-- Thanks for contributing to dir. Keep PRs focused on one thing. -->

## What this PR does

<!-- One or two sentences. -->

## Type

- [ ] New idea(s) in `ideas/`
- [ ] Edit to an existing idea
- [ ] Showcase a shipped project (`status: shipped` + `shipped_projects`)
- [ ] Flag an idea that already exists on CKB (`status: exists` + `exists_as`)
- [ ] Site / tooling / docs

## Checklist

- [ ] `npm run validate` passes locally (CI runs it too).
- [ ] If I touched `site/`, `cd site && npm run build` succeeds.

### If this adds or edits an idea

- [ ] Filename is `ideas/NNNN-slug.md` and `id` matches it (lowercase-kebab, no `.`/`+`).
- [ ] Frontmatter uses only the enum values in `schema/idea.schema.json`.
- [ ] **Acceptance criteria are concrete and verifiable** — they are the on-chain bounty release condition (`SPEC.md §6`), not vague ("deployed on testnet with a public demo", not "works well").
- [ ] **I checked it doesn't already exist on CKB.** If it partially exists, the body names the project and states the gap.
- [ ] Body has `## Problem`, `## Why CKB`, `## Spec` (and optional `## Mini-demo`, `## References / prior art`).
- [ ] I'm fine with the idea being **CC0** (see `ideas/LICENSE`).

## Notes for reviewers

<!-- Anything non-obvious, decisions you made, or open questions. -->
