---
id: "0011-dob-credential-badge-protocol"
title: "DOB Credential & Badge Protocol"
status: open
category: "Spore/DOB"
summary: >
  Verifiable credentials — course completions, event attendance, skill certs, employment
  history — issued as Spore DOBs organized in Clusters. Fully on-chain and owned by the holder,
  each credential is backed by locked CKB the holder can reclaim by melting. Zero transfer fees
  mean credentials move freely between wallets and apps.
ckb_properties:
  - "Spore/DOB"
  - "First-Class Assets"
  - "Cell Model"
  - "1 CKB = 1 Byte"
difficulty: good-first
primitives:
  - "Spore SDK"
  - "CCC"
inspired_by: "Soulbound Tokens, POAP, W3C Verifiable Credentials"
author: "dir"
references:
  - title: "Spore Protocol"
    url: "https://spore.pro"
  - title: "Spore docs"
    url: "https://docs.spore.pro"
acceptance_criteria:
  - "Issuers can create a Cluster representing a credential program (e.g. a course or event)."
  - "Recipients receive a Spore DOB credential under that Cluster, held by the recipient's own Lock."
  - "A DOB credential schema encoding issuer, credential type, subject, and issue date, verifiable by any reader."
  - "Holders can melt a credential to reclaim the CKB capacity that backs it."
  - "A query/verify library that, given a holder address, lists their credentials and the Cluster (issuer) each belongs to."
  - "Deployed and demoed on CKB testnet with docs."
needs_collaborators:
  - "smart-contract"
  - "frontend"
---

## Problem

Credentials today live in issuer databases (a university portal, an event platform, an HR system).
The holder does not own them, cannot port them, and depends on the issuer staying online to prove
they exist. POAP-style on-chain badges fixed availability but most are rows in a shared contract
with no intrinsic value and awkward portability. On CKB, UGMP makes Spore minting easy and idea #7
(on-chain attestation protocol) covers general composable claims — but there is no
credential-specific standard that organizes issuers into Clusters, gives each credential
CKB-backed value, and lets holders reclaim that value. The gap is a portable, holder-owned
credential standard with economics built in.

## Why CKB

A Spore DOB credential is a first-class asset held by the recipient's own Lock — the holder
genuinely owns it, not the issuer. Clusters give a natural grouping: one Cluster per course,
event, or employer, so a credential's provenance is structural rather than a claimed string.
Because storage is capacity (1 CKB = 1 byte), every credential is backed by locked CKB the holder
can reclaim by melting it — credentials are not free junk, they carry intrinsic value. And CKB's
zero transfer fees mean a credential can move between a holder's wallets or into a third-party app
without friction.

## Spec

- **Issuer Cluster:** an issuer creates a Spore Cluster describing a credential program (name,
  issuer identity, rules).
- **Credential DOB:** minted under the Cluster, owned by the recipient's Lock. DOB `data`/DNA
  encodes credential type, subject, issue date, and any program-specific fields.
- **Melt-to-reclaim:** the holder can melt their credential to recover the backing CKB capacity,
  per Spore's standard melt flow.
- **Verify library:** thin TS layer over the Spore SDK / CCC to issue, list-by-holder, and verify
  a credential's Cluster lineage.

This is a natural consumer of idea #7's attestation primitives, and a builder-reputation feature
(e.g. in `dir` itself) would consume credentials issued here to assemble a verifiable track record.

**Good first slice.** Use the existing Spore SDK to mint a single credential DOB under one Cluster
to a recipient address, plus a page that lists a holder's credentials and offers melt-to-reclaim.
That's a complete, demoable contribution on testnet; the verify library, multi-program Clusters,
and reputation wiring can come as follow-up PRs.

## Mini-demo

Sketch: an issuer page creates a "CKB Bootcamp 2026" Cluster and mints completion DOBs to
attendee addresses; a holder profile page lists credentials grouped by issuer Cluster and offers a
"melt to reclaim CKB" action.

## References / prior art

See frontmatter. Compare Soulbound Tokens and POAP (no intrinsic value, weaker portability) and
W3C Verifiable Credentials (off-chain data model) — this gives credentials CKB-backed value and
on-chain permanence.
