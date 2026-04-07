# Plan: Add Cart Functionality to Zava Retail Store

**TL;DR**: Build a complete shopping cart using React Context API (mirroring the existing ChatContext pattern). Support adding/removing items, quantity adjustments, saved items, and checkout—all with session-only persistence and hardcoded product data for now.

## Steps

### Phase 1: State Management & Types

1. **Create cart types** (`src/app/types/cart.ts`)
   - Define `CartItem` interface: `{ productId: number; name: string; price: number; quantity: number; image: string; }`
   - Define `SavedItem` interface (same as CartItem, for wishlist)
   - Define `CartState` interface: `{ items: CartItem[]; savedItems: SavedItem[]; }`
   - Define action types: `ADD_TO_CART | REMOVE_FROM_CART | UPDATE_QUANTITY | SAVE_FOR_LATER | REMOVE_SAVED | CLEAR_CART`

2. **Create CartContext** (`src/app/contexts/CartContext.tsx`)
   - Implement CartProvider wrapping useReducer (similar pattern to ChatContext)
   - Reducer function to handle: add/remove/update quantity/save-for-later actions
   - Expose hook: `useCart()` returning `{ cartState, addToCart, removeFromCart, updateQuantity, saveForLater, removeSaved, clearCart }`
   - Calculate derived state: `totalItems`, `subtotal`, `totalPrice`

### Phase 2: UI Components

3. **Create cart components** (`src/app/components/cart/`)
   - `CartItem.tsx` - Single cart item with quantity controls, remove button, "save for later" button
   - `CartSummary.tsx` - Display total items, subtotal, tax estimate, total price
   - `SavedItems.tsx` - Display and manage saved-for-later items with "move to cart" action
   - `CartEmpty.tsx` - Empty state when no items in cart

4. **Create cart page** (`src/app/cart/page.tsx`)
   - Layout: 2-column (items list + summary sidebar) on desktop, stacked on mobile
   - Sections: Cart items list, saved items collapsible section, checkout button
   - "Continue shopping" link back to homepage

### Phase 3: Integration

5. **Update CartProvider wrapper** in `src/app/layout.tsx`
   - Add CartProvider alongside ChatProvider in root layout
   - Ensures cart context available to all pages

6. **Add "Add to Cart" handlers** to product components
   - Update `src/app/components/home/FeaturedProducts.tsx` - Add click handler to "Add to cart" button
   - Update `src/app/components/home/PopularProducts.tsx` - Add click handler to "Add to cart" button
   - Extract product data as constants to make it reusable between components

7. **Update Header cart button** (`src/app/components/layout/Header.tsx`)
   - Display cart item count badge
   - Replace cart icon link to navigate to `/cart` page
   - Add notification badge showing number of items

8. **Create product card with add-to-cart** (refactor)
   - Extract reusable `ProductCard.tsx` component used by both FeaturedProducts and PopularProducts
   - Include "Add to cart" button with useCart hook integration

### Phase 4: Styling & Polish

9. **Apply design system**
   - Use Tailwind tokens from `src/tailwind.config.ts`: primary teal, accent gold for buttons
   - Responsive grid layouts (mobile-first): 1 column on mobile, 2 columns on tablet, main + sidebar on desktop
   - Consistent hover/active states for interactive elements

10. **Add cart interactions**
    - Toast/notification when item added to cart (optional: use browser toast or simple UI feedback)
    - Smooth animations for quantity adjustments and item removal
    - "Move to cart" from saved items should update UI immediately

---

## Relevant Files

### To Modify

- **[src/app/layout.tsx](src/app/layout.tsx)** — add CartProvider
- **[src/app/components/layout/Header.tsx](src/app/components/layout/Header.tsx)** — cart badge + navigation
- **[src/app/components/home/FeaturedProducts.tsx](src/app/components/home/FeaturedProducts.tsx)** — add-to-cart handlers
- **[src/app/components/home/PopularProducts.tsx](src/app/components/home/PopularProducts.tsx)** — add-to-cart handlers

### Reference Implementations

- **[src/app/contexts/ChatContext.tsx](src/app/contexts/ChatContext.tsx)** — reducer pattern
- **[src/tailwind.config.ts](src/tailwind.config.ts)** — design tokens

### New Files to Create

