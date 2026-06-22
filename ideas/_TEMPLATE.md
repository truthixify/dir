---
# Copy this file to ideas/<NNNN>-<kebab-title>.md and fill it in.
# Frontmatter is validated by schema/idea.schema.json. Keep keys in this order.

id: "0000-your-idea-slug"        # zero-padded number + kebab slug; must match filename
title: "Your Idea Title"
status: draft                    # draft → set to `open` on merge
category: "Developer Tooling"    # one of the enum in schema/idea.schema.json
summary: >
  One or two sentences. This is the pitch shown in the catalog list.
ckb_properties:
  - "Cell Model"                 # one or more; see schema enum
difficulty: intermediate         # good-first | intermediate | advanced
primitives:                      # optional: building blocks a builder needs
  - "CCC"
inspired_by: ""                  # optional: cross-ecosystem analogue
author: "your-handle"            # for attribution
references:                      # optional but encouraged
  - title: "Relevant forum thread / docs"
    url: "https://example.com"
forkable_starter: ""             # optional: URL to a degit-able scaffold
acceptance_criteria:             # REQUIRED. This is the bounty release condition.
  - "A concrete, verifiable thing that must be true for this to count as shipped."
  - "Another one. Be specific — curators check the project against this list."
needs_collaborators: []          # optional: rust | frontend | design | ...
---

## Problem

What's missing today? What do builders / users currently do instead, and why is that bad?
If something *partially* exists on CKB, name it and explain the gap precisely.

## Why CKB

Why does this belong on CKB specifically? Which property (from `ckb_properties`) makes it
possible or better here than elsewhere?

## Spec

The shape of the thing. Key Cells / scripts / flows. Enough that a builder knows where to start —
not a full design doc.

## Mini-demo

Optional: link a testnet demo, a GIF, or a sketch of the core interaction.

## References / prior art

Anything not already in frontmatter `references` worth reading.
