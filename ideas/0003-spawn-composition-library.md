---
id: "0003-spawn-composition-library"
title: "Spawn Composition Library"
status: open
category: "Developer Tooling"
summary: >
  Pre-built, audited script building blocks using the Spawn syscall and pipes:
  multisig, time-locks, rate limiting, access control, escrow, oracle reading, token gating.
  Spawn shipped with Meepo (2025) but has almost no ecosystem libraries on top of it.
ckb_properties:
  - "Spawn Syscall"
  - "RISC-V VM"
  - "Lock/Type Scripts"
difficulty: advanced
primitives:
  - "Rust / ckb-std"
  - "Spawn syscall (Meepo hard fork)"
  - "ckb-debugger"
inspired_by: "OpenZeppelin contracts (reusable, audited primitives) — for CKB's multi-process model"
author: "dir"
references:
  - title: "CKB Spawn syscall (RFC / Meepo)"
    url: "https://github.com/nervosnetwork/rfcs"
acceptance_criteria:
  - "At least 5 composable modules callable via Spawn pipes (e.g. multisig, time-lock, rate-limit, access-control, oracle-read)."
  - "Each module has property-based tests and a ckb-debugger reproduction."
  - "Documented IPC/pipe contract for composing modules into a parent script."
  - "A worked example script that composes ≥3 modules into one verification flow."
  - "Published as a versioned, referenceable package (Cell Deps + source)."
needs_collaborators:
  - "rust"
  - "smart-contract"
  - "docs"
---

## Problem

The Spawn syscall enables modular, multi-process on-chain execution with pipes/IPC — but since
it landed in the Meepo hard fork, almost no reusable libraries exist. Every team that wants
composable script logic writes it from scratch, which is exactly the kind of unforgiving,
asset-freezing code you least want to hand-roll.

## Why CKB

Spawn is unique to CKB's RISC-V VM: cross-script calls with real IPC, not a precompile. That
makes genuinely modular, audited building blocks possible — the OpenZeppelin pattern, but for a
multi-process verification machine. A shared library here lifts the whole script-writing ecosystem
(and underpins ideas #2, #27, #30).

## Spec

- A set of small, single-purpose RISC-V binaries, each with a documented pipe protocol
  (request/response over the Spawn IPC channel).
- A composition convention: how a parent script discovers, calls, and aggregates child verdicts.
- Test harness around ckb-debugger; property-based adversarial inputs (overflow, replay,
  cell-grouping abuse).

## Mini-demo

Sketch: a Lock that composes `multisig` + `time-lock` + `rate-limit` modules via Spawn, with a
debugger trace showing each child's cycle cost.

## References / prior art

See frontmatter. Pair with idea #4 (fuzzer) for testing these modules.
