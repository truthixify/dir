---
id: "0004-script-fuzzer"
title: "Script Fuzzer & Formal Verification Tool"
status: open
category: "Developer Tooling"
summary: >
  Automated fuzzing and property-based testing built for CKB scripts. Lock scripts
  are powerful but unforgiving — a bug can permanently freeze assets. This tool
  generates adversarial transactions and checks for freeze conditions, integer
  overflow, and replay vulnerabilities before code reaches mainnet.
ckb_properties:
  - "Lock/Type Scripts"
  - "RISC-V VM"
  - "Cell Model"
  - "Off-chain Compute / On-chain Verify"
difficulty: advanced
primitives:
  - "Rust / ckb-std"
  - "ckb-debugger"
inspired_by: "Echidna / Foundry fuzzing (Ethereum), libFuzzer property testing"
author: "dir"
references:
  - title: "ckb-debugger (execution engine for harnessing scripts)"
    url: "https://github.com/nervosnetwork/ckb-standalone-debugger"
  - title: "CKB RFCs (script validation model)"
    url: "https://github.com/nervosnetwork/rfcs"
acceptance_criteria:
  - "A test harness that takes a compiled CKB script and a transaction template, then generates randomized/adversarial inputs (witnesses, capacities, cell data, script args) and runs them through the VM."
  - "Built-in property checks for at least: asset-freeze conditions (no valid unlock witness exists), integer overflow/underflow in capacity or amount arithmetic, and replay/witness-reuse across transactions."
  - "Coverage-guided generation (e.g. tracking executed VM basic blocks / cycle paths) so the fuzzer explores deeper script logic over time."
  - "Minimized, reproducible counterexample output: a concrete transaction that triggers each finding, replayable in ckb-debugger."
  - "Worked examples fuzzing at least two real script types (one lock, one type script) with at least one genuine bug class demonstrated and explained."
  - "Open-source repo with docs and CI integration example."
needs_collaborators:
  - "rust"
  - "smart-contract"
  - "research"
---

## Problem
On CKB, a lock script decides whether assets can ever move. If it is buggy, assets can be frozen permanently — there is no admin override. The community has repeatedly noted that "lock scripts are powerful but unforgiving," and contract fuzz testing has been flagged as ongoing core-team work, but there is no public, reusable fuzzing/property-testing tool that ecosystem developers can drop into their own projects. Today most teams rely on hand-written happy-path unit tests, which systematically miss the adversarial inputs an attacker (or an unlucky user) will actually produce.

## Why CKB
CKB scripts run on a deterministic RISC-V VM, which is ideal for fuzzing: execution is reproducible, cycle accounting is exact, and basic-block coverage can guide input generation. The validation model is uniform — a script's entire job is to inspect a transaction (inputs, outputs, witnesses, deps) and return pass/fail — so a generic harness can drive *any* script with the same interface. And because the failure mode that matters most here, asset freeze, is a precise, checkable property ("does there exist a witness that unlocks this Cell?"), it maps directly onto property-based testing rather than vague heuristics.

## Spec
- **Harness:** load a compiled script binary plus a transaction template describing which fields are fixed and which are fuzzable (witness bytes, args, capacities, cell data, sibling cells).
- **Generators:** randomized and boundary-biased inputs (zero, max u64, off-by-one capacities, malformed witnesses, duplicated cells), plus structure-aware mutation of known-good transactions.
- **Coverage feedback:** instrument the VM run (via `ckb-debugger`/a custom runner) to record executed basic blocks or cycle traces, and prioritize inputs that reach new code.
- **Property oracles:** (1) *freeze* — search for the absence of any unlocking witness for a Cell created by the script; (2) *arithmetic* — detect overflow/underflow in capacity and token-amount math; (3) *replay* — detect when a witness valid for one tx is accepted in another context.
- **Reporting:** for each violation, emit a minimized, reproducible transaction replayable in the visual debugger (idea #1).

## Mini-demo
Sketch: point the fuzzer at a custom token type script with a transaction template marking the amount fields fuzzable. Within minutes it produces a transaction where two inputs' amounts sum past `u64::MAX`, wrapping to a small value and minting tokens for free — output as a concrete, replayable counterexample.

## References / prior art
Echidna and Foundry's fuzzer established property-based fuzzing for EVM contracts; this brings the same discipline to CKB's Cell/script model. Pairs with idea #1 (Visual Debugger) for inspecting counterexamples and idea #2 (Script Registry), where audited, fuzz-tested scripts could carry their test corpus as metadata.
