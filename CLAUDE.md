# CLAUDE.md

Operating guide for any agent working in this repo. Read it fully before your first edit. It is the contract; the rules here override your defaults.

---

## 1. What this is

**dir** is an open directory of **CKB-native project ideas** where builders publicly commit, build, and ship — on-chain. It is also a CKB app in its own right: wishes, commitments, stakes, and bounties are real attestations and Cells. dir **dogfoods the very ideas it lists** (#7 attestation, #30 escrow, #28 time-lock).

Three things must always stay true, or the project loses its reason to exist:

1. **The catalog is honest.** No idea is listed that already exists on CKB without saying so. Stale "doesn't exist" claims destroy trust.
2. **Funds are never custodied.** Stakes/bounties live in user Cells; dir holds at most one multisig key. The escrow lock is the security boundary — treat it as such.
3. **It dogfoods CKB.** When a coordination action *can* be on-chain, it is, using a primitive from the catalog.

Authoritative docs — **read the relevant one before touching its area; do not re-derive from memory:**

| Doc | What it governs |
|---|---|
| `SPEC.md` | Mechanics: lifecycle, commitment tiers, escrow Cell, release, safety. **The source of truth for behavior.** |
| `design.md` | Visual system: palette, type, manifest pattern, components, surfaces. **The source of truth for UI.** |
| `CONTRIBUTING.md` | How ideas/showcases get added; license; review norms. |
| `schema/idea.schema.json` | The exact shape of every idea's frontmatter. |

If an instruction here conflicts with one of those, those win for their domain; tell the user about the conflict.

---

## 2. Repository map

```
dir/
├── CLAUDE.md            this file
├── README.md            public overview + dev commands
├── SPEC.md              design spec (behavior — source of truth)
├── design.md            design system (UI — source of truth)
├── CONTRIBUTING.md      contribution flow + license
├── schema/idea.schema.json   validates idea frontmatter
├── ideas/               THE CATALOG — one Markdown file per idea
│   ├── _TEMPLATE.md     copy to propose a new idea
│   └── NNNN-slug.md     ideas 0001–0030 (and growing)
├── scripts/validate-ideas.mjs   schema + integrity validator (CI runs this)
├── site/                Astro static site that renders the catalog
└── .github/workflows/validate.yml   runs the validator on every idea PR
```

The repo is currently **light on code, heavy on content**. Most work is: adding/editing ideas, evolving the spec/design, and building the site (and later, the on-chain layer).

---

## 3. Git workflow — commit regularly, push per batch

This is a hard requirement, not a preference. Sloppy git history is treated as an incomplete task.

### Cadence

- **Commit at every logical checkpoint** — a coherent unit of work that leaves the repo in a valid state (validator passes, site builds). Examples: "add 5 ideas," "reskin site to design tokens," "wire up CI." Do **not** batch unrelated changes into one commit, and do **not** leave a session with uncommitted work.
- **A "batch" is a complete, self-contained piece of work** the user asked for (e.g. "add all 30 ideas," "build the site"). When a batch is done and verified, **push it.**
- Prefer **several small, well-described commits** over one giant commit. If you wrote 28 files across categories, that can be one commit ("add 28 seed ideas") — coherence, not file count, defines a commit.

### Mechanics

- **Never commit directly to `main` for non-trivial work.** Branch first: `feat/<short-slug>`, `fix/<slug>`, `content/<slug>`, `docs/<slug>`, `design/<slug>`. Trivial single-file fixes on `main` are acceptable only if the user is clearly iterating fast.
- **Before every commit:** run the validator (and build the site if you touched it). A commit that fails CI is a defect.
- **No remote is configured yet and there are no commits.** The first time you're asked to push: confirm/help set up `origin`, make the initial commit, then push. Don't invent a remote URL — ask the user for it or use `gh repo create` if they want.
- **Commit only what belongs.** `node_modules/`, `dist/`, `.astro/` are gitignored — keep them out. Commit `package-lock.json`.

### Commit message format

```
<type>: <imperative summary ≤ 72 chars>

<why, not just what — 1–3 short lines if non-obvious>

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

`type` ∈ `feat | fix | content | docs | design | chore | refactor`. Examples:
- `content: add 28 seed ideas across all 9 categories`
- `feat: add schema validator + idea-PR CI`
- `design: reskin site to light manifest palette`

PR bodies end with:
```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Definition of done (every task)

1. The change does what was asked.
2. `npm run validate` passes.
3. If `site/` changed, `cd site && npm run build` succeeds.
4. Work is committed at sensible checkpoints; the batch is pushed (once a remote exists).
5. You told the user what you did, plainly — including anything skipped or still failing.

---

## 4. Commands

```bash
# Validate the catalog — MUST pass before any commit. CI runs this too.
npm install            # first time
npm run validate

# Site
cd site && npm install # first time
npm run dev            # http://localhost:4321
npm run build          # static output → site/dist
```

There are no tests yet beyond the validator. When you add code that can be tested (the on-chain layer especially), add tests and wire them into CI and the Definition of Done.

---

## 5. Working with ideas (the catalog)

Each idea is `ideas/NNNN-slug.md`: YAML frontmatter (machine-readable, validated) + a Markdown body (human spec). To add one:

1. Copy `ideas/_TEMPLATE.md` → `ideas/NNNN-slug.md` (next free zero-padded number; `slug` lowercase-kebab, **no dots or `+`** — use `rgbpp`, not `rgb++`).
2. `id` in frontmatter **must equal the filename without `.md`**.
3. Fill frontmatter per `schema/idea.schema.json`. Enums (`category`, `ckb_properties`, `difficulty`, `status`) must match exactly.
4. **Acceptance criteria are required and load-bearing** — they are the on-chain bounty release condition (see `SPEC.md §6`). Write them concrete and verifiable ("deployed on testnet with a public demo URL"), never vague ("works well").
5. **Check it doesn't already exist on CKB first.** If it partially exists, name the project and state the gap. If it fully exists, set `status: exists` with `exists_as` links.
6. Body sections: `## Problem`, `## Why CKB`, `## Spec`, optional `## Mini-demo`, `## References / prior art`. Match the tone of `ideas/0007-*.md` (the reference).
7. `npm run validate`, then commit.

Status lifecycle (`SPEC.md §2`): `draft → open → claimed → building → shipped`, plus curation-only `exists` / `superseded`. Most transitions are driven by on-chain state — don't hand-edit status to fake progress.

Ideas are **CC0**. Projects built from them belong to their builders. Never imply dir owns anything a builder makes.

---

## 6. UI work — obey design.md

`design.md` is the visual contract. The non-negotiables (full detail there):

- **Light mode only.** Paper-and-ink. (The current `site/` CSS is a dark v0 scaffold scheduled for reskin to the `design.md` tokens — don't add new dark-mode styling.)
- **Squared corners everywhere** (`border-radius: 0`). Round = true circles only.
- **The palette is fixed** — paper `#F4F1E8`, ink `#15130F`, brand violet `#4B37E0`, and the state hues (wish=cyan, in-progress=amber, shipped=jade, value=magenta, alarm=crimson). **Do not introduce new hues.** Tokens are in `design.md §11`.
- **Color is semantic** — one state color per card, mapped to lifecycle. `open` is colorless on purpose.
- **Two font weights (400/500). No emoji in product surfaces. No serif. No drop shadows** (use offset solid blocks). Mono for all IDs/addresses/amounts/timestamps/status labels.
- The **manifest card pattern** (ID tab, status band, violet L-brackets, CC0 form footer) is the spine — reuse it, don't reinvent.

Match the surrounding code's conventions. Default stack for new frontend work: the existing Astro site; add React islands only if interactivity (wallet/JoyID) needs it.

---

## 7. On-chain & money (when you get there)

- The escrow lock holds other people's CKB. **Testnet first, always.** It must be externally reviewed before mainnet (cf. ideas #4, #18).
- The four safety guarantees in `SPEC.md §7` are load-bearing: no stranded funds, no self-dealing, no platform custody, bulletproof refund. Do not ship escrow code that violates any of them.
- Release is semi-trusted (curator multisig) in v1 **and we say so** — never describe it as trustless.

---

## 8. House rules

- **Don't re-read a doc you can cite** — but **do** read the governing doc before working in its area. Don't guess at `SPEC.md`/`design.md`/schema contents from memory.
- **Surface contradictions, don't paper over them.** If the design and the code disagree, say so.
- **Report faithfully.** If the validator fails, say so with output. If you skipped something, say it. Don't claim "done" without the Definition of Done met.
- **Keep the catalog honest** above all (§1).
- **No scope creep.** Do what was asked, well; propose the rest.
- When unsure about a genuinely user-owned decision (palette change, abandoning a mechanic, spending real CKB), ask. Otherwise pick the sensible default, note it, proceed.

> CC0 for ideas · Apache-2.0 for code. Leave the repo better and greener than you found it.
