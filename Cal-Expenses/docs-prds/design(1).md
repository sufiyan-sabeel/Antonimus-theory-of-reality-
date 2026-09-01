# CAL-EXPENSES Design System

**Tagline:** "Your money. Your days. One calendar."
**Version:** 1.0
**Status:** Implementation-ready
**Platform:** Mobile-first web application / PWA

---

## 1. Design Vision

CAL-EXPENSES exists to answer one question a user has every day: *what happened to my money, and what's coming next?* The calendar is the mechanism that makes both questions answerable in the same glance — a date is not just a day, it's a financial event container.

The product should feel like three things fused into one confident object: a **premium personal finance app**, a **calendar/productivity tool**, and an **AI copilot** that never talks over the user. It should never feel like banking software, a spreadsheet, a crypto ticker, or a generic admin template.

The design system in this document is original to CAL-EXPENSES. It studies two reference interfaces for their underlying UX qualities — information density and dark-surface confidence from one, spacious clarity and typographic warmth from the other — and produces a new visual language that does not reuse either reference's colors, layout, iconography, or composition.

---

## 2. Reference Analysis

### Reference 1 — Dark, dense analytics dashboard
**What to learn, not copy:**
- Near-black surfaces create a sense of premium focus and let financial numbers "glow" with contrast rather than competing with bright chrome.
- A persistent icon-rail sidebar keeps navigation out of the way while remaining always-available — informs our desktop rail concept.
- Cards use restrained borders instead of heavy drop shadows, which keeps a dense grid from feeling noisy.
- A single accent color (used sparingly) is enough to guide the eye to the most important number on screen.
- Compact list rows with avatar + status pill + amount demonstrate that transaction-style data can be dense without being cluttered, if alignment is consistent.

**What we deliberately do NOT take:** the specific palette, the card shapes, the sidebar icon set, the donut-chart styling, or the exact spacing rhythm.

### Reference 2 — Light, spacious finance dashboard
**What to learn, not copy:**
- Generous whitespace and large corner radii make a finance product feel approachable rather than clinical.
- Bold, oversized numerals on "card" style balance components establish an immediate hierarchy — the number is the hero, labels are secondary.
- Circular category/action buttons below a hero card give quick access to common actions without a heavy toolbar.
- Transaction rows separated by whitespace (not rules) feel calmer than bordered tables.
- The overall composition reads as "friendly," achieved through rounded geometry and a light, airy background rather than flat white.

**What we deliberately do NOT take:** the specific card arrangement, the exact rounded-rectangle card system, the colors, the icon set, or the layout grid.

### Synthesis
CAL-EXPENSES combines Reference 1's *confident density and dark-mode restraint* with Reference 2's *warmth, oversized numerals, and generous mobile-friendly spacing* — expressed through an original palette, an original type system, and a mobile-first component set neither reference was designed for.

---

## 3. Design Principles

1. **Calendar first** — the calendar is the primary navigational and mental model, not a secondary tab.
2. **Financial clarity** — every number on screen must be scannable in under a second; no ambiguous magnitudes.
3. **One-handed mobile usability** — primary actions live within thumb reach (bottom half of the screen).
4. **Fast expense entry** — logging a simple expense should take under 10 seconds, three taps or fewer.
5. **Progressive disclosure** — show the minimum needed first; advanced fields are opt-in, not default.
6. **Minimal cognitive load** — one primary action per screen; secondary actions visually recede.
7. **AI with user control** — the AI proposes, the user confirms; no silent autonomous financial actions.
8. **Privacy-first presentation** — local-data status and destructive actions are always legible, never hidden in menus.
9. **Accessible by default** — WCAG AA contrast and touch targets are the floor, not a stretch goal.
10. **Consistent interaction patterns** — the same gesture always produces the same class of result app-wide.
11. **Data should feel understandable** — pair every number with context (vs. last period, vs. budget) where possible.
12. **Empty states should guide the user** — every empty state names what's missing and offers the fix.
13. **Motion should communicate state, not decorate** — animation exists to explain a transition, never to perform.

---

## 4. Brand Personality

**Is:** intelligent, trustworthy, modern, calm, premium, practical, organized, approachable.
**Is not:** traditional banking software, a spreadsheet, a crypto dashboard, a futuristic HUD, a generic SaaS template.

**Voice in one line:** *A composed financial friend who does the math so you don't have to, and never judges what you bought.*

**Personality dial:**
| Trait | Low ←—— CAL-EXPENSES ——→ High |
|---|---|
| Playful vs. Serious | ● positioned center-serious |
| Minimal vs. Dense | ● positioned center (dense on desktop, minimal on mobile) |
| Corporate vs. Human | ● positioned human |
| Loud vs. Quiet | ● positioned quiet |

---

## 5. Visual Direction

- Deep neutral dark mode (not pure black) and clean warm-neutral light mode (not stark white).
- One restrained accent color used purposefully, never decoratively.
- Subtle surface elevation via layered neutrals + thin borders, not heavy drop shadows.
- Soft, low-opacity shadows reserved for floating elements (bottom sheets, FAB, modals).
- Generous mobile spacing; density is a desktop-only privilege.
- Large, tabular-numeral financial figures as the visual anchor of every card.
- Compact, lower-contrast secondary metadata (dates, categories, timestamps).
- Rounded geometry that reads as "considered," not "bubbly" — a controlled radius scale, not maximal rounding everywhere.
- Charts are legible first: no 3D effects, no excessive gradient fills, clear axis labeling.
- Icons are line-based, single-weight, consistent stroke.
- Glassmorphism: used only for the bottom sheet scrim and the AI overlay header — nowhere else.
- Gradients: reserved for the AI surface only, as a subtle two-stop accent wash — never on standard cards.
- No neon, no cyberpunk glow, no oversaturated color fields.

---

## 6. Color System

CAL-EXPENSES uses a **deep indigo-teal** accent (a calm, trustworthy, non-cliché alternative to finance-app green) as its single primary brand color, with a fully separate semantic palette for financial and status meaning so that "brand color" and "financial meaning" are never confused.

### 6.1 Brand Accent
```
--color-brand-50:  #EEF3FF
--color-brand-100: #DCE6FF
--color-brand-200: #B7CBFF
--color-brand-300: #8FA9FA
--color-brand-400: #6485EF
--color-brand-500: #3D63DE   /* primary brand */
--color-brand-600: #2C4CB8
--color-brand-700: #223B8F
--color-brand-800: #1A2C6B
--color-brand-900: #131F4D
```

### 6.2 Light Theme Surfaces
```
--color-background:        #F7F6F3   /* warm off-white, not stark white */
--color-surface:           #FFFFFF
--color-surface-elevated:  #FFFFFF   /* + shadow-elevation-2, see §11 */
--color-surface-hover:     #F0EEEA
--color-border:            #E4E1DA
--color-text-primary:      #1B1B1F
--color-text-secondary:    #55565E
--color-text-muted:        #8B8C94
```

