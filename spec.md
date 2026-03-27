# Luxury Streetwear Store

## Current State
Store has 7 seeded products: Balenciaga Track, Balenciaga Runner, Meta Glasses, Dior B30, Dior B22, Sp5der Hoodie, Amiri MX1 Jeans. Products seed once on first load via `seedProductsOnce`.

## Requested Changes (Diff)

### Add
- Canada Goose jacket product (new image generated)
- Moncler jacket product (new image generated)
- Hellstar Hoodie product (new image generated)

### Modify
- `seedProducts()` in main.mo to include 3 new products
- Brand marquee in HomePage.tsx to include CANADA GOOSE, MONCLER, HELLSTAR

### Remove
- Nothing

## Implementation Plan
1. Add 3 new product entries to `seedProducts()` in main.mo
2. Update marquee brands in HomePage.tsx
