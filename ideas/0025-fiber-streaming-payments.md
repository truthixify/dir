---
id: "0025-fiber-streaming-payments"
title: "Fiber Streaming Payments"
status: open
category: "Fiber Network"
summary: >
  Continuous payment streams over Fiber channels: pay-per-second for compute time, data feeds,
  content consumption, or service usage. A channel opens and value flows continuously until the
  user stops, metered with Fiber's sub-cent precision and supporting multi-token streams.
ckb_properties:
  - "Fiber Network"
  - "First-Class Assets"
  - "Off-chain Compute / On-chain Verify"
difficulty: advanced
primitives:
  - "Fiber node"
  - "xUDT"
  - "CCC"
inspired_by: "Superfluid (Ethereum streaming payments), adapted for Fiber channels"
author: "dir"
references:
  - title: "Fiber Network"
    url: "https://www.fiber.world"
acceptance_criteria:
  - "A streaming protocol over a Fiber channel that sends incremental micro-payments on a fixed interval (e.g. per second) for the duration of usage."
  - "Start/stop/pause semantics: either party can halt the stream, and the channel state reflects exactly what was consumed at stop time."
  - "A metering model mapping a per-unit rate (per second / per request / per MB) to payment amounts at sub-cent precision."
  - "Provider-side enforcement: service access is cut off promptly when the stream stalls or the payer's channel balance is exhausted."
  - "Multi-token streams: at least CKB and one xUDT can be streamed."
  - "A working demo (e.g. metered API or media playback) running against Fiber testnet, with docs and an SDK."
needs_collaborators:
  - "rust"
  - "research"
  - "product"
---

## Problem

Lots of value on CKB is consumed *continuously* — compute time, a live data feed, video playback,
metered API usage — but there's no way to pay continuously to match. Today you either prepay a
lump sum, post-pay an invoice, or run a subscription, all of which mismatch real usage and lock
funds. There is **no streaming-payment implementation on CKB at all**. Superfluid proved the
demand on Ethereum, but its on-chain-balance-streaming design doesn't translate to CKB's model.

## Why CKB

Fiber is a far better substrate for streaming than on-chain balance accounting. A payment channel
is *already* a running tally between two parties, so streaming is just sending many tiny channel
updates over time — no per-tick on-chain transaction, no gas, and **sub-cent precision** that
makes per-second pricing meaningful. Because Fiber carries First-Class Assets, streams can be
denominated in CKB or xUDT stablecoins. And the pattern is exactly off-chain compute with
on-chain/Fiber-anchored verification: the service runs off-chain, the channel state is the
verifiable, settle-anytime record of what was actually consumed.

## Spec

- **Stream session:** opens against a Fiber channel; the payer authorizes incremental updates at a
  fixed cadence; each tick advances the channel balance by `rate × elapsed`.
- **Control:** start / pause / stop from either side; on stop the latest channel state is the
  final settled amount — no over- or under-payment.
- **Metering:** a rate model (per second, per request, per MB) translated to per-tick amounts at
  sub-cent precision, plus a low-balance signal before exhaustion.
- **Enforcement:** the provider gates access on a live, advancing stream and cuts off promptly on
  stall or empty channel.
- **Multi-token + SDK:** CKB and xUDT streams; a client/provider SDK over CCC and a Fiber node.

Settlement and merchant accounting can lean on idea #24 (Fiber Payment Gateway); metered content
delivery overlaps idea #23 (content gate) when access is time-based rather than per-unlock.

## Mini-demo

Sketch: a GPU/API provider charges 0.001 CKB/second. A user opens a stream and starts a job; value
flows tick-by-tick while it runs and stops the instant they cancel — they pay for exactly the time
used, with no prepaid deposit to reclaim.

## References / prior art

Superfluid for the streaming-money concept on Ethereum; fiber.world for the network. The CKB
difference is that streams are channel updates over Fiber rather than on-chain balance deltas,
making per-second, multi-token payments practical.
