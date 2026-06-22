---
id: "0014-rgbpp-application-sdk"
title: "RGB++ Application SDK & Templates"
status: open
category: "RGB++ & Bitcoin"
summary: >
  A batteries-included developer toolkit for building apps on RGB++ isomorphic bindings.
  Project templates, a CLI scaffolder, a testing framework for Bitcoin-anchored transactions,
  and docs with worked examples. RGB++ activity collapsed ~78.6% QoQ partly because building
  with it is too hard — this lowers the floor from "protocol expert" to "any web dev."
ckb_properties:
  - "RGB++"
  - "First-Class Assets"
  - "Cell Model"
  - "Lock/Type Scripts"
difficulty: intermediate
primitives:
  - "rgbpp-sdk"
  - "CCC"
  - "xUDT"
  - "Bitcoin node"
inspired_by: "create-react-app / Foundry / Hardhat developer experience"
author: "dir"
references:
  - title: "rgbpp-sdk"
    url: "https://github.com/ckb-cell/rgbpp-sdk"
  - title: "RGB++ Fans (community resources)"
    url: "https://www.rgbppfans.com"
  - title: "Nervos CKB Docs"
    url: "https://docs.nervos.org"
acceptance_criteria:
  - "A CLI scaffolder (e.g. `create-rgbpp-app`) that generates a runnable project for at least two templates: an xUDT issuance app and a leap (BTC<->CKB) app."
  - "A testing framework that can simulate or exercise the full isomorphic flow against testnet — BTC UTXO commitment plus the bound CKB Cell — with assertions on both sides."
  - "A local/regtest harness so contributors can run the BTC + CKB round-trip without mainnet funds."
  - "Docs with at least three worked, copy-pasteable examples: issue an asset, transfer it, and leap it between BTC and CKB."
  - "End-to-end: a fresh developer scaffolds, tests, and deploys a working RGB++ app on testnet in under 30 minutes following the README."
  - "Published as installable packages with versioning and a changelog."
needs_collaborators:
  - "rust"
  - "frontend"
  - "docs"
---

## Problem

RGB++ is one of CKB's most distinctive primitives — assets that live on Bitcoin UTXOs but are
programmable through CKB Cells — yet on-chain RGB++ activity reportedly fell roughly 78.6%
quarter-over-quarter. A large part of that isn't lack of interest; it's that building with RGB++
is genuinely hard. A developer must understand isomorphic bindings, UTXO-to-Cell mapping,
commitment construction, the BTC time-lock dance, and how to coordinate two chains in a single
logical transaction — all before shipping anything. The existing `rgbpp-sdk` is powerful but
low-level, and there's no scaffolding, no opinionated templates, and no testing story that lets
someone iterate quickly. The result is a steep cliff where most would-be builders bounce off.

## Why CKB

RGB++'s value proposition only pays off when people actually build on it. CKB uniquely supports
this model: a Bitcoin UTXO is the single source of ownership truth, while a CKB Cell carries the
asset's state and the Type Script that governs it. The same asset is "isomorphic" across both
chains — Bitcoin gives settlement and security, CKB gives programmability and cheap, owned
storage (1 CKB = 1 byte). A good SDK is the missing layer that turns this powerful-but-arcane
primitive into something a normal web developer can reach for.

## Spec

Key flows the toolkit must make trivial:

- **Scaffolding:** `create-rgbpp-app <name> --template <issuance|leap|...>` produces a project
  with wallet wiring (CCC + a Bitcoin signer), config for testnet/regtest, and example scripts.
- **Isomorphic binding:** helpers that construct the BTC commitment output and the bound CKB
  Cell together, mapping each Bitcoin UTXO to its corresponding Cell and keeping the commitment
  consistent across both legs of the transaction.
- **Leap transactions:** first-class helpers for `leapFromBtcToCkb` and `leapFromCkbToBtc`,
  abstracting the commitment + time-lock + Cell update sequence so the caller specifies intent,
  not low-level steps.
- **Testing framework:** a harness that drives a BTC node (regtest) and a CKB node together,
  exposes fixtures for funded UTXOs/Cells, and lets tests assert invariants on both chains after
  a flow (e.g. "after a leap, the BTC UTXO is spent and the CKB Cell reflects the new owner").
- **Docs:** worked examples that double as integration tests, so the examples can never silently
  rot.

This is foundational for the rest of the RGB++ category — ideas #15 (document vault) and #16
(token launchpad) would both build directly on top of these templates and helpers.

## Mini-demo

Sketch: run `create-rgbpp-app demo --template issuance`, `npm test` (spins up regtest + CKB
devnet, issues and transfers an xUDT-backed RGB++ asset, asserts both chains), then `npm run
deploy:testnet` to mint a real asset on testnet — all from one README.

## References / prior art

See frontmatter for `rgbpp-sdk` and community resources. The DX target is the Foundry/Hardhat
and create-react-app experience: scaffold, test locally, deploy with confidence. If specifics of
the current `rgbpp-sdk` API surface differ from the helpers described here, follow the SDK's
actual API and treat these as the desired ergonomics to wrap.
