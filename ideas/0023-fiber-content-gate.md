---
id: "0023-fiber-content-gate"
title: "Fiber Content Gate — Micropayment Access Control"
status: open
category: "Fiber Network"
summary: >
  Pay-per-access content for CKB. Creators register content metadata as Spore DOBs (proving
  ownership); access is unlocked by a Fiber invoice payment — sub-cent amounts, instant
  settlement, no subscriptions and no platform cut. Works for articles, music, video, APIs, and
  data feeds.
ckb_properties:
  - "Fiber Network"
  - "Spore/DOB"
  - "First-Class Assets"
  - "Off-chain Compute / On-chain Verify"
difficulty: intermediate
primitives:
  - "Fiber node"
  - "Spore SDK"
  - "CCC"
inspired_by: "L402 / Lightning paywalls, adapted for Fiber + Spore"
author: "dir"
references:
  - title: "Fiber Network"
    url: "https://www.fiber.world"
acceptance_criteria:
  - "Content is registered as a Spore DOB that records the creator's ownership and a pointer/commitment to the gated resource."
  - "An access protocol: a request to gated content returns a Fiber invoice; settling it yields a verifiable access grant (preimage-bound token) the gate accepts."
  - "A creator dashboard to publish content, set a per-access price, and view earnings."
  - "A consumer flow that pays the invoice and receives content with no account and no subscription."
  - "Demonstrated across at least two media types (e.g. an article and an API endpoint)."
  - "Deployed against Fiber testnet with docs and a reference server library."
needs_collaborators:
  - "frontend"
  - "rust"
  - "product"
---

## Problem

Monetizing a single article, song, or API call on CKB today has no good path. On-chain payments
are too heavy and slow for a sub-cent unlock, and the existing Fiber tooling is narrow: **Fiber
Link** does Discourse tipping only, while general content monetization doesn't exist. The result
is that creators fall back to subscriptions and walled platforms that take a cut and own the
relationship with the reader. There is no general-purpose, pay-as-you-go content gate.

## Why CKB

Fiber gives the missing piece account chains lack: **instant, sub-cent settlement** over payment
channels, so charging a fraction of a cent to read one article is actually viable. Pairing it with
**Spore DOBs** means the content itself is a first-class, creator-owned asset on-chain — ownership
and provenance are provable, not a row in a platform's database — while the heavy bytes stay off
the ledger and only the unlock is verified. The payment preimage doubles as a clean, verifiable
access grant: pay, get the secret, the gate checks it. This is off-chain compute (serving content)
with on-chain/Fiber-anchored verification.

## Spec

- **Content registry:** each piece of content is a Spore DOB recording creator ownership, price,
  and a commitment to the resource (hash or encrypted pointer).
- **Access protocol:** an unauthorized request returns a Fiber invoice (L402-style). The payer
  settles it; the payment preimage binds an access grant the gate verifies before releasing the
  resource (or a decryption key).
- **Creator tooling:** dashboard to mint content DOBs, set prices, rotate keys, and see revenue.
- **Server library:** drop-in middleware so any backend can gate a route behind a Fiber invoice.

For consumer-facing unlocks, a gated resource can be shared as a CKB Action Link (idea #22): one
click, pay, read.

## Mini-demo

Sketch: a writer publishes an essay as a content DOB priced at 0.3 CKB. A reader hits the URL,
gets a Fiber invoice, pays it in a tap, and the essay renders — no signup, no subscription, and
100% of the payment reaches the writer.

## References / prior art

Compare Lightning L402 paywalls; **Fiber Link** (Discourse tipping) shows the tipping slice but
not general monetization. See fiber.world for the network. This generalizes both to arbitrary
media with on-chain ownership via Spore.
