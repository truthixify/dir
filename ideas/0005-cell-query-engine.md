---
id: "0005-cell-query-engine"
title: "Cell Query Engine (CKB Subgraph)"
status: open
category: "Developer Tooling"
summary: >
  A high-level query layer over ckb-indexer with a GraphQL API, custom filters,
  real-time subscriptions, and computed views. Run compound queries across script
  types, reconstruct historical state, map cross-Cell relationships, and fire
  webhooks — the Cell-model equivalent of The Graph.
ckb_properties:
  - "Cell Model"
  - "Lock/Type Scripts"
  - "1 CKB = 1 Byte"
difficulty: intermediate
primitives:
  - "ckb-indexer"
  - "CCC"
inspired_by: "The Graph (Ethereum)"
author: "dir"
references:
  - title: "The Graph"
    url: "https://thegraph.com/"
  - title: "Nervos CKB docs"
    url: "https://docs.nervos.org"
acceptance_criteria:
  - "A GraphQL endpoint over indexed Cell data supporting compound queries (filter by combinations of lock script, type script, capacity ranges, and cell-data predicates) — not just single lock/type-hash lookups."
  - "Real-time subscriptions: clients can subscribe to new/spent Cells matching a query and receive push updates."
  - "Webhook triggers that POST to a configured URL when a matching Cell appears or is consumed."
  - "Historical state reconstruction: query the set of live Cells matching a filter as of a given block height."
  - "A user-defined view/mapping mechanism so developers can declare derived/computed entities (e.g. balances per address, token totals) maintained incrementally as blocks arrive."
  - "Deployed public demo indexing at least one testnet asset type, with docs and example queries."
needs_collaborators:
  - "rust"
  - "product"
  - "frontend"
---

## Problem
`ckb-indexer` gives you the essentials — find live Cells by lock hash or type hash — but anything richer is left to each application. Want all Cells with a given type script *and* capacity above a threshold *and* a particular data prefix? Want the set of live Cells as of block N? Want a push notification when a specific Cell is spent? Today every team builds that plumbing from scratch against the raw indexer, reinventing pagination, relationship mapping, and reorg handling. There is no shared, declarative query layer — the kind of infrastructure that made dapp development on other chains tractable.

## Why CKB
On EVM chains, application state is reconstructed from *event logs* — which is why The Graph indexes events. On CKB, state *is* the set of live Cells, addressed by their lock and type scripts. That makes a query engine more direct and more powerful: you are querying actual current state, not replaying emitted logs. Because every Cell carries explicit capacity (1 CKB = 1 byte) and structured script fields, rich filters (capacity ranges, script-arg matches, data predicates) are first-class. And because Cells are consumed rather than mutated, historical "as-of-block" queries fall out of indexing the create/spend lifecycle of each Cell.

## Spec
- **Ingestion:** follow the chain (building on `ckb-indexer` or indexing directly), recording each Cell's creation and consumption with block height, with reorg-safe rollback.
- **Query API:** a GraphQL schema exposing Cells with filters on lock script, type script, capacity, cell data (prefix/decoded fields), and `out_point`/tx relationships. Support pagination and ordering.
- **Subscriptions & webhooks:** GraphQL subscriptions for live updates and configurable webhooks for server-to-server triggers.
- **Computed views:** a mapping definition (declarative config or a small handler) that turns matching Cells into derived entities — e.g. an address-balance table or per-type-script supply totals — maintained incrementally and rolled back on reorg.
- **History:** all queries accept an optional block-height parameter to return the live-Cell set as of that height.

## Mini-demo
Sketch: a wallet team registers a computed view that sums the amounts of all live Cells carrying a token's type script, keyed by owner lock. They subscribe to balance changes for one address and wire a webhook so their backend is notified the instant a relevant Cell is spent — no custom indexer, just a query.

## References / prior art
The Graph is the direct cross-ecosystem analogue, but it indexes event logs; this indexes live Cell state, which suits CKB's UTXO-style model better. Complements idea #1 (Visual Debugger) — the query engine finds the transactions worth inspecting — and could expose registry metadata from idea #2.
