---
id: "0016-rgbpp-token-launchpad"
title: "RGB++ Token Launchpad"
status: open
category: "RGB++ & Bitcoin"
summary: >
  A no-code platform for creating and managing RGB++ tokens natively bound to Bitcoin UTXOs.
  Creators set supply, distribution, and vesting through a UI — no deep RGB++ protocol knowledge
  needed. Includes a creation wizard, distribution manager, holder dashboard, and leap operations
  between BTC and CKB, all on the xUDT token standard.
ckb_properties:
  - "RGB++"
  - "First-Class Assets"
  - "Cell Model"
  - "Lock/Type Scripts"
  - "Header Deps / Time-lock"
difficulty: intermediate
primitives:
  - "rgbpp-sdk"
  - "xUDT"
  - "CCC"
  - "Bitcoin node"
inspired_by: "Token launchpads (e.g. pump.fun) — but Bitcoin-native via RGB++"
author: "dir"
references:
  - title: "rgbpp-sdk"
    url: "https://github.com/ckb-cell/rgbpp-sdk"
  - title: "Nervos CKB Docs"
    url: "https://docs.nervos.org"
  - title: "RGB++ Fans (community resources)"
    url: "https://www.rgbppfans.com"
acceptance_criteria:
  - "A token creation wizard that issues an xUDT-based RGB++ token with creator-defined name, symbol, total supply, and decimals — bound to a Bitcoin UTXO."
  - "A distribution manager supporting at least airdrop/batch-send and time-locked vesting schedules enforced on-chain."
  - "A holder dashboard showing balances, the token's BTC anchor, and per-holder history."
  - "Leap operations exposed in the UI: a holder can move tokens between a Bitcoin UTXO and a CKB Cell (BTC<->CKB) and see both sides update."
  - "Deployed and demoed on CKB testnet (with Bitcoin testnet/signet): create a token, run a vested distribution, and complete a round-trip leap, all from the UI."
  - "Docs/onboarding so a non-developer can launch a token end-to-end without touching the SDK."
needs_collaborators:
  - "frontend"
  - "smart-contract"
  - "design"
  - "product"
---

## Problem

Launching a token on RGB++ today means understanding xUDT, isomorphic bindings, UTXO-to-Cell
mapping, commitment construction, and leap mechanics — then wiring a Bitcoin signer and a CKB
wallet together by hand. That's a serious barrier, and it shows: RGB++ on-chain activity
reportedly fell about 78.6% QoQ. The primitive's headline feature — Bitcoin-native assets that
are also programmable on CKB — is exactly what should attract token creators, but there's no
simple, opinionated path from "I want to launch a token" to a live, Bitcoin-anchored asset with
sane distribution and vesting. Creators who would happily launch on a polished UI instead bounce
off the raw protocol.

## Why CKB

RGB++ lets a token's ownership live on Bitcoin UTXOs while its supply logic and balances are
governed by an xUDT Type Script on a CKB Cell. That means the token inherits Bitcoin's security
and settlement while gaining CKB's programmability — vesting, batch distribution, and rich state
that a pure-Bitcoin asset can't express, all in owned storage (1 CKB = 1 byte). Time-locks make
vesting enforceable on-chain rather than as a promise. A launchpad is the natural surface that
hides the isomorphic plumbing and exposes only the decisions a creator actually cares about.

## Spec

Key flows:

- **Creation wizard:** collects name/symbol/supply/decimals, then issues an xUDT-backed RGB++
  token — minting the CKB Cell that carries supply state and binding it isomorphically to a
  Bitcoin UTXO so the asset is Bitcoin-native from block one.
- **Distribution manager:** batch transfers (airdrops) and vesting schedules. Vesting is enforced
  by a Type Script + time-lock so locked allocations cannot be moved before their unlock height.
- **Holder dashboard:** reads balances and history, shows each holder's BTC anchor and the bound
  CKB Cell, and surfaces total/circulating supply.
- **Leap operations:** UI buttons for `leapFromBtcToCkb` / `leapFromCkbToBtc` so holders can
  custody on Bitcoin or operate on CKB, with both legs of the isomorphic binding updated and
  reflected in the dashboard.

Built directly on the SDK and templates from idea #14; the launchpad is essentially the
flagship consumer app for that toolkit.

## Mini-demo

Sketch: a creator runs the wizard to mint "DEMO" with a 1,000,000 supply and a 6-month linear
vest for a team allocation, airdrops a tranche to a list of testnet addresses, and a recipient
then leaps their tokens from the Bitcoin UTXO to a CKB Cell — watching balances and the BTC
anchor update live in the dashboard.

## References / prior art

Compare familiar token launchpads, but the differentiator is Bitcoin-native issuance via RGB++
with on-chain vesting and leap, rather than single-chain tokens. See frontmatter for SDK and
docs links; where the live `rgbpp-sdk`/xUDT APIs differ from the flows above, defer to them and
treat this as the target UX.
