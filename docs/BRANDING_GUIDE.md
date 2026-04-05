# GradeUp - Visual Identity & Branding Guide

## Brand Philosophy

**We design for every student.**

GradeUp's design must be:
- **Accessible** - WCAG AAA compliant
- **Dyslexia-friendly** - Clean lines, readable fonts
- **Inclusive** - Works for all devices, abilities
- **Student-first** - No distractions, pure learning
- **Warm** - Welcoming, not corporate

---

## Color Palette

### Primary Colors

| Color | Hex | Usage | Accessibility |
|-------|-----|-------|-----------------|
| **Blue** | `#2563eb` | Primary actions, links | WCAG AA ✓ |
| **Purple** | `#8b5cf6` | Community features | WCAG AA ✓ |
| **Coral** | `#ff6348` | Urgency, alerts | WCAG AA ✓ |

### Semantic Colors

| Semantic | Color | Hex | Contrast |
|----------|-------|-----|----------|
| Success | Green | `#10b981` | 4.8:1 |
| Warning | Amber | `#f59e0b` | 5.2:1 |
| Danger | Red | `#ef4444` | 5.1:1 |
| Info | Blue | `#0ea5e9` | 4.7:1 |

### Neutral Colors

```
50   #f9fafb
100  #f3f4f6
200  #e5e7eb
300  #d1d5db
400  #9ca3af
500  #6b7280
600  #4b5563
700  #374151
800  #1f2937
900  #111827
```

### Subject Colors (For Cards)

```css
Mathematics:     #3b82f6 (Blue)
Language:        #ef4444 (Red)
Literature:      #9333ea (Purple)
Science:         #06b6d4 (Cyan)
Humanities:      #f97316 (Orange)
Computing:       #6366f1 (Indigo)
```

---

## Typography

### Font Stack (Dyslexia-Friendly)

```css
/* Default */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 
             Cantarell, sans-serif;

/* Dyslexia-Friendly Mode */
font-family: 'OpenDyslexic', 'Segoe UI', sans-serif;

/* Monospace */
font-family: 'Fira Code', 'Monaco', monospace;
```

### Size Scale

| Use | Size | Weight | Line Height |
|-----|------|--------|-------------|
| **Hero Title** | 28-32px | 700 | 1.2 |
| **Page Title** | 24-28px | 700 | 1.3 |
| **Section Title** | 18-20px | 600 | 1.4 |
| **Body** | 14-16px | 400 | 1.5-1.8* |
| **Small** | 12-14px | 400 | 1.4 |
| **Tiny** | 11-12px | 400 | 1.3 |

*Dyslexia mode: 1.8x line height

### Font Weights

```
Light:   300
Regular: 400
Medium:  500
Semibold: 600
Bold:    700
```

---

## Component Library

### Buttons

```tsx
// Primary (Most important action)
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
  Primary
</button>

// Secondary (Alternative action)
<button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200">
  Secondary
</button>

// Ghost (Less emphasis)
<button className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg">
  Ghost
</button>

// Disabled
<button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
  Disabled
</button>
```

**States:**
- Normal
- Hover (Darken by 1 shade)
- Active (Darken by 2 shades)
- Disabled (Gray out)
- Loading (Show spinner)

### Cards

```tsx
<div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
  {/* Card content */}
</div>

// Compact spacing: p-3
// Default spacing: p-4
// Generous spacing: p-6
```

**Card Shadows:**
- Rest: `border-gray-200` (no shadow)
- Hover: `shadow-md` (subtle elevation)
- Active: `shadow-lg` (more elevation)

### Forms

```tsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Email Address
  </label>
  <input
    type="email"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
</div>
```

**States:**
- Default: `border-gray-300`
- Focus: `ring-2 ring-blue-500 border-transparent`
- Error: `ring-2 ring-red-500 border-transparent`
- Disabled: `bg-gray-100 text-gray-500 cursor-not-allowed`

### Badges

