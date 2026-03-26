# Luxury Streetwear Store — Full Modern Redesign

## Current State
Dark editorial luxury site with Playfair Display serif headings, gold accent color, borderless product cards, a brand marquee ticker, scrolling animations. Hero headline reads "Define Your Style."

## Requested Changes (Diff)

### Add
- New modern sans-serif typography system (Space Grotesk or similar geometric sans)
- Fresh color system: deep black background with electric white + vivid accent (electric blue, electric green, or bright red — pick the most impactful for streetwear)
- Brutalist/modern layout touches: oversized type, strong contrast, tight grid
- New hero headline: "Wear The Culture."

### Modify
- index.css: complete design token and typography overhaul — ditch Playfair Display, use modern geometric sans throughout; update accent color from gold to vivid modern accent
- Navbar: cleaner, bolder — logo in all-caps modern sans, tighter layout
- HomePage: hero headline "Define / Your / Style." → "Wear / The / Culture." — full modern layout with bold oversized type; marquee kept but styled with new palette
- ProductCard: modern card style — cleaner image block, bolder type, crisp action buttons in new accent color
- ProductsPage: modern header section, updated category filter tabs
- ProductDetailPage: modern two-column layout with updated type and colors
- CartPage: modernized with consistent new palette
- Footer: modernized with new palette

### Remove
- Playfair Display / Instrument Serif font references
- Gold color references throughout (replace with new accent)
- All serif font-family references in component classes

## Implementation Plan
1. Update index.css with new design tokens (modern sans, vivid accent, updated palette)
2. Update Navbar with modern styling
3. Rewrite HomePage hero and all sections with new palette and headline
4. Update ProductCard with modern styling
5. Update ProductsPage, ProductDetailPage, CartPage, Footer
6. Validate build
