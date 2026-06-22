# dir

**An open directory of CKB-native project ideas where builders publicly commit, build, and ship — on-chain.**

`dir` is two things at once:

1. A curated, community-maintained catalog of things worth building on [Nervos CKB](https://www.nervos.org/) — each with a spec, references, and (over time) a forkable starter.
2. A **CKB-native app in its own right.** Commitments, wishes, stakes, and bounties are real on-chain attestations and Cells. `dir` is the first consumer of the very primitives it lists — on-chain attestation (#7), escrow (#30), and time-locks (#28).

> An idea directory that isn't built on the chain it's about would be telling you to do something it won't do itself. `dir` dogfoods CKB end to end.

---

## How it works

```
 Watching → Committed → Staked → Backed → Shipped
   (wish)    (claim)   (skin)  (+bounty)  (loop closed)
```

- **Browse** ideas by category, CKB property, difficulty, or "has a bounty."
- **Wish** for an idea you want to exist (an on-chain signal that guides builders).
- **Commit** to build one — a public on-chain attestation with a timeline.
- **Stake** optional CKB to signal you're serious and claim the idea exclusively.
- **Fund** an idea with a bounty if you want it built and aren't building it yourself.
- **Ship** it, link the project back to the idea, and close the loop. Your track record accrues to your builder reputation.

When a staked claim lapses, the stake can convert into a bounty for the next builder — so abandonment funds future success instead of wasting it. See [`SPEC.md`](./SPEC.md) for the full mechanics.

---

## Repository layout

```
dir/
├── README.md            you are here
├── SPEC.md              the full design: lifecycle, tiers, escrow, release, safety
├── CONTRIBUTING.md      how to add an idea, showcase a project, or improve the app
├── schema/
│   └── idea.schema.json JSON Schema validating each idea's frontmatter
├── ideas/               the catalog — one Markdown file per idea
│   ├── _TEMPLATE.md     copy this to propose a new idea
│   └── NNNN-*.md        the 30 seed ideas
├── scripts/
│   └── validate-ideas.mjs   validates every idea against the schema
├── site/                Astro static site that renders the catalog
└── .github/workflows/   CI that validates idea PRs automatically
```

The idea catalog lives as one Markdown file per idea under `ideas/`, each with structured YAML frontmatter (machine-readable) plus a human-readable spec body. Adding an idea is a pull request — CI validates the frontmatter against the schema on every PR.

## Develop

```bash
# Validate the catalog (also runs in CI on every PR)
npm install
npm run validate

# Run the site locally
cd site && npm install && npm run dev      # http://localhost:4321
npm run build                              # static output in site/dist
```

---

## Status

Early. The catalog and contribution flow come first; the on-chain layer ships to **testnet** before mainnet, and the escrow lock script must be **audited** before it holds real CKB. See the roadmap in [`SPEC.md`](./SPEC.md#roadmap).

## Contributing

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md). The fastest way to help right now: add an idea, migrate one from the seed list, or improve a spec. Design, frontend, and lock-script review are all wanted.

## License

Ideas in this repo are **CC0** (public domain — [`ideas/LICENSE`](./ideas/LICENSE)). The code is **Apache-2.0** ([`LICENSE`](./LICENSE)). Projects you build from an idea are **yours**. See [`CONTRIBUTING.md`](./CONTRIBUTING.md#license--ownership).