### 6.3 Dark Theme Surfaces
```
--color-background-dark:       #0E1013
--color-surface-dark:          #16181C
--color-surface-elevated-dark: #1D2025   /* + border, see §11 */
--color-surface-hover-dark:    #23262C
--color-border-dark:           #2A2D33
--color-text-primary-dark:     #F2F2F0   /* not pure white */
--color-text-secondary-dark:   #B4B5BB
--color-text-muted-dark:       #7B7D85
```

### 6.4 Semantic Colors
Each semantic color is defined with a base, a soft background tint (for badges/chips), and is **never used alone** — every income/expense/status distinction pairs color with an icon, a label word, a leading sign (+/−), and a shape (see §6.5).

```
--color-income:          #1E8A6E   /* muted teal-green, distinct from brand */
--color-income-bg:       #E4F5F0
--color-expense:         #C4573B   /* muted terracotta, not alarmist red */
--color-expense-bg:      #FBEAE5
--color-warning:         #B8862E
--color-warning-bg:      #FAF1DD
--color-success:         #1E8A6E
--color-success-bg:      #E4F5F0
--color-error:           #C0392B
--color-error-bg:        #FBE8E5
--color-info:            #3D63DE
--color-info-bg:         #EEF3FF
--color-event:           #7A5FC7   /* violet — calendar events */
--color-event-bg:        #F1EDFB
--color-gift:            #C7508F   /* muted rose — gifts */
--color-gift-bg:         #FAEBF3
--color-goal:            #2C8FA8   /* muted cyan-teal — savings goals */
--color-goal-bg:         #E7F4F7
--color-ai:              #6C4CE0   /* distinct violet-indigo, unique to AI surfaces only */
--color-ai-bg:           #EFEBFC
```

Dark-mode semantic variants shift lightness up ~8–12% and desaturate slightly to remain calm against dark surfaces (e.g. `--color-expense-dark: #E08165`), while soft backgrounds become low-opacity overlays of the base color at 14% alpha rather than flat tints.

### 6.5 Non-Color Meaning Redundancy Rules
Income/expense/status must never rely on hue alone:
- **Income:** `+` prefix, upward-chevron icon, label "Income," teal accent.
- **Expense:** `−` prefix, downward-chevron icon, label category name, terracotta accent.
- **Warning:** triangle icon, label "Budget Alert" or similar, amber accent.
- **Success/confirmation:** check-circle icon, label confirming the action, teal accent.
- **Event/Gift/Goal:** each has a unique icon glyph (calendar-star, gift-box, target) in addition to its unique hue, so color-blind users identify the category by shape first.

---

## 7. Typography

