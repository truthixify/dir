---
id: "0021-otx-collector-network"
title: "OTX Collector Network"
status: open
category: "OTX & Intent-Based"
summary: >
  The first production implementation of Open Transaction (OTX) infrastructure for CKB. Users
  broadcast partial transactions expressing intent; collector agents gossip them over a P2P
  network, aggregate compatible OTXs into valid full transactions, and submit on-chain — with
  replay protection and Cell-grouping solved.
ckb_properties:
  - "OTX/CoBuild"
  - "Cell Model"
  - "Lock/Type Scripts"
  - "First-Class Assets"
difficulty: advanced
primitives:
  - "CCC"
  - "CoBuild / OTX format"
  - "CKB P2P (tentacle)"
inspired_by: "Ethereum's intent/solver architectures (CoW Protocol, ERC-4337 bundlers)"
author: "dir"
references:
  - title: "CKB RFC: Open Transaction (OTX) CoBuild"
    url: "https://github.com/nervosnetwork/rfcs"
acceptance_criteria:
  - "An OTX envelope format with a witness layout that scopes each signature to its own input/output group, preventing one signed OTX from being reused in a different aggregation (replay protection)."
  - "A P2P gossip layer that propagates OTXs between collector nodes and de-duplicates by content hash."
  - "A collector agent that matches compatible OTXs, assembles a single valid full transaction, balances capacity/fees, and submits it to a CKB node."
  - "Cell-grouping resolution: deterministic rules so two collectors never both consume the same live Cell into conflicting transactions, with conflict detection on submission."
  - "Deployed on CKB testnet with at least two collector nodes aggregating real user-submitted OTXs end-to-end."
  - "Docs plus a TS/Rust SDK so a wallet can construct and broadcast an OTX in under 50 lines."
needs_collaborators:
  - "rust"
  - "smart-contract"
  - "research"
---

## Problem

CKB's CoBuild/OTX work defines how partial transactions *could* be expressed and merged, and an
OTX streaming prototype proved that intents can flow off-chain and be assembled by a third party.
But the prototype surfaced two blockers that stop it being production-ready: **replay attacks**
(a signed OTX reused in an aggregation the signer never intended) and **Cell grouping** (two
collectors racing to consume the same live Cell). No shipped infrastructure on CKB lets a normal
user broadcast "what I want" and have an agent reliably turn it into a confirmed transaction.

## Why CKB

OTX is uniquely natural on CKB. The Cell model already treats a transaction as a *set of
input/output groups* rather than a monolithic call to one contract, so independently-authored
fragments compose by construction — there is no shared mutable contract state to serialize
against. Lock and Type Scripts let each contributor sign exactly their own slice via the witness
layout, and First-Class Assets mean the things being matched (CKB, xUDT, DOBs) are owned Cells the
collector merely arranges, never custodies. This is the substrate intent architectures on account
chains have to simulate; here it is the data model.

## Spec

- **OTX envelope:** a CoBuild-style message carrying the contributor's inputs, outputs, and a
  witness whose signed payload commits to *only* that contributor's groups plus an aggregation
  nonce — so a signature cannot be lifted into a different bundle (replay protection).
- **Gossip network:** collector nodes peer over CKB's P2P stack, flood valid OTXs, and key the
  mempool by content hash to de-duplicate. Invalid/expired OTXs are dropped.
- **Collector agent:** maintains an OTX pool, runs a matcher to find compatible sets, assembles a
  full transaction, fills capacity and fee, signs its own balancing inputs, and submits.
- **Cell-grouping / conflict resolution:** a deterministic claim rule (e.g. lowest collector ID
  or first-seen timestamp per live Cell) plus on-chain conflict detection — a losing aggregation
  is rejected by the node and the OTXs return to the pool for re-matching.
- **SDK:** thin TS/Rust layer over CCC to build, sign, and broadcast OTXs.

This is the infrastructure that idea #22 (CKB Action Links) rides on — an Action Link is an OTX a
wallet completes and this network assembles.

## Mini-demo

Sketch: two users each broadcast an OTX — one offering 100 CKB for an xUDT amount, the other the
reverse. A single collector node matches them, assembles one transaction settling both, and the
two users see one confirmed swap neither had to coordinate.

## References / prior art

See the CKB CoBuild/OTX RFC work in the nervosnetwork/rfcs repo. Compare account-chain intent
systems (CoW Protocol solvers, ERC-4337 bundlers) — the difference is that CKB needs no solver to
fabricate state transitions, only to *arrange* user-owned Cells.