- `src/app/types/cart.ts` — Cart types and interfaces
- `src/app/contexts/CartContext.tsx` — Cart provider and reducer
- `src/app/components/cart/CartItem.tsx` — Individual cart item component
- `src/app/components/cart/CartSummary.tsx` — Cart totals/summary box
- `src/app/components/cart/SavedItems.tsx` — Saved items section
- `src/app/components/cart/CartEmpty.tsx` — Empty cart state
- `src/app/components/cart/ProductCard.tsx` — Reusable product card (extracted from home components)
- `src/app/cart/page.tsx` — Cart page layout

---

## Verification Checklist

1. **Type Safety**: Run `npm run lint` — no TypeScript errors or ESLint warnings
2. **Add to Cart Flow**: 
   - Click "Add to cart" on any product from homepage → item appears in cart context
   - Header cart badge updates with count
   - Navigate to `/cart` → item displays in cart list with quantity, price, and controls
3. **Cart Page Interactions**:
   - Update quantity: Click +/- buttons → subtotal updates, header badge updates
   - Remove item: Click remove button → item disappears, totals update
   - Save for later: Click "Save" → item moves to saved section, displays under "Saved Items"
   - Move from saved to cart: Click "Add to cart" from saved → item reappears in cart
   - Clear cart: Cart returns to empty state if all items removed
4. **Responsive Design**: 
   - Mobile (375px): Cart items stack, controls accessible, prices visible
   - Tablet (768px): 2-column with sidebar appearing
   - Desktop (1024px+): Full 2-column layout with summary sidebar
5. **Integration**:
   - Header cart button reflects correct count across all pages
   - "Continue shopping" link on cart page returns to homepage
   - All "Add to cart" buttons across homepage sections work correctly

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **State Management** | Context API + useReducer | Matches existing ChatContext pattern; no external dependencies; sufficient for MVP |
| **Persistence** | Session-only (in-memory context) | Keeps scope focused; easily upgrades to localStorage/database when backend ready |
| **Product Data** | Hardcoded (initial) | Aligns with MVP; ready to swap to API calls later |
| **Cart Page Route** | Dedicated `/cart` page | Clearer UX separation vs. modal/overlay approach |
| **Saved Items** | First-class feature | User requirement; enhances wishlist-like functionality |
| **Authentication** | Not required (guest cart) | Simplifies MVP; can add user profiles in future phase |
| **Checkout** | Button included, flow deferred | CTA present; actual checkout (payment, shipping) is Phase 2 |

---

## Further Considerations

### 1. Toast Notifications
Add feedback when items are added/removed from cart?

**Options:**
- A: Use simple JS `alert()` — quick to implement, poor UX
- B: Custom toast component with Tailwind — small overhead, better UX
- C: Skip for MVP — simplest, can add later

**Recommendation:** Implement Option B (build reusable toast component; pairs well with future notifications like order status)

### 2. Quantity Limits
Should cart enforce max quantity per item?

**Options:**
- A: No limits — simpler, assumes unlimited inventory
- B: Enforce stock limits — requires `stock_quantity` field integration
- C: Configurable per product — most flexible, higher complexity

**Recommendation:** Option A for MVP (keep simple); add stock checks Phase 2 when DB integrates

### 3. Product Card Refactor
FeaturedProducts and PopularProducts share similar card UI. Extract to `ProductCard.tsx`?

**Benefits:**
- Single source of truth for product card styling
- Easier to add features (like "Add to cart") across all products
- Reduces duplication

**Recommendation:** Extract early (minimal effort, high maintainability gain)

---

## Estimated Timeline

- Phase 1 (Types + Context): ~30 mins
- Phase 2 (Components): ~60 mins  
- Phase 3 (Integration + wiring): ~45 mins
- Phase 4 (Styling + polish): ~30 mins
- **Total: ~165 mins (~2.75 hours)**

---

## Acceptance Criteria

✅ Cart context manages state independently  
✅ Users can add/remove items from any product section  
✅ Header cart badge shows accurate item count  
✅ Cart page displays all items with correct prices and quantities  
✅ Quantity adjustments immediately update totals  
✅ "Save for later" moves items to saved section  
✅ "Continue shopping" returns to homepage  
✅ Mobile/tablet/desktop layouts render correctly  
✅ No TypeScript errors or ESLint warnings  
✅ Code follows existing project patterns (ChatContext, Tailwind usage)
