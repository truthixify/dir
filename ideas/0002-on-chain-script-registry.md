---
id: "0002-on-chain-script-registry"
title: "On-Chain Script Registry & Package Manager"
status: open
category: "Developer Tooling"
summary: >
  Deploy audited CKB scripts on-chain once, then reference them via Cell Deps with
  versioning and dependency resolution. A searchable registry of Lock Scripts, Type
  Scripts, and Spawn-callable modules so developers run `ckb-pkg install multisig-lock`
  instead of copy-pasting code.
ckb_properties:
  - "Cell Deps"
  - "Spawn Syscall"
  - "Cell Model"
  - "Lock/Type Scripts"
difficulty: advanced
primitives:
  - "Rust / ckb-std"
  - "CCC"
  - "ckb-indexer"
inspired_by: "npm / crates.io, plus Ethereum's deployed-library pattern"
author: "dir"
references:
  - title: "CKB RFCs (script & cell dep semantics)"
    url: "https://github.com/nervosnetwork/rfcs"
  - title: "Nervos CKB docs"
    url: "https://docs.nervos.org"
acceptance_criteria:
  - "A CLI (e.g. ckb-pkg) that resolves a named, versioned script to a concrete on-chain code Cell OutPoint and emits the cell dep needed to use it."
  - "A registry mapping human names + semantic versions to deployed code Cell OutPoints, with the code hash and hash type, published and queryable."
  - "Dependency resolution: a script declaring it Spawns or depends on another registry entry pulls the transitive cell deps automatically."
  - "Publishing flow: deploy a script's binary as a code Cell, register metadata (name, version, audit status, source link), and verify the on-chain binary hash matches the claimed source build."
  - "At least three real scripts (e.g. a multisig lock, a fungible-token type script, a Spawn-callable utility) published and installable end to end on testnet."
  - "Public registry UI with search and docs."
needs_collaborators:
  - "rust"
  - "smart-contract"
  - "frontend"
---

## Problem
Every CKB team reimplements the same primitives — multisig locks, token type scripts, common verification helpers — by copy-pasting code and redeploying their own binaries. There is no canonical place to discover audited scripts, no versioning convention, and no tooling that turns "I want a multisig lock" into the exact Cell Dep your transaction needs. The result is duplicated audit cost, inconsistent implementations, and chain bloat from redundant code Cells. CKB's architecture already supports code reuse at the protocol level; what's missing is the package-management layer on top.

## Why CKB
On CKB, code lives in Cells and is referenced by transactions through Cell Deps rather than being redeployed per project — code is genuinely shareable at the protocol level. The Spawn syscall extends this further: a script can invoke another deployed script as a separate process via IPC, so registry entries can be composable *runtime* modules, not just statically linked code. This makes a true on-chain package manager natural in a way it isn't on chains where each contract is its own siloed deployment. Versioning maps cleanly onto immutable code Cells: a version is an OutPoint, and an upgrade is a new Cell, so resolution is deterministic and auditable.

## Spec
- **Code Cells:** publishing deploys a script binary into a dep Cell (optionally under a type-id lock for upgradeable lines). The registry records `{name, version, out_point, code_hash, hash_type, source_url, audit_status}`.
- **Registry backend:** an indexed store (rebuildable from chain) mapping names/versions to OutPoints. Designed so anyone can reconstruct it from on-chain data — the registry is a convenience index, not a trust anchor.
- **CLI (`ckb-pkg`):** `install <name>[@version]` returns the cell dep(s) and integrates with CCC so a builder can attach them automatically. `publish` handles deploy + metadata + reproducible-build hash check.
- **Dependency graph:** a manifest format lets a script declare other registry entries it Spawns or depends on; the resolver walks it and assembles the full set of cell deps.
- **Verification:** on publish, rebuild from source and confirm the binary hash equals the on-chain code hash, so consumers can trust "this OutPoint is this audited source."

## Mini-demo
Sketch: a developer runs `ckb-pkg install multisig-lock@1.2.0`. The CLI returns the code Cell OutPoint and code hash, and CCC wires the cell dep into the next transaction. Their script also declares a dependency on a Spawn-callable `ed25519-verify` module; the resolver pulls that dep automatically — no copy-pasted crypto.

## References / prior art
Conceptually npm/crates.io for on-chain code, and analogous to deployed-library reuse on Ethereum but first-class via Cell Deps. Pairs with idea #3 (Spawn Composition Library): this registry is where those composable Spawn modules would be published and discovered.
