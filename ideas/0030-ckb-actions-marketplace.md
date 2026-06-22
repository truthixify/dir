---
id: "0030-ckb-actions-marketplace"
title: "CKB Actions Marketplace — Community Task Board"
status: open
category: "Social & Community"
summary: >
  An on-chain task/bounty board where tasks and rewards live in escrow Cells. A poster locks
  CKB into a Cell whose Lock Script releases payment when the task's Type Script verifies the
  completion criteria (confirmed by designated reviewers). No platform ever holds funds;
  contributors claim, complete, and get paid atomically.
ckb_properties:
  - "Cell Model"
  - "Lock/Type Scripts"
  - "First-Class Assets"
difficulty: advanced
primitives:
  - "CCC"
  - "Rust / ckb-std"
inspired_by: "Gitcoin / bounty boards, but with non-custodial Cell escrow"
author: "dir"
references:
  - title: "Nervos CKB Docs — Cell Model"
    url: "https://docs.nervos.org/docs/tech-explanation/cell-model"
  - title: "Nervos CKB Docs — Type Scripts"
    url: "https://docs.nervos.org/docs/tech-explanation/type-script"
acceptance_criteria:
  - "An escrow Cell standard: a poster locks reward CKB with release conditions, deployed on testnet."
  - "A claim flow so a contributor can lock a task to themselves before working (preventing double-claims)."
  - "Conditional release: payment is spendable only when the completion criteria are satisfied and confirmed by the designated reviewer(s)."
  - "Multi-sig reviewer panel: an M-of-N reviewer set arbitrates approval/dispute on-chain."
  - "Reclaim path: if a task expires unclaimed or incomplete, the poster recovers their funds (time-locked)."
  - "A web demo of the full lifecycle (post → claim → submit → review → pay) plus docs; funds are never custodied by the app."
needs_collaborators:
  - "smart-contract"
  - "frontend"
  - "product"
---

## Problem

Bounty and task boards almost always custody money: the platform holds the reward, takes a cut,
and is a single point of failure for disputes, exit scams, and shutdowns. Communities that want
to coordinate paid work have no neutral, non-custodial way to escrow rewards and release them on
verifiable completion. On CKB there is no standard task marketplace where the funds sit in a Cell
the platform cannot touch and release is governed by script logic rather than a company's
dashboard.

## Why CKB

The Cell model makes escrow native: a poster locks reward CKB into a Cell whose **Lock Script is
the escrow agent**. Release conditions live in script — satisfy the completion criteria and
reviewer approval, and the contributor can spend it; otherwise it stays locked or returns to the
poster after a timeout. Because funds are first-class assets owned by the Cell, no platform
balance ever exists to be drained or frozen. Type Scripts can encode the task's verification
rules and an M-of-N reviewer panel can arbitrate on-chain, so payout is atomic with approval —
no "trust us, the payment is coming."

## Spec

- **Task/escrow Cell:** holds the reward CKB; its lock encodes (claimant, reviewer set,
  approval threshold, expiry). `data`/Type Script captures the task spec and completion criteria.
- **Claim:** a contributor binds the task to their lock so it can't be double-claimed while in
  progress.
- **Submit & review:** the contributor references their deliverable; an M-of-N reviewer multi-sig
  approves, which unlocks the spend path to the contributor.
- **Dispute & reclaim:** disputes resolve through the reviewer panel; on expiry without an
  approved completion, a time-locked path returns funds to the poster (same escrow/expiry pattern
  used elsewhere in dir).
- **SDK:** CCC helpers for `postTask`, `claim`, `submit`, `review`, `payout`, and `reclaim`.

This is essentially the same escrow primitive dir's own bounty mechanism uses to fund ideas like
the ones in this directory — see [`../SPEC.md`](../SPEC.md). The expiry/reclaim branch shares the
time-lock pattern from #28. Building it as a general marketplace makes that capability reusable
by any CKB community.

## Mini-demo

A board page: a poster funds a task escrow Cell; a contributor claims it and submits work; two of
three reviewers approve; the contributor sweeps the reward in one transaction. A second flow lets
an unclaimed task expire and the poster reclaims funds — all on testnet, with no app-held balance
at any point.

## References / prior art

Compare Gitcoin and Web3 bounty platforms (custodial or partially custodial). The differentiator
is fully non-custodial Cell escrow with script-enforced, reviewer-gated, atomic payout.