```tsx
// Status badges
<span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
  ✅ Verified
</span>

// Category badges
<span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
  Mathematics
</span>

// Notification badges
<span className="inline-flex items-center justify-center w-5 h-5 text-white text-xs font-bold bg-red-600 rounded-full">
  3
</span>
```

---

## Accessibility Features

### Dark Mode / High Contrast

```css
/* Automatic based on OS preference */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
  }
}

/* User-controlled in settings */
html.high-contrast {
  --contrast: 7:1; /* WCAG AAA */
}
```

### Focus Indicators

```css
/* Keyboard focus - always visible */
*:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
  border-radius: 2px;
}

/* Remove default blue outline */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Skip Links

```html
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to main content
</a>

<main id="main-content">
  {/* Page content */}
</main>
```

### Screen Reader Only Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## Layout System

### Spacing Scale

```
0   0px
1   4px
2   8px
3   12px
4   16px
6   24px
8   32px
12  48px
16  64px
20  80px
24  96px
```

### Grid System

```css
/* Container */
max-width: 1280px (2xl)
margin: 0 auto
padding: 8px (mobile), 16px (tablet), 32px (desktop)

/* Grid columns */
1 column:  mobile (< 640px)
2 columns: tablet (640px - 1024px)
3 columns: desktop (> 1024px)
```

### Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## Navigation

### Sidebar Navigation

```
┌─────────────────┐
│ GradeUp Logo    │ 64px
├─────────────────┤
│ • Dashboard     │
│ • Subjects      │
│ • Past Papers   │
│ • Flashcards    │ Main nav
│ • AI Tutor      │ 2-3px hover indicator
│ • Community     │
│ • Study Groups  │
│ • Notes         │
├─────────────────┤
│ • Settings      │
│ ❤️ Donate       │ Secondary nav
├─────────────────┤
│ [Collapse <]    │ Collapse button
└─────────────────┘
```

**Sidebar State:**
- **Expanded**: 256px (lg+)
- **Collapsed**: 80px
- **Mobile**: -256px (slides in from left)

### Mobile Navigation

- Hamburger menu (top-left)
- Fullscreen overlay when open
- 50% dark overlay behind
- Swipe-to-close enabled

---

## Responsive Design

### Mobile (< 640px)

```
┌─────────────────┐
│ ≡ [Donate] ←    │ Header
├─────────────────┤
│                 │
│  Main Content   │ Full width
│   Single Column │
│                 │
└─────────────────┘
```

### Tablet (640px - 1024px)

```
┌──────────────────────────┐
│ ≡ GradeUp    [Donate] ← │
├──────────────────────────┤
│                          │
│   2-column layout        │
│                          │
└──────────────────────────┘
```

### Desktop (> 1024px)

```
┌─────────────────────────────────────────┐
│ Sidebar │  Dashboard    [Donate] [User] │
│ ────────┼  ────────── 3-column layout   │
│  Nav    │                               │
│         │           Main Content        │
│         │              Full width       │
│         └─────────────────────────────  │
└─────────────────────────────────────────┘
```

---

## Animations & Transitions

### Principles

- Subtle (100-300ms)
- Purpose-driven (not gratuitous)
- Respectful of `prefers-reduced-motion`
- Hardware-accelerated (use `transform`)

### Common Transitions

```css
/* Hover transitions */
transition: all 200ms ease-out;

/* Focus transitions */
transition: outline 100ms ease-out;

/* Page transitions */
transition: opacity 200ms ease-in-out;

/* Loading states */
@keyframes spin {
  to { transform: rotate(360deg); }
}

animation: spin 1s linear infinite;
```

### Respect Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Copywriting Guidelines

### Tone

- **Student-first** - Speak to the learner
- **Encouraging** - Celebrate progress
- **Clear** - No jargon unless necessary  
- **Action-oriented** - Tell users what to do
- **Warm** - Friendly, not corporate

### Examples

| ❌ Don't Say | ✅ Do Say |
|-------------|-----------|
| "Please input data" | "Enter your answer" |
| "Error 404" | "We can't find that page" |
| "Authentication failed" | "Incorrect password" |
| "Submission processed" | "Your answer has been saved" |
| "No results found" | "Try different search terms" |

### Form Labels

```
❌ Email field:
<label>Email Address (Required)</label>

