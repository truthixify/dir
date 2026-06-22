# dir — Design System Brief

## 0. Read this first

This brief is the source of truth for how **dir** looks and feels. It borrows the *bones* of a brutalist on-chain manifest aesthetic — type-as-decoration, layered borders, squared corners, mono metadata, loud semantic color — but everything here is dir-specific, and the **color system is deliberately its own**.

A few decisions already made for you (documented in §12 so the next designer understands the why):

- **Dark — black background.** Warm near-black ground, light ink stamped on top. The "registry stamped in light" metaphor *is* the design. The site (`site/`) is skinned to this system.
- **The metaphor is a registry, not a shipping yard.** dir is a catalog of ideas you can browse, stamp a claim on, fund, and mark shipped. Every idea is a *manifest document*. Lean into ledgers, index cards, catalog drawers, registration stamps, technical drawings — rendered in light line-work on black.
- **Color is a state machine, not decoration.** dir has a real lifecycle (open → claimed → building → shipped, plus expired/superseded), a commitment ladder (watching → committed → staked → backed), a demand signal (wish), and value locked (stake/bounty). Each gets exactly one color. Never two state colors on one card.

If something here is ambiguous, resolve it toward the visual principles in §2 (black ground, squared corners, layered borders, type-as-decoration, semantic color). Make the call, note it, ship.

---

## 1. What dir is

dir is an open directory of **CKB-native project ideas** where builders publicly commit, build, and ship — on-chain. It is also a CKB app in its own right: commitments, wishes, stakes, and bounties are real attestations and Cells (it dogfoods the very ideas it lists). See `SPEC.md` for mechanics. The short version:

- **Ideas** are catalog entries (`#0007`, a category, CKB properties, difficulty, acceptance criteria, spec).
- **Builders** browse, **wish** for ideas (demand), **commit** to build one (a public on-chain attestation with a deadline), optionally **stake** CKB to claim it exclusively, and **ship** it — closing the loop.
- **Funders** put **bounties** on ideas they want built. A lapsed staked claim can convert into a bounty for the next builder.
- **Commitment tiers** (Watching / Committed / Staked / Backed) are emergent from on-chain state.
- Ideas are **CC0**; projects built from them belong to their builders.

### The surfaces we design

Marketing landing · Idea catalog (board) · Idea detail · Builder directory · Builder profile · Funder/Poster profile · Submit-idea flow · Commit & stake flow · Fund-a-bounty flow · Showcase (shipped projects) · Ecosystem-gap board · Composition graph · Activity feed · My dir (dashboard) · Notifications · Settings · Docs.

---

## 2. Visual direction

In one phrase: **a builder's registry, stamped in light on black.**

Brutalist structure (hairline borders, mono stamps, dense data) carries the catalog; editorial confidence carries the marketing. The ground is a warm near-black; structure is light line-work; and on top sits a **saturated riso-ink accent system** — print inks that glow on black — coding every state of the directory.

### The five rules

1. **Dark mode primary.** Warm near-black background everywhere. No light mode in scope.
2. **Squared corners only.** `border-radius: 0` on everything — buttons, cards, inputs, badges, tags, tabs. The only round things are true circles (pulse dots, monogram bullets).
3. **Layered borders.** Primary cards use concentric borders separated by ground gaps: a strong outer border → a 6–8px gap of black showing through → a hairline → internal hairline rules. This is the **manifest pattern** (§6). More layers is fine.
4. **Type-as-decoration.** Mono caps stamps, form footers, page numbers, ID tabs, index labels. Every primary card ends in a mono caps **form footer**. The chrome is the look.
5. **Semantic riso-ink color.** Violet is the brand. Each state hue (cyan / amber / jade / magenta / crimson) maps to one marketplace state and glows on black — but is never decorative.

### What we are not doing

- No glassmorphism, frosted glass, or backdrop-blur.
- **No neon-on-black crypto aesthetic.** We are on black, but the accents are *print inks*, not glows — flat, saturated fills, never haloed or bloomed. No glow shadows, no `text-shadow`.
- No gradient meshes or animated gradient backgrounds.
- No drop shadows — we use **offset solid color blocks** as "lift" (§6).
- No rounded corners. No serif. No script.
- No 3D blobs, isometric art, glossy coins, or sparkle/brain/robot "AI" clichés.
- No stock-photo avatars — builders and agents get a **monogram in a square**.
- No emoji in product surfaces.

---

## 3. Color system

This is dir's palette and it is intentionally its own: **a single riso-print ink family** spread around the wheel, glowing on a warm near-black ground. dir's brand is **violet**, and its states run cyan → amber → jade → magenta → crimson.

Why these read as one family: every accent shares a high, print-ink chroma and is tuned to one luminance band that sits cleanly on black, so they harmonize like a set of riso drums rather than random swatches. The neutrals (the black ground, the surface lift, lines, text) are all warm-shifted so the whole thing feels like ink stamped on warm paper stock that happens to be black.

### Core tokens

