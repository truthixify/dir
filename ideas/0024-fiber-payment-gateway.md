---
id: "0024-fiber-payment-gateway"
title: "Fiber Payment Gateway"
status: open
category: "Fiber Network"
summary: >
  Complete merchant infrastructure for Fiber: an API to create invoices, process payments, handle
  webhooks, and manage settlements. Merchants integrate with a few API calls and never run a Fiber
  node themselves. Multi-token (CKB + xUDT stablecoins), instant settlement.
ckb_properties:
  - "Fiber Network"
  - "First-Class Assets"
difficulty: intermediate
primitives:
  - "Fiber node"
  - "xUDT"
  - "CCC"
inspired_by: "BTCPay Server / Strike (Lightning), adapted for Fiber multi-token"
author: "dir"
references:
  - title: "Fiber Network"
    url: "https://www.fiber.world"
acceptance_criteria:
  - "A hosted Fiber node (or node pool) abstracted behind a REST/gRPC API so merchants never operate Fiber infrastructure."
  - "Invoice lifecycle endpoints: create invoice, query status, expire, and reconcile."
  - "Signed webhooks on payment events (received, settled, failed) with retry and idempotency."
  - "Multi-token support: invoices denominated in CKB and at least one xUDT (stablecoin), with settlement accounting per token."
  - "A merchant dashboard for keys, invoices, balances, and payout/settlement history."
  - "A drop-in SDK and a working demo store checking out over Fiber testnet, with docs."
needs_collaborators:
  - "rust"
  - "frontend"
  - "product"
---

## Problem

A merchant who wants to accept Fiber payments today has to run and babysit a Fiber node, manage
channels and liquidity, and build all the invoice/webhook/settlement plumbing themselves. The
existing tooling stops short: **fiber-checkout** is a basic React component library for the
front-end button, but there is no backend that actually *processes* payments, fires reliable
webhooks, and reconciles settlements at scale. That backend gap is exactly what kept Lightning
adoption painful until BTCPay Server and Strike existed.

## Why CKB

Fiber's payment channels deliver instant settlement with negligible fees, which is what makes
real commerce — not just tipping — viable on CKB. Crucially, Fiber inherits CKB's **First-Class
Assets**, so the same channel infrastructure moves CKB *and* xUDT tokens, including stablecoins.
That means a merchant can quote and settle in a stable unit while still getting Lightning-class
finality — something Lightning itself (BTC-only) can't natively do. A gateway that abstracts the
node turns all of this into a few API calls.

## Spec

- **Node abstraction:** the gateway operates the Fiber node(s) and channel liquidity; merchants
  see only an API key.
- **Invoice API:** create/query/expire invoices, denominated per token, with metadata and
  callback URLs.
- **Webhooks:** signed, idempotent, retried events for payment received/settled/failed.
- **Multi-token settlement:** per-token balance accounting and payout/settlement records for CKB
  and xUDT stablecoins.
- **Dashboard + SDK:** key management, invoice and balance views, settlement history, and a
  drop-in client that pairs with fiber-checkout on the front end.

This is the natural backend for idea #23 (content gate) and a settlement target for idea #22
(Action Links) invoices.

## Mini-demo

Sketch: a demo storefront calls `POST /invoices { amount, token: "USD-xUDT" }`, renders the Fiber
QR with fiber-checkout, and on payment receives a signed webhook that marks the order paid — all
without the merchant ever touching a Fiber node.

## References / prior art

BTCPay Server and Strike for the Lightning playbook; **fiber-checkout** for the existing front-end
slice this completes; fiber.world for the network. The differentiator is multi-token settlement
over Fiber.
