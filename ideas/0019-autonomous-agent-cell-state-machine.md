---
id: "0019-autonomous-agent-cell-state-machine"
title: "Autonomous Agent with Cell State Machine"
status: open
category: "AI Agents"
summary: >
  An AI agent whose entire operational state lives in CKB Cells — memory, configuration,
  reputation, balance — all first-class, on-chain assets. Every agent action is a CKB
  transaction; agent-to-agent interaction uses OTX composability. Unlike ElizaOS-style agents
  (off-chain state, on-chain wallet only), this agent IS its Cells: verifiable, auditable,
  ownable, transferable.
ckb_properties:
  - "Cell Model"
  - "First-Class Assets"
  - "Lock/Type Scripts"
  - "OTX/CoBuild"
difficulty: advanced
primitives:
  - "CCC"
  - "ckb-js-vm"
inspired_by: "ElizaOS, Virtuals Protocol agents — but with state in CKB Cells"
author: "dir"
references:
  - title: "CCC (CKB common toolkit)"
    url: "https://github.com/ckb-devrel/ccc"
  - title: "CKB RFCs (Cell model / transaction structure)"
    url: "https://github.com/nervosnetwork/rfcs"
acceptance_criteria:
  - "A Cell schema modeling an agent's state — at minimum identity, configuration, a memory/context store, reputation, and balance — with a Type Script defining valid state transitions."
  - "Every agent action is realized as a CKB transaction that consumes the current state Cell(s) and produces the next, so the agent's full history is reconstructable from chain."
  - "State transitions are authority-checked: only the agent's controller (or a delegated policy) can advance state, and invalid transitions are rejected by the Type Script."
  - "Agent-to-agent interaction demonstrated via OTX: one agent emits a partial transaction another completes, updating both agents' state atomically."
  - "An agent is transferable — ownership of the agent (its state Cells) can move to a new controller — and this is demonstrated."
  - "A running reference agent on CKB testnet with docs, plus a viewer that renders an agent's state and history from chain."
needs_collaborators:
  - "rust"
  - "smart-contract"
  - "research"
---

## Problem
Today's on-chain AI agents are mostly off-chain programs with a wallet bolted on. ElizaOS and Virtuals-style agents keep their memory, personality, and reputation in a server database; the blockchain sees only the agent's transfers. That means the interesting part of the agent — what it knows, how it has behaved, how much it can be trusted — is neither verifiable nor portable, and dies with the operator's server. On CKB specifically, the existing agent work does not close this gap: PiPiXia is a single agent operated through OpenClaw, and Nervos Brain is a docs RAG bot. Neither makes the agent's *state itself* an on-chain, ownable object. There is no pattern for an agent that you can audit, transfer, or trustlessly reason about because its state is on chain.

## Why CKB
CKB's Cell model is, in effect, a general state machine: a transaction consumes input Cells and produces output Cells, with Type Scripts deciding which transitions are valid. That maps almost exactly onto an agent's lifecycle — current state in, validated next state out. Because Cells are first-class assets with explicit ownership (Lock Scripts), the agent's memory and reputation become things someone genuinely *owns* and can transfer, not rows in a private DB. The append-only transaction history gives a tamper-evident audit log of every decision the agent made. And OTX/CoBuild lets two agents' state transitions be composed into one atomic transaction, so agent-to-agent interactions settle without a trusted intermediary. No account-based chain gives you "the agent IS its state objects" as cleanly.

## Spec
- **State Cells:** an agent is a set of Cells — an identity/config Cell, one or more memory Cells (chunked context, embeddings or hashes thereof), a reputation Cell, and a balance Cell. Large memory can be content-addressed off-chain with on-chain commitments.
- **Transition Type Script:** validates every advance — checks the controller's authority, enforces monotonic rules (e.g. reputation only changes via accepted interactions), and rejects malformed next-states.
- **Action = transaction:** the agent's reasoning loop ends by building a transaction that consumes its current state Cells and produces the next; the chain is the source of truth, so the agent can be rehydrated entirely from chain on restart.
- **Agent-to-agent via OTX:** agent A emits a partial transaction (an intent) referencing its state; agent B completes it, atomically updating both agents' reputation/balance.
- **Ownership/transfer:** the controlling Lock can be reassigned, transferring the agent.

This builds on idea #17 (Agent Wallet SDK) for transaction construction and signing, and its on-chain reputation is the substrate idea #20 (Agent Marketplace) trades against. State transitions can be vetted with idea #18 (AI Script Auditor) before deployment.

## Mini-demo
Sketch: a minimal agent with a reputation Cell starts at 0. It completes a task for another agent via an OTX; on completion both agents' state Cells advance in one transaction, bumping reputation by 1. The viewer replays the agent's entire history from chain — every memory update and reputation change — then the agent is transferred to a new controller and continues running unchanged.

## References / prior art
ElizaOS and Virtuals Protocol popularized autonomous on-chain agents but keep core state off-chain. The contribution here is treating the Cell model as the agent's state machine so the agent is fully on-chain, auditable, and transferable.
