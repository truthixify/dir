---
id: "0027-quantum-safe-lock-script-suite"
title: "Quantum-Safe Lock Script Suite"
status: open
category: "Identity & Security"
summary: >
  Production-ready Lock Scripts implementing post-quantum signatures (ML-DSA, SPHINCS+) with
  real key-management features: M-of-N social recovery, time-locked fallbacks, dead-man
  switches, and key rotation. Quantum Purse is a basic PQ wallet; this is the complete
  programmable key-management system underneath.
ckb_properties:
  - "RISC-V VM"
  - "Lock/Type Scripts"
  - "Header Deps / Time-lock"
  - "Cell Model"
difficulty: advanced
primitives:
  - "Rust / ckb-std"
  - "CCC"
inspired_by: "NIST PQC standards (ML-DSA / FIPS 204, SPHINCS+ / FIPS 205)"
author: "dir"
references:
  - title: "Nervos CKB Docs — RISC-V VM"
    url: "https://docs.nervos.org/docs/tech-explanation/ckb-vm"
  - title: "NIST Post-Quantum Cryptography Standards"
    url: "https://csrc.nist.gov/projects/post-quantum-cryptography"
acceptance_criteria:
  - "A Lock Script verifying at least one NIST PQC signature (ML-DSA or SPHINCS+) inside the CKB-VM, deployed on testnet."
  - "M-of-N social-recovery branch: guardians can collectively rotate the owner key without moving funds off-chain."
  - "Time-locked fallback: if the owner does not transact within N epochs, an alternate spending path activates (verified via Header Deps)."
  - "Key rotation: the owner can replace their PQ public key in place while preserving the Cell's identity and balance."
  - "Benchmark report: cycle counts and on-chain size per scheme, with guidance on cost vs. security tradeoffs (1 CKB = 1 byte)."
  - "Public demo wallet plus docs covering the threat model and an audit-style review of the verifier."
needs_collaborators:
  - "rust"
  - "smart-contract"
  - "research"
---

## Problem

Quantum Purse showed that post-quantum signing is feasible on CKB, but it is a basic wallet:
sign and send. Real custody needs far more than a PQ signature check — it needs recovery when a
key is lost, safe rotation when a key is exposed, and graceful fallbacks when the owner
disappears. No CKB project offers a *complete, programmable, quantum-safe key-management
suite* combining ML-DSA/SPHINCS+ verification with social recovery, time-locks, and dead-man
switches in one set of locks. Without it, "quantum-safe" remains a single feature rather than a
custody system people can actually trust with serious value.

## Why CKB

A CKB Lock Script is arbitrary RISC-V code, so implementing a NIST PQC verifier is a matter of
porting the reference algorithm — no protocol change, no special opcode. The same VM lets the
lock encode rich policy: count guardian signatures, branch on elapsed time, or require a
rotation proof. Header Deps give the script access to block/epoch information, so time-based
logic (inactivity windows, staged fallbacks) is verifiable on-chain rather than trusted to a
server. And because each Cell carries its own lock, every account can run its own custody policy
without a shared global contract.

## Spec

- **PQ verifier core:** a Rust/ckb-std implementation of ML-DSA (and optionally SPHINCS+) that
  validates a witness signature against the owner's PQ public key. Optimized for VM cycle cost.
- **Recovery branch:** an M-of-N guardian set; a quorum of guardian signatures authorizes a key
  rotation (replace the owner pubkey) without relocating funds.
- **Time-locked fallback / dead-man switch:** using Header Deps, if no owner-authorized spend
  has occurred within N epochs, an alternate path (recovery contact, or staged heirs) unlocks.
  This shares the time-lock pattern with the inheritance protocol in #28.
- **Key rotation:** an in-place update path that swaps the PQ public key while preserving the
  Cell identity and capacity.
- **SDK:** CCC-based helpers to assemble guardian transactions, check fallback status, and
  rotate keys.

## Mini-demo

A wallet page backed by an ML-DSA lock. The user signs a transfer with their PQ key; separately,
three of five configured guardians co-sign a recovery that rotates the owner key on testnet.
A second view shows the dead-man switch: after the (test-shortened) inactivity window, the
fallback heir path becomes spendable.

## References / prior art

Quantum Purse (existing basic PQ wallet on CKB) is the closest prior art — this extends it from
a signer into a custody system. Compare smart-contract social recovery (e.g. Argent on Ethereum)
for the recovery UX, and the NIST FIPS 204/205 standards for the signature schemes.
