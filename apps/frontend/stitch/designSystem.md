---
name: Obsidian Precision
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c6c6cf'
  on-secondary: '#2f3037'
  secondary-container: '#45464e'
  on-secondary-container: '#b4b4bd'
  tertiary: '#ffffff'
  on-tertiary: '#32302d'
  tertiary-container: '#e7e1dd'
  on-tertiary-container: '#676460'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e2e1eb'
  secondary-fixed-dim: '#c6c6cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#45464e'
  tertiary-fixed: '#e7e1dd'
  tertiary-fixed-dim: '#cbc6c1'
  on-tertiary-fixed: '#1d1b19'
  on-tertiary-fixed-variant: '#494643'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  huge: 64px
  sidebar-width: 240px
  sidebar-collapsed: 64px
---

## Brand & Style

The design system is engineered for high-performance SaaS environments where clarity, speed, and information density are paramount. It draws inspiration from modern developer tools, prioritizing a "utility-first" aesthetic that removes visual noise to focus on user workflows.

The style is **Deep Dark Minimalism**. It rejects decorative flourishes like gradients, heavy shadows, or vibrant neon accents in favor of a monochromatic, structural approach. Depth is communicated through subtle tonal shifts and precise borders rather than elevation. The emotional response is one of serious productivity, technical sophistication, and reliability.

## Colors

This design system utilizes a strictly controlled grayscale palette to establish a clear visual hierarchy. 

- **Core Surfaces**: The background (#09090B) acts as the base "void," with the surface (#111113) and card (#18181B) layers providing incremental steps of perceived elevation.
- **Typography**: Primary text uses #FAFAFA for maximum contrast against the deep background. Secondary text (#A1A1AA) is used for descriptions and metadata, while Muted text (#71717A) is reserved for inactive states and placeholders.
- **Accents**: Functional colors (Success, Warning, Error) should be used sparingly in desaturated tones to maintain the professional atmosphere.

## Typography

The system relies exclusively on **Inter** to provide a clean, systematic feel. The hierarchy is tight, using subtle weight shifts (400 to 600) to differentiate content without relying on size alone. 

For dense dashboard views, `body-sm` (13px) is the preferred size for data tables and sidebars. Letter spacing is slightly tightened on larger headlines to ensure a "locked-in" feel, while labels use slightly increased tracking for legibility at small sizes.

## Layout & Spacing

A strict **8px grid** governs all spatial relationships. This ensures a mathematical consistency that is felt rather than seen.

- **Grid System**: Use a 12-column fluid grid for main content areas with 24px gutters.
- **Sidebar**: A persistent left-hand navigation. It transitions between a 240px expanded state and a 64px collapsed icon-only state.
- **Density**: Content-heavy views should utilize 8px and 16px increments for internal component spacing to maintain high information density. 24px+ should only be used for major section breaks.

## Elevation & Depth

This design system avoids traditional drop shadows. Depth is achieved through **Tonal Layering** and **Structural Outlines**:

- **Borders**: Elements are separated by 1px solid borders using `rgba(255, 255, 255, 0.08)`.
- **Hover States**: Use a subtle lightening of the background (e.g., from #111113 to #18181B) rather than a shadow or glow.
- **Modals/Overlays**: For elements that must float (like Command Menus), use a slightly higher background tone (#1C1C1F) and a sharper, low-opacity 1px border to define the edge.
- **Transitions**: Implement Framer Motion-style physics: `type: "spring", stiffness: 300, damping: 30`. Use subtle Y-axis offsets (4px to 0px) and opacity fades (0 to 1) for entering elements.

## Shapes

The shape language is disciplined and "Soft-Square." 

- **Default Radius**: 4px (`0.25rem`) for standard buttons, input fields, and small UI components.
- **Card Radius**: 8px (`0.5rem`) for project cards and modal containers to give them a slightly more defined container feel.
- **Interactive Elements**: Use 4px radius for all nested items (menu items, list items) to maintain a cohesive structural look.

## Components

### Buttons & Inputs
- **Primary Button**: Solid #FAFAFA background with #09090B text. No shadows.
- **Ghost Button**: Transparent background, 1px border (rgba(255,255,255,0.08)), #FAFAFA text.
- **Input Fields**: Background #09090B, 1px border. Focus state changes border to rgba(255,255,255,0.2) without an outer glow.

### Command Search (Linear-style)
- A centered modal with a fixed width (640px). 
- Features a search input at the top with no border, followed by a list of results.
- Active items use a #1C1C1F background.

### Project Cards
- Background: #18181B.
- Border: 1px rgba(255,255,255,0.08).
- Include status indicators: Small 8px circles with desaturated functional colors (e.g., #22C55E for "Active," but at 60% saturation).

### Sidebar
- Background: #111113.
- Right-side border separates it from the main stage.
- Navigation items include a 16px icon and `body-sm` text.

### Chips/Tags
- Background: rgba(255,255,255,0.04).
- Text: #A1A1AA.
- Border: 1px rgba(255,255,255,0.08).
