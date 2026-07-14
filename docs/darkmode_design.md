# Dark Mode Design System — Deep Dark Blue Palette

## 1. What's wrong with the current implementation

Diagnosing the current screenshot before prescribing fixes:

| Issue | Where it shows up | Why it's a problem |
|---|---|---|
| Off-family gray in table header | Header row (`PROJECT NAME`, `DEPARTMENT`...) is a flat slate-gray (~`#4B5768`) | Reads like an unstyled default/light-mode leftover — it doesn't share a hue with the rest of the dark blue UI |
| No elevation system | Background, sidebar, and table body all sit at roughly the same near-black value | Nothing visually "lifts" — cards, rows, and page background blur together except where that gray header breaks it |
| Divider contrast too harsh | Thin light-gray lines between rows | Against a near-black background these read as bright hairlines, adding visual noise instead of quiet structure |
| Accent colors don't share a palette | "New Record Entry" (saturated blue) vs "Export As" (saturated green) | Two competing saturated colors with no relationship — green is also reused for status ("On going"), so the button visually competes with data state |
| Icon button styling inconsistent | Edit = light circle bg, Delete = dark circle bg | No shared pattern for action icons; looks like two different components were pasted together |
| Harsh pure-white checkboxes | Row/column checkboxes | Pure white squares are the highest-contrast element on the page, drawing the eye more than the data itself |
| Background is closer to black than blue | Page background | "Deep dark blue" needs a visible blue undertone at every layer, not just in accents |

## 2. Core principle

Every surface in the UI should sit on the **same blue hue family**, differentiated only by **lightness** (elevation), not by switching hues. Accent and status colors are the *only* saturated colors allowed — everything else is desaturated navy.

## 3. Color tokens

### 3.1 Surfaces (elevation scale — darkest to lightest)

```css
:root[data-theme="dark"] {
  --bg-canvas:      #0A0E1A; /* page background, the "floor" */
  --bg-surface:     #10162A; /* sidebar, table body, cards */
  --bg-elevated:    #171F38; /* table header, modals, dropdowns, popovers */
  --bg-hover:       #1F2944; /* row hover, list item hover */
  --bg-active:      #253262; /* selected/active row or nav item */
}
```

All four values share the same hue (~225°–230°) and only step up in lightness (~8% → 12% → 16% → 20% → 25%). This is what makes it read as "deep dark blue" instead of "black with blue accents."

### 3.2 Borders / dividers

```css
--border-subtle:  rgba(148, 163, 196, 0.08); /* row dividers */
--border-default: rgba(148, 163, 196, 0.14); /* card outlines, input borders */
--border-strong:  rgba(148, 163, 196, 0.24); /* focus rings, active outlines */
```

Never use a flat hex gray for borders in dark mode — use a low-opacity white-blue so it automatically sits correctly against whatever surface it's on.

### 3.3 Text

```css
--text-primary:   #E7ECF7; /* headings, primary labels */
--text-secondary: #9AA7C7; /* body text, dates, secondary labels */
--text-tertiary:  #6B7797; /* placeholders, disabled, timestamps */
```

Avoid pure `#FFFFFF` for text — it creates more contrast than the rest of the palette and looks like it belongs to a different design pass.

### 3.4 Accent (single primary accent — used for links, primary buttons, active nav)

```css
--accent:         #4C7DFF;
--accent-hover:   #6B92FF;
--accent-muted:   rgba(76, 125, 255, 0.14); /* active nav bg, subtle highlight */
```

Only **one** saturated accent hue exists in the whole system. "New Record Entry" and any other primary CTA use this same token — do not introduce a second accent color (e.g. green) for another button. If "Export" needs to be visually distinct, make it a **secondary/outline style** using border-default + text-secondary, not a different hue.

### 3.5 Status colors (reserved exclusively for state — never reused on buttons/chrome)

```css
--status-success:      #34D399;
--status-success-bg:   rgba(52, 211, 153, 0.12);
--status-warning:      #FBBF24;
--status-warning-bg:   rgba(251, 191, 36, 0.12);
--status-danger:       #F87171;
--status-danger-bg:    rgba(248, 113, 113, 0.12);
```

Because these are reserved for status only, "On going" / "Under Review" chips stay meaningful — nothing else on the page competes with them for the user's attention.

## 4. Component rules

**Table**
- Table header uses `--bg-elevated`, text `--text-secondary`, uppercase, letter-spacing ~0.03em — no gray outlier.
- Rows use `--bg-surface`, separated by `--border-subtle` only (no per-cell borders).
- Row hover: `--bg-hover`, transition 120ms.

**Buttons**
- Primary: `--accent` fill, white text (`#F5F8FF`, not pure white).
- Secondary: transparent fill, `--border-default` outline, `--text-secondary` label.
- Never use a status color (green/amber/red) as a button fill unless the action *is* that state (e.g. a delete-confirm button may use `--status-danger`).

**Status badges**
- Pill shape, `background: var(--status-*-bg)`, `color: var(--status-*)`, no border, or a 1px border at 20% opacity of the same hue.

**Icon action buttons (edit/delete)**
- Use one consistent shape and background for *all* icon buttons: `--bg-elevated` circle/rounded-square, `--text-secondary` icon, hover → `--bg-hover` background + `--text-primary` icon (or `--status-danger` icon color on hover specifically for delete).
- Do not mix a light-filled circle (edit) with a dark-filled circle (delete) — pick one treatment for both.

**Checkboxes**
- Unchecked: transparent fill, 1.5px `--border-default` outline, 4px radius.
- Checked: `--accent` fill, white check icon.
- Never pure white unchecked boxes.

**Sidebar**
- Background `--bg-surface` (same as table body, so it recedes rather than competing).
- Active item: `--bg-active` or `--accent-muted` background with `--accent` icon/text.
- Inactive icons: `--text-tertiary`.

## 5. Quick before → after mapping

| Element | Before | After |
|---|---|---|
| Page background | near-black `#0A0E17` | `--bg-canvas` `#0A0E1A` (same darkness, explicit blue hue) |
| Table header | flat gray `#4B5768` | `--bg-elevated` `#171F38` |
| Row dividers | light solid gray line | `--border-subtle` (8% opacity blue-white) |
| Primary button | saturated blue `#2196F3`-ish | `--accent` `#4C7DFF` |
| Export button | saturated green | secondary/outline style, no fill color |
| Edit icon button | light circle | `--bg-elevated` circle, unified with delete |
| Delete icon button | dark circle | same treatment as edit, hover → `--status-danger` |
| Checkbox | pure white square | outlined, `--accent` fill when checked |

## 6. Implementation note

If this is Tailwind: define these as CSS variables in `:root[data-theme="dark"]` (as above) and reference them via `bg-[var(--bg-surface)]` etc., or map them into `tailwind.config` under `theme.extend.colors` (e.g. `surface: 'var(--bg-surface)'`) so you can use `bg-surface`, `text-secondary`, etc. as regular utility classes. This keeps one source of truth instead of hardcoding hexes across components.
