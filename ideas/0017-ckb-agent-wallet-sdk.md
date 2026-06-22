---
id: "0017-ckb-agent-wallet-sdk"
title: "CKB Agent Wallet SDK"
status: open
category: "AI Agents"
summary: >
  A programmable wallet library purpose-built for AI agents on CKB. Agents manage Cells, sign
  transactions, open Fiber channels, mint DOBs, and compose OTX intents — all programmatically,
  behind safety rails (spending limits, action whitelists, kill switches). PiPiXia is one agent;
  this is the SDK that lets anyone build CKB-native agents.
ckb_properties:
  - "Cell Model"
  - "Lock/Type Scripts"
  - "Fiber Network"
  - "OTX/CoBuild"
  - "Account Abstraction"
difficulty: intermediate
primitives:
  - "CCC"
  - "Fiber node"
  - "ckb-js-vm"
inspired_by: "Coinbase AgentKit, GOAT SDK, ai16z plugins"
author: "dir"
references:
  - title: "CCC (CKB Connector / common toolkit)"
    url: "https://github.com/ckb-devrel/ccc"
  - title: "Fiber Network"
    url: "https://github.com/nervosnetwork/fiber"
acceptance_criteria:
  - "A TypeScript SDK exposing a high-level Agent wallet over CCC: create/transfer Cells, sign and broadcast transactions, query balance and owned Cells."
  - "First-class actions for at least: opening/using a Fiber payment channel, minting a Spore/DOB, and constructing an OTX intent that another party can complete."
  - "Configurable safety rails enforced before signing: per-period spend limit, action/recipient whitelist, and a kill switch that revokes signing authority."
  - "A pluggable signer interface so an agent can hold keys locally, via a remote KMS, or behind a co-signing policy script."
  - "A worked example agent (e.g. a treasury rebalancer or tip bot) built end-to-end on the SDK and demoed on CKB testnet."
  - "Open-source repo with docs and a quickstart that gets a new agent transacting in under 20 lines."
needs_collaborators:
  - "rust"
  - "smart-contract"
  - "product"
---

## Problem
AI agents that act on-chain need a wallet, but a wallet built for a human and a wallet built for an autonomous program are different things. A human approves each transaction in a UI; an agent decides and signs in a loop, possibly thousands of times a day, with no one watching. On CKB today the only public CKB-native agent is PiPiXia (a single agent wired up via the OpenClaw framework), and Nervos Brain is a docs RAG bot that does not transact at all. There is no reusable library that gives *any* builder an agent-grade wallet with the guardrails autonomy demands. Every team that wants a CKB agent currently rebuilds CCC plumbing, key handling, and ad-hoc spending checks from scratch — and the spending checks are exactly the part you do not want each team improvising.

## Why CKB
CKB's primitives are unusually well suited to programmatic agents. The Cell model means an agent's holdings are explicit, enumerable objects rather than an opaque balance, so an agent can reason about *which* assets it is touching. Lock Scripts make policy programmable: a co-signing or limit-enforcing Lock can refuse to unlock unless the agent's action satisfies on-chain rules, turning "spending limit" from an SDK convenience into a chain-enforced guarantee (a form of account abstraction). Fiber enables sub-cent, high-frequency payments — the natural settlement layer for agents paying for API calls or each other. And OTX/CoBuild lets an agent emit a partial transaction (an *intent*) that other agents or solvers complete, which is the composability substrate agent-to-agent commerce needs (see #20).

## Spec
- **Core wallet:** a thin, typed layer over CCC — `getCells`, `transfer`, `sign`, `send`, balance and UTXO selection tuned for an agent's repeated small actions.
- **Action modules:** opt-in capabilities, each a small interface: `fiber` (open/route/close channel payments), `dob` (mint and transfer Spore/DOBs), `otx` (build an intent others can complete, or complete one).
- **Safety rails:** a policy object evaluated before every signature — `spendLimit` (per token, per window), `allowlist` (recipients / script hashes / action types), and `killSwitch` (a revocable authority). Rails are enforced in the SDK *and*, where possible, mirrored by a co-signing Lock Script so a compromised agent process still cannot exceed policy.
- **Signer abstraction:** `Signer` interface with local-key, remote-KMS, and policy-co-signer implementations.

This SDK is the foundation the other AI Agents ideas build on: #19 (agent state in Cells) uses it to write state transitions, and #20 (agent marketplace) uses its Fiber and OTX modules for per-action payment.

## Mini-demo
Sketch: a 15-line tip bot that watches a feed, and for each qualifying post sends 0.01 CKB over a Fiber channel — constrained by a 5 CKB/hour spend limit and an allowlist, with a kill switch the operator can pull at any time. Demonstrate the limit actually blocking an over-budget action.

## References / prior art
Compare Coinbase AgentKit and the GOAT SDK in EVM/Solana land — agent wallets with action plugins. The differentiator here is CKB's ability to push safety rails down into a Lock Script rather than trusting only the SDK. PiPiXia (OpenClaw) is the existing single-agent reference point; this generalizes that capability into a library.
