# dir — Design Spec

This document defines how `dir` works: the idea lifecycle, the commitment tiers, the on-chain data model (attestations + escrow Cell), how bounties are released, and the safety guarantees. It is the source of truth; the app and contracts implement it.

It is intentionally implementation-light on contract code — that gets built and audited separately. This is the *what* and the *why*.

- [1. Principles](#1-principles)
- [2. The idea lifecycle](#2-the-idea-lifecycle)
- [3. Commitment tiers](#3-commitment-tiers)
- [4. Forfeiture modes](#4-forfeiture-modes)
- [5. On-chain data model](#5-on-chain-data-model)
- [6. Bounty & stake release](#6-bounty--stake-release)
- [7. Safety guarantees](#7-safety-guarantees)
- [8. Reputation](#8-reputation)
- [9. Idea data format](#9-idea-data-format)
- [10. Roadmap](#10-roadmap)

---

## 1. Principles

1. **Dogfood CKB.** Every coordination action that *can* be on-chain *is* — using the primitives this directory catalogs. `dir` is a reference implementation of #7 (attestation), #30 (escrow), #28 (time-lock).
2. **Never custody funds.** Stakes and bounties live in user-controlled Cells. `dir` (the platform) holds at most *one key in a multisig*, never the funds. First-class assets: a bug in the app cannot move anyone's CKB.
3. **Trustless where math allows, honest where it doesn't.** "Did the deadline pass?" is verifiable on-chain (time-lock). "Was the software actually built?" is *not* — it needs a human oracle. We say so plainly and minimize the human's power: the oracle can only *release*, never *seize*.
4. **Failure should be generative.** A lapsed commitment leaves an idea better-funded than before, not stranded.
5. **Low floor.** The free path (wish, commit) requires no money. Staking and bounties are opt-in signals on top.

---

## 2. The idea lifecycle

An idea moves through statuses. Most transitions are driven by on-chain state; a few are curation.

```
        ┌─────────┐  PR merged
        │  draft  │ ───────────────┐
        └─────────┘                ▼
                              ┌──────────┐   commit attestation
                              │   open   │ ───────────────────────┐
                              └──────────┘                         ▼
                                   ▲                         ┌───────────┐
                       deadline    │ claim lapses /          │  claimed  │
                       expires,    │ released                └───────────┘
                       no ship     │                               │ builder posts progress
                                   │                               ▼
                              ┌──────────┐   ship attestation ┌───────────┐
                              │  open    │ ◄───────────────── │  building │
                              └──────────┘   (if it lapses)   └───────────┘
                                                                    │ ship verified
                                                                    ▼
                                                              ┌───────────┐
                                                              │  shipped  │
                                                              └───────────┘

   curation-only terminal states:  exists (already live on CKB) · superseded (replaced by another idea)
```

| Status | Meaning | Set by |
| --- | --- | --- |
| `draft` | Proposed, under review in a PR | curation |
| `open` | Live, unclaimed, claimable | curation / auto on lapse |
| `claimed` | One or more active commitments exist | on-chain (commit attestation) |
| `building` | Claimant has posted progress | on-chain (progress attestation) |
| `shipped` | A ship was verified; project linked | on-chain (ship attestation + multisig) |
| `exists` | Already live on CKB; not buildable here | curation (community flag) |
| `superseded` | Replaced by a better/merged idea | curation (`superseded_by`) |

A free (`Committed`) claim is **non-exclusive** — several people may be "trying," and the idea stays `claimed`/`building`. A **staked** claim is **exclusive** for its window (see §3).

---

## 3. Commitment tiers

A builder's (or supporter's) relationship to an idea is **emergent from on-chain state**, not a stored setting. The tier is just *what attestations and Cells exist right now*:

```
tier = f( wish?, commit attestation?, stake amount, slash mode, bounty attached? )
```

| Tier | On-chain footprint | Signal | Unlocks |
| --- | --- | --- | --- |
| **Watching** | wish attestation | "I want this to exist" | counts toward demand ranking |
| **Committed** | commit attestation + deadline | "I'm going to try" | non-exclusive claim, short window, low ranking |
| **Staked (deposit)** | + stake Cell, `mode=deposit` | "I reserved this slot" | **exclusive** claim, longer window, badge |
| **Staked (slash)** | + stake Cell, `mode=slash-*` | "I risk real loss" | exclusive, longest window, **top** ranking, "skin in the game" badge |
| **Backed** | staked-slash + external bounty | "Funded and committed" | featured placement |

Two orthogonal axes — keep them separate:

- **Commitment axis** = *do you risk loss?* → `deposit` (no) vs `slash-*` (yes). This is what raises your tier. Both slash modes risk equal money, so they grant the **same** commitment bump.
- **Flow axis** = *where forfeited value goes* → `pool` vs `next-builder`. This is a separate "generosity / ecosystem" flag and a badge, **not** a ranking lever.

**Dials, not thresholds.** Stake *amount* varies continuously and feeds ranking, so there's no single magic number. Bigger stake + risks-loss + bounty = higher placement.

**Exclusivity rule.** While a staked claim is within its window, the idea cannot be staked-claimed by anyone else. Free `Committed` claims may still pile on (they're cheap signals), but they're ranked below the staker and don't block them.

---

## 4. Forfeiture modes

Chosen at stake time, **immutable** once the Cell is created (you can't downgrade `slash → deposit` later to dodge the consequence).

| Mode | If the claim lapses (deadline passes, no verified ship)… | Commitment | Flow flag |
| --- | --- | --- | --- |
| `deposit` | Stake returns to the staker. They lose the *exclusive claim* + take a reputation hit, nothing more. | base | — |
| `slash-pool` | Stake sweeps to the **retro-PGF / community pool**. | high | pool |
| `slash-next` | Stake is **escrowed as a bounty on the same idea**, released only when the *next* builder ships. | high | next-builder |

### `slash-next` is the bounty primitive, reused

A `slash-next` forfeiture is not a new mechanism — it is a **bounty whose source happens to be a flake.** Same escrow Cell, same release condition, same acceptance criteria. It stacks with any pre-existing bounty pool on the idea.

This is what makes `dir` anti-fragile: a lapsed serious commitment leaves the idea *more* funded than before.

### v1 recommendation

Ship all three as user choices, but **default the UI to `deposit`** and present the slash modes as the "serious builder" upgrade. The reputation system (see §8) does the social punishing; slashing is opt-in teeth for those who want to broadcast maximum commitment. Don't auto-slash newcomers over a subjective "did you finish" call.

---

## 5. On-chain data model

Two construct families: **attestations** (cheap, signal/record) and the **escrow Cell** (holds value).

### 5.1 Attestations

Lightweight records following the CKB attestation pattern (#7). Each is a Cell (or CoBuild-composed entry) whose Type Script validates the schema and whose data carries the payload. All reference an `idea_id` (the catalog slug, e.g. `0007-on-chain-attestation-protocol`).

| Type | Payload | Who signs | Purpose |
| --- | --- | --- | --- |
| `wish` | `idea_id`, attester | anyone | demand signal (one per identity per idea) |
| `author` | `idea_id`, author identity | curator at merge | attribution + optional payout share |
| `commit` | `idea_id`, builder, `deadline`, `tier_ref` | builder | public claim |
| `progress` | `idea_id`, builder, note/link | builder | build-in-public log; flips `claimed → building` |
| `ship` | `idea_id`, builder, `project_url`, `commit_ref` | builder, then co-signed | claims completion; triggers verification |

`ship` alone does not release funds — it is a *request*. Release requires the curator multisig (see §6).

### 5.2 The escrow Cell (stake **and** bounty)

One Cell design serves both roles. Role and behavior are encoded in its scripts.

```
Escrow Cell
├── capacity        = the locked CKB (this IS the money — 1 CKB = 1 byte)
├── lock script     = "dir-escrow-lock": gates spending to the paths below
└── type script     = carries metadata, enforces it can't be tampered with:
        role        : "stake" | "bounty"
        idea_id     : which idea
        party       : staker (if stake) / funder (if bounty)
        beneficiary : builder address, or "open" for unassigned bounties
        deadline    : epoch/block (used by time-lock via `since` / Header Deps)
        mode        : "deposit" | "slash-pool" | "slash-next"   (stake only)
        accept_hash : hash of the idea's acceptance criteria at lock time
```

The lock script permits exactly these spend paths:

| Path | Precondition | Output |
| --- | --- | --- |
| **SHIP** | curator multisig signature **+** a matching `ship` attestation referencing this Cell | capacity → builder |
| **REFUND** | `deadline` passed (enforced by `since`) **+** no verified ship, **+** `mode=deposit` or `role=bounty` | capacity → original party |
| **SLASH-POOL** | `deadline` passed, no ship, `mode=slash-pool` | capacity → community pool Cell |
| **SLASH-NEXT** | `deadline` passed, no ship, `mode=slash-next` | capacity → new `bounty` escrow Cell on same `idea_id`, `beneficiary=open` |

Notes:
- **Bounties always REFUND on expiry** (a funder never loses money to a flake that isn't theirs). Only **stakes** can SLASH, and only if their owner chose it.
- `accept_hash` pins the acceptance criteria so the deal can't be moved after funds are committed.
- Time conditions use CKB's `since` field / Header Deps (#28) — no oracle needed to know the deadline passed.

---

## 6. Bounty & stake release

The asymmetry that makes the trust model honest:

- **Trustless trigger for *failure*.** REFUND / SLASH paths fire on a time-lock. No human decides "they failed" — the clock does.
- **Human gate for *success*.** Releasing money to a builder (SHIP path) requires the **curator multisig** (e.g. 2-of-3 / 3-of-5 maintainers) co-signing, because no Type Script can verify that real software was built.

### Release procedure (v1)

1. Builder publishes a `ship` attestation with `project_url` + evidence, referencing the escrow Cell(s).
2. Curators check the project against the idea's **acceptance criteria** (the `accept_hash` pin). *The acceptance checklist in the idea spec is literally the release condition — author ideas with that in mind.*
3. On agreement, curators co-sign the SHIP spend. Funds go to the builder; staked deposit returns to the builder; the idea flips to `shipped`.

> v1 release is **semi-trusted** and we say so. The decentralization path (optimistic release with a challenge window, designated per-bounty reviewer panels) is roadmap, not launch — see §10. The key guarantee even in v1: curators can only release to a builder who shipped, and can never seize or redirect funds.

---

## 7. Safety guarantees

Load-bearing rules. Breaking any of these breaks trust permanently.

1. **No stranded funds.** Every escrow Cell has a terminal path. A `slash-next` bounty that no one ever completes sweeps to the community pool after a long fallback timeout — it never locks forever.
2. **No self-dealing.** The builder who flaked a `slash-next` stake is **ineligible** to be the "next builder" who claims that resulting bounty. Otherwise: flake → reship-as-sockpuppet → reclaim your own slashed stake. Encoded in the lock (beneficiary ≠ original party).
3. **No platform custody.** Funds sit in user Cells; `dir` holds at most one multisig key. The website going down cannot freeze or take anyone's CKB.
4. **Bulletproof refund.** The failure mode that kills the project is "funder pledged, nobody shipped, funds stuck." REFUND must be the most-tested path. Funder-initiated, time-locked, no multisig required.
5. **Immutable terms.** `mode` and `accept_hash` are fixed at lock time. No moving the goalposts after money is in.
6. **Testnet first, audit before mainnet.** The escrow lock holds other people's CKB. It runs on testnet with test-CKB until it has real mileage, and gets an external review (cf. ideas #4, #18) before mainnet.

---

## 8. Reputation

A builder's track record is itself a CKB-native asset (cf. idea #11 — credentials as DOBs), reusable beyond `dir`:

- Derived from on-chain history: `commit` count, `shipped` count, lapses, total staked, slash modes chosen.
- Surfaced as a portable builder profile / soulbound-style credential.
- This is what does the social "punishing" for `deposit`-mode flakes — and the rewarding for shippers. It's the retention loop: building *here* compounds into a CKB-dev résumé other apps and grant programs can read.

---

## 9. Idea data format

Each idea is `ideas/<id>.md` — YAML frontmatter (validated by [`schema/idea.schema.json`](./schema/idea.schema.json)) + a Markdown body. The frontmatter is machine-readable for the app; the body is for humans. The **acceptance criteria** in the frontmatter double as the bounty release condition (§6).

See [`ideas/_TEMPLATE.md`](./ideas/_TEMPLATE.md) for the canonical shape and [`ideas/0007-on-chain-attestation-protocol.md`](./ideas/0007-on-chain-attestation-protocol.md) for a worked example.

---

## 10. Roadmap

| Phase | Scope |
| --- | --- |
| **0 — Catalog** | Repo + idea schema + contribution flow. Migrate the seed list of 30 ideas via PRs. Static site that reads `ideas/`. |
| **1 — Attestations (testnet)** | JoyID sign-in. `wish`, `commit`, `progress`, `ship` attestations. Status driven by on-chain state. Builder reputation read-out. |
| **2 — Escrow (testnet)** | Stake + bounty Cells. Commitment tiers. Forfeiture modes incl. `slash-next`. Curator-multisig release. Time-locked refund/slash. |
| **3 — Conversion** | Forkable starter scaffold per idea (biggest lever). Collaborator matchmaking. Acceptance-criteria-as-release wiring. |
| **4 — Mainnet** | Audit the escrow lock. Migrate to mainnet CKB. Reputation DOBs. |
| **Later** | Optimistic/decentralized release. Composition graph. Ecosystem-gap telemetry. AI/MCP repo-analysis layer. Grants-as-bounty integration. |