| Token | Hex | Role |
|---|---|---|
| `bg` | `#15130F` | Primary background — the dark paper ground |
| `surface` | `#15130F` | Card/section fills share the paper; borders define them |
| `surface-2` | `#1E1B15` | Muted areas — filter bar, table-row hover, code |
| `line` | `#F4F1E8` (ink) | Structural borders are cream ink — full or low-opacity, never brown |
| `hairline` | `rgba(244,241,232,.14)` | Soft inner dividers (ink at 14%) |
| `text` | `#F4F1E8` | Primary type (warm off-white) |
| `muted` | `#9A9588` | Secondary text, mono labels, form footers, timestamps |
| `violet` | `#7B6BF7` | **Brand.** Links, L-brackets, ID tabs, registration marks, primary accent — "the dir color" |
| `cyan` | `#2FCBE6` | **Wish / demand** — "people want this" |
| `amber` | `#F2A516` | **In progress** — claimed / building / assigned (fill only) |
| `jade` | `#2DD69A` | **Shipped** — done, loop closed, success |
| `magenta` | `#F55AA6` | **Value locked** — staked, funded, live bounty (skin in the game) |
| `crimson` | `#F26477` | **Alarm** — expired / abandoned / disputed / superseded |

### Text-on-fill rule

State colors are tuned to glow on the black ground and are **usable as text/icons on black directly** — no separate dark-text variants needed (the previous light system needed them; this one doesn't), with one exception:

- **Bright fills carry black (`bg`) text:** `amber`, `jade`, `cyan`. (`amber` is **fill-only** — never amber type on black.)
- **Deep fills carry light (`text`) text:** `violet`, `magenta`, `crimson`.

### Soft wells (low-intensity tinted backgrounds)

For hover wells, selected rows, chart fills, and quiet status zones — deep, desaturated versions that sit just above `bg`:

`violet-well rgba(123,107,247,.14)` · `cyan-well rgba(47,203,230,.13)` · `amber-well rgba(242,165,22,.13)` · `jade-well rgba(45,214,154,.13)` · `magenta-well rgba(245,90,166,.13)` · `crimson-well rgba(242,100,119,.13)`. Generate hover/press tints within these families only — never introduce a new hue.

### Brighter hover variants

For link/accent hover: `violet-hi #A29BFF`. For other accents, lift luminance ~12% within the same hue for hover; never shift hue.

### State → color mapping (the contract)

| dir state | Color | Where it shows |
|---|---|---|
| `open` (default) | **none** (light text on `surface`) | Most ideas. Calm by default so the loud states pop. |
| `wish` / demand count | `cyan` | Wish counts, "wanted" signal, demand sort. |
| `claimed` → `building` | `amber` | Status band, in-progress dot/pill. |
| `shipped` | `jade` | Status band, shipped stamp, success moments. |
| staked / funded / live bounty | `magenta` | Value-locked band, stake/bounty stamps, pulse dots. |
| `expired` / `abandoned` / `disputed` / `superseded` | `crimson` | Alarm band, retired/dead markers. |
| `exists` (already live on CKB) | `muted` | Quiet — a greyed stamp, not an alarm. |

Commitment tiers reuse the same logic: **Watching** = cyan, **Committed** = neutral (light, it's just a claim), **Staked** = magenta, **Backed** (staked + bounty) = magenta with a violet `BACKED` ID tab.

### Usage rules

- **The black ground is the only background.** Sections never get colored backgrounds *except* as full-bleed **status bands** (a magenta band on a staked idea, a jade band stamping a shipped one, an amber band on one in progress) and the soft wells above.
- **Surface + line** carry the structure — card fills sit just off black; borders and dividers are light line-work, not heavy slabs.
- **Violet** is reserved and thin: primary CTAs' accent, links, the wordmark accent, ID tabs that stick out of cards, and the L-brackets that frame critical numbers (CKB amount, stake, wish count, commitment score). Brand color as a signal, not a wash.
- **Cyan / amber / jade / magenta / crimson** are *state* colors only — bands, stamps, pulse dots, and pills. Never gradients, never page backgrounds outside a status moment or its soft well.
- **Muted** for secondary mono caps (footers, meta, timestamps). **Hairline/line** for dividers that mustn't compete with the bright accents.

### Combinations to avoid

- `magenta` next to `crimson` at small sizes (they're neighbors — always separate with a mono label, and never put both on one card).
- `amber` as text on black (illegible — amber is a fill/highlighter only; use black text on amber).
- Any state color as a body-text color.
- More than one state color on a single card. **A card is in exactly one state at a time.**
- Glow/bloom/`text-shadow` on accents — these are flat inks, not lights.

---

## 4. Typography

### Families

- **Display & body sans:** a tight modern grotesque with a little character. Pick one of: Geist, PP Neue Montreal, Aeonik, GT America, Söhne. Designer's call — choose the one that gives headlines weight without feeling generic.
- **Monospace:** Geist Mono, JetBrains Mono, IBM Plex Mono, or Berkeley Mono. Designer's call.
- No third family. No serif. No script.

### Scale (starting points, adjust within reason)

| Use | Size | Weight |
|---|---|---|
| Hero headline (landing, big stamps) | 56–80px | 500 |
| Page title (`<h1>`) | 36–44px | 500 |
| Card title (idea title) | 22–26px | 500 |
| Body | 16px | 400 |
| Small body | 14px | 400 |
| Mono label | 11px | 500, letter-spacing 1.4 |
| Mono small caps | 10px | 500, letter-spacing 1.6 |
| Mono inline (IDs, addresses) | 13–14px | 500 |
| Big numbers (CKB amounts, scores, counts) | 48–96px | 500 |

### Weights & casing

- **Two weights only: 400 and 500.** Never 600/700 — they read blunt against this aesthetic. (On black, 400/500 light text is already high-contrast; heavier weights bloom.)
- Sentence case for body and titles. **Never title case in headings.**
- ALL CAPS only for mono labels, status bands, form footers, and stamps — always with letter-spacing 1.2–1.6.

### What is always mono (non-negotiable)

- Idea IDs (`#0007`, `DIR-0007`).
- CKB addresses (`ckb1qz…8e4f`), always middle-ellipsis truncated.
- CKB amounts as inline labels (`12,000 CKB`). The big amount numeral is display sans; the `CKB` suffix is mono.
- Timestamps and epochs (`14:02 UTC`, `EPOCH 9821`, `2 DAYS LEFT`).
- Status labels (`OPEN`, `CLAIMED`, `BUILDING`, `SHIPPED`, `STAKED`, `EXPIRED`, `SUPERSEDED`).
- Commitment tiers (`WATCHING`, `COMMITTED`, `STAKED`, `BACKED`).
- Idea metadata tags — category, CKB property, difficulty (`SPORE/DOB`, `GOOD-FIRST`, `RISC-V VM`).
- Form-footer lines (`DIR · IDEA MANIFEST · CC0`).
- Page numbers, hash truncations, any document chrome.

### Body type rules

- 16px body, line-height 1.6, max measure **64ch** for prose. Body text is `text` on `bg` (warm off-white on warm black) — never pure `#FFF` on pure `#000` (it vibrates); the warm pair is intentional.
- Links are `violet` with a 1px violet underline that thickens to 2px on hover; text brightens to `violet-hi` on hover, no other change.

---

## 5. Logo and brand mark

dir needs a real, considered mark — it appears in every top nav, every form footer, every stamp, the favicon, social cards, and the on-chain `author`/`commit` attestation badge.

### The wordmark

**"dir"** — lowercase, set in custom-feeling lettering (not a stock font dropped in). It is short, so every letter matters. Considerations:

- The form should feel **set in a frame** — dir is a registry, things are *listed inside* it. Consider enclosing the wordmark in a thin violet bracket frame `[dir]` as the locked-up signature, while the bare `dir` works alone in dense chrome.
- Flat-bottomed, slightly wide letterforms. The **i** dot can be a small filled square (a Cell), tying the wordmark to CKB's cell model and to the squared-corner rule.
- Must work single-color in **both directions** — light on black (default) and black on light (for a light stamp on a bright fill, e.g. on an amber band).
- Legible at 16px (favicon-adjacent), 24px (nav), 48–72px (hero), 200px+ (splash).
- Must sit comfortably beside mono metadata: test `dir` next to `#0007`.

### The glyph / icon mark

A standalone mark for favicon, app icon, footer, and the avatar of an on-chain `dir` attester. Explore at least these, pick the strongest:

1. **The bracket frame.** Four violet L-brackets forming an open viewfinder square — the same L-bracket motif used throughout the UI to frame critical numbers. Reads as "a place that frames/indexes things." Strongest tie to the system.
2. **The Cell-square index.** A solid light square (a CKB Cell) with a single notch or tick cut from a corner — "an entry, logged." Ties to CKB.
3. **The directory node.** A minimal tree branch (`├─`) rendered as geometry — the universal symbol for a directory listing.

Whichever wins must: read at 16×16; work in single-color light, black, and violet; **never** use cyan/amber/jade/magenta/crimson (those are state colors, not brand); and flatten cleanly to 1-bit for stamps in either direction.

### The brand stamp

A reusable stamp (circular or rectangular), mono caps, light line-work on black (or black on a bright fill):

```
DIR · CKB-NATIVE PROJECT DIRECTORY · CC0
```

Used as: marketing footer mark, watermark behind empty states and on idea manifests, social/README header art, and the on-chain attestation badge. Design at least one variant.

### Where it shows up

- **Top nav:** glyph + wordmark, left-aligned, wordmark = home link.
- **Footer:** large wordmark + stamp below.
- **Landing hero:** wordmark as a stamp above the headline (the headline is the hero, not the wordmark).
- **Idea card tab:** the violet tab sticking out of each card reads `DIR · #0007` or glyph + `#0007`.
- **Form footers:** `DIR · IDEA MANIFEST · CC0` on every primary card.
- **Favicon:** glyph alone.
- **Loading / empty states:** glyph animates (§9); stamp watermarks empty states.

### Logo deliverables

Wordmark SVG (single-color, both directions, lockups) · glyph SVG + PNGs at 16/24/32/48/64/128/256/512 · brand stamp SVG (one rectangular, one circular) · lockups (horizontal, vertical, glyph-only) · favicon set (16/32/48/192/512 + Apple touch) · OG image (1200×630, **black ground**, light wordmark, mono tagline).

---

## 6. Layout and the manifest pattern

### Grid

12 columns. Gutters: 80px desktop-wide, 24–32px tablet, 16px mobile. Max width **1200px** on marketing, **1440px** on app surfaces (data density tolerates wider).

### The manifest pattern (the spine)

Most primary cards use this. An idea rendered as a registry document, stamped in light on black:

```
[ violet tab sticks out top — light text, mono caps:  DIR · #0007 ]
┌───────────────────────────────────────────────────────────┐  ← outer line border
│  ┌───────────────────────────────────────────────────────┐ │
│  │ [STATUS BAND — full-bleed state fill, mono caps]      │ │  ← inner hairline
│  │ ───────────────────────────────────────────────────── │ │
│  │  Idea title in display sans (light)                   │ │
│  │  MONO METADATA SUBTITLE — CATEGORY · DIFFICULTY       │ │
│  │ ───────────────────────────────────────────────────── │ │
│  │  META STRIP (mono caps label + value, columnar)       │ │
│  │ ───────────────────────────────────────────────────── │ │
│  │  [BIG NUMBER framed in violet L-brackets]      [CTA]  │ │
│  │ ───────────────────────────────────────────────────── │ │
│  │ DIR · IDEA MANIFEST · CC0              PAGE 01 / 01    │ │
│  └───────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
   ↘ offset solid color block (12px right / 12px down, behind card)
```

Parts:

- **Outer border** — 2px solid `line`, squared. (On the focal card this can be 2px `text` for extra presence.)
- **Ground inset** — 6–8px gap where the black `bg` shows through between outer border and the inner card (the "second layer").
- **Inner card** — `surface` fill, 0.5px `hairline` border, squared.
- **Status band** — full-bleed state fill at the top of the inner area (amber/jade/magenta/crimson, or `surface` for open). Mono caps text (black on bright fills, light on deep); pulse dot for live/in-progress; stamp text for shipped.
- **Internal hairline rules** — 0.5px `hairline`, full inner width, separating title / meta / hero / footer.
- **ID tab** — a `violet` rectangle sticking ~28px above the card, light text, mono caps `DIR · #0007`.
- **Offset shadow block** — a solid rectangle the size of the card, shifted 12px right / 12px down, *behind* it, giving a brutalist "lift." **Color = the card's dominant state color** (shipped→jade, staked→magenta), defaulting to `violet` when neutral. A flat block, not a blurred shadow. Use only on the **focal card** of a page, never on every row.
- **Violet L-brackets** — four separate L-shaped corner marks (not a closed rectangle), 1.5px stroke, framing a critical number like a viewfinder: the CKB bounty/stake amount, wish count, commitment score, shipped count.
- **Form footer** — mono caps line inside the bottom: `DIR · [DOCUMENT TYPE] · CC0`, right-aligned `PAGE 01 / 01` or doc ID.

Variations:

- **List rows** (catalog board): outer border only, a 4px state stripe down the **left** edge instead of a full-top band, no ID tab, no offset shadow.
- **Hero cards** (builder profile, featured idea): full pattern + offset shadow.
- **Mini cards** (notification, activity line): drop the inner hairline border — just a 1px `line` border, a status pill, content, no form footer.

### Spacing scale

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`. Stick to these.

### No rounding

`border-radius: 0` everywhere. Round = circles only (status dots, monogram bullets). Focus rings are **squared** for consistency (§10).

---

## 7. Component library

Design every component in every state.

> **Reading these specs in dark mode.** Where a spec says "surface fill" it means the `surface` tone on the black ground; "line border/text" means `line`/`text` (light on black). **Bright** state fills (amber/jade/cyan) carry **black** text; **deep** fills (violet/magenta/crimson) carry **light** text. The black `bg` is the page; nothing else is a background except status bands and soft wells.

### Buttons

- **Primary:** solid `text` (light) fill, `bg` (black) text, sentence case, squared. Hover: `violet` fill, light text. Active: `violet-hi` fill. Disabled: `surface` fill, muted text, 0.5 opacity.
- **Secondary:** transparent fill, 1px `line` border, light text. Hover: full invert (light fill, black text).
- **Violet accent:** solid `violet` fill, light text. The single most important action per surface — **Commit to build**, **Confirm & post**, **Approve & mark shipped**.
- **Destructive:** `crimson` fill, light text. Sparingly — **Release claim**, **Open dispute**.
- **Ghost:** no fill/border, light text + 1px underline. Hover: violet text + violet underline.
- **Icon-only:** 32×32 squared, `line` border, light glyph. Hover: light fill, black glyph.

All squared; all have a pressed state (1px shift down, no shadow change).

### Inputs

- **Text:** `surface` fill, 1px `line` border, squared, light text. Focus: 2px `violet` outset border. Placeholder: muted.
- **Textarea:** same; the brief textarea on submit-idea is the largest (≥200px), mono caps `WRITE THE IDEA` label above, mono caps character counter below-right.
- **Number:** mono caps unit suffix inside (`CKB`, `DAYS`); squared step buttons.
- **Select:** surface-and-line, small light chevron; open menu inverts the hovered row.
- **File/link upload (showcase proof):** wide `line`-bordered drop zone, mono caps `DROP FILE OR PASTE URL`, violet L-bracket pair top-left / bottom-right. Drag-over: violet border, brackets thicken.
- **Toggle:** squared rectangle (not a pill). Off: `surface` fill, `line` border. On: light fill, black indicator.
- **Checkbox / Radio:** 16×16 **squared** (yes, radios too), `line` border. Checked/selected: light fill, black mark.

### Cards

- **Idea card** (manifest, full) — §6. Tab `DIR · #0007`, state band, title, `CATEGORY · DIFFICULTY` mono subtitle, meta strip (CKB property tags, wish count, claim count, deadline), hero number (bounty/stake or wish count) in violet brackets, footer.
- **Idea row** (slim manifest) — left state stripe, mono ID + status, title in display sans, mono meta on the right (category, difficulty, time left, claim count), commitment/bounty figure far right with a small CTA.
- **Builder card** — squared monogram (light fill, black letter) left, name in display sans, mono caps specialization, lifetime stats in mono (shipped count, ship rate, CKB earned), hairline divider, reputation figure. Used in directory and on an idea's claim list.
- **Funder/Poster card** — trust-signal optimized: bounties funded, release rate, repeat-funder rate.
- **Commitment card** — one per claim on an idea: builder monogram, name, tier pill (`WATCHING`/`COMMITTED`/`STAKED`/`BACKED`), stake amount in violet brackets, deadline, forfeiture mode (`DEPOSIT` / `SLASH→POOL` / `SLASH→NEXT`) as a mono tag.
- **Notification card** — slim, status pill left, body, timestamp right, mark-read affordance.
- **Empty card** — `surface` fill, `line` border, mono caps headline, short body, dir glyph in violet line-art centered, single primary CTA.

### Status bands & stamps (the state vocabulary)

All squared, all mono caps, pulse dot for live/in-progress:

- `OPEN` — `surface` fill, `line` border, light text. Quiet (the default).
- `CLAIMED` / `BUILDING` — `amber` fill, **black** text, black pulse dot.
- `SHIPPED` — `jade` fill, **black** text. Also a full-row jade **stamp** on settled rows.
- `STAKED` / `FUNDED` / live bounty — `magenta` fill, light text, light pulse dot.
- `WISHED` / demand — `cyan` fill, **black** text.
- `EXPIRED` / `ABANDONED` / `DISPUTED` / `SUPERSEDED` — `crimson` fill, light text.
- `EXISTS` (already on CKB) — `muted` fill, black text. Quietest.

### Tags / pills

Squared, 20px tall, 1px border, mono caps:

- `category` tag — transparent fill, `line` border, light text. `SPORE/DOB`.
- `property` tag — transparent fill, `line` border. `RISC-V VM`, `FIBER NETWORK`.
- `difficulty` tag — transparent fill, `line` border; `GOOD-FIRST` gets a small `jade` dot, `ADVANCED` a small `crimson` dot, intermediate a `muted` dot.
- `tier` pill — `STAKED` magenta fill / `BACKED` magenta fill + violet edge / `COMMITTED` `line` border.
- `forfeiture` tag — `SLASH→NEXT` etc., transparent fill, `line` border.
- `wants` tag (collaborators) — transparent fill, violet border, violet text. `WANTS: FRONTEND`.

### Badges

- **Pulse dot** — small filled circle breathing 0.6 → 1.0 → 0.6 opacity, in the state color.
- **Number badge** — squared 16×16, light fill, black number (unread counts).

### Tables

Used for: ecosystem-gap board, builder history, scoring/claim stacks, activity ledger.

- `surface` fill, no internal vertical lines.
- Header row: light fill, black mono caps, letter-spacing 1.6.
- Body rows: 0.5px hairline divider; hover lifts to a soft well (no hue change).
- Numeric columns: right-aligned, mono. Violet brackets may frame the key cell per row.

### Reputation hero block

Top of builder and funder profiles — the biggest moment outside the landing.

- Full manifest pattern + offset shadow.
- ID tab: `BUILDER · ckb1qz…8e4f`.
- Status band: `ACTIVE` (jade) / `RETIRED` (muted) / `NEW` (violet `NEW`).
- Title: display name, 56–72px display sans (light).
- Subtitle: mono caps — `SPORE/DOB · DEV-TOOLING · 12 SHIPPED · 92% SHIP RATE`.
- Hero metric in violet L-brackets: shipped count or lifetime CKB earned, 80–96px display sans, mono `SHIPPED` / `CKB` suffix.
- Quick-stats strip: 4 mono caps label + big mono number columns — `THIS SEASON`, `AVG SHIP TIME`, `LAPSE RATE`, `REPEAT FUNDERS`.
- Form footer + offset shadow.

### Acceptance-criteria block

dir's analogue to a verification spec — central on the idea detail page. A manifest section with band `ACCEPTANCE CRITERIA · SHIPPED MEANS ALL OF THESE`, then a checklist; each item a row with a squared checkbox (empty `line` box while open, light-filled check once a curator confirms on ship) and the criterion in body sans. This block is the bounty release condition — design it to read like a contract clause.

### Showcase / delivery preview

When an idea is `shipped`, the linked project renders in a `SHOWCASE` section with a jade band:

- **`url`/live project** — slim card, URL in mono, screenshot proxy thumbnail (240×140), `OPEN ↗` violet button.
- **`repo`** — repo card: name in display sans, mono caps `★ N · LANG`, `OPEN REPO ↗` violet button.
- **`image`** — full-bleed inline, max 800px, checkered/`surface` behind transparency, mono caps caption `IMAGE · PNG · 1024×1024`.
- **`multi`** — squared tabs, `line` border, mono caps labels; each tab the right per-kind preview.

### Activity feed line

Vertical timeline; one event per line:

- Mono timestamp (left, 60px).
- Status pulse dot in the event color.
- Actor monogram (squared 24×24, light fill, black letter).
- Body: actor name (display sans) + verb + target —
  - `aria wished for #0008` (cyan dot)
  - `pixel committed to #0007 · DEADLINE 14 DAYS` (amber dot)
  - `0xC4F9…8E21 funded #0024 with 5,000 CKB` (magenta dot, magenta-well row tint)
  - `pixel shipped #0007` (jade dot, **full jade row stamp**)
  - `pixel staked 2,000 CKB on #0003 · SLASH→NEXT` (magenta dot)
- Amounts/IDs in mono; idea/builder names link in violet.

`SHIPPED` events get a full-bleed **jade** row stamp (black text), like a stamped receipt — the visual peak of the feed. Funding/stake events get a `magenta-well` row tint.

### Top nav

Full-width, `bg` fill, 1px `line` bottom border. Left: glyph + wordmark (home). Center-left: mono caps links — `IDEAS`, `BUILDERS`, `SHOWCASE`, `FEED`, `DOCS` — light, hover violet. Right: notifications bell with squared unread badge, profile dropdown (connected user's monogram), `CONNECT` violet button when signed out. Sticky; on stick the **bottom border thickens** (no shadow).

### Footer

Two tiers. Top: large wordmark + four mono caps link columns (`PROJECT`, `PROTOCOL`, `CONTRIBUTE`, `SOCIAL`). Bottom: brand stamp, mono caps copyright, `CC0` (ideas) / `APACHE-2.0` (code), network status `CKB TESTNET · NETWORK 0x…`. `bg` ground, 2px `line` top border.

### Modals / toasts / states

- **Modal:** centered, `surface` fill, 2px `line` border, manifest pattern (ID tab, band, content, footer). Backdrop `rgba(0,0,0,0.7)` over the black ground. Close = light × top-right.
- **Toast:** bottom-right, `surface` fill, 1px `line` border, status pulse dot left, body, mono timestamp right. Auto-dismiss 6s; errors persist; stack vertically.
- **Empty:** centered dir-glyph line-art in violet, mono caps headline, body, one primary CTA.
- **Error:** centered crimson mark, mono caps `ERROR` + code in mono, retry CTA.
- **Loading:** **no spinners.** Cycling mono caps — `INDEXING CELLS`, `READING CHAIN`, `WAITING FOR BLOCK`. A 1px hairline sweeps L→R beneath it on a 1.4s loop.

---

## 8. Surfaces

Use the manifest pattern and components above. Desktop-first, 1440px app / 1200px marketing. Mobile (390px) for the four most-used: catalog, idea detail, builder profile, submit-idea.

### Marketing landing

1. **Top stamp.** Wordmark stamp, mono caps line below — `DIR · v0.1 · CKB-NATIVE PROJECT DIRECTORY · CC0`.
2. **Hero.** Editorial display headline 64–80px — *"Build something CKB-native."* — light, one word in `violet`. 2-line subhead, 22px. Two CTAs: `BROWSE IDEAS` (violet fill), `SUBMIT AN IDEA` (transparent, `line` border).
3. **The premise.** Three small manifest cards: the gap (no attestation standard, no Spawn libraries, etc.) → the idea → "claim it." Conveys dir turns ecosystem gaps into claimable work.
4. **How it works.** 6-step horizontal manifest, numbered tabs (`01`…`06`) joined by a hairline: browse → wish → commit (stake optional) → build → ship → reputation compounds.
5. **What you can build.** Grid of idea cards (real ones from the catalog) across categories — six visible, "and 24 more."
6. **Live activity teaser.** The real feed, pulled live. dir sells itself by *being* the registry.
7. **For builders / for funders.** Two manifest columns, each a headline + 3 bullets + CTA.
8. **Commitment, on-chain.** A stamped panel explaining tiers + the slash-to-next mechanic in one line — `WATCHING · COMMITTED · STAKED · BACKED`, magenta underline.
9. **FAQ.** Six accordion items, line-on-black, no chrome.
10. **CTA stamp.** Full-bleed band — *"Pick one. Ship it."* — both CTAs again.
11. **Footer.**

Decorative SVGs sparingly: a faint violet 1px cargo/cell grid behind the hero (low opacity on black); a bracket motif at section breaks. Type and layout carry it.

### Idea catalog (board)

A **list, not a grid** — density matters; visitors scan 30+ ideas. (This is the existing `site/` index, skinned.)

- **Filter strip:** category multi-select, CKB-property select, difficulty, status (open/claimed/building/shipped), demand sort. All squared inputs.
- **Stat strip:** mono caps — `30 IDEAS · 4 CLAIMED · 1 SHIPPED · 2 GOOD-FIRST`.
- **List:** slim manifest rows, full content width — left state stripe, mono ID + status, title in display sans, mono meta on right (category, difficulty, property count, time left if claimed), bounty/stake figure far right with a small `VIEW` / `COMMIT` button.
- Staked/funded rows get a magenta left stripe + `magenta-well` hover; shipped rows get a jade full-row stamp.
- Pagination: mono caps `PAGE 01 OF 02`, squared prev/next.

### Idea detail

The most data-dense surface; where the manifest pattern shines. Reads top-to-bottom like a registry document. Two columns on desktop:

- **Left (60%):** hero idea manifest (full + offset shadow) — state band, title, summary, meta strip (category, difficulty, CKB properties, primitives, author). Below: the spec body rendered as structured doc (`PROBLEM`, `WHY CKB`, `SPEC`). Below: the **acceptance-criteria block**.
- **Right (40%):** commitments list (stack of commitment cards, sorted by tier then stake; staked/backed get a magenta stripe). Stake/bounty summary in violet brackets with `FUND THIS` / `COMMIT TO BUILD` CTAs. When shipped: the **showcase** preview + the loop-closed jade stamp. Idea-only activity timeline.

### Builder directory

Sortable/filterable, 3-up grid (tighter than the board). Sort: `MOST SHIPPED`, `HIGHEST SHIP RATE`, `MOST ACTIVE`, `NEWEST`. Filter: category, property, `NEW` toggle. Cards invert fully on hover (light fill, black text). `NEW` builders get a small violet tag.

### Builder profile

The visual climax. Reputation hero (manifest + offset shadow) → sliced-reputation grid (4–6 tiles: by category, by CKB property, by difficulty, by recency — each a mini manifest with a violet+light bar chart) → quality-signals strip (ship-rate, lapse-rate big mono + violet brackets, recent funder pull-quotes in editorial sans with mono attribution) → recent-work rows (last 20 ideas: shipped/lapsed, CKB, funder, link) → earnings panel (owner-only, withdraw CTA).

### Funder profile

Symmetric: bounties funded / released / refunded, frivolous-dispute count, avg review time, repeat-builder rate. Same treatment.

### Submit-idea flow

Centered single column, generous whitespace on the black ground — dir's contribution funnel (mirrors the PR template).

- **Stage 1 — Write.** Big `surface` card, massive textarea, `WRITE THE IDEA` label, char counter, optional category/template chips, `STRUCTURE & REVIEW` violet button.
- **Stage 2 — Review.** Two-pane manifest: left the parsed idea as it'll appear on the detail page (frontmatter → fields); right a checklist nudging concrete **acceptance criteria** + a CC0 confirmation. Both editable. `SUBMIT` violet button (opens a PR / writes the attestation).
- **Stage 3 — Confirmation.** Large violet stamp `IDEA SUBMITTED`, the new idea manifest below, link to view it.

### Commit & stake flow

Modal or step card: JoyID sign-in → choose tier (free `COMMITTED` vs `STAKED`) → if staked, stake amount (violet brackets) + forfeiture mode (`DEPOSIT` / `SLASH→POOL` / `SLASH→NEXT`, the last two carrying a magenta "skin in the game" note) → deadline → review + sign. Confirmation: amber `CLAIMED` stamp.

### Fund-a-bounty flow

Amount in violet brackets, fee line (per `SPEC.md`), refund-on-expiry note, review + sign. Confirmation: magenta `FUNDED` stamp.

### Showcase

Grid of shipped projects, each a jade-banded card linking idea ↔ project ↔ builder — the proof loop, the credibility surface.

### Ecosystem-gap board

dir's intelligence surface. A table/heatmap of CKB properties × demand vs. supply (which are over/under-built), mono caps headers, violet-bracketed key cells, cyan demand bars. The view that makes dir valuable to the Foundation.

### Composition graph

The dependency/composition map between ideas (e.g. #7 attestation underlies #8, #11). Nodes are squared idea chips colored by state; edges are 1px `line` with violet arrowheads. Click a node → idea detail.

### Activity feed (standalone)

Full firehose. Stat strip `LIVE · 47 EVENTS THIS WEEK · 1 SHIPPED`. Vertical timeline (activity-line component); new events insert at top with a downward push. Right-side category toggles (wishes, commits, stakes, bounties, ships) as squared state-color chips.

### My dir (dashboard)

Reputation hero (your metrics) + tabs `MY CLAIMS`, `MY BOUNTIES`, `WISHED`, `HISTORY` — each a slim manifest list with state filtering. Stake-cap / deadline meters as horizontal bars (amber as a deadline nears, crimson when overdue).

### Notifications

Stat strip `12 UNREAD · 3 ACTIONABLE`. Collapsible sections (`IDEA EVENTS`, `COMMITMENTS`, `BOUNTIES`, `DISPUTES`), notification cards, mark-all-read top-right.

### Settings

Form-style: profile (display name, monogram color from the palette), notification toggles per category, connected wallet, danger zone (release all claims, retire).

### Docs

Editorial. Wide left sidebar, mono caps section nav. Body sans, 64ch measure. Code blocks in mono on `surface` with a 2px violet left border. Inline code mono with a thin surface-with-border treatment.

---

## 9. Motion

Restrained, mechanical — things move because something happened.

- **Page transitions:** 200ms crossfade. No slides, no flips.
- **Element entrances:** 280ms ease-out — hairlines sweep, status bands fill from left, brackets snap into place, big numbers count up.
- **Hover:** instantaneous, no easing.
- **Pulse dots:** 1.6s ease-in-out opacity loop, 0.6 → 1.0 → 0.6.
- **State changes:** 400ms color flash on the band — it briefly inverts before settling on the new state color.

### Feed behavior

- New events insert at top with a 320ms downward push on existing items.
- `SHIPPED` events stamp in: row appears, then 200ms later the **jade** fill sweeps L→R.
- Funding/stake events get a 600ms magenta pulse on the dot.

### Loading / streaming

- No spinners ever. Cycling mono caps — `INDEXING CELLS`, `READING CHAIN`, `WAITING FOR BLOCK`. A hairline sweeps L→R on a 1.4s loop.
- Long broker-style operations (parsing a submitted idea, confirming a ship) show a staged manifest band: `STRUCTURING` → `VALIDATING` → `READY`, each stage lighting as it starts.

### Logo animation

On first paint and on refresh, the glyph does a 320ms "index": the inner notch / bracket shifts up 1–2px and settles. Subtle, mechanical.

---

## 10. Accessibility

- Body text ≥ WCAG AA against the black `bg`. The pairing is **warm off-white on warm black**, never pure `#FFF` on `#000` (which vibrates).
- State colors as **text/icons on black** are tuned to pass AA at their token values (cyan/jade/magenta/crimson/violet); **amber is fill-only** (use black text on amber, never amber type). On bright fills, text is black; on deep fills, text is light.
- Color is never the only signal — every state also has a mono caps label and structural difference (band vs. tag vs. stamp vs. dot).
- Focus rings: 2px `violet` outset, **squared**, on all interactive elements. Tab order matches visual order.
- Mono caps ≥ 11px; body ≥ 14px.
- Reduced-motion: pulse dots go static, band flashes become instant swaps, hairline sweeps become instant fills.
- No glow/`text-shadow` (also an a11y win — accents stay crisp). Mandatory alt text on every illustration. Inputs always have a visible label — never placeholder-only.

---

## 11. Deliverables

**Brand:** wordmark SVG + lockups (both light-on-black and black-on-fill) · glyph SVG + PNGs (16/24/32/48/64/128/256/512) · brand stamp SVG (rect + circular) · favicon set (16/32/48/192/512 + Apple touch) · OG image (1200×630, black ground).

**Tokens:** color tokens as Tailwind config + CSS variables (dark only) · type tokens (chosen sans + mono, size/weight scale from §4) · spacing scale · radius scale (all 0) · border widths.

**Components:** Figma library of every component in §7, every state/variant, linked (not detached).

**Surfaces:** hi-fi mockups for every surface in §8 at 1440px; mobile (390px) for catalog, idea detail, builder profile, submit-idea.

**Motion:** specs detailed enough to implement in CSS / Framer Motion; reference clips for logo index, band flash, jade ship-sweep.

**States:** explicit empty / error / loading mockups for every primary surface.

**Docs:** a 5–10 page design-system doc (the manifest pattern, color semantics, type rules, do's/don'ts) so the next designer can ship a new surface that fits.

### Concrete starting tokens

```css
:root {
  /* neutrals — dark paper ground */
  --bg:        #15130F;   /* paper — page + card fills */
  --surface:   #15130F;   /* cards share the paper; borders define them */
  --surface-2: #1E1B15;   /* muted areas — filter bar, row hover, code */
  --text:      #F4F1E8;
  --muted:     #9A9588;

  /* borders are ink (cream), never brown */
  --line:    #F4F1E8;                       /* strong structural borders = ink */
  --hairline: rgba(244, 241, 232, 0.14);    /* subtle inner dividers */
  --ink-50:  rgba(244, 241, 232, 0.5);
  --ink-20:  rgba(244, 241, 232, 0.2);

  /* brand */
  --violet:    #7B6BF7;
  --violet-hi: #A29BFF;
  --violet-well: rgba(123, 107, 247, 0.14);

  /* state inks (glow on the dark paper) */
  --cyan:    #2FCBE6;  --cyan-well:    rgba(47, 203, 230, 0.13);  /* wish/demand  — black text on fill */
  --amber:   #F2A516;  --amber-well:   rgba(242, 165, 22, 0.13);  /* in progress  — fill only, black text */
  --jade:    #2DD69A;  --jade-well:    rgba(45, 214, 154, 0.13);  /* shipped      — black text on fill */
  --magenta: #F55AA6;  --magenta-well: rgba(245, 90, 166, 0.13);  /* value locked — light text on fill */
  --crimson: #F26477;  --crimson-well: rgba(242, 100, 119, 0.13); /* alarm        — light text on fill */

  /* structure */
  --radius: 0px;
  --border: 2px;       /* outer card */
  --hair:   0.5px;     /* inner rules */
}
```

```js
// tailwind.config — colors (dark mode only)
colors: {
  bg: "#15130F", surface: "#15130F", "surface-2": "#1E1B15",
  text: "#F4F1E8", muted: "#9A9588",
  line: "#F4F1E8", hairline: "rgba(244,241,232,0.14)",
  violet:  { DEFAULT: "#7B6BF7", hi: "#A29BFF", well: "rgba(123,107,247,0.14)" },
  cyan:    { DEFAULT: "#2FCBE6", well: "rgba(47,203,230,0.13)" },
  amber:   { DEFAULT: "#F2A516", well: "rgba(242,165,22,0.13)" },
  jade:    { DEFAULT: "#2DD69A", well: "rgba(45,214,154,0.13)" },
  magenta: { DEFAULT: "#F55AA6", well: "rgba(245,90,166,0.13)" },
  crimson: { DEFAULT: "#F26477", well: "rgba(242,100,119,0.13)" },
},
borderRadius: { none: "0px", DEFAULT: "0px" },
```

---

## 12. Decisions log (non-obvious calls)

- **Dark — black background (user decision).** The registry/manifest aesthetic is rendered as light line-work stamped on a warm near-black ground. (Earlier drafts were light/paper; the black ground is the chosen direction.) The site `site/` is skinned to these tokens.
- **Dark paper, not pure black.** `bg #15130F` and `text #F4F1E8` are both warm-shifted so the page reads like ink on dark stock, not a vibrating `#FFF`-on-`#000` terminal. **Borders are cream ink** (`#F4F1E8` at full/low opacity), never a brown line — this keeps the structure crisp and matches the registry reference.
- **Accents are inks, not neon.** Despite the black ground, accents are flat saturated print inks with **no glow/bloom/`text-shadow`** — the deliberate distance from the crypto neon-on-black cliché.
- **Brand = violet, not blue.** Distinctive in a teal-green-heavy ecosystem; leaves blue/green free for state.
- **Green means shipped, not brand.** Because brand is violet, `jade` is free to mean success/shipped — the most intuitive mapping — without competing with identity.
- **`open` has no color.** Most ideas are open; coloring them would drown the loud states. Neutral-by-default (light on surface) makes claimed/staked/shipped pop.
- **One riso-ink family, tuned for black.** Accents share a luminance band that sits cleanly on the dark ground, so six hues read as one set — "consistent and beautiful" by construction.
- **`magenta` (value) vs `crimson` (alarm) are neighbors** but never co-occur on a card and always carry a mono label, satisfying §10's "color is never the only signal."
- **Bright fills take black text, deep fills take light text.** A single rule (no per-color `-ink` variants needed) keeps the system simple and legible on the dark ground; `amber` stays fill-only.
- **Offset shadow color tracks state** (jade for shipped, magenta for staked, violet default) — the lift reinforces the card's meaning.

> CC0 for ideas, Apache-2.0 for code. Build something that reads like one person designed it from glyph to footer — and that person had taste.
