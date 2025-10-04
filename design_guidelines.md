# wPanel Design Guidelines

## Design Approach
**Hybrid Approach**: Design system foundation with distinctive brand identity. Drawing from Linear's data clarity, Vercel's dashboard aesthetics, and Material Design's component structure, enhanced with the requested signature blue-purple gradient treatment.

**Core Principle**: Professional admin interface with a modern, gradient-enhanced visual identity that maintains clarity for data-heavy operations.

---

## Color Palette

### Brand Gradients (Signature Element)
**Primary Gradient (Sidebar/Header)**
- From: `250 70% 60%` (vibrant purple)
- To: `220 80% 55%` (deep blue)
- Direction: 135deg (diagonal flow)

**Accent Gradient (CTAs/Focus)**
- From: `220 75% 58%` (blue)
- To: `280 65% 62%` (purple)

### Dark Mode
- Background: `222 15% 8%` (near-black)
- Surface: `222 15% 12%` (card backgrounds)
- Border: `222 10% 20%` (subtle dividers)
- Text Primary: `0 0% 98%`
- Text Secondary: `0 0% 70%`
- Gauge backgrounds: `222 15% 15%` with gradient overlays

### Light Mode
- Background: `0 0% 98%` (off-white)
- Surface: `0 0% 100%` (pure white cards)
- Border: `220 15% 90%` (soft dividers)
- Text Primary: `222 20% 15%`
- Text Secondary: `222 15% 45%`
- Gauge backgrounds: `0 0% 96%` with gradient accents

### Data Visualization
- Success/Green: `142 70% 45%`
- Warning/Yellow: `45 90% 55%`
- Error/Red: `0 85% 60%`
- Info/Cyan: `195 75% 50%`

---

## Typography
**Font Stack**: 'Inter' for UI, 'JetBrains Mono' for data/metrics

- **Headers**: 
  - H1: text-3xl/4xl, font-bold (Dashboard titles)
  - H2: text-2xl/3xl, font-semibold (Section headers)
  - H3: text-xl/2xl, font-semibold (Card titles)

- **Body**: 
  - Default: text-sm/base, font-normal
  - Labels: text-xs, font-medium, uppercase tracking-wide
  - Metrics/Data: font-mono, text-lg/xl, font-semibold

---

## Layout System

**Spacing Units**: Consistent use of 4, 6, 8, 12, 16 (p-4, gap-6, mt-8, py-12, space-y-16)

**Sidebar**: 
- Width: w-64 (desktop), collapsible to w-16 (icon-only)
- Full-height with gradient background
- Sticky positioning with blur backdrop when scrolling

**Main Content Area**:
- Container: max-w-7xl mx-auto px-6 lg:px-8
- Dashboard grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- Card elevation: shadow-lg with border accent

**Header**:
- Height: h-16
- Gradient background matching sidebar
- Glass-morphism effect: backdrop-blur-md bg-opacity-90
- Includes: breadcrumbs, search, notifications, user menu

---

## Component Library

### Dashboard Gauges (Hero Components)
- **Circular Gauges**: 
  - Size: w-32 h-32 to w-40 h-40
  - Gradient stroke using conic-gradient
  - Center metric: large mono font with unit label
  - Animated progress with smooth transitions
  - Glow effect on critical thresholds

- **Gauge Card Container**:
  - Background: gradient from transparent to subtle brand color (5% opacity)
  - Border: 1px gradient border
  - Icon in top-left corner with gradient fill
  - Real-time status indicator (pulsing dot)

### Navigation Sidebar
- **Logo Area**: py-6 with gradient text effect
- **Menu Items**:
  - Default: text-white/70 with hover:text-white
  - Active: bg-white/10 backdrop-blur with left gradient border (4px)
  - Icon + label layout with rounded-lg hover states
  - Smooth transitions (150ms)

### Data Tables (Clients/Suppliers)
- **Table Structure**:
  - Sticky header with gradient background
  - Zebra striping: odd rows with subtle bg-surface
  - Row hover: scale-up effect with shadow
  - Action buttons: icon-only with tooltips
  
- **Profile Photo Cell**:
  - Size: w-10 h-10 rounded-full
  - Border: 2px gradient border
  - Fallback: gradient background with initials

### Forms (CRUD Operations)
- **Input Fields**:
  - Height: h-10/12
  - Border: 1.5px solid with focus:ring-2 gradient ring
  - Background: dark mode surface, light mode white
  - Consistent padding: px-4

- **Photo Upload**:
  - Drag-drop zone: dashed gradient border
  - Preview: rounded-lg with gradient overlay on hover
  - Upload button: gradient background with white text

### Modals/Dialogs
- Backdrop: bg-black/60 backdrop-blur-sm
- Container: max-w-2xl with gradient border-top
- Slide-up animation (300ms ease-out)
- Close button: top-right with gradient hover

---

## Interaction Patterns

**Real-time Updates (WebSocket)**:
- Pulse animation on data refresh
- Color shift on threshold breach
- Toast notifications: slide-in from top-right with gradient accent

**Navigation**:
- SPA transitions: crossfade (200ms)
- Page load: skeleton screens with gradient shimmer
- Breadcrumbs: interactive with gradient separator arrows

**Hover States**:
- Cards: subtle lift (translateY(-2px)) + shadow increase
- Buttons: gradient shift + slight scale (1.02)
- Links: gradient underline slide-in

**Loading States**:
- Gauge spinners: gradient rotating border
- Table skeletons: gradient shimmer animation
- Button loading: gradient progress bar overlay

---

## Theme Switching
- Toggle in header: sun/moon icons with gradient backgrounds
- Smooth transition: transition-colors duration-300
- Persist preference: localStorage
- Gradient adjustments: maintain vibrancy in both themes
- Border contrast: ensure visibility in both modes

---

## Images
**Profile Photos**: User avatars and client/supplier profile images throughout the application
**Placement**: 
- Login page: subtle background pattern with gradient overlay
- Dashboard cards: small icons with gradient treatments
- Client/Supplier tables: profile photos in first column
- User menu (header): profile photo with gradient ring

**No large hero images** - this is a utility dashboard focused on data and functionality.