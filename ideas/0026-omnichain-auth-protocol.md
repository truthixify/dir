---
id: "0026-omnichain-auth-protocol"
title: "Omnichain Auth Protocol"
status: open
category: "Identity & Security"
summary: >
  A universal authentication layer built on CKB's protocol-level account abstraction. Users
  sign in with MetaMask, a Bitcoin wallet, JoyID passkeys, or social login — all resolving to
  the same CKB identity with linked credentials. The protocol layer that any dApp can use to
  authenticate users from any chain in one standard way.
ckb_properties:
  - "Account Abstraction"
  - "RISC-V VM"
  - "Lock/Type Scripts"
  - "Cell Model"
difficulty: advanced
primitives:
  - "CCC"
  - "JoyID"
  - ".bit"
  - "Rust / ckb-std"
inspired_by: "Sign-In with Ethereum (EIP-4361) + WebAuthn, but signature-agnostic"
author: "dir"
references:
  - title: "Nervos CKB Docs — Lock Scripts"
    url: "https://docs.nervos.org/docs/tech-explanation/lock-script"
  - title: ".bit (DID on CKB)"
    url: "https://www.did.id"
  - title: "JoyID (passkey wallet)"
    url: "https://joy.id"
acceptance_criteria:
  - "An on-chain identity Cell standard: one CKB identity that links multiple credential locks (secp256k1/EVM, secp256r1/passkey, Bitcoin, Ed25519)."
  - "Verifier Lock Scripts for at least three signature schemes (e.g. EVM personal_sign, WebAuthn/P-256, Bitcoin BIP-322), deployed on CKB testnet."
  - "A credential add/remove flow: an authenticated user links a second wallet to the same identity and proves control of both."
  - "Optional .bit name resolution so an identity can be addressed by a human-readable handle."
  - "A drop-in SDK so a dApp authenticates a user from any supported chain in <30 lines and receives a single canonical CKB identity."
  - "Public demo with two different wallets resolving to one identity, plus docs and a threat model."
needs_collaborators:
  - "smart-contract"
  - "rust"
  - "frontend"
---

## Problem

CKB already proves that signature-scheme diversity is possible: JoyID brings passkey
(secp256r1) login and .bit provides human-readable DIDs. But these live as separate islands.
There is no protocol layer that unifies *any* wallet into one canonical identity and exposes a
standard "authenticate this user" primitive that any dApp can adopt. Today each app picks one
wallet stack, re-implements connection logic, and treats a MetaMask user and a Bitcoin user as
unrelated strangers even when they are the same person. The result is fragmented identity and
duplicated, error-prone auth code across the ecosystem.

## Why CKB

Account abstraction on CKB is not a smart-contract convention bolted on top — it is
**protocol-level**. A Lock Script is arbitrary RISC-V code, so the chain itself does not assume
secp256k1; any signature scheme that can be verified in the VM is a first-class way to own a
Cell. That makes CKB the natural home for an omnichain auth layer: instead of bridging foreign
signatures into a fixed verifier, you deploy a verifier Lock Script per scheme and let one
identity reference many of them. The Cell model then lets an identity be an owned, portable
object that aggregates credentials rather than a row in some app's user table.

## Spec

- **Identity Cell:** a Cell whose `data` enumerates linked credentials (scheme id + public key
  / commitment) and an active-set policy (e.g. any-1-of-N, or threshold). The Type Script
  enforces valid credential additions and removals.
- **Verifier Lock Scripts:** one RISC-V Lock per scheme — EVM `personal_sign`, WebAuthn P-256
  (reuse JoyID's verifier where possible), Bitcoin BIP-322, Ed25519. Each validates a witness
  signature against a challenge.
- **Linking flow:** to add a credential, the user authorizes with an existing credential and
  proves control of the new one in the same transaction; the Type Script appends it.
- **Resolution:** optionally bind the identity to a `.bit` name so apps can address users by
  handle and reverse-resolve an address to a profile.
- **SDK:** a CCC-based TS layer exposing `connect()` (any wallet), `getIdentity()`,
  `linkCredential()`, and `verifyChallenge()` so a relying app gets one canonical identity.

This is the shared substrate for several other dir ideas: Cell Social (#29) can let users join
from any wallet through it, and the quantum-safe locks of #27 are just another verifier scheme
plugged into the same identity.

## Mini-demo

A login page with three buttons — MetaMask, a Bitcoin wallet, and a JoyID passkey. A first-time
visitor logs in with MetaMask, creating an identity Cell; later they link their Bitcoin wallet.
A second demo dApp then authenticates the same person via either wallet and shows it is one
identity, optionally displaying their `.bit` handle.

## References / prior art

Compare Sign-In with Ethereum (EIP-4361) and WebAuthn for the challenge/response model, and
.bit for DID resolution. The differentiator is protocol-level, scheme-agnostic account
abstraction: the chain verifies the signature, so the identity layer is not tied to any one
chain's wallet.
