# Luxury Streetwear Store

## Current State
New project. Empty backend actor, no frontend pages yet.

## Requested Changes (Diff)

### Add
- Product catalog with 7 initial products across brands: Balenciaga, Dior, Meta (Ray-Ban), Sp5der, Amiri
- Product categories: Sneakers, Hoodies, Jeans, Accessories
- Public storefront: hero banner, product grid, product detail page
- Cart system: add/remove items, quantity, simple checkout form (no payment)
- Admin panel (role-based): add, edit, delete products; update images, prices, descriptions
- Navigation bar: brand logo, category filters, cart icon with count
- Mobile-responsive layout
- Authorization for admin access
- Blob storage for product images

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select `authorization` and `blob-storage` components
2. Generate Motoko backend with:
   - Product CRUD (id, name, brand, category, price, description, imageUrl, stock)
   - Admin role check
   - Seed 7 initial products
3. Frontend pages:
   - `/` — Hero banner + featured product grid
   - `/products` — Full product grid with category filter
   - `/products/:id` — Product detail page
   - `/cart` — Cart view with checkout form
   - `/admin` — Admin panel for product management (add/edit/delete + image upload)
4. Shared state: cart context, auth context
