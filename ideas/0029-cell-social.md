---
id: "0029-cell-social"
title: "Cell Social — Owned Social Protocol"
status: open
category: "Social & Community"
summary: >
  A social protocol where posts are Cells owned by their authors, follows are on-chain
  relationships, and the social graph is shared state. Authors truly own their content as
  first-class assets the platform cannot delete; feeds run client-side over user-owned data;
  tipping flows over Fiber micropayments; users join from any wallet via account abstraction.
ckb_properties:
  - "Cell Model"
  - "First-Class Assets"
  - "Account Abstraction"
  - "Fiber Network"
difficulty: advanced
primitives:
  - "CCC"
  - "Spore/DOB"
  - ".bit"
inspired_by: "Farcaster (on-chain identity + off-chain content) and Nostr (censorship resistance)"
author: "dir"
references:
  - title: "Nervos CKB Docs — Cell Model"
    url: "https://docs.nervos.org/docs/tech-explanation/cell-model"
  - title: "Fiber Network"
    url: "https://www.fiber.world/"
acceptance_criteria:
  - "A post standard: a Cell (with on-chain or content-addressed payload) owned by the author's lock, readable by any client."
  - "An on-chain follow/graph standard so relationships are shared, queryable state — not siloed in one app."
  - "Authors can edit/delete their own posts and no one else can; demonstrate platform-resistance to takedown."
  - "A client that builds a feed entirely from on-chain data with a client-side ranking algorithm (no server feed authority)."
  - "Tipping integrated over Fiber: a reader sends a micropayment to an author from the post UI."
  - "Users onboard from at least two different wallets via account abstraction; public demo + docs."
needs_collaborators:
  - "frontend"
  - "smart-contract"
  - "product"
---

## Problem

Decentralized social keeps splitting the baby. Farcaster anchors identity on-chain but keeps
content off-chain on hubs; Nostr achieves censorship resistance via relays but has no notion of
owned, programmable content objects. In both, "ownership" of a post is convention, not a
property the network enforces — a relay or hub can drop your data, and the social graph is
effectively re-derived per app. On CKB there is no social protocol that treats a post as a
genuinely owned asset and the follow graph as shared on-chain state that any client can read and
build on.

## Why CKB

The Cell model makes content a **first-class, owned asset**: a post is a Cell under the author's
lock, so only the author can edit or remove it and no platform can delete it. The social graph
becomes shared on-chain state rather than per-app data, so feed algorithms are a client concern
running over data users own — not a moat controlled by one company. Account abstraction lets
anyone join from the wallet they already have (EVM, Bitcoin, passkey) without a bespoke account
system. And Fiber, CKB's payment-channel network, makes per-post tipping economical at
micropayment scale instead of paying a base-layer fee per like.

## Spec

- **Post Cell:** author's lock + a payload (short posts inline on-chain; larger media
  content-addressed with the bytes optionally in Spore/DOB Cells). Editing/melting is the
  author's exclusive right.
- **Graph standard:** follow/relationship Cells (or a DOB-style relationship object) that any
  client can query to assemble a graph — shared state, not app-private.
- **Identity:** built on the omnichain auth layer (#26) and optionally `.bit` handles, so users
  arrive from any wallet with a portable identity.
- **Feeds:** clients fetch on-chain posts + graph and rank locally; multiple competing
  algorithms can run over the same data.
- **Tipping:** a Fiber channel integration to stream micro-tips from reader to author directly
  from the post UI.

Cell Social leans on several other dir ideas: account abstraction from #26, and DOB media
patterns shared with the composable-media work (#12).

## Mini-demo

A minimal client: log in with any wallet, publish a post (a Cell appears under your lock), follow
another account (an on-chain relationship), and see a feed assembled from chain data with a
client-side ranking toggle. Tip a post via Fiber and watch the author receive it, then delete
your own post to show no one else can.

## References / prior art

Compare Farcaster and Nostr for identity and censorship-resistance models, and Lens for an
on-chain-graph approach. The differentiator is content as an owned first-class asset (Cell) plus
Fiber-native micro-tipping and wallet-agnostic onboarding.