✅ Email field:
<label>Your email address *</label>
<span class="hint">We'll use this to send you updates</span>
```

### Button Text

```
❌ <button>OK</button>
❌ <button>Submit</button>

✅ <button>Save Answer</button>
✅ <button>Start Practice</button>
✅ <button>View Mark Scheme</button>
```

---

## Error & Success States

### Error Message

```
┌──────────────────────────────────────┐
│ ⚠️ Something went wrong              │
│ Please check your email address      │
│ [Dismiss]                            │
└──────────────────────────────────────┘

Background: #fef2f2 (red-50)
Border: #fecaca (red-200)
Text: #dc2626 (red-600)
```

### Success Message

```
┌──────────────────────────────────────┐
│ ✅ Paper submitted successfully!     │
│ It will be reviewed by our team      │
│ [Dismiss]                            │
└──────────────────────────────────────┘

Background: #f0fdf4 (green-50)
Border: #bbf7d0 (green-200)
Text: #16a34a (green-600)
```

### Warning Message

```
┌──────────────────────────────────────┐
│ ⚡ Heads up: This group is full     │
│ [Join Waitlist] [Find Another]      │
└──────────────────────────────────────┘

Background: #fefce8 (yellow-50)
Border: #fde047 (yellow-200)
Text: #ca8a04 (yellow-600)
```

---

## Loading States

### Skeleton Screens

```tsx
// Instead of spinners, use skeleton loading
<div className="bg-gray-200 animate-pulse rounded h-4 w-3/4 mb-2" />
<div className="bg-gray-200 animate-pulse rounded h-4 w-1/2" />
```

### Progress Indicators

```tsx
// For long operations (5s+)
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="bg-blue-600 h-2 rounded-full transition-all"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Spinning Loader

```tsx
// For <2s operations only
<Loader2 className="animate-spin" size={24} />
```

---

## Print Styles

```css
@media print {
  /* Hide navigation */
  nav, .sidebar, .donate-box { display: none; }

  /* Full width */
  body { max-width: 100%; }

  /* Dark text for printing */
  body { color: #000; background: #fff; }

  /* Show URLs in links */
  a[href]:after { content: " (" attr(href) ")"; }

  /* Page breaks */
  .page-break { page-break-after: always; }
}
```

---

## Component Examples (Summary)

### Subject Card

```
┌─────────────────────────┐
│   [Math Icon]           │ Header (colored)
├─────────────────────────┤
│ Mathematics             │
│ 84 past papers          │ Content
│                         │
│ Explore →           │ Footer
└─────────────────────────┘
```

### Paper Card

```
┌──────────────────────────────────────┐
│ 📄 Mathematics                       │
│    AQA • 2024 • Paper 1 (Higher)    │
│                                      │
│ [View] [Download] [Practice]         │
└──────────────────────────────────────┘
```

### Stat Card

```
┌──────────────────┐
│  📈 [Icon]       │
│  24              │
│  Papers Done     │
└──────────────────┘
```

---

## Design Resources

### Icons
- Lucide Icons (React ready, open source)
- 24px default size
- Consistent stroke width

### Fonts
- Google Fonts: Segoe UI, Roboto (fallback)
- System fonts for performance
- OpenDyslexic for accessibility mode

### Tools
- Figma (design files)
- Storybook (component library)
- Tailwind CSS (styling)

---

## Checklist for New Components

- [ ] WCAG AA contrast (4.5:1)
- [ ] Keyboard accessible
- [ ] Screen reader tested
- [ ] Works at 200% zoom
- [ ] Dyslexia-friendly in alternate mode
- [ ] Mobile responsive (tested on 320px)
- [ ] Links are underlined or otherwise distinguished
- [ ] Focus indicators visible
- [ ] No auto-playing media
- [ ] Form labels associated correctly
