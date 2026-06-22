---
id: "0007-on-chain-attestation-protocol"
title: "On-Chain Attestation Protocol"
status: open
category: "On-Chain Storage & Data Ownership"
summary: >
  A composable attestation standard native to CKB. Anyone defines an attestation
  schema (a Type Script); anyone makes attestations (Cells) against it. KYC, skill
  endorsements, audit certs, event attendance — owned by the subject, built on by other apps.
ckb_properties:
  - "Lock/Type Scripts"
  - "Cell Model"
  - "First-Class Assets"
  - "1 CKB = 1 Byte"
difficulty: intermediate
primitives:
  - "CCC"
  - "JoyID"
  - "ckb-js-vm or Rust scripts"
inspired_by: "Ethereum Attestation Service (EAS)"
author: "dir"
references:
  - title: "Ethereum Attestation Service"
    url: "https://attest.org/"
  - title: "HashThis (existing CKB timestamping — the gap this fills)"
    url: "https://github.com/Hanssen0/hashthis"
acceptance_criteria:
  - "A schema-registry Type Script: anyone can register a named attestation schema as a Cell."
  - "An attestation Type Script that validates a Cell against a referenced schema."
  - "Attestations are owned by the subject (subject's Lock) and revocable by the issuer per schema rules."
  - "A reusable SDK/library so another app can issue and query attestations in <50 lines."
  - "Worked example: at least one downstream consumer (e.g. event attendance) built on it."
  - "Deployed and demoed on CKB testnet with docs."
needs_collaborators:
  - "smart-contract"
  - "frontend"
---

## Problem

CKB has timestamping (HashThis) but no general, composable **attestation** standard — the
EAS-equivalent that lets any app say "X attests that Y is true about Z" in a way other apps
can read and build on. Today every app that needs verifiable claims (credentials, KYC,
endorsements, reviews) reinvents its own ad-hoc format. Nothing composes.

## Why CKB

The Cell model makes attestations **first-class assets owned by their subject**, not rows in a
contract's storage. A schema is a Type Script (validation logic); an attestation is a Cell that
references it. Because storage is owned (1 CKB = 1 byte) and logic lives in Type Scripts, the
subject genuinely holds their attestations and can present, port, or melt them — no issuer
database to trust for availability.

## Spec

- **Schema registry:** a Type Script under which each Cell defines a named schema (fields,
  revocability, issuer constraints). Schema Cells are referenced by hash.
- **Attestation Cell:** `data` carries the encoded claim; Type Script enforces it matches the
  referenced schema; Lock is the subject's (ownership) — with an issuer-revocation path if the
  schema allows.
- **SDK:** thin TS layer over CCC for `defineSchema`, `attest`, `revoke`, `query`.

`dir` itself is the first consumer: `wish`, `commit`, `progress`, and `ship` are all attestations
in this protocol (see [`../SPEC.md`](../SPEC.md#5-on-chain-data-model)). Building this well unlocks
ideas #8 (knowledge graph) and #11 (credentials) too.

## Mini-demo

Sketch: a "POAP-style" event-attendance schema, an issuer page that mints attestations to
attendees' addresses, and a verifier page that reads them back.

## References / prior art

See frontmatter. Also compare Verifiable Credentials (W3C) for the data model.
