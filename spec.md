# Luxury Streetwear Store

## Current State
The app has a Motoko backend with product seeding, but `seedProductsOnce` requires admin auth — so it fails silently for unauthenticated visitors. Seed data also used placeholder image URLs instead of the locally generated images.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `seedProductsOnce`: Remove admin auth requirement so any visitor triggers seeding on first load
- Seed data image URLs: Updated to use `/assets/generated/<filename>` paths matching existing generated images
- Seed data descriptions: Improved to be more descriptive and luxury-focused

### Remove
- Admin auth guard on `seedProductsOnce`

## Implementation Plan
1. Update `main.mo` — remove auth check from `seedProductsOnce`, update all 7 product image URLs and descriptions
