---
id: "0009-permacell-web-archive"
title: "PermaCell — Permanent Web Archive on CKB"
status: open
category: "On-Chain Storage & Data Ownership"
summary: >
  Store web pages, documents, and digital media permanently in CKB Cells. Unlike Arweave (a
  separate chain with its own economics), PermaCell rides CKB's existing PoW security and Cell
  ownership, storing content as Spore DOBs with melt-to-reclaim: your archive carries intrinsic
  CKB value, and you can melt the DOB to reclaim CKB when it is no longer needed.
ckb_properties:
  - "Spore/DOB"
  - "Cell Model"
  - "1 CKB = 1 Byte"
difficulty: intermediate
primitives:
  - "Spore SDK"
  - "CCC"
inspired_by: "Arweave permaweb (with CKB Cell economics + melt-to-reclaim instead of an endowment)"
author: "dir"
references:
  - title: "Spore Protocol"
    url: "https://spore.pro/"
  - title: "Arweave"
    url: "https://www.arweave.org/"
acceptance_criteria:
  - "An archiver that captures a web page (or uploads a document/media file) and mints it as a Spore DOB on CKB testnet."
  - "Stored content is retrievable and renderable directly from the on-chain Cell data (no off-chain dependency)."
  - "Melt-to-reclaim demonstrated: melting the DOB returns the locked CKB to the owner."
  - "Large content is chunked across Cells (or otherwise handled) with the size/cost shown to the user up front (1 CKB = 1 byte)."
  - "Public demo: archive a real URL, view it back from chain, then reclaim CKB by melting."
  - "Docs comparing the cost/permanence model to Arweave."
needs_collaborators:
  - "frontend"
  - "smart-contract"
---

## Problem

Link rot is permanent loss: pages, documents, and media vanish when servers go down. Arweave
solves permanence but does so on a **separate chain** with a one-time-payment endowment model and
its own security assumptions. On CKB there is no general web/media archive — and CKB already has
the ingredients (PoW security, owned on-chain storage, and Spore's digital-object standard with
melt economics), so a separate permanence chain is unnecessary for users already in this
ecosystem.

## Why CKB

CKB stores data **on the same PoW-secured chain** that secures value, so an archive inherits that
security without a bespoke incentive scheme. The 1 CKB = 1 byte rule makes the cost explicit and
the storage genuinely owned. The decisive difference from Arweave is **melt-to-reclaim**: with
Spore DOBs, the CKB backing an archived object is locked but recoverable — if the content is no
longer worth keeping, the owner melts the DOB and gets the CKB back. So an archive is not a sunk
cost; it is a redeemable asset with intrinsic value.

## Spec

- **Archive object = Spore DOB:** captured content (HTML snapshot, PDF, image, video) is encoded
  and minted as a Spore digital object. Small items fit one Cell; larger items are chunked across
  multiple Cells with a manifest DOB tying them together.
- **Capture pipeline:** an archiver snapshots a URL (inlining assets) or accepts a file upload,
  computes size and CKB cost, then mints via the Spore SDK / CCC.
- **Retrieval:** content renders directly from on-chain Cell data — the proof of permanence is
  that nothing off-chain is required to view it.
- **Melt-to-reclaim:** the owner can melt the DOB to recover the locked CKB, making archiving an
  economically reversible decision.

Naturally pairs with idea #6 (encrypt before archiving for private permanence) and idea #8
(archived pages as citable source Cells in the knowledge graph).

## Mini-demo

Paste a URL, see the byte size and CKB cost, mint the snapshot as a DOB, then open the archived
page rendered straight from chain. A "reclaim" button melts the DOB and returns the CKB.

## References / prior art

Compare Arweave (separate chain, endowment-funded permanence) and the Internet Archive
(centralized). PermaCell's angle is permanence on CKB's existing security with reversible,
owned economics via Spore melt-to-reclaim.
