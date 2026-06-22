---
id: "0018-ai-script-auditor"
title: "AI Script Auditor"
status: open
category: "AI Agents"
summary: >
  An AI-powered analyzer for CKB Lock and Type Scripts that flags vulnerabilities before
  deployment: Cell-freeze conditions, replay attacks, unauthorized Cell consumption, arithmetic
  overflow, and OTX-specific exploits (instruction-list reuse, Cell-grouping abuse). Lock scripts
  are powerful but unforgiving — this catches bugs before they freeze assets permanently.
ckb_properties:
  - "Lock/Type Scripts"
  - "RISC-V VM"
  - "Cell Model"
  - "OTX/CoBuild"
difficulty: advanced
primitives:
  - "Rust / ckb-std"
  - "ckb-debugger"
  - "LLM (Claude)"
inspired_by: "Slither, MythX, and LLM-assisted Solidity auditors"
author: "dir"
references:
  - title: "ckb-debugger (script execution / harnessing)"
    url: "https://github.com/nervosnetwork/ckb-standalone-debugger"
  - title: "CKB RFCs (script validation model)"
    url: "https://github.com/nervosnetwork/rfcs"
acceptance_criteria:
  - "A tool that ingests CKB script source (Rust/ckb-std or ckb-js-vm) and/or a compiled binary and produces a structured findings report."
  - "Detectors for at least: asset-freeze conditions, witness replay/reuse, unauthorized Cell consumption (missing ownership/authority checks), and integer overflow/underflow in capacity or amount math."
  - "At least one OTX/CoBuild-specific detector covering a real class of issue from the streaming prototype (e.g. instruction-list reuse across OTXs, or Cell-grouping that lets one party's input satisfy another's constraint)."
  - "Each finding includes severity, the offending code/location, an explanation, and where feasible a concrete adversarial transaction (replayable in ckb-debugger) that demonstrates it."
  - "An LLM-assisted pass that explains findings in plain language and suggests fixes, grounded in (not hallucinating beyond) the static/dynamic evidence."
  - "Evaluated against a corpus of known-vulnerable scripts with a documented true/false-positive rate, plus open-source repo and CI usage example."
needs_collaborators:
  - "rust"
  - "smart-contract"
  - "research"
---

## Problem
On CKB, a Lock Script is the only thing standing between assets and a permanent freeze — there is no admin key, no upgrade, no rescue. A single missing check or an overflow in amount math can lock funds forever or let an attacker drain a Cell. The CKB community repeatedly warns that "lock scripts are powerful but unforgiving," yet the tooling to catch these mistakes pre-deployment is thin. The existing CKB AI work does not address this: PiPiXia is a transacting agent (via OpenClaw), and Nervos Brain answers docs questions — neither reads your script and tells you it will freeze assets. Meanwhile OTX/CoBuild introduces a whole new surface (composed partial transactions) where prototypes have already surfaced subtle bugs like instruction-list reuse and Cell-grouping exploits that a happy-path test will never reach.

## Why CKB
The CKB validation model is uniform and analyzable: every script's job is to inspect a transaction (inputs, outputs, witnesses, deps) and return pass/fail on a deterministic RISC-V VM. That uniformity is exactly what makes automated auditing tractable — there is one well-defined question ("under what inputs does this script wrongly pass or wrongly fail?") rather than a sprawl of host APIs. Determinism and exact cycle accounting mean a candidate exploit can be *executed* and confirmed, not just guessed. And the highest-stakes failure, asset freeze, is a precise property ("does any unlocking witness exist?"), which an analyzer can target directly rather than via vague heuristics. The OTX-specific risks are CKB-native and have no EVM analogue, so they need a CKB-native auditor.

## Spec
- **Ingestion:** parse Rust/ckb-std or ckb-js-vm source for static analysis, and load the compiled binary for dynamic checks via ckb-debugger.
- **Static detectors:** pattern and dataflow checks — missing ownership/authority verification (unauthorized Cell consumption), unchecked arithmetic on capacities/amounts, witness fields used without binding to the transaction (replay), and unreachable/contradictory unlock paths (freeze).
- **OTX detectors:** model the composed-transaction setting — flag instruction lists reused across OTXs, Cell groupings where one OTX's constraint is satisfiable by another's cells, and signatures that do not cover the fields an honest signer assumed.
- **Dynamic confirmation:** for each candidate, synthesize an adversarial transaction and run it through the VM to confirm exploitability; emit a minimized, replayable counterexample.
- **LLM layer:** Claude summarizes findings, ranks severity, and proposes fixes — strictly grounded in the static/dynamic evidence so explanations stay faithful.

This pairs directly with idea #4 (Script Fuzzer): the fuzzer searches the input space for crashes/freezes, while the auditor reasons about code structure and OTX composition. Together they form a pre-deployment safety net, and findings can be inspected in idea #1 (Visual Debugger).

## Mini-demo
Sketch: run the auditor on a custom token Type Script that sums input amounts without overflow checks. It flags the arithmetic, then produces a transaction where two inputs sum past `u64::MAX` to mint tokens for free — with a plain-language explanation and a one-line suggested fix (checked addition).

## References / prior art
Slither and MythX brought static/dynamic analysis to Solidity; recent LLM-assisted auditors layer explanation on top. This brings that discipline to CKB's Cell/script model and extends it to OTX/CoBuild, which has no equivalent elsewhere.
