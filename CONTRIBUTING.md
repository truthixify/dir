# Contributing to dir

Three ways to help, lowest-friction first.

## 1. Add or improve an idea

1. Copy [`ideas/_TEMPLATE.md`](./ideas/_TEMPLATE.md) to `ideas/<NNNN>-<kebab-title>.md`.
   - `<NNNN>` is the next free zero-padded number. `<kebab-title>` is a short slug.
   - The filename (without `.md`) must equal the frontmatter `id`.
2. Fill in the frontmatter. It's validated against [`schema/idea.schema.json`](./schema/idea.schema.json).
3. Write the body: **Problem**, **Why CKB**, **Spec**, optional **Mini-demo**.
4. **Check it doesn't already exist.** Search the live CKB ecosystem first. If something partial
   exists, name it and explain the *gap* — don't pretend it's greenfield. If it fully exists, you
   can still open a PR setting `status: exists` with `exists_as` links, to keep the catalog honest.
5. Open a PR. Maintainers review for fit, accuracy, and that the **acceptance criteria are concrete
   and verifiable** (these become the on-chain bounty release condition — see
   [`SPEC.md §6`](./SPEC.md#6-bounty--stake-release)).

### Writing good acceptance criteria

This is the most important field. Each item must be something a curator can objectively check
against a finished project. "Works well" is not a criterion; "deployed on testnet with a public
demo URL and the 5 modules listed below" is. Vague criteria make bounty release a fight.

### Migrating the seed list

The original 30 ideas live in the project doc. Porting one into this format (with real references
and acceptance criteria) is a great first PR. Pick an unported number and go.

## 2. Showcase a shipped project

Built something from an idea? Open a PR setting that idea's `status: shipped` and adding it to
`shipped_projects`. This closes the loop and builds the directory's credibility.

## 3. Improve the app, design, or contracts

Frontend, UX/design, and lock-script review are all wanted — especially review of the escrow
lock (it holds real CKB; see the safety rules in [`SPEC.md §7`](./SPEC.md#7-safety-guarantees)).
Open an issue describing what you want to take on, or flag interest as a `needs_collaborators`
role on a relevant idea.

## License & ownership

- **Ideas** in this repo are **CC0** — public domain. Submitting one means you're fine with anyone
  building it.
- **Projects** you build from an idea are **yours** — your code, your license, your ownership. The
  directory tracks and showcases; it claims nothing over what you build.
- Idea **authors are credited** (frontmatter `author` + the on-chain `author` attestation) and may
  be eligible for an attribution share if a payout mechanism is enabled — but authorship of an idea
  conveys no ownership of projects built from it.

## Review norms

- Be specific and kind. Critique the idea/spec, not the person.
- Keep the catalog honest: stale "doesn't exist" claims erode trust. Flag ideas that have since
  shipped elsewhere via `status: exists`.
