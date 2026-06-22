---
id: "0010-dob-world-engine"
title: "DOB World Engine — Fully On-Chain Game Framework"
status: open
category: "Spore/DOB"
summary: >
  A reusable framework for fully on-chain games on CKB. All game state lives in Cells;
  characters, items, and world objects are Spore DOBs with DNA-generated traits. A shared
  Rust core compiles to both RISC-V (on-chain rules) and WASM (client rendering), so a DOB
  character earned in one game works in any game that reads the standard.
ckb_properties:
  - "Spore/DOB"
  - "Cell Model"
  - "RISC-V VM"
  - "Off-chain Compute / On-chain Verify"
difficulty: advanced
primitives:
  - "Rust / ckb-std"
  - "Spore SDK"
  - "CCC"
inspired_by: "MUD Engine (Ethereum autonomous worlds)"
author: "dir"
references:
  - title: "Spore Protocol"
    url: "https://spore.pro"
  - title: "Spore docs"
    url: "https://docs.spore.pro"
acceptance_criteria:
  - "A shared Rust core crate that compiles to both a RISC-V on-chain Type Script and a WASM module usable in a browser client."
  - "A Spore DOB schema for entities (characters/items) whose DNA-derived traits drive both on-chain rules and client rendering from the same code path."
  - "An on-chain Type Script that validates at least one state-transition rule (e.g. an item equip or a combat resolution) against entity DOBs."
  - "A second minimal game that reads the same DOB standard and renders/uses a character minted by the first game — proving cross-game interop."
  - "Deployed and demoed on CKB testnet with docs covering how to build a new game on the engine."
needs_collaborators:
  - "rust"
  - "smart-contract"
  - "frontend"
---

## Problem

WarSpore Saga proved you can build a fully on-chain game on CKB with Spore DOBs as game
entities — but it is one game, with its own bespoke state handling, rules, and rendering. Every
new CKB game team re-solves the same problems: where does state live, how do you validate moves
on-chain, how do you turn a DOB's DNA into something you can render and reason about. There is no
reusable engine, and there is no shared entity standard that lets an asset cross between games.
UGMP solves Spore *minting* but not game *logic* or interop. The gap is a framework: WarSpore is
an application; this is the engine others build on.

## Why CKB

CKB is uniquely suited to autonomous worlds. The Cell model means game state is owned by players
as first-class assets, not entries in a central game contract — a character is genuinely *yours*.
Spore DOBs give entities deterministic, DNA-generated traits that any reader can reconstruct. The
RISC-V VM lets the *same* Rust logic that validates a move on-chain also run off-chain in the
client (compiled to WASM) for prediction and rendering — one source of truth for game rules,
verified on-chain, executed everywhere. This off-chain compute / on-chain verify split is what
makes rich gameplay affordable while staying trustless.

## Spec

- **Entity DOBs:** characters, items, and world objects are Spore DOBs. A standard DNA schema
  encodes traits (stats, appearance, type) so any conforming game can read an entity it did not
  mint.
- **State Cells:** mutable game state (positions, inventories, world tiles) lives in Cells,
  updated by consume-and-recreate. A player's Lock guards their own entities.
- **Shared Rust core:** rules (movement, combat, crafting) live in one crate compiled to RISC-V
  for the on-chain Type Script and to WASM for the client. The Type Script validates that any
  submitted transition is a legal output of the core given the input Cells.
- **Interop standard:** a documented DOB trait schema + a reader library so game B can load a DOB
  character minted by game A and place it into its own world.

Builds on the consume-and-recreate state pattern; pairs naturally with idea #13 (dynamic evolving
DOBs) for entities that level up across sessions.

## Mini-demo

Sketch: a tiny grid-world where a character DOB moves and picks up an item DOB. The move is
predicted client-side by the WASM core and committed on-chain, where the RISC-V build of the same
core validates it. A second bare-bones viewer loads the same character DOB and renders its traits.

## References / prior art

See frontmatter. Compare MUD (autonomous worlds on Ethereum, ECS-based) — this targets CKB's
Cell/UTXO model with Spore DOBs as entities instead of ECS tables. WarSpore Saga is the reference
application this generalizes.
