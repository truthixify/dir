---
id: "0001-cell-transaction-visual-debugger"
title: "Cell Transaction Visual Debugger & Simulator"
status: open
category: "Developer Tooling"
summary: >
  An interactive GUI that visualizes Cell consumption/creation flows, script
  execution traces, and cycle costs. See exactly which Cells are consumed, which
  are created, what data changes, and why a script fails — graphically, not as raw
  terminal output.
ckb_properties:
  - "Cell Model"
  - "Lock/Type Scripts"
  - "RISC-V VM"
  - "1 CKB = 1 Byte"
difficulty: advanced
primitives:
  - "ckb-debugger"
  - "CCC"
  - "ckb-indexer"
inspired_by: "Tenderly transaction simulator (Ethereum)"
author: "dir"
references:
  - title: "ckb-debugger (nervosnetwork/ckb-standalone-debugger)"
    url: "https://github.com/nervosnetwork/ckb-standalone-debugger"
  - title: "Nervos CKB docs"
    url: "https://docs.nervos.org"
acceptance_criteria:
  - "Load a transaction (by testnet/mainnet hash, or a local tx JSON / CCC-built skeleton) and render inputs and outputs as a visual Cell graph."
  - "For each Cell, display capacity, lock/type script, and a diff of cell data between consumed inputs and created outputs."
  - "Run each input's lock/type scripts through ckb-debugger and surface the per-script exit code, cycle count, and the failing instruction/step on error."
  - "Provide a step-through view of a script's execution trace (registers/PC/syscalls) linked back to source where debug symbols exist."
  - "Deployed as a public web app (or installable desktop app) with a hosted demo and docs; works on at least one real testnet transaction end to end."
needs_collaborators:
  - "frontend"
  - "rust"
  - "design"
---

## Problem
Debugging a CKB transaction today means reading raw output. `ckb-debugger` is powerful but CLI-only: it dumps cycle counts, exit codes, and register/PC state as text, leaving the developer to reconstruct the actual Cell flow in their head. CKB Studio (Obsidian Labs) attempted a visual IDE but was abandoned years ago. There is no maintained tool that shows, graphically, which Cells a transaction consumes and creates, how their data changes, and where a script execution diverges from the expected path. New developers hit a wall precisely because the Cell model and script-validation model are unfamiliar and invisible.

## Why CKB
The Cell model is inherently a *graph*: inputs are consumed Cells, outputs are created Cells, and validity is decided by lock and type scripts running on the RISC-V VM. That structure is far more legible visually than as JSON. Because CKB scripts run on a real RISC-V VM with deterministic cycle accounting, an execution trace is reproducible and step-by-step inspectable — unlike opaque gas estimation. And since 1 CKB = 1 byte, capacity accounting is concrete and worth surfacing directly (a Cell that is "too small" to hold its own data is a common, confusing failure this tool can flag).

## Spec
- **Transaction loader:** accept a tx hash (resolve via RPC/indexer), a raw tx JSON, or a transaction skeleton built with CCC. Resolve all input `OutPoint`s to their full Cells and resolve cell deps.
- **Cell graph view:** render inputs on the left, outputs on the right, with edges where capacity/data flows. Each Cell node shows capacity (with a 1-byte = 1-CKB occupancy bar), lock script, type script, and a truncated data preview.
- **Data diff:** for cells that are logically "updated" (same lock/type, mutated data), show a byte/field-level diff.
- **Script runner:** wrap `ckb-debugger` (compiled to a service or WASM) to execute each lock and type script. Report exit code, cycle count, and on failure the failing step.
- **Trace stepper:** a timeline of VM steps (PC, registers, syscalls like `load_cell_data`, `load_witness`). Where DWARF/debug info is available, map steps to source lines.
- **Simulate edits:** let the user tweak a witness, capacity, or cell data and re-run, to test "what if" scenarios before broadcasting.

## Mini-demo
Sketch: paste a failing testnet tx hash. The graph shows three input Cells and two outputs; one output's capacity bar is red because its data exceeds its capacity. The script panel shows the type script exiting with a non-zero code; clicking it opens the trace, which halts at a `load_cell_data` syscall — instantly revealing the under-funded output as the root cause.

## References / prior art
Tenderly's transaction simulator and debugger set the bar for EVM; this is the Cell-model analogue. See `ckb-debugger` for the underlying execution engine, and CCC for building/loading transactions. Pairs naturally with idea #4 (Script Fuzzer): the fuzzer finds bad inputs, this tool explains why they break.
