## Plan: Add storefront cart

Implement a first-version shopping cart for the Next.js storefront using a typed client-side cart context with localStorage persistence, wire it into the existing product cards and header, and add a dedicated `/cart` page with quantity controls, totals, and a checkout placeholder. This approach fits the current codebase, reuses the existing provider/reducer pattern from chat, and avoids introducing backend/API complexity before product data is dynamic.

**Steps**
1. Phase 1 — Define cart domain contracts. Create shared cart/product types so UI components, context state, and cart page all use one source of truth for item shape, quantity, price, and totals.
2. Phase 2 — Build cart state infrastructure. Add a `CartContext` in the same style as `ChatContext`, with reducer actions for add/remove/increment/decrement/set quantity/clear cart and derived selectors for item count and subtotal. *Depends on 1.*
3. Phase 3 — Add persistence and hydration. Persist cart state to localStorage on the client and hydrate safely after mount so the cart survives refreshes without breaking App Router rendering. Keep persistence encapsulated in the cart provider to preserve a clean path to future server-backed carts. *Depends on 2.*
4. Phase 4 — Integrate cart globally. Wrap the app in `CartProvider` from `src/app/layout.tsx` and update the header cart button to link to `/cart` and show a badge with total item count. *Depends on 2; can overlap with 3 once the provider API is stable.*
5. Phase 5 — Wire add-to-cart actions in existing product listings. Update the product data in home components to use a shared product/cart input shape and connect the existing buttons in `PopularProducts` to cart actions. Decide whether `FeaturedProducts` also gets add-to-cart in this pass or remains navigation-only; recommended to add it for consistency. *Depends on 1 and 2.*
6. Phase 6 — Build the cart route. Create `src/app/cart/page.tsx` with empty-state and populated-state variants, line-item rows, quantity controls, remove action, subtotal/order summary, and a checkout placeholder CTA. *Depends on 2; benefits from 3 and 4.*
7. Phase 7 — UX polish and safeguards. Add disabled states for invalid quantity operations, currency formatting helpers, accessible button labels, and clear messaging when cart data is empty or stale. *Depends on 4, 5, and 6.*
8. Phase 8 — Verification. Validate add/remove/update flows, persistence across refreshes, badge updates, route navigation, and lint/build health. *Depends on all prior phases.*

**Relevant files**
- `/Users/julia/Desktop/Labs/zava-retail-store/src/app/layout.tsx` — add `CartProvider` alongside `ChatProvider`; keep the root layout as the global integration point.
- `/Users/julia/Desktop/Labs/zava-retail-store/src/app/contexts/ChatContext.tsx` — reference reducer/provider structure and hook ergonomics when designing `CartContext`.
- `/Users/julia/Desktop/Labs/zava-retail-store/src/app/components/layout/Header.tsx` — replace the inert cart button with a cart link/button plus badge sourced from cart state.
- `/Users/julia/Desktop/Labs/zava-retail-store/src/app/components/home/PopularProducts.tsx` — wire the existing add-to-cart button and normalize product payload shape.
- `/Users/julia/Desktop/Labs/zava-retail-store/src/app/components/home/FeaturedProducts.tsx` — optionally add add-to-cart affordance or align product typing if it stays browse-only.
- `/Users/julia/Desktop/Labs/zava-retail-store/src/app/page.tsx` — verify homepage composition still works once child components consume cart hooks.
- `/Users/julia/Desktop/Labs/zava-retail-store/src/app/types/` — add shared `product.ts` and/or `cart.ts` definitions for item contracts and totals.
- `/Users/julia/Desktop/Labs/zava-retail-store/src/app/cart/page.tsx` — new cart route containing the primary cart UX.
- `/Users/julia/Desktop/Labs/zava-retail-store/src/package.json` — likely no new dependency required; confirm implementation stays within existing React/Next stack.
- `/Users/julia/Desktop/Labs/zava-retail-store/.github/instructions/nextjs-tailwind.instructions.md` — follow App Router, typed state, and Tailwind styling guidance during implementation.

**Verification**
1. Run lint/build for the Next.js app from `src/` and fix any type or App Router issues introduced by new context, route, or components.
2. Manually verify homepage flows: adding the same product multiple times, adding different products, and seeing the header badge update immediately.
3. Refresh the browser and confirm cart contents rehydrate from localStorage without hydration errors or visible flicker beyond a small acceptable mount sync.
4. Open `/cart` and verify increment, decrement, direct quantity handling (if included), remove item, clear cart (if included), subtotal calculation, and empty-state transition.
5. Confirm navigation works from the header cart icon to `/cart`, and that the checkout placeholder CTA is intentionally non-functional but clearly labeled.
6. Regression-check chat widget visibility/layout because `layout.tsx` is the shared provider wrapper.

**Decisions**
- Recommended persistence for v1: client-side context + localStorage, because the app currently has no product API or authenticated user/session model.
- Included scope: header badge, wired add-to-cart buttons, dedicated `/cart` page, quantity editing, subtotal/order summary, and checkout placeholder CTA.
- Excluded scope: real checkout/payment integration, inventory reservation, server-side cart APIs, authenticated cross-device carts, coupon/tax/shipping logic unless explicitly requested.
- Recommended consistency choice: make both home product sections cart-aware so users are not surprised by mixed interaction patterns.

**Further Considerations**
1. If product data is expected to become database-backed soon, keep cart actions accepting a minimal normalized product payload (`id`, `name`, `price`, `image`, `link`) so the future data source swap does not ripple through the UI.
2. If you want a richer shopping experience later, the next increment after this plan should be a mini-cart drawer reusing the same context/selectors rather than changing the data model again.
3. If price display needs currency semantics beyond simple formatting, centralize a helper early so mixed numeric/string prices from current hardcoded components do not spread.
