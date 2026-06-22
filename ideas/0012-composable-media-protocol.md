---
id: "0012-composable-media-protocol"
title: "Composable Media Protocol — DOB Remix"
status: open
category: "Spore/DOB"
summary: >
  Every piece of creative media — art, music, writing, code — is a Spore DOB. Fork an existing
  DOB to create a derivative; the protocol tracks lineage via Cluster relationships, and DNA
  enables generative traits that downstream remixes inherit and mutate. Type Scripts encode
  royalties so original creators automatically earn when derivatives are transacted.
ckb_properties:
  - "Spore/DOB"
  - "Lock/Type Scripts"
  - "First-Class Assets"
  - "Cell Model"
difficulty: advanced
primitives:
  - "Spore SDK"
  - "Rust / ckb-std"
  - "CCC"
inspired_by: "Sampling/remix culture, generative art lineage"
author: "dir"
references:
  - title: "Spore Protocol"
    url: "https://spore.pro"
  - title: "Spore docs"
    url: "https://docs.spore.pro"
acceptance_criteria:
  - "A media DOB schema where any media object (image/audio/text/code) is minted as a Spore DOB."
  - "A fork operation that mints a derivative DOB recording its parent, with lineage expressed via Cluster relationships."
  - "DNA-derived generative traits that a derivative inherits from its parent and can mutate."
  - "A royalty Type Script that, when a derivative is transacted, routes a defined share of value to the original creator(s) up the lineage."
  - "A lineage viewer that, given any DOB, shows its ancestors and descendants."
  - "Deployed and demoed on CKB testnet with docs."
needs_collaborators:
  - "smart-contract"
  - "frontend"
  - "design"
---

## Problem

Remix and sampling culture has no native on-chain home where derivation is first-class.
Marketplaces treat each NFT as an isolated artifact; when someone remixes a work, the link to the
original is at best metadata and the original creator earns nothing downstream. On CKB, Spore DOBs
and UGMP make minting media easy, but there is no protocol for *forking* a DOB, tracking the
resulting lineage, or sharing revenue back up the chain of derivation. The gap is composability:
media that other media can be built from, with provenance and royalties enforced by code rather
than by a marketplace's goodwill.

## Why CKB

Spore DOBs make each media object a first-class, owned asset, and DNA gives it deterministic
generative traits that a derivative can inherit and mutate — remix becomes a structural operation,
not a copy. Clusters express lineage natively, so a fork's parentage is part of the data model.
Crucially, royalty logic lives in a Type Script that runs at transaction time on CKB's VM: the
chain itself enforces that transacting a derivative pays the ancestors, with no marketplace able to
strip it out. Owned storage means creators hold their work, and forks reference parents by hash for
a tamper-evident lineage.

## Spec

- **Media DOB:** any creative artifact minted as a Spore DOB; `data`/DNA carries content (or a
  content reference) plus generative traits.
- **Fork:** an operation that mints a derivative DOB recording its parent DOB and joining a lineage
  Cluster. Inherited DNA traits seed the derivative; new mutations are applied at fork time.
- **Lineage via Clusters:** Cluster relationships model the derivation graph so any node's ancestors
  and descendants are discoverable.
- **Royalty Type Script:** on transfer/sale of a derivative, validates that a configured share is
  routed to the original creator(s) up the lineage before the transaction is accepted.
- **SDK/viewer:** library to mint, fork, query lineage, and a UI to walk the derivation tree.

Pairs with idea #10's DNA tooling; complements idea #7 (attestation) for asserting authorship.

## Mini-demo

Sketch: an artist mints a generative image DOB; a second user forks it, mutating its palette DNA;
a lineage viewer shows parent→child, and a simulated sale of the derivative routes a royalty to the
original artist's Lock.

## References / prior art

See frontmatter. Compare music-sampling clearance and generative-art "editions" — this makes
derivation and royalty-on-derivation enforceable on-chain via Spore DOB composability and Type
Scripts.
