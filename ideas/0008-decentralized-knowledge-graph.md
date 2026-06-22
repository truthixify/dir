---
id: "0008-decentralized-knowledge-graph"
title: "Decentralized Knowledge Graph"
status: open
category: "On-Chain Storage & Data Ownership"
summary: >
  CKB literally stands for Common Knowledge Base. This is a protocol for storing, linking, and
  querying verified knowledge claims as typed Cells — each claim referencing its sources via
  Cell Deps, each contributor owning their own claims. A cryptographically-proven,
  contributor-owned knowledge network.
ckb_properties:
  - "Cell Model"
  - "Cell Deps"
  - "Lock/Type Scripts"
  - "First-Class Assets"
  - "1 CKB = 1 Byte"
difficulty: advanced
primitives:
  - "CCC"
  - "ckb-indexer"
inspired_by: "Wikidata + Semantic Web (RDF triples)"
author: "dir"
references:
  - title: "Nervos CKB Docs — Cell Model"
    url: "https://docs.nervos.org/docs/tech-explanation/cell-model"
acceptance_criteria:
  - "A claim Type Script that validates structure and enforces citation rules (a claim must reference its source Cells via Cell Deps)."
  - "Claims are owned by their contributor (contributor's Lock) and are individually addressable on-chain."
  - "An indexer + query layer that can traverse the graph (e.g. 'all claims citing claim X', 'provenance chain of claim Y')."
  - "At least one verification standard demonstrated (e.g. attestation-backed claims, building on idea #7)."
  - "Deployed on CKB testnet with a public demo that adds a claim, links sources, and queries the graph."
  - "Docs covering the schema, citation model, and storage-cost implications (1 CKB = 1 byte)."
needs_collaborators:
  - "smart-contract"
  - "research"
  - "frontend"
---

## Problem

Knowledge bases today (Wikidata, Wikipedia, academic citation graphs) are centrally hosted: the
graph structure and the provenance live in someone's database, claims are not individually owned,
and citation integrity depends on the host. There is no system where a knowledge claim is a
first-class, owned, independently-verifiable object whose links to its sources are tamper-proof.
On CKB — whose name is *Common Knowledge Base* — this is the obvious primitive, but nothing
exists that turns claims into typed, linked, contributor-owned Cells.

## Why CKB

Two CKB features map directly onto a knowledge graph. **Cell Deps** are how a transaction
references other Cells without consuming them — exactly the semantics of a citation: a claim Cell
is created in a transaction that *deps on* the source Cells it cites, so the link is recorded in
the claim's own provenance and cannot be silently rewritten. **Type Scripts** enforce the rules
of valid knowledge — required fields, that cited sources actually exist, that verification
standards are met. And because each claim is its own Cell with the contributor's Lock, knowledge
is **owned by its author** (1 CKB = 1 byte), not pooled in a host's table.

## Spec

- **Claim Cell:** `data` encodes the claim (subject–predicate–object, or a richer schema) plus
  references to the source Cells it relies on. Lock = contributor's. Type Script validates the
  schema and the citation rules.
- **Citation via Cell Deps:** the transaction that mints a claim includes its sources as Cell
  Deps; the claim's `data` records their out-points/hashes so provenance is permanent and
  traversable. A claim that fails to cite required sources is rejected by its Type Script.
- **Verification standards:** a claim can carry attestations (from idea #7) — peer review,
  source-quality endorsements — so callers can filter the graph by trust level.
- **Query layer:** an indexer (ckb-indexer + a graph index) exposes traversals: forward
  ("what does this cite"), backward ("what cites this"), and provenance chains.

This builds directly on idea #7 (attestations) for the verification dimension and can store
private or large claim bodies in idea #6 (sovereign data cells).

## Mini-demo

A "fact with footnotes" page: a contributor publishes a claim ("Statement S"), selecting two
existing claim Cells as sources. The mint transaction deps on those sources; the resulting claim
shows its provenance chain, and a query view lists everything that cites it.

## References / prior art

Compare Wikidata (centralized), RDF / the Semantic Web (data model, no ownership or integrity
guarantees), and academic citation graphs. The novelty is contributor-owned claims with
Cell-Dep-anchored citations on a PoW-secured chain.
