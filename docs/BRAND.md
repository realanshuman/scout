# Scout — brand & design system

Scout is an AI fundraising associate that lives on WhatsApp. The brand should
feel like a **sharp, friendly associate**: editorial and considered, not a
loud SaaS template. Clean over clever. One accent, lots of air, hairline
borders instead of heavy shadows.

## Logo & mascot

- **Mascot** (`ScoutMark`): a friendly green agent with big eyes looking
  up-and-right (always scouting) and a small signal antenna. Drawn inline as
  SVG so it stays crisp at any size. Green gradient `#2fd66d → #0e7a5f`.
- **Wordmark** (`Logo`): the mascot + "Scout" set in the display serif. Use
  `invert` on dark panels (white wordmark).
- Keep clear space around the mark of at least the mark's antenna height. Never
  recolor the mascot outside its green gradient.

## Color

Semantic tokens (CSS variables, so light/dark both work without touching
component classes — see `app/globals.css`, `tailwind.config.ts`):

| Token    | Light           | Dark            | Use                                  |
|----------|-----------------|-----------------|--------------------------------------|
| `paper`  | warm cream      | deep green-black | page background                     |
| `card`   | white           | raised green-black | cards / raised surfaces           |
| `ink`    | near-black green | off-white       | primary text                        |
| `mist`   | muted green-gray | muted           | secondary text                      |
| `moss`   | `#0e7a5f`       | `#34d399`       | accent, links, "why matched"        |

Fixed in both modes:

- `signal` `#22c55e` — the green CTA / highlight color.
- `night` `#0c1512` — immersive dark panels (hero, final CTA).
- `bubble` `#d9fdd3`, `chatbg` `#ece5dd` — WhatsApp chat motif only.

**Rules:** green is the *only* accent. No multi-color gradients in UI chrome.
The one sanctioned gradient is the WhatsApp glyph squircle and the mascot. Tint
surfaces with `moss/[0.05–0.08]`, never arbitrary hues.

## Type

- **Display** — Instrument Serif (`font-display`). Editorial, high-contrast.
  Used for headlines and section titles. Always `tracking-tight`, tight leading
  (`leading-[0.98]`–`1.1`).
- **Body / UI** — Inter (`font-sans`). Everything else.

Scale (landing):

| Role            | Classes                                              |
|-----------------|------------------------------------------------------|
| Hero H1         | `text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl` |
| Section H2      | `text-4xl sm:text-5xl` (display)                      |
| Card / sub H3   | `text-lg` – `text-xl`                                 |
| Body            | `text-[15px]` – `text-lg`, `leading-relaxed`         |
| Eyebrow / label | `text-xs font-semibold uppercase tracking-[0.18em]`  |

## Surfaces & motifs

- **Immersive dark** (`night` / `#071310`): hero and final CTA. Add a single
  soft radial green glow at the top: `radial-gradient(ellipse at 50% -10%,
  rgb(34 197 94 / 0.28), transparent 60%)`. White text, `white/60` for support.
- **Light sections**: `paper` background, `card` surfaces, hairline
  `border-ink/10` dividers. Alternate light and dark sections for rhythm.
- **Branded panels** (e.g. how-it-works): one consistent subtle moss tint
  (`from-moss/[0.07] to-moss/[0.02]`) with a hairline border — never a set of
  different gradients.
- **WhatsApp motif**: green squircle glyph, chat bubbles (`bubble` outgoing,
  white incoming) — used to show the product, sparingly.

## Components

- **Buttons**: pill (`rounded-full`). Primary = `signal` on dark ink text;
  glass = `white/10` + backdrop blur over dark; secondary = bordered card.
  Subtle lift on hover (`-translate-y-0.5`), press scale on active.
- **Cards**: `rounded-2xl`/`rounded-3xl`, `border-ink/10`, minimal shadow.
- **Motion**: `fade-up` on hero entrance; 150–200ms transitions. Respect
  `prefers-reduced-motion`.

## Voice

Plain, confident, founder-to-founder. Short sentences. Concrete numbers over
adjectives. **No em dashes** in copy — use commas, colons, or periods.
