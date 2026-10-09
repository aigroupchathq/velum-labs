# DESIGN SYSTEM BASELINE & TOKEN SPECIFICATION
**Branch**: `design/expert-ui-review`  
**Date**: October 9, 2026  

---

## 1. Color System & Surfaces

```css
:root {
  /* Core Brand Colors */
  --apple-bg: #070709;
  --apple-panel-bg: rgba(18, 18, 22, 0.75);
  --apple-panel-interactive: rgba(20, 20, 25, 0.65);
  --apple-border: rgba(255, 255, 255, 0.08);

  /* Semantic Accents */
  --color-emerald: #34d399; /* Eligibility & Verification */
  --color-rose: #f87171;    /* Boundary Exclusion & Friction */
  --color-amber: #fbbf24;   /* Caution & Contradiction Alert */
  --color-purple: #c084fc;  /* High Harmonic Match & Dyad Sync */
  --color-cyan: #38bdf8;    /* Science & Algorithmic Layer */
}
```

---

## 2. Typography Scale

- **Display Hero**: `text-4xl sm:text-6xl md:text-7xl`, `tracking-tight`, `font-semibold`, line-height `1.08`
- **Section Heading**: `text-2xl sm:text-3xl`, `tracking-tight`, `font-semibold`
- **Card Title**: `text-xl sm:text-2xl`, `font-bold`, `tracking-tight`
- **Subhead Badge**: `text-[10px] sm:text-[11px]`, `font-mono`, `uppercase`, `tracking-wider`
- **Body Text**: `text-xs sm:text-sm`, `text-neutral-300`, `leading-relaxed`, `font-normal`

---

## 3. Interaction & Touch Targets

- **Minimum Touch Bounds**: $44 \times 44\text{px}$ touch target box on all mobile buttons.
- **Glassmorphic Panels**: Backdrop blur `blur(32px) saturate(180%)`, border `1px solid rgba(255, 255, 255, 0.08)`.
- **Focus Rings**: `focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none`.
- **Motion & Transitions**: `cubic-bezier(0.16, 1, 0.3, 1)` smooth Apple-grade transition curve.