**Font family:** [Inter](https://fonts.google.com/specimen/Inter) for UI text (exceptional mobile legibility, true tabular figures, wide weight range, free/Google Fonts). **Financial numerals** use Inter's `tnum` (tabular numbers) OpenType feature so amounts align in lists and never jitter in width when values change.

Fallback stack: `'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif`

### 7.1 Type Scale

| Token | Size (mobile) | Size (desktop) | Weight | Line height | Letter spacing | Use |
|---|---|---|---|---|---|---|
| Display | 32px | 40px | 700 | 1.15 | -0.02em | Onboarding, hero moments only |
| H1 | 26px | 30px | 700 | 1.2 | -0.01em | Screen titles |
| H2 | 21px | 24px | 600 | 1.25 | -0.01em | Section headers |
| H3 | 18px | 20px | 600 | 1.3 | 0 | Card titles |
| H4 | 16px | 17px | 600 | 1.35 | 0 | Subsection labels |
| Body | 15px | 16px | 400 | 1.5 | 0 | Default copy |
| Body Small | 13px | 14px | 400 | 1.5 | 0 | Secondary copy, helper text |
| Caption | 12px | 12px | 500 | 1.4 | 0.01em | Metadata, timestamps |
| Label | 12px | 12px | 600 | 1.3 | 0.03em (uppercase optional) | Field labels, eyebrow text |
| Button | 15px | 15px | 600 | 1.2 | 0 | All button text |
| Financial Large | 34px | 44px | 700 | 1.1 | -0.02em | Hero balance figures |
| Financial Medium | 22px | 26px | 700 | 1.15 | -0.01em | Card-level totals |
| Financial Small | 15px | 16px | 600 | 1.3 | 0 | Inline list amounts |

All Financial-* tokens set `font-variant-numeric: tabular-nums` and always render the currency symbol at 70% of the numeral's visual weight (lighter weight or muted color) so the number itself is the hero.

CSS variables:
```
--font-family-base: 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-size-display: 2rem;
--font-size-h1: 1.625rem;
--font-size-h2: 1.3125rem;
--font-size-h3: 1.125rem;
--font-size-h4: 1rem;
--font-size-body: 0.9375rem;
--font-size-body-sm: 0.8125rem;
--font-size-caption: 0.75rem;
--font-size-financial-lg: 2.125rem;
--font-size-financial-md: 1.375rem;
--font-size-financial-sm: 0.9375rem;
```

---

## 8. Spacing System

Base unit: **4px**. Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

```
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

| Context | Mobile | Desktop |
|---|---|---|
| Page padding (horizontal) | `--space-4` (16px) | `--space-8` (32px), max content width applies |
| Card padding | `--space-4` (16px) | `--space-6` (24px) |
| Section spacing (vertical between blocks) | `--space-6` (24px) | `--space-8` (32px) |
| List item spacing | `--space-3` (12px) internal, `--space-2` (8px) between rows | same, tighter row height allowed |
| Form field spacing | `--space-4` (16px) between fields | `--space-5` (20px) |
| Bottom nav safe padding | `--space-2` + device safe-area-inset-bottom | n/a (sidebar instead) |

Rule: mobile never drops below `--space-4` for page padding, even on dense screens (Analytics, Transactions) — density is achieved through typography and row height, never by shrinking margins.

---

## 9. Layout & Grid

- **Max content width:** 1280px (desktop), centered, with the sidebar outside this measure.
- **Mobile:** single column, full-bleed sections with `--space-4` gutters.
- **Tablet:** single column content, wider cards, optional 2-column card grid for Dashboard and Analytics.
- **Desktop:** persistent sidebar (240px expanded / 72px collapsed) + content area using a 12-column grid, 24px gutter.
- **Dashboard grid (desktop):** 4-column card grid for stat cards, 2-column below for larger cards (Budget Progress, Upcoming, AI Insight).
- **Card behavior:** cards never define a fixed height; they grow with content but cap secondary lists (e.g., "Recent Transactions" shows 5 items + "See all").
- **Sidebar behavior:** collapses to icon-only rail below 1280px trigger point if desktop but narrow (e.g. small laptop), fully hides in favor of bottom nav under 1024px.
- **Bottom navigation behavior:** fixed, 5-slot (Home, Calendar, +, AI, Profile), persists across all mobile primary screens, hides during full-screen flows (Expense Entry, Onboarding, AI full-screen chat).

---

## 10. Responsive Breakpoints

```
--breakpoint-mobile: 320px;      /* 320–767px */
--breakpoint-mobile-lg: 480px;   /* large mobile */
--breakpoint-tablet: 768px;      /* 768–1023px */
--breakpoint-desktop: 1024px;    /* 1024–1439px */
--breakpoint-desktop-lg: 1440px; /* 1440px+ */
```

| Breakpoint | Nav | Columns | Notes |
|---|---|---|---|
| Mobile 320–767 | Bottom nav | 1 | Full-bleed cards, stacked |
| Mobile-lg 480–767 | Bottom nav | 1 | Slightly larger touch targets, same structure |
| Tablet 768–1023 | Bottom nav (or collapsible top rail) | 2 | Dashboard cards begin pairing |
| Desktop 1024–1439 | Collapsed sidebar (icon rail) | 3–4 | Sidebar expandable on hover/click |
| Desktop-lg 1440+ | Expanded sidebar | 4 | Full sidebar labels always visible |

---

## 11. Elevation & Borders

CAL-EXPENSES favors **borders + subtle elevation** over heavy shadows, consistent with the premium-dense reference quality.

```
--elevation-0: none;
--elevation-1: 0 1px 2px rgba(20,20,25,0.04), 0 1px 1px rgba(20,20,25,0.03);      /* resting cards (light) */
--elevation-2: 0 4px 12px rgba(20,20,25,0.08);                                    /* elevated cards, dropdowns */
--elevation-3: 0 8px 24px rgba(20,20,25,0.12);                                    /* modals, bottom sheets */
--elevation-4: 0 16px 40px rgba(20,20,25,0.16);                                   /* FAB action sheet, toasts */

--border-width-hairline: 1px;
--color-border-default: var(--color-border);        /* light */
--color-border-default-dark: var(--color-border-dark);
```

Dark mode elevation is expressed primarily through **surface lightness steps** (background → surface → surface-elevated) rather than shadow, since shadows are nearly invisible on dark backgrounds; a 1px lighter hairline border substitutes for shadow at elevation-1 and elevation-2 in dark mode.

---

## 12. Radius System

```
--radius-xs: 6px;    /* chips, badges, small buttons */
--radius-sm: 10px;   /* inputs, icon buttons */
--radius-md: 14px;   /* standard cards */
--radius-lg: 20px;   /* hero cards, bottom sheet top corners */
--radius-xl: 28px;   /* modals, large feature cards */
--radius-full: 999px; /* avatars, pills, FAB */
```

Rule: never exceed `--radius-lg` on rectangular cards — this keeps "rounded but not excessively bubbly" as specified. `--radius-xl` and `--radius-full` are reserved for sheets, modals, and circular elements only.

---

## 13. Iconography

- **System:** Lucide (open-source, consistent single-weight line icon set), used exclusively — no mixing icon families.
- **Stroke weight:** 1.75px at 24px icon size (scales proportionally).
- **Sizes:** `--icon-size-xs: 14px`, `--icon-size-sm: 18px`, `--icon-size-md: 22px`, `--icon-size-lg: 28px`, `--icon-size-xl: 36px`.
- **Semantic icon usage:** every category (Food, Transport, Shopping, etc.) maps to one fixed Lucide glyph, stored in a category-icon registry so the same category always renders the same icon everywhere in the app.
- **Touch area:** all tappable icons get a minimum 44×44px hit target even if the visual icon is 18–22px, via padding on the IconButton component.

---

## 14. Motion System

Motion exists to explain state changes — navigation direction, hierarchy (something expanding from where it was tapped), confirmation, and feedback. It never runs for decoration.

```
--motion-duration-instant: 100ms;   /* button press feedback */
--motion-duration-fast: 150ms;      /* toggles, small state changes */
--motion-duration-base: 220ms;      /* card expansion, tab switches */
--motion-duration-slow: 320ms;      /* bottom sheet, modal, page transition */
--motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);   /* enter */
--motion-easing-decelerate: cubic-bezier(0, 0, 0, 1);   /* elements entering screen */
--motion-easing-accelerate: cubic-bezier(0.3, 0, 1, 1); /* elements leaving screen */
```

| Interaction | Duration | Easing | Notes |
|---|---|---|---|
| Page transition | 320ms | decelerate | Horizontal slide for forward nav, fade for tab switches |
| Bottom sheet entrance | 320ms | decelerate | Slide up + scrim fade-in together |
| Card expansion (e.g., budget row → detail) | 220ms | standard | Height + opacity, anchored at tap point |
| Calendar month transition | 220ms | standard | Horizontal slide matching swipe direction |
| Button feedback | 100ms | standard | Scale to 0.97 + subtle opacity dip |
| AI response appearance | 220ms per message | decelerate | Stagger 60ms between structured preview elements |
| Success confirmation | 220ms | decelerate | Check-circle scale-in + haptic (mobile) |

**Reduced motion:** when `prefers-reduced-motion: reduce` is set, all transform/slide/scale animations are replaced with a simple opacity cross-fade at `--motion-duration-fast`, and non-essential motion (stagger effects, hover lifts) is removed entirely.

---

## 15. Accessibility

- **Contrast:** all text meets WCAG AA (4.5:1 body text, 3:1 large text/financial figures) in both themes; verified against the token pairs in §6.
- **Touch targets:** minimum 44×44px for every interactive element, including calendar date cells and icon buttons.
- **Keyboard navigation:** full tab order on desktop; visible focus ring using `--color-brand-500` at 2px offset outline; bottom sheets trap focus while open and return focus on close.
- **Screen readers:** every icon-only control has an `aria-label`; amounts are announced with sign and currency (e.g., "minus 250 rupees, Food category").
- **Semantic labels:** income/expense are never conveyed by color class name alone in the DOM — always paired with a text node.
- **Accessible charts:** every chart ships a companion data table (visually hidden, screen-reader accessible) and never encodes meaning by color alone (see §6.5 pattern extended to charts via distinct line styles/markers).
- **Accessible calendar:** date cells are real button elements with full aria-labels ("August 30, 2 transactions, 1 event"); arrow-key navigation moves between days.
- **Reduced motion:** honored per §14.
- **Non-color status communication:** enforced app-wide per §6.5.

---

## 16. Mobile App Shell

- **Structure:** fixed top bar (contextual, often just a greeting/profile on Home, or a title + back on subpages) + scrollable content + fixed bottom navigation.
- **Safe areas:** respects `env(safe-area-inset-*)` on all fixed elements.
- **Status bar:** content scrolls beneath a translucent top bar only on Home; all other screens use an opaque top bar with page title.
- **One-handed zone:** primary actions (Save, Confirm, Quick Add) are anchored to the bottom of the viewport, never top-right.

## 17. Desktop App Shell

- **Structure:** persistent left sidebar + top utility bar (search, notifications, profile) + main content area, max-width 1280px, centered with side padding beyond that.
- **Sidebar states:** expanded (240px, icon + label), collapsed (72px, icon + tooltip on hover), and an auto-collapse below 1280px viewport width.
- **Content area:** never exceeds max content width even on ultra-wide displays; excess space becomes background, not stretched cards.

---

## 18. Navigation

### 18.1 Mobile Bottom Navigation
Five fixed slots: **Home · Calendar · + · AI · Profile**.
- The center **+** is visually distinct: a raised circular button (`--radius-full`, elevation-4, brand-colored fill) sitting slightly above the bar line.
- Tapping **+** opens the **Quick Add action sheet** (§ Mobile App Shell / Bottom Sheet), not a new screen.
- Active tab: icon switches from outline to filled Lucide variant + brand-colored label; inactive tabs use muted icon/text color.
- Bottom nav height: 64px + safe-area-inset-bottom; **+** button diameter: 56px.

### 18.2 Desktop Sidebar
Primary: Overview, Calendar, Expenses, Income, Budgets, Goals, Events, Gifts, Family, AI Assistant, Analytics, Games.
Secondary (bottom-anchored, visually separated by a divider): Profile, Settings, Export.

- **Active state:** filled icon + brand-tinted background pill (`--color-brand-50` light / `--color-brand-900` at 40% opacity dark) behind the item, brand-colored text.
- **Hover:** `--color-surface-hover` background, no layout shift.
- **Focus:** 2px brand outline, offset 2px, visible on keyboard nav only.
- **Mobile transformation:** sidebar items map to bottom nav (Home=Overview, Calendar, + =Expenses/Income/Event creation, AI=AI Assistant, Profile=Profile) — remaining desktop-only items (Budgets, Goals, Events, Gifts, Family, Analytics, Games, Settings, Export) are reachable from Home quick-links and Profile/Settings on mobile, not from the bottom bar.

---

## 19. Dashboard

### 19.1 Mobile Dashboard (hierarchy, top to bottom)
1. **Top bar:** greeting ("Good morning 👋") + subline ("Ready to see where your money went?") + avatar + notification bell (badge dot for unread).
2. **Balance Card** (hero, full-width): current balance in Financial Large, small income/expense sub-row beneath.
3. **Today's Activity strip:** compact two-stat row (Today's Income / Today's Expense) — not full cards, just a lightweight inline pair.
4. **Quick Add row:** 4 circular shortcut buttons (Expense, Income, Event, More) beneath the balance card — mirrors the reference's "quick action circles" pattern, reimagined with app-specific actions.
5. **Budget Progress Card:** top 1–2 budgets nearest their limit, each a compact progress row.
6. **Upcoming Calendar Items Card:** next 2–3 dated items (bill, event) with date chips.
7. **Recent Transactions Card:** last 5 transactions, "See all" link to full list.
8. **AI Insight Card:** one rotating insight, dismissible.

Only items 1–3 are guaranteed above the fold on a standard mobile viewport (~667px height); everything else is a normal scroll.

### 19.2 Desktop Dashboard
4-column stat card row (Balance, Income, Expenses, Savings) at top, followed by a 2-column layout: left column stacks Budget Progress + Recent Transactions; right column stacks Upcoming Calendar + AI Insight, with a mini calendar month view pinned at the top of the right column.

---

## 20. Dashboard Cards

Each card below follows the same structural contract: **purpose → hierarchy → padding → typography → icon → interaction → loading → empty → error → mobile behavior.**

### Balance Card
- **Purpose:** show total available balance at a glance.
- **Hierarchy:** balance number is the single largest element on the dashboard.
- **Padding:** `--space-5` mobile / `--space-6` desktop.
- **Typography:** label in Label token ("Current Balance"), value in Financial Large.
- **Icon:** wallet glyph, top-right, muted.
- **Interaction:** tap navigates to Transactions filtered "All."
- **Loading:** skeleton block matching numeral width + shimmer.
- **Empty:** shows ₹0.00 with a "Add your first transaction" link — never blank.
- **Error:** "Unable to load balance" inline with retry icon-button.
- **Mobile behavior:** full-bleed width, elevation-1, `--radius-lg`.

### Monthly Spending Card
- **Purpose:** total spend this month vs. last month delta.
- **Hierarchy:** Financial Medium value + small delta chip (▲/▼ with % and color per §6.5).
- **Padding:** `--space-4` mobile / `--space-5` desktop.
- **Typography:** H4 label, Financial Medium value, Caption for delta.
- **Icon:** trending-down/up Lucide glyph matched to delta direction.
- **Interaction:** tap opens Analytics → Spending tab.
- **Loading:** skeleton bar.
- **Empty:** "No spending recorded this month."
- **Error:** inline retry.
- **Mobile behavior:** pairs with Income Card in a 2-up row on tablet+, stacks full-width on mobile.

### Income Card
Mirrors Monthly Spending Card structure; teal accent; icon: banknote/arrow-down-left.

### Savings Card
- **Purpose:** current total saved across goals this month.
- **Hierarchy:** Financial Medium value + linear progress sliver toward a monthly savings target if one is set.
- **Icon:** piggy-bank glyph.
- **Empty:** "Set a savings goal to start tracking."

### Budget Progress Card
- **Purpose:** surface the 1–2 budgets closest to their limit.
- **Hierarchy:** category label + amount spent/total, horizontal progress bar beneath, % as Caption.
- **Icon:** category-specific icon per §13.
- **Interaction:** tap row → Budget detail; tap card header "See all" → Budgets screen.
- **Loading:** two skeleton rows.
- **Empty:** "No budgets configured yet — set one in under a minute" + CTA button.
- **Error:** "Unable to load budgets."
- **Mobile behavior:** shows max 2 rows; desktop shows up to 4.

### Upcoming Bills Card
- **Purpose:** remind of near-term due bills/events.
- **Hierarchy:** date chip (left) + title + amount (right).
- **Icon:** calendar-clock.
- **Empty:** "Nothing due soon."
- **Mobile behavior:** horizontal scroll of 2–3 chips if more than 3 items exist, rather than a long vertical list.

### AI Insight Card
- **Purpose:** one timely, specific observation.
- **Hierarchy:** small "AI" badge (violet, `--color-ai`) + insight sentence, no numbers larger than Body text (this card supports the dashboard, it doesn't compete with the Balance Card).
- **Icon:** sparkle glyph in `--color-ai`.
- **Interaction:** tap opens AI Assistant with this insight pre-loaded as context.
- **Loading:** shimmer over 2 text lines.
- **Empty:** "Check back after a few days of activity for personalized insights."
- **Error:** "AI insights unavailable right now."

### Goal Progress Card / Event Budget Card
Structurally identical to Budget Progress Card, with goal-specific (`--color-goal`) or event-specific (`--color-event`) accenting and icon, and a target-date Caption instead of a period label.

---

## 21. Calendar

**The calendar is the signature feature and receives the most design attention in the system.**

### 21.1 Mobile Calendar
- **Month selector:** centered month/year label with left/right chevrons; swipe gesture also changes month (§14 motion).
- **Weekday row:** single-letter labels (S M T W T F S), Caption weight, muted.
- **Date cells:** square-ish cells at `--radius-sm`, minimum 44×44px touch target.
- **Today indicator:** brand-colored ring around the date number.
- **Selected date:** filled brand background, inverse text color.
- **Financial indicator:** small tabular figure beneath the date number showing net amount for the day (e.g., "₹840"), colored per income/expense dominance that day, truncated/abbreviated (₹1.2k) if space-constrained.
- **Event/category dots:** up to 3 small colored dots beneath the figure representing event/gift/goal/bill presence that day (using §6.4 hues) — if more than 3 categories occur, show 2 dots + a "+N" caption.
- **Intelligent aggregation rule:** a cell never shows more than one numeral + one icon + up to 3 dots; anything beyond that collapses into the day-detail sheet, never onto the cell itself.

### 21.2 Tablet/Desktop Calendar
Same cell logic at a larger cell size (min 96px height), allowing a second line of text (e.g., top category label) beneath the dots — still capped, overflow still deferred to day detail.

### 21.3 Interaction
Tapping/clicking a date opens the **Day Detail bottom sheet** (mobile) or a **Day Detail side panel** (desktop, slides in from the right without covering the calendar).

---

## 22. Day Detail

### 22.1 Mobile Day Detail (Bottom Sheet)
- **Header:** date in H2 ("August 30"), close affordance (drag handle + tap-outside-to-dismiss).
- **Summary row:** Spent / Income as two compact stat blocks side by side (Financial Small values, Label captions).
- **Events row:** chip list if any events exist that day (e.g., "🎂 Birthday").
- **Transactions list:** TransactionRow components (§38) for that day only, grouped, no date repeated per row since the header already establishes it.
- **AI Insight (contextual):** single sentence, only shown if a genuinely relevant comparison exists (e.g., day's shopping vs. recent average) — omitted entirely otherwise, never a filler line.
- **Actions:** three pill buttons pinned at the bottom of the sheet — Add Expense / Add Income / Add Event — always visible without scrolling (sticky footer inside the sheet).

### 22.2 States
- **Loading:** skeleton summary + 2 skeleton rows.
- **Empty (no activity that day):** "Nothing logged for August 30" + the same three action buttons, emphasized.
- **Error:** "Couldn't load this day" + retry.

---

## 23. Expense Entry

Mobile-first, single-purpose screen (not a modal on mobile — a full-screen sheet to give the amount field maximum room).

### 23.1 Structure (progressive disclosure)
1. **Amount field (hero):** currency symbol (muted, smaller) + large editable numeral field using Financial Large size, centered, with a numeric keypad optimized layout below it on mobile (custom keypad component, not native OS keyboard, for consistent one-handed reachability).
2. **Category selector:** horizontal scroll of category chips with icons; tapping opens a full category grid if "More" is tapped.
3. **Description field:** single-line text input, optional, placeholder "What was this for?" but always paired with a persistent Label above it (never placeholder-as-label).
4. **Date field:** defaults to "Today," tap opens date picker.
5. **Payment method field:** defaults to last-used method, simple select.
6. **Advanced (collapsed by default):** recurring toggle, tags, attach note/photo, split expense — revealed via a "More options" disclosure row.
7. **Primary action:** full-width "Save Expense" button, sticky at bottom, brand-colored, disabled state until amount > 0.

### 23.2 States
- **Default / Focus / Filled / Error / Disabled / Success** defined per §24 Forms.
- **Success:** on save, a brief success confirmation animation (§14) plays before returning to the originating screen (Dashboard, Calendar day, or Transactions).

---

## 24. Transactions

### 24.1 Transaction List
- **Row anatomy:** leading CategoryIcon (in a soft-tinted circular badge matching category color) → title (merchant/description) + Caption subline (category · relative date/time) → trailing amount in Financial Small, sign-prefixed and colored per §6.5.
- **Grouping:** rows grouped under sticky date headers ("Today," "Yesterday," "August 28") in the full Transactions screen; no grouping needed inside Day Detail (date already established).
- **Density:** whitespace-separated rows (`--space-3` vertical), no full-width dividers — an optional 1px inset divider (`--color-border`, indented past the icon) may be used on dense desktop tables only.
- **Interaction:** tap row → Transaction Detail (edit/delete); swipe left (mobile) reveals Edit/Delete quick actions.

### 24.2 States
- **Loading:** 5 skeleton rows (icon circle + two text bars + amount bar).
- **Empty:** "No transactions yet" illustration-light empty state + "Add your first expense" CTA.
- **Error:** "Couldn't load transactions" + retry button.

---

## 25. Income

Structurally mirrors Transactions but filtered to income-type entries; Income Entry screen mirrors Expense Entry with the amount field using `--color-income` accenting instead of neutral/expense framing, and a "Source" field replacing "Category" (Salary, Freelance, Gift Received, Other).

---

## 26. Budgets

- **Budget Card (list item):** category name (H4) + "₹X budget" Caption, spent/remaining pair in Body, horizontal **BudgetProgress** bar beneath (rounded, `--radius-full`, track in `--color-surface-hover`, fill in category-appropriate hue — amber past 80%, terracotta past 100%), percentage as trailing Caption.
- **Budget Detail:** full breakdown of transactions counting against that budget for the period, plus a small trend sparkline.
- **Create/Edit Budget:** category select, period select (weekly/monthly), amount field (Financial Medium sized, not full hero size — this isn't the primary "amount" moment of the app).
- **States:** empty ("No budgets configured" + CTA), loading (skeleton progress rows), error (inline retry), over-budget visual state (fill color shifts to `--color-error`, small warning icon appears beside the percentage).

---

## 27. Goals

- **Goal Card:** title (H4), "saved / target" pair in Financial Small ("₹18,000 / ₹60,000"), percentage as a Caption pill, **GoalProgress** bar (`--color-goal` fill), target date as Caption ("Target: December 2026").
- **Micro-interaction:** on crossing a 25/50/75/100% milestone, the progress bar fill briefly pulses once (respecting reduced-motion) — restrained, not confetti/gamified beyond this single pulse.
- **Create/Edit Goal:** name, target amount, target date, optional linked category for auto-tracking contributions.
- **States:** empty ("No goals yet — what are you saving for?" + CTA), loading, error, completed state (goal card gets a subtle celebratory badge "🎉 Goal reached" replacing the progress bar, still restrained).

---

## 28. Events

- **Event Card (list item):** title (H4) + date (Caption), budget/spent/remaining trio in Financial Small (three-column mini layout), linked-item icon row beneath (Gift/Food/Transport icons as small badges).
- **Event Detail:** header with title/date/edit, budget summary trio (larger), linked items list (each a TransactionRow-style entry tagged to this event), "Add linked expense" action.
- **Create/Edit Event:** name, date, optional budget amount, optional category tags for auto-linking.
- **States:** empty ("No events planned" + CTA), loading, error, over-budget event (remaining figure turns `--color-error`).

---

## 29. Gifts

- **Gift Planner list item:** recipient name (H4) + occasion/date (Caption), budget vs. actual mini-pair, purchase-state Badge (Planned / Purchased / Given) using neutral badge styling, not stoplight colors, to keep tone friendly rather than task-management-serious.
- **Gift Detail:** recipient, occasion, date, budget, planned gift description, actual amount once purchased, link to the Event it belongs to (if any).
- **States:** empty ("No gifts planned yet"), loading, error.

---

## 30. Family

A **local/shared-device workspace**, not real-time multi-user collaboration (V1 is localStorage-based).

- **Family screen:** list of family "profiles" stored on this device (e.g., household members tracked locally), each with their own color tag used consistently across their transactions/events.
- **Visual distinction from future cloud collaboration:** a persistent, calm Label/Caption strip at the top of the Family screen: "Shared on this device" with a device icon — explicitly not a "synced" or "online" indicator (no green dot, no "live" language, no avatars-with-presence-ring pattern, since that would imply real-time sync that doesn't exist).
- **No fake collaboration indicators:** no typing indicators, no "last seen," no online/offline dots for family members — these are entirely omitted rather than faked.
- **States:** empty ("No family members added" + CTA "Add a member"), loading, error.

---

## 31. Analytics

Charts prioritize readability over decoration; mobile gets dedicated layouts, not shrunk desktop charts.

- **Spending Chart:** mobile = simplified bar chart, one bar per day/week depending on zoom, horizontally scrollable if range exceeds ~10 bars, with a fixed axis label row that doesn't scroll; desktop = full line/bar combo with hoverable tooltips.
- **Category Breakdown:** mobile = horizontal stacked bar or ranked list with inline percentage bars (avoids tiny illegible pie slices); desktop = donut chart with a legible legend list beside it (never overlaid labels on thin slices).
- **Income vs. Expense:** grouped bar chart, income bars in `--color-income`, expense bars in `--color-expense`, always labeled directly (not just color-coded) above each bar pair.
- **Trend Chart:** single line, area fill at low opacity (10–15%) of the line's color, never a heavy gradient fill.
- **Calendar Heatmap:** reuses the Calendar Cell geometry from §21 at a condensed size, intensity mapped to spend magnitude via a single-hue lightness ramp (not a red-green diverging scale, to stay consistent with §6.5's non-alarmist tone).
- **Savings Progress:** horizontal GoalProgress bars stacked per goal.
- **Accessibility companion:** every chart type ships a toggle to view its underlying data as a simple table.

---

## 32. AI Assistant

CAL-EXPENSES AI is a **financial copilot embedded in the product**, not a generic chat clone.

### 32.1 Entry Points
- Bottom nav "AI" tab → full AI screen.
- AI Insight Card tap → AI screen pre-loaded with that insight's context.
- Natural language quick-entry from anywhere via the AI tab.

### 32.2 AI Screen Structure
- **Header:** distinct visual treatment — a soft two-stop gradient wash (`--color-ai` to transparent) behind the header only, the one sanctioned gradient use in the system (§5).
- **Greeting prompt:** "How can I help with your money today?"
- **Quick action chips:** Analyze this month · Check my budget · Upcoming bills · Add an expense · Create a budget · Explain my spending — horizontally scrollable chip row beneath the greeting.
- **Input bar:** bottom-anchored text field, placeholder "Spent ₹250 on lunch today," mic icon optional, send button.

### 32.3 Structured Detection Preview
When the AI parses a natural-language entry into a transaction, it never auto-saves — it renders a **Detected Entry Card**:
- Small "Expense detected" Label with sparkle icon (`--color-ai`).
- Amount (Financial Medium), category (with icon), date, description — displayed exactly like a mini Expense Entry summary.
- Two buttons: **Cancel** (text button) / **Confirm** (filled brand button) — Confirm is the only path that writes data.

### 32.4 States
- **Loading:** three-dot typing indicator in `--color-ai`, restrained (no bouncing avatar).
- **Empty (first use):** greeting + quick actions only, no history.
- **Error:** "AI unavailable right now — you can still add expenses manually" + link straight to Expense Entry (AI failure never blocks core functionality).

---

## 33. AI Insights / AI Automation UI

- **AI Insight Card variants:** Spending Insight, Budget Alert, Calendar Insight — same card shell (§20 AI Insight Card), differentiated only by the leading icon and the sentence content, never by changing the card's structure.
- **Tone rule:** insights are observational and specific, never alarmist (see §36 Content Design) — "You spent ₹420 more on food this month" not "You are overspending."
- **Automation boundary:** the AI can pre-fill and suggest (budgets, categorizations, detected transactions) but every write action requires an explicit Confirm tap — this is a hard UI rule, not just a copy guideline, enforced by always rendering the Cancel/Confirm pair in §32.3 for any AI-initiated data change.

---

## 34. Profile

Sections, each its own scrollable group with a Label header:
- **Profile identity:** Avatar, name, email — tap avatar to change (local image only, no cloud upload implied).
- **Preferences:** currency, language, theme (Light/Dark/System).
- **Financial preferences:** default payment method, week start day, budget period default.
- **AI preferences:** enable/disable natural-language quick entry, insight frequency.
- **Privacy:** local-data explanation (plain-language card, see §46), link to Export Center, "Clear local data" (destructive, see §46).
- **Data management:** Export, Import, Clear local data — grouped together, visually separated from non-destructive settings by a divider and slightly muted section background.

---

## 35. Settings

Organized into clearly separated groups (never one long scroll of mixed toggles):
**Account · Appearance · Calendar · Finance · AI · Notifications · Privacy · Data · About.**

Each group is its own card/section with an H4 header; within a group, rows use a consistent Settings Row component (label left, control right — toggle/select/chevron-to-subscreen).

---

## 36. Export

**Export Center** — a dedicated screen, not a modal, because it involves a multi-step decision (what + range + format).

- **Format options as selectable cards:** Monthly PDF, CSV, JSON Backup — each with a one-line description of intended use ("PDF — for printing or sharing," "CSV — for spreadsheets," "JSON — full backup for re-import").
- **Date range picker:** below format selection.
- **Data included checklist:** Transactions, Budgets, Events, Gifts, Goals — user can deselect categories.
- **Confirmation step:** before export executes, a summary sheet states exactly what will be generated ("Exporting 3 months of transactions, budgets, and events as PDF") with Cancel/Export buttons — required for every export, not just destructive ones, since financial data leaving the app deserves a deliberate final step.

---

## 37. Games

Lightweight, visually consistent with the core system — no separate "game skin."

- **Budget Challenge, Savings Streak, Expense Quiz:** presented as cards on a single Games screen, each using standard Card + ProgressBar/Badge components already defined, with the `--color-goal` or `--color-ai` accent depending on whether the game is savings-themed or knowledge-themed.
- **No gambling visual language:** no slot-style reveals, no spinning wheels, no confetti bursts beyond the single restrained pulse defined in §27, no countdown-timer urgency styling, no currency-style "coins" or scorekeeping that resembles wagering.
- **Streak indicator:** a simple row of filled/unfilled dots (not flames, not slot-machine styling) to show consecutive days.

---

## 38. Component Library

For each component: purpose · variants · states · mobile behavior · desktop behavior · accessibility · motion.

**Button** — Purpose: primary actions. Variants: primary (filled brand), secondary (outlined), tertiary (text-only), destructive (filled error color). States: default/hover/pressed/disabled/loading (spinner replaces label). Mobile: full-width for primary screen actions, min-height 48px. Desktop: intrinsic width unless in a form footer. A11y: `aria-disabled` when disabled, focus ring per §15. Motion: 100ms press scale.

**IconButton** — Purpose: single-icon actions (back, close, more). Variants: default, filled (circular background). States: standard set. Mobile/Desktop: 44px min hit area regardless of visual icon size. A11y: mandatory `aria-label`. Motion: 100ms press scale.

**Input** — Purpose: single-line text entry. Variants: text, email, number. States: default/focus/filled/error/disabled/success. Mobile: 48px height, 16px font-size minimum (prevents iOS zoom-on-focus). Desktop: 44px height. A11y: always paired with a visible `<label>`, error state adds `aria-describedby` pointing to the error message. Motion: border-color transition 150ms.

**AmountInput** — Purpose: currency entry, used in Expense/Income/Budget/Goal forms. Variants: hero (Financial Large, Expense Entry) and inline (Financial Medium, Budget/Goal forms). States: same as Input. Mobile: triggers custom numeric keypad component, not native keyboard, for consistent layout. A11y: announces full currency value on change. Motion: none beyond standard input transitions.

**Select** — Purpose: choose from a fixed list (category, payment method, currency). Variants: inline dropdown (desktop), bottom sheet picker (mobile). States: default/focus/disabled. A11y: full keyboard operability on desktop; mobile sheet traps focus. Motion: sheet entrance per §14.

**DatePicker** — Purpose: date selection. Mobile: opens a calendar bottom sheet reusing Calendar Cell geometry at compact size. Desktop: inline popover calendar. A11y: arrow-key day navigation, announces selected date. Motion: sheet/popover entrance per §14.

**Search** — Purpose: filter transactions/categories. Variants: inline (embedded in a screen), overlay (full-screen on mobile when tapped). A11y: `role="search"`, live region announcing result count. Motion: overlay fade 150ms.

**Card** — Purpose: base container for all dashboard/content blocks. Variants: standard, elevated (hover-interactive), accent (tinted background for AI card). States: default/hover(desktop only)/pressed(if tappable). Mobile: full-bleed width, `--radius-lg`. Desktop: intrinsic width per grid column, `--radius-md`. A11y: if the whole card is tappable, it's a real `<button>`/`<a>`, never a `<div onclick>`. Motion: hover lift only on desktop (2px translate + elevation-2), never on mobile.

**StatCard** — Purpose: single-metric display (Balance, Income, Expense, Savings). See §20 for full per-card contracts.

**TransactionRow** — Purpose: one line item in any transaction list. See §24.1. A11y: full row is one focusable element with a composed aria-label ("Lunch, Food, today, minus 250 rupees").

**CategoryIcon** — Purpose: consistent category glyph in a tinted circular badge. Variants: sized xs–lg matching §13 icon scale. A11y: decorative (icon meaning is redundant with adjacent text per §6.5), `aria-hidden="true"`.

**BudgetProgress / GoalProgress** — Purpose: horizontal progress indication. States: normal/warning(80%+)/over(100%+) for Budget; normal/milestone-pulse/complete for Goal. A11y: `role="progressbar"` with `aria-valuenow/min/max`. Motion: fill animates on first render (400ms ease-out), instant thereafter (no motion on every re-render/poll).

**CalendarCell / CalendarHeader** — See §21 for full spec. A11y: `<button>` per cell with composed label; header month change announced via live region.

**BottomSheet** — Purpose: mobile-primary container for Day Detail, Quick Add, pickers. States: entering/open/dismissing. A11y: focus trap, `aria-modal="true"`, Esc/swipe-down/scrim-tap to dismiss. Motion: §14 slide-up.

**Dialog** — Purpose: desktop-primary confirmation/short-form container (mobile uses BottomSheet instead for the same purpose). A11y: focus trap, labelled by its heading. Motion: scale-fade 220ms.

**Toast** — Purpose: transient confirmation/error feedback. Variants: success/error/info. Mobile: bottom-anchored above bottom nav. Desktop: bottom-right. A11y: `role="status"` (success/info) or `role="alert"` (error), auto-dismiss 4s but pausable on hover/focus. Motion: slide+fade in 220ms, fade out 150ms.

**Badge** — Purpose: small status/category label (Planned/Purchased, category tag). Variants: neutral, semantic-tinted per §6.4. A11y: text-based, never icon-only.

**Tabs / SegmentedControl** — Purpose: switch between views within a screen (e.g., Quiz/Flashcards analogy — Weekly/Monthly analytics range). A11y: `role="tablist"`/`role="tab"`, arrow-key navigation. Motion: active indicator slides 220ms standard easing.

**Avatar / AvatarGroup** — Purpose: user/family member identity. Variants: initials-fallback, image, color-tagged ring for Family members. 

**ChartCard** — Purpose: wraps any Analytics chart with a consistent header (title, range selector, optional "view as table" toggle).

**AIMessage / AIInsightCard** — See §32/§33.

**QuickAction** — Purpose: chip-style shortcut (AI quick actions, Dashboard quick add circles). States: default/pressed. Mobile: horizontally scrollable row where used in a list; fixed grid where used as Dashboard Quick Add.

**EmptyState / ErrorState** — Purpose: consistent no-data/failure messaging. Structure: icon (muted, single-color line icon, never a large illustration that would slow perceived load) + H4 headline + Body Small explanation + optional CTA button. See §41/§43 for content rules.

**Skeleton** — Purpose: loading placeholder matching the shape of the real content it precedes. Motion: single subtle shimmer sweep, 1.2s loop, disabled entirely under reduced-motion (replaced with a static muted block).

**NavigationItem / BottomNavigation / Sidebar / ActionSheet** — See §18 and §22/§32 patterns; ActionSheet is the Quick Add's specific BottomSheet variant with a vertical list of large tappable rows (icon + label) for Expense/Income/Event/Bill/Gift/Goal/Note.

---

## 39. Forms

States: **default, focus, filled, error, disabled, success.**

- **Labels:** always a persistent `<label>` above the field — placeholder text is supplementary (an example value), never the only identifier of what the field is.
- **Helper text:** Body Small, muted, beneath the field, present before an error occurs where useful (e.g., "Used to calculate your monthly budget period").
- **Validation timing:** on blur for most fields; live for AmountInput (can't submit ₹0 or negative) and required fields once the form has been submitted once.
- **Error messages:** specific and actionable ("Enter an amount greater than ₹0," not "Invalid input"), shown in `--color-error` beneath the field with an inline alert icon.
- **Required indicators:** a subtle asterisk after the label text, plus `aria-required="true"` — required fields are minimized by design (progressive disclosure keeps most fields optional at first entry).
- **Success state:** used sparingly — mainly for confirmation-sensitive fields (e.g., successful import validation) — a small check icon beside the field, `--color-success`.

---

## 40. Tables & Data-Dense UI

Rules for financial density without overwhelm:
- **Primary information** (amounts, balances): largest size in its context, highest contrast (`--color-text-primary`).
- **Secondary information** (categories, dates): `--color-text-secondary`, one step down in size.
- **Metadata** (timestamps, payment method, IDs): `--color-text-muted`, Caption size, only shown on detail views or desktop tables — omitted on mobile rows by default.
- **Actions:** icon buttons or a single "..." overflow menu per row, never more than 2 visible inline actions on a data row.
- **Desktop tables** (e.g., a full Transactions table view on wide viewports): use `--elevation-1` container, row hover = `--color-surface-hover`, sortable column headers with a subtle sort-direction chevron, sticky header on scroll.
- **Rule of one focal number per row:** a data row never presents two equally-weighted numeric values — one (usually the amount) is always visually dominant.

---

## 41. Empty States

Every empty state names **what's empty, why it matters, and what to do next.**

| Screen | Message pattern |
|---|---|
| No expenses yet | "No expenses yet — log your first one to start seeing your spending clearly." + Add Expense CTA |
| No events this month | "Nothing on the calendar this month yet." + Add Event CTA |
| No budget configured | "No budget set for [category] — set one to track your spending automatically." + Create Budget CTA |
| No goals yet | "No savings goals yet — what are you working toward?" + Create Goal CTA |
| No AI insights yet | "Insights appear once there's a bit of activity to learn from — check back in a few days." (no CTA needed, purely informative) |
| No gifts planned | "No gifts planned — add one to keep occasions on budget." + Add Gift CTA |

Visual: single muted line icon (§13 scale, `--icon-size-xl`) + H4 + Body Small, centered, generous vertical padding (`--space-10`+) so it never feels like an error.

---

## 42. Loading States

- **Skeleton cards/rows** for all list and card content (§38 Skeleton) — never a full-screen spinner for content areas that have a known shape.
- **Calendar loading:** grid renders immediately with muted placeholder cells (no numerals/dots), populates progressively as data resolves.
- **Chart loading:** axis and frame render immediately, data draws in with a brief 220ms fade once available — never a spinner replacing the whole chart area.
- **AI loading:** three-dot typing indicator only (§32.4) — no skeleton text, since AI response length is unpredictable.
- **Profile loading:** skeleton avatar circle + two text bars.

General rule: a full-screen spinner is used only for true first-load (cold app start before any shell can render) — everywhere else, the shell renders first and skeletons fill in.

---

## 43. Error States

Friendly, specific, always paired with a recovery path:

| Error | Message | Recovery |
|---|---|---|
| Unable to load data | "We couldn't load this right now." | Retry button |
| Storage unavailable | "Local storage isn't available in this browser — some features may not work." | Link to help/settings |
| AI unavailable | "AI assistant is unavailable right now — you can still add things manually." | Direct link to manual entry |
| Invalid import | "This file doesn't look like a CAL-EXPENSES backup." | Choose a different file |
| Authentication error | "Something went wrong signing you in." | Retry / contact support link |
| Network unavailable | "You're offline — changes will save locally and sync isn't required to keep working." | Dismiss (app remains usable) |

Visual: same EmptyState component shell (§38) with an error-tinted icon (`--color-error`, muted background) instead of neutral.

---

## 44. Notifications

- **In-app banner (top, transient):** used for non-critical confirmations that don't warrant a full Toast interruption context switch — rare, mostly reserved for system-level messages (e.g., app update available).
- **Notification bell (Dashboard top bar):** badge dot (no number badge, to avoid anxiety-inducing count pressure) — opens a Notifications list: Budget Alerts, Upcoming Bills, Goal Milestones, AI Insights ready.
- **Toast:** see §38 — used for immediate action feedback (Expense saved, Export complete, Import failed).
- **Push (PWA, if enabled):** bill due reminders and budget threshold alerts only — never marketing-style pings; opt-in per category in Settings → Notifications.

---

## 45. Responsive Rules

Explicit transformation per major surface:

| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| Navigation | Bottom nav, 5 slots | Bottom nav (or top rail if space allows) | Persistent sidebar |
| Dashboard | Single-column stacked cards | 2-column pairing for stat cards | 4-column stat row + 2-column detail cards |
| Charts | Simplified, horizontally scrollable where needed | Medium detail | Full detail with hover tooltips |
| Modal vs. Sheet | Bottom sheet always | Bottom sheet always | Centered Dialog |
| Table vs. Cards | TransactionRow cards | TransactionRow cards | Optional full data table view (toggle) |
| Calendar cell | Compact, numeral + dots | Larger, + optional label | Largest, + optional label |
| Day Detail | Bottom sheet, full-width | Bottom sheet | Right-side slide-in panel (calendar stays visible) |
| Quick Add | ActionSheet (bottom) | ActionSheet (bottom) | Dropdown menu from a "+ New" button in the top bar |

---

## 46. Stitch MCP Workflow

Design production should proceed through Google Stitch MCP in the following fixed order, always building on the previously established system rather than generating disconnected screens:

1. Analyze reference images (§2, complete).
2. Establish design tokens (§6–§14, complete — feed directly into Stitch as global tokens).
3. Establish typography (§7).
4. Establish color system (§6).
5. Establish spacing (§8).
6. Establish component system (§38).
7. Establish mobile navigation (§18.1).
8. Design mobile dashboard (§19.1).
9. Design mobile calendar (§21.1).
10. Design expense entry (§23).
11. Design transaction details (§24).
12. Design budgets (§26).
13. Design analytics (§31).
14. Design AI assistant (§32).
15. Design events (§28).
16. Design gifts (§29).
17. Design goals (§27).
18. Design profile/settings (§34–35).
19. Adapt to tablet (§10, §45).
20. Adapt to desktop (§17, §19.2, §45).
21. Review visual consistency against this document — flag and resolve any divergence before finalizing.
22. Document any final decisions or deviations as an addendum to this design.md rather than as undocumented screen-level choices.

Each Stitch screen generation prompt should explicitly reference the relevant section numbers above (tokens, component contracts, spacing) so screens stay coherent rather than becoming isolated visual experiments.

---

## 47. Implementation Rules

- All colors, spacing, radii, typography, motion values, and breakpoints must be implemented as CSS custom properties using the exact token names given in this document — no hard-coded hex/px values in components.
- Light and dark themes are two token sets swapped at the root (`:root[data-theme="dark"]`), never computed at runtime via filters/inversion.
- Every interactive component must implement all states listed in its §38 contract before being considered complete — a component shipped without loading/empty/error states is incomplete, not "good enough for now."
- Mobile layouts are the default/base CSS; tablet and desktop are additive media-query overrides — never the reverse (no desktop-first-then-shrink).
- No component may introduce a new radius, shadow, or color value outside §6/§11/§12 without adding it to this document first.
- AI-initiated data writes must always route through the Confirm-gated pattern in §32.3 — no exceptions, including for "obviously correct" detections.
- Every destructive action (Clear local data, Delete account, Delete transaction in bulk) requires the two-step pattern from §46 Export confirmation, adapted to a Dialog/Sheet warning + explicit confirm button labeled with the action itself (e.g., "Delete all local data," never a bare "Confirm").
- All aggregate financial figures displayed anywhere must use `tnum` tabular numerals (§7) for alignment consistency.

---

## 48. Design QA Checklist

- [x] Mobile-first
- [x] Desktop supported
- [x] Light mode
- [x] Dark mode
- [x] Calendar is the primary feature
- [x] Fast expense entry
- [x] Accessible
- [x] Touch-friendly
- [x] Consistent components
- [x] Consistent typography
- [x] Consistent spacing
- [x] AI integrated naturally
- [x] No fake functionality
- [x] No copied reference layouts
- [x] Empty states defined
- [x] Loading states defined
- [x] Error states defined
- [x] Reduced motion defined
- [x] Stitch workflow documented
- [x] Design tokens implementation-ready
