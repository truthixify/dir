---
id: "0022-ckb-action-links"
title: "CKB Action Links (Transaction as URL)"
status: open
category: "OTX & Intent-Based"
summary: >
  Share a CKB transaction as a clickable URL. One click to tip a creator, mint a DOB, attest a
  credential, or pay an invoice — the link encodes the transaction intent as a partial OTX, and
  the user's wallet (JoyID, etc.) previews and completes it. Embeddable anywhere; no dApp
  navigation needed.
ckb_properties:
  - "OTX/CoBuild"
  - "Account Abstraction"
  - "Cell Model"
  - "First-Class Assets"
difficulty: good-first
primitives:
  - "CCC"
  - "JoyID"
  - "OTX format"
inspired_by: "Solana Blinks / Actions (transaction-as-URL)"
author: "dir"
references:
  - title: "Solana Actions and Blinks"
    url: "https://solana.com/docs"
acceptance_criteria:
  - "A URL/spec that encodes a transaction intent as a partial OTX, including the missing fields the signer must supply (their input Cells, signature)."
  - "A resolver endpoint pattern: a link points to metadata (title, icon, action) plus the unsigned partial transaction, so any client can render a preview."
  - "A client (web component or wallet integration) that fetches a link, previews the human-readable action, and lets the user complete and sign via CCC + JoyID."
  - "At least three working action templates: tip CKB, mint a Spore/DOB, and pay a Fiber or on-chain invoice."
  - "Links are embeddable: an unfurl preview for at least one surface (e.g. an HTML meta-tag card) and a fallback page for clients that cannot inline."
  - "Deployed on CKB testnet with docs and a public demo link anyone can click and sign."
needs_collaborators:
  - "frontend"
  - "design"
  - "product"
---

## Problem

Doing anything on-chain on CKB today means leaving the context you're in — a tweet, a chat
message, a blog post — to find and load a dApp, connect a wallet, and navigate to the right page.
There is no way to drop a ready-to-sign transaction *inline* where the user already is. Solana
solved this for account chains with Blinks/Actions, but CKB has no equivalent, and a naive port
would custody intent badly because CKB transactions are authored very differently.

## Why CKB

A CKB Action Link is naturally a **partial OTX** (see idea #21): the link author writes the
outputs and intent they care about, and leaves the inputs and signature for the clicker's wallet
to fill. The Cell model means the author never has to know the signer's UTXO set in advance — the
wallet just contributes its own owned Cells. Account Abstraction via Lock Scripts (JoyID
passkeys, etc.) means "sign" is a passkey tap, not a seed phrase, so a one-click link is genuinely
one click. First-Class Assets make "mint this DOB" or "tip this xUDT" a single legible output the
wallet can preview honestly.

## Spec

- **Link format:** a URL whose payload (or a resolver it points to) carries action metadata plus
  an unsigned partial transaction / OTX template with typed blanks for the signer's contributions.
- **Resolver contract:** GET returns `{ title, icon, description, action }` and the partial tx;
  the client renders a preview card. POST (optional) lets dynamic actions parameterize the tx.
- **Client:** a small library / web component that resolves a link, shows a plain-language
  preview ("Tip 5 CKB to @alice"), and drives completion + signing through CCC and JoyID.
- **Embedding:** unfurl card metadata for social surfaces; a hosted fallback page otherwise.
- **Templates:** tip, mint DOB, attest a credential (ties to idea #7), pay an invoice.

Action Links are the consumer-facing front door to the OTX Collector Network (#21): the link is
the intent, the network can assemble it.

**Good first slice.** Ship just the *tip-CKB* template end-to-end: a link → preview card → JoyID
sign → settled transfer on testnet. One action, one wallet, no resolver service (encode the intent
in the URL itself). That alone is a complete, demoable contribution; the resolver, embedding, and
extra templates can follow as separate PRs.

## Mini-demo

Sketch: a creator pastes a "Tip me" link in their bio. A reader clicks it, JoyID pops a preview
"Send 5 CKB to creator", they tap to authorize with a passkey, and the tip settles — without ever
opening a dApp.

## References / prior art

See Solana Actions/Blinks for the transaction-as-URL pattern. The CKB-native difference is that
the link carries a partial OTX the *signer's* wallet completes, rather than a pre-built call to a
contract.
