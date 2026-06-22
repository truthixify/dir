---
id: "0020-ai-agent-marketplace"
title: "AI Agent Marketplace with Fiber Micropayments"
status: open
category: "AI Agents"
summary: >
  A registry and marketplace where AI agents advertise capabilities as Spore DOBs, users discover
  agents, and payment happens per-action over Fiber micropayments. Reputation lives in on-chain
  Cells, accrued through verified task completions. Sub-cent Fiber payments (e.g. 0.001 CKB per
  API call) make agent-to-agent commerce actually viable.
ckb_properties:
  - "Fiber Network"
  - "Spore/DOB"
  - "Cell Model"
  - "OTX/CoBuild"
  - "First-Class Assets"
difficulty: advanced
primitives:
  - "CCC"
  - "Fiber node"
  - "Spore SDK"
inspired_by: "Virtuals Protocol Agent Commerce Protocol — with Fiber for sub-cent payments and DOBs for identity"
author: "dir"
references:
  - title: "Fiber Network"
    url: "https://github.com/nervosnetwork/fiber"
  - title: "Spore (DOB / on-chain assets)"
    url: "https://github.com/sporeprotocol/spore-sdk"
acceptance_criteria:
  - "An on-chain registry where an agent publishes a capability profile as a Spore/DOB (identity, advertised actions, pricing, endpoint)."
  - "A discovery surface (API + minimal UI) that lets a user or another agent query agents by capability and reputation."
  - "Per-action payment over Fiber: a caller pays a sub-cent amount per request through a payment channel, demonstrated at a price point like 0.001 CKB per call."
  - "Reputation stored in on-chain Cells that increases only via verified task completions (a completion proof, not self-reported)."
  - "An end-to-end demo: agent registers, a second party discovers it, pays per-action over Fiber, the task is verified, and reputation updates on chain."
  - "Open-source repo with docs covering the DOB schema, Fiber payment flow, and reputation model, deployed on CKB testnet."
needs_collaborators:
  - "rust"
  - "frontend"
  - "smart-contract"
  - "product"
---

## Problem
For an agent economy to exist, agents need to find each other, pay each other, and tell who is trustworthy — and all three are unsolved on CKB. The existing CKB AI projects do not provide them: PiPiXia is a single agent (via OpenClaw) with no marketplace around it, and Nervos Brain is a docs RAG bot. More fundamentally, agent-to-agent commerce is throttled everywhere by payments: an agent that wants to charge a fraction of a cent per API call cannot do it on a base layer where each transaction costs real fees and confirmation time. Virtuals Protocol's Agent Commerce Protocol points at the right shape (agents transacting with agents) but inherits L1 cost and latency, so genuinely micro pricing — pay-per-call, pay-per-token — is impractical. Without sub-cent settlement and portable, verifiable reputation, there is no real marketplace, just a directory.

## Why CKB
Fiber is the unlock: a Lightning-style payment network on CKB where channel updates are off-chain and effectively free, making 0.001 CKB per API call a normal transaction rather than an absurd one. That is what turns "agents pay each other per action" from a slogan into something economically real. Spore/DOBs give each agent a first-class on-chain identity and capability profile that the agent owns and can evolve — not a row in the marketplace's database. Cell-based reputation makes trust portable and tamper-evident: it lives with the agent, accrues only through verified completions, and any counterparty can read it directly from chain. And OTX/CoBuild lets a request-and-fulfillment between two agents be composed into atomic, verifiable settlement.

## Spec
- **Agent identity (DOB):** each agent mints a Spore/DOB capability profile — advertised actions, pricing, service endpoint, and a pointer to its reputation Cell.
- **Registry & discovery:** an index over agent DOBs queryable by capability and reputation, exposed as an API plus a minimal browse/search UI.
- **Per-action payment:** the caller opens or reuses a Fiber channel to the agent and pays a sub-cent amount per request; the channel batches many calls with on-chain settlement only at open/close.
- **Reputation:** an on-chain Cell that advances on a *verified* completion — a signed/attestable completion proof from the requester (or an OTX where payment and a completion attestation settle together), not a self-report. Tie this to idea #7 (attestation protocol) for the proof format.
- **Settlement:** request and fulfillment composed via OTX so payment and reputation update are atomic.

This sits on top of idea #17 (Agent Wallet SDK) for the Fiber, DOB, and OTX actions, and trades against the on-chain reputation defined in idea #19 (agent-as-Cells). Agents listed here can have their underlying scripts vetted with idea #18 (AI Script Auditor).

## Mini-demo
Sketch: a translation agent registers a DOB advertising "translate, 0.001 CKB/call." A second agent discovers it, opens a Fiber channel, and fires 200 calls paying sub-cent each — settling on chain only once. On the final verified completion, the translation agent's reputation Cell ticks up, visible to the next buyer browsing the marketplace.

## References / prior art
Virtuals Protocol's Agent Commerce Protocol is the closest analogue; this re-grounds it on Fiber micropayments and Spore DOB identity/reputation so sub-cent, high-frequency agent commerce is actually affordable.
