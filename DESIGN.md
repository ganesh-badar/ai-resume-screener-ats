# Design System — AI Resume Screener & ATS

## 1. Design Philosophy & System Identity
- **Product Truth**: AI-assisted Resume Screener & Applicant Tracking System (ATS) evaluation workspace.
- **Mode**: Operate — Professional recruiter & candidate screening console, high scanability, high data density, zero fluff.
- **Craft Floor Rules**: Zero gradient text, zero pill buttons (crisp 4px rectangular radius), dual mode (light & dark Obsidian Precision), full browser surface theming (custom scrollbar, custom selection, focus rings, tabular figures), minimum functional font size of 12px.

## 2. Color Palette & Surfaces
```css
:root {
  /* Light Mode (Default) */
  --bg-primary: #F8FAFC;
  --bg-nav: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-subtle: #F1F5F9;
  --border-color: #E2E8F0;
  --border-subtle: #CBD5E1;
  --border-strong: #94A3B8;

  --text-primary: #0F172A;
  --text-nav: #334155;
  --text-secondary: #475569;
  --text-muted: #64748B;

  /* Cobalt Accent */
  --brand-primary: #2563EB;
  --brand-primary-hover: #1D4ED8;
  --brand-navy: #0F172A;
  --brand-navy-hover: #1E293B;
  --brand-subtle: rgba(37, 99, 235, 0.08);
}

[data-theme="dark"] {
  /* Dark Mode */
  --bg-primary: #070809;
  --bg-nav: #0e1015;
  --bg-card: #131620;
  --bg-subtle: #0a0c12;
  --border-color: #1e2536;
  --border-subtle: #2d3548;
  --border-strong: #3d4a63;

  --text-primary: #F1F5F9;
  --text-nav: #CBD5E1;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
}
```

## 3. Typography
- **Display**: `'Space Grotesk', system-ui, sans-serif` for titles and metric headings (-0.02em letter-spacing).
- **Body**: `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif` for recruiter copy, evaluation tables, and job descriptions.
- **Code & ATS Tokens**: `'JetBrains Mono', monospace` with `font-variant-numeric: tabular-nums` for match percentages, keyword counts, and timestamps.
- **Scale**:
  - Main Score: 2.5rem – 3rem (700 weight)
  - Headings: 1.15rem – 1.5rem
  - Body: 0.875rem – 1rem
  - Badges & Match Tags: 0.75rem (12px, WCAG legibility compliant)

## 4. Components & Elevation
- **Scorecards & Panels**: 4px radius, single subtle 1px border (`var(--border-color)`), zero heavy shadows.
- **Buttons**: Crisp 4px rectangular border radius. Zero pills. High-contrast solid primary action (`var(--brand-primary)`) or dark neutral (`var(--brand-navy)`).
- **Dropzone**: 1.5px dashed border with instant feedback state on drag-over.

## 5. Browser Surfaces
- `::selection`: `rgba(37, 99, 235, 0.3)` with `var(--text-primary)`
- `input, textarea, select`: `caret-color: #2563eb`
- `:focus-visible`: `2px solid #2563eb`, outline offset 2px
- `::-webkit-scrollbar`: 8px width, `var(--border-subtle)` thumb with `var(--bg-primary)` track

