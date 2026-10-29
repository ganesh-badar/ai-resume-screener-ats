# Design System — AI Resume Screener & ATS

## 1. Design Philosophy & System Identity
- **Product Truth**: AI-assisted Resume Screener & Applicant Tracking System (ATS) evaluation workspace.
- **Mode**: Operate — Professional recruiter & candidate screening console, high scanability.
- **Color Theme**: Palette 2 — Obsidian Velvet / Titanium Violet (`#17151C` → `#E2DDE7`).
- **Craft Floor Rules**: Zero gradient text, zero pill buttons (crisp 4px rectangular radius), dual mode, full browser surface theming (custom scrollbar, custom selection, focus rings, tabular figures), minimum functional font size of 12px.

## 2. Color Palette & Surfaces (Obsidian Velvet)
```css
[data-theme="dark"] {
  /* Obsidian Velvet (#17151C → #E2DDE7 ramp) */
  --bg-primary: #17151C;             /* Deepest base surface */
  --bg-nav: #17151C;                 /* Header navigation */
  --bg-card: #292531;                /* Elevated cards & scorecards */
  --bg-subtle: #17151C;
  --bg-inset: #45404F;               /* Inset wells & dividers */

  /* Borders & Dividers */
  --border-color: #45404F;           /* Structural borders */
  --border-subtle: #716879;          /* Secondary borders */
  --border-strong: #AAA2B3;          /* High-emphasis borders */

  /* Typography */
  --text-primary: #E2DDE7;           /* High-contrast crisp text */
  --text-nav: #AAA2B3;
  --text-secondary: #AAA2B3;         /* Secondary labels */
  --text-muted: #716879;             /* Muted helper copy */

  /* Primary Action */
  --brand-primary: #2563EB;
  --brand-primary-hover: #60A5FA;
  --brand-navy: #292531;
  --brand-navy-hover: #45404F;
}
```

## 3. Typography
- **Display & Headings**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (-0.025em letter-spacing).
- **Body**: System UI Stack for recruiter copy, evaluation tables, and job descriptions.
- **Code & ATS Tokens**: `'JetBrains Mono', monospace` with `font-variant-numeric: tabular-nums` for match percentages, keyword counts, and timestamps.
- **Scale**:
  - Main Score: 2.5rem – 3rem (700 weight)
  - Headings: 1.15rem – 1.5rem
  - Body: 0.875rem – 1rem
  - Badges & Match Tags: 0.75rem (12px, WCAG legibility compliant)

## 4. Components & Elevation
- **Scorecards & Panels**: 4px radius, single subtle 1px border (`#45404F`), zero heavy shadows.
- **Buttons**: Crisp 4px rectangular border radius. Zero pills. High-contrast solid primary action (`var(--brand-primary)`).
- **Dropzone**: 1.5px dashed border with instant feedback state on drag-over.

## 5. Browser Surfaces
- `::selection`: `rgba(37, 99, 235, 0.3)` with `var(--text-primary)`
- `input, textarea, select`: `caret-color: #2563eb`
- `:focus-visible`: `2px solid #2563eb`, outline offset 2px
- `::-webkit-scrollbar`: 8px width, `#716879` thumb with `#17151C` track
