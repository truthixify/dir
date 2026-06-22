---
id: "0015-bitcoin-anchored-document-vault"
title: "Bitcoin-Anchored Document Vault"
status: open
category: "RGB++ & Bitcoin"
summary: >
  Store immutable records in CKB Cells isomorphically bound to Bitcoin UTXOs via RGB++.
  Documents, certificates, and audit trails inherit Bitcoin's proof-of-work security plus
  CKB's programmable, owned storage. A proof can be verified by checking either chain — built
  for legal, compliance, and institutional use cases where Bitcoin-grade settlement matters.
ckb_properties:
  - "RGB++"
  - "Cell Model"
  - "1 CKB = 1 Byte"
  - "Lock/Type Scripts"
  - "Header Deps / Time-lock"
difficulty: intermediate
primitives:
  - "rgbpp-sdk"
  - "CCC"
  - "Bitcoin node"
inspired_by: "OpenTimestamps, notarization services"
author: "dir"
references:
  - title: "rgbpp-sdk"
    url: "https://github.com/ckb-cell/rgbpp-sdk"
  - title: "Nervos CKB Docs"
    url: "https://docs.nervos.org"
  - title: "RGB++ Fans (community resources)"
    url: "https://www.rgbppfans.com"
acceptance_criteria:
  - "A Type Script that stores a document commitment (hash + metadata) in a CKB Cell isomorphically bound to a Bitcoin UTXO via RGB++."
  - "An append/update flow that preserves an immutable, ordered history: superseding a record does not erase prior versions, and the chain of versions is verifiable."
  - "A dual-chain verifier: given a document and a proof, confirm authenticity by checking the CKB Cell OR by checking the Bitcoin UTXO commitment independently."
  - "A web UI to deposit a document (client-side hashing — raw contents need not be uploaded), view its history, and produce a shareable proof."
  - "Deployed and demoed on CKB testnet (with Bitcoin testnet/signet) including a verification page that works against both chains."
  - "Docs covering the trust model: what Bitcoin guarantees, what CKB guarantees, and what the user must keep."
needs_collaborators:
  - "smart-contract"
  - "frontend"
  - "product"
---

## Problem

Organizations that need tamper-evident records — legal contracts, compliance certificates, audit
trails, diplomas — currently rely on either a trusted notary/database or a single-chain timestamp
that inherits only that chain's security. Pure timestamping proves "this existed at time T" but
gives no programmable lifecycle (versioning, ownership, revocation), and many institutions
specifically want Bitcoin's settlement assurances rather than a smaller chain's. Meanwhile RGB++
— the primitive that could give exactly this dual-chain story — saw on-chain activity drop
roughly 78.6% QoQ, in large part because it's hard to build anything real with it. There's no
ready-made, institution-friendly vault that combines Bitcoin-anchored immutability with
programmable, owned storage.

## Why CKB

RGB++ binds a record to a Bitcoin UTXO (settlement and proof-of-work security) while keeping the
record's state and rules in a CKB Cell (programmability and cheap owned storage at 1 CKB = 1
byte). That duality is the whole point here: the Bitcoin leg means a verifier who only trusts
Bitcoin can still confirm a commitment exists, while the CKB leg gives versioning, access rules,
and rich metadata that a bare Bitcoin transaction can't express. Header deps and time-locks let
the vault reason about ordering and finality. No other stack offers "Bitcoin-anchored AND
programmable AND user-owned" in one asset.

## Spec

Key flows:

- **Deposit:** the client hashes the document locally; the vault constructs an RGB++ record —
  a CKB Cell whose `data` holds `{ hash, contentType, issuer, timestamp, version, prevRef }`,
  governed by a Type Script — isomorphically bound to a Bitcoin UTXO whose commitment encodes
  the same hash. Raw contents stay with the owner; only the commitment goes on-chain.
- **Versioning:** updates spend the prior Cell and create a successor that references it
  (`prevRef`), forming an immutable linked history. The Type Script enforces that history is
  append-only and that each version's BTC commitment matches its CKB Cell.
- **Leap:** the record can leap between a Bitcoin UTXO and a CKB Cell (custody/transfer of the
  underlying anchor) without breaking the proof chain — useful when an issuer hands a credential
  to a holder.
- **Dual-chain verification:** a verifier takes a document + proof and validates two independent
  paths — (a) recompute the hash and find the committing Bitcoin UTXO, or (b) read the bound CKB
  Cell and its Type Script. Either alone establishes existence; together they establish the full
  programmable history.

Built on the templates from idea #14; pairs naturally with the attestation protocol (#7) for
issuer-signed credentials.

## Mini-demo

Sketch: an "audit-trail" demo — upload (hash) a PDF, see it anchored to a Bitcoin signet UTXO
and a CKB Cell, edit it to produce v2, then open a verifier link that proves both versions exist
and shows the ordered history, with a toggle to verify via Bitcoin only or via CKB only.

## References / prior art

Compare OpenTimestamps and traditional notarization. The differentiator is programmable,
versioned, user-owned records that still settle on Bitcoin via RGB++ — not just a timestamp. See
frontmatter for SDK and docs links; defer to the actual `rgbpp-sdk` API where it differs from the
flows sketched above.
