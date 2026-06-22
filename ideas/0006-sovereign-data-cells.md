---
id: "0006-sovereign-data-cells"
title: "Sovereign Data Cells — User-Owned Encrypted Data Store"
status: open
category: "On-Chain Storage & Data Ownership"
summary: >
  Personal data — credentials, medical records, legal docs — stored as actual encrypted bytes
  in user-owned Cells, not as IPFS hashes. The user holds the keys; apps request access with a
  witness proof and the Lock Script gates it. Even the app developer cannot read the data
  without the user's cryptographic permission.
ckb_properties:
  - "Cell Model"
  - "First-Class Assets"
  - "Lock/Type Scripts"
  - "1 CKB = 1 Byte"
difficulty: advanced
primitives:
  - "CCC"
  - "ckb-js-vm or Rust scripts"
inspired_by: "Solid (Tim Berners-Lee personal data pods)"
author: "dir"
references:
  - title: "Nervos CKB Docs — Cell Model"
    url: "https://docs.nervos.org/docs/tech-explanation/cell-model"
acceptance_criteria:
  - "A Lock Script that gates read/spend access on a verified witness proof, deployed on CKB testnet."
  - "An SDK that encrypts a payload client-side, stores it in a Cell, and reclaims/decrypts it for the owner."
  - "Demonstrated app-access flow: a second party requests access and is granted (or denied) purely by the Lock Script, with no plaintext ever leaving the owner's control."
  - "Encryption keys are derived from the owner's wallet; the app developer demonstrably cannot decrypt stored data."
  - "Public demo + docs covering the threat model and the on-chain-size vs. cost tradeoff (1 CKB = 1 byte)."
needs_collaborators:
  - "smart-contract"
  - "rust"
  - "frontend"
---

## Problem

Most "decentralized storage" on chains stores a **pointer** — an IPFS or Arweave hash — while
the bytes live somewhere off-chain that the user does not actually own or control. The chain
proves a hash existed; it does not give the user a sovereign, programmable container for the
data itself. On CKB there is no standard for storing *real encrypted personal data* in a Cell
the user owns, with access mediated by script logic rather than by a server's goodwill. Existing
CKB storage examples treat Cells as anchors for hashes, not as the data vault.

## Why CKB

The Cell model is uniquely suited to this. A Cell is a **first-class, owned container**: its
`capacity` is the user's CKB, its `data` is arbitrary bytes, and its `lock` is programmable
access control. Because 1 CKB = 1 byte, the user literally pays for and owns the storage — there
is no landlord. Access is not a database ACL but a Lock Script: to read (spend/reference) the
Cell in a transaction, the spender must satisfy a script that checks a witness proof. This makes
"the app developer cannot access your data" a cryptographic fact, not a privacy policy.

## Spec

- **Data Cell:** `data` holds an encrypted blob (symmetric key wrapped to the owner's key). The
  owner's `lock` is the default sovereign lock; the owner can always spend to update or reclaim
  capacity.
- **Access-grant Lock Script:** an alternate lock (or unlock branch) that authorizes a specific
  requester when the witness carries a valid grant proof — e.g. a signature over `(cell_id,
  requester_pubkey, expiry)` issued by the owner. The script verifies the grant and that the
  requester's signature matches; otherwise it rejects.
- **Key management:** the content key is derived from / wrapped to the owner's wallet key (via
  CCC). Sharing means re-wrapping the content key to the requester's pubkey inside a grant — the
  Lock Script never sees plaintext, only proofs.
- **SDK:** TS helpers for `put(encrypted)`, `grant(requester, scope, expiry)`, `revoke`, and
  `read` (decrypt for owner). Built on CCC.

This is the storage substrate that several other dir ideas can stand on — attestations (idea #7)
that must stay private, and contributor-owned knowledge Cells (idea #8) that the author wants
encrypted rather than public.

## Mini-demo

A "health passport" page: the user encrypts a vaccination record into a Data Cell, then grants a
clinic time-boxed read access. The clinic page presents its grant proof, the Lock Script
verifies it on testnet, and the record decrypts — while a third unauthorized page is rejected by
the same script.

## References / prior art

Compare Solid pods (server-hosted, trust-based) and Ceramic streams. The differentiator here is
that the container *is* an owned on-chain asset with script-enforced access, not an off-chain
store behind a hash.
