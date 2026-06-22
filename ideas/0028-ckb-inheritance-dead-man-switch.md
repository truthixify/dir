---
id: "0028-ckb-inheritance-dead-man-switch"
title: "CKB Inheritance & Dead-Man Switch Protocol"
status: open
category: "Identity & Security"
summary: >
  On-chain inheritance that actually works. Lock Scripts with time-locked fallbacks: if the
  owner doesn't check in within N epochs, designated heirs can claim — staged so a spouse gets
  access after 6 months, children after 12, a charity after 24. All encoded in the Lock Script,
  no trusted third party.
ckb_properties:
  - "Lock/Type Scripts"
  - "Header Deps / Time-lock"
  - "Cell Model"
difficulty: intermediate
primitives:
  - "Rust / ckb-std"
  - "CCC"
inspired_by: "Bitcoin time-locked inheritance (CLTV), extended with multi-tier conditional logic"
author: "dir"
references:
  - title: "Nervos CKB Docs — Lock Scripts"
    url: "https://docs.nervos.org/docs/tech-explanation/lock-script"
  - title: "Nervos CKB Docs — Since (time-locks)"
    url: "https://docs.nervos.org/docs/tech-explanation/since"
acceptance_criteria:
  - "A Lock Script with an owner path plus one or more time-delayed heir paths, deployed on CKB testnet."
  - "Owner check-in: any owner-authorized transaction resets the inactivity clock."
  - "Multi-tier release verified against block/epoch time via Header Deps (e.g. heir A after T1, heir B after T2)."
  - "Heir claim flow: after the window elapses, the designated heir can spend the Cell and no one else can earlier."
  - "An SDK to configure tiers, fund the Cell, check status, and execute a claim."
  - "Public demo with test-shortened windows, docs, and a clear explanation of the no-trusted-party guarantee."
needs_collaborators:
  - "smart-contract"
  - "frontend"
---

## Problem

Crypto inheritance is mostly vaporware: people leave seed phrases in safes, trust a lawyer with
a hardware wallet, or rely on a centralized "if I die" service. These reintroduce exactly the
custodial trust that self-custody was meant to remove. On CKB there is no standard protocol for
*programmable, multi-tier inheritance* — a way to encode "if I go silent, these people get
access in this order, on this schedule" directly into the asset, with no service that could be
hacked, coerced, or simply shut down.

## Why CKB

CKB Lock Scripts are general programs, and Header Deps let a script read block/epoch time, so
"has the owner been inactive for N epochs?" becomes an on-chain, verifiable condition rather than
a server cron job. The Cell model means each inherited asset carries its own succession policy in
its lock — funds never leave the owner's control while alive, and the heir path simply becomes
spendable when the time condition is met. There is no escrow agent and no third party who could
release early or refuse to release at all; the chain enforces it.

## Spec

- **Owner path:** the default spend; any owner-authorized transaction is also a "check-in" that
  resets the inactivity timer (tracked relative to the last spend / a stored timestamp).
- **Tiered heir paths:** the Lock Script encodes (heir lock, unlock-after) pairs. Using Header
  Deps, each heir branch is valid only once block/epoch time exceeds its threshold — e.g. spouse
  after ~6 months, children after ~12, charity after ~24.
- **Exclusivity:** earlier tiers take precedence; a later-tier heir cannot front-run an earlier
  one before their window, and the owner can always reclaim while alive.
- **Configuration:** tiers, heir locks, and windows are set at funding time and updatable by the
  owner.
- **SDK:** CCC helpers for `configure`, `fund`, `checkIn`, `status`, and `claim`.

This reuses the same time-lock pattern as dir's own escrow/expiry logic and as the dead-man
switch in #27 — the building block is "an alternate spend path gated on elapsed epochs read via
Header Deps."

## Mini-demo

An "estate" page where an owner funds a Cell, sets a spouse heir at window T1 and a charity heir
at T2 (both test-shortened), and periodically checks in. A separate heir page shows the claim
path locked before T1, then spendable after — while a different address is rejected throughout.

## References / prior art

Bitcoin enables crude time-locked inheritance with `OP_CHECKLOCKTIMEVERIFY`, but it is single
tier and awkward to stage. CKB's programmable locks plus Header Deps allow true multi-tier,
conditional succession. Compare custodial services (Casa, inheritance vaults) for the UX target
without their trust assumptions.
