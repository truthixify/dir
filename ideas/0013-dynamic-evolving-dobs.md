---
id: "0013-dynamic-evolving-dobs"
title: "Dynamic Evolving DOBs"
status: open
category: "Spore/DOB"
summary: >
  Spore DOBs are static after minting. This protocol adds state evolution — DOBs that change
  over time based on on-chain conditions. A pet that grows, a reputation that accumulates, a
  membership that levels up. State transitions are validated by Type Scripts and triggered by
  holder transactions, so the DOB's DNA evolves while its history stays verifiable.
ckb_properties:
  - "Spore/DOB"
  - "Cell Model"
  - "Lock/Type Scripts"
difficulty: intermediate
primitives:
  - "Spore SDK"
  - "Rust / ckb-std"
  - "CCC"
inspired_by: "ERC-6551 token-bound accounts, dynamic NFTs"
author: "dir"
references:
  - title: "Spore Protocol"
    url: "https://spore.pro"
  - title: "Spore docs"
    url: "https://docs.spore.pro"
acceptance_criteria:
  - "An evolving-DOB schema where DNA carries mutable state (e.g. level, stage, accumulated points) alongside immutable identity."
  - "A Type Script that validates state transitions: only legal evolutions of the prior state are accepted on consume-and-recreate."
  - "At least one trigger condition demonstrated (e.g. elapsed time via header deps, or an explicit holder action)."
  - "Verifiable history: a reader can reconstruct the DOB's evolution from its on-chain transaction lineage."
  - "Deployed and demoed on CKB testnet with a worked example (pet, reputation, or membership) and docs."
needs_collaborators:
  - "smart-contract"
  - "frontend"
---

## Problem

Spore DOBs are effectively static once minted: their traits are fixed at creation. But many of the
most compelling assets are *alive* — a pet that grows, a reputation score that accumulates, a
membership that levels up with use. Today builders fake this with off-chain databases (defeating
the point of on-chain ownership) or by burning and re-minting (which loses identity and history).
WarSpore Saga needs game entities that change; idea #11's credentials would benefit from levels;
none of it has a shared standard. The gap is a protocol for DOBs whose state evolves on-chain
under validated rules while preserving identity and a verifiable history.

## Why CKB

CKB's Cell model already gives the right primitive: a DOB is a Cell, and "mutation" is
consume-and-recreate — spend the old Cell, produce a new one. A Type Script attached to the DOB
validates that the new state is a legal transition from the old, so evolution is rule-governed,
not arbitrary. Because every change is a transaction, the DOB's full history is reconstructable
from its lineage — evolution and verifiability come for free. Header deps enable time-based
triggers (a pet that ages), and the holder's Lock ensures only the owner can advance their own
DOB. This is native to CKB in a way ERC-6551 and dynamic-NFT hacks are not on account-based chains.

## Spec

- **Schema:** DNA splits into immutable identity (mint-time, never changes) and mutable state
  (level, stage, points, last-updated).
- **Transition Type Script:** on consume-and-recreate, validates the output DOB's state is a legal
  function of the input state plus the trigger (action, elapsed time via header dep, or an
  attestation reference).
- **Triggers:** holder-initiated actions, time conditions (header deps / time-lock), or external
  on-chain signals.
- **History:** because each evolution is a transaction consuming the prior DOB, the lineage is the
  audit trail; a reader replays it to show how the DOB got to its current state.

Directly supports idea #10 (game entities that level up) and idea #11 (credentials that gain tiers).

## Mini-demo

Sketch: a pet DOB that advances from egg → hatchling → adult. Each stage is a consume-and-recreate
transaction whose Type Script enforces stage order and a minimum elapsed time via a header dep; a
profile page renders the current stage and walks the lineage to show the growth history.

## References / prior art

See frontmatter. Compare ERC-6551 token-bound accounts and dynamic NFTs on Ethereum — this is
native to CKB, where every DOB is already a Cell with programmable Type Script logic and an
inherent transaction history.
