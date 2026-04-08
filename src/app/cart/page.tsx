'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

interface SavedItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Oak Solid Hardwood Plank',
    description: 'Natural finish · 5" width',
    price: 6.99,
    quantity: 4,
    image: '/images/oak-solid-3.png',
  },
  {
    id: '2',
    name: 'Waterproof Vinyl Tile',
    description: 'Gray stone · 12"×24"',
    price: 3.99,
    quantity: 2,
    image: '/images/vinyl-tile-1.png',
  },
  {
    id: '3',
    name: 'Interior Paints',
    description: 'Eggshell · Warm White · 1 Gal',
    price: 42.99,
    quantity: 1,
    image: '/images/interior-paints-1.png',
  },
];

const initialSavedItems: SavedItem[] = [
  {
    id: '4',
    name: 'Hexagon Mosaic Tile',
    description: 'White marble · 2" hex',
    price: '$5.49/sq ft',
    image: '/images/hexagon-tile-1.png',
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [savedItems, setSavedItems] = useState<SavedItem[]>(initialSavedItems);
  const [promoCode, setPromoCode] = useState('');
  const [showMobilePromo, setShowMobilePromo] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = +(subtotal * 0.085).toFixed(2);
  const total = subtotal + tax;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.flatMap((item) => {
        if (item.id !== id) return [item];
        const next = item.quantity + delta;
        return next > 0 ? [{ ...item, quantity: next }] : [];
      }),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((i) => i.id !== id));
  };

  const saveForLater = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    setSavedItems((s) => [
      ...s,
      { id: item.id, name: item.name, description: item.description, price: `$${item.price}`, image: item.image },
    ]);
    removeItem(id);
  };

  const moveToCart = (id: string) => {
    const item = savedItems.find((i) => i.id === id);
    if (!item) return;
    setCartItems((c) => [
      ...c,
      { id: item.id, name: item.name, description: item.description, price: parseFloat(item.price.replace('$', '')), quantity: 1, image: item.image },
    ]);
    setSavedItems((s) => s.filter((i) => i.id !== id));
  };

  const removeSaved = (id: string) => {
    setSavedItems((s) => s.filter((i) => i.id !== id));
  };

  /* ── Empty state ─────────────────────────────────────────── */
  if (cartItems.length === 0 && savedItems.length === 0) {
    return <EmptyCart />;
  }

  /* ── Cart with items ─────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-neutral-off-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-medium-gray">
          <Link href="/" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-dark-gray">Shopping Cart</span>
        </nav>

        {/* Page heading */}
        <h1 className="text-3xl font-bold font-montserrat text-neutral-charcoal mb-1 sm:text-4xl">
          Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h1>
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary-dark transition-colors mb-8 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          ← Continue Shopping
        </Link>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* ── Left column: cart items ── */}
          <section aria-label="Cart items" className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Desktop column headers */}
              <div className="hidden lg:grid grid-cols-12 gap-4 bg-neutral-light-gray px-6 py-3 text-sm font-medium text-neutral-dark-gray border-b border-neutral-light-gray">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              <ul role="list" className="divide-y divide-neutral-light-gray">
                {cartItems.map((item) => (
                  <li key={item.id} className="p-4 sm:p-6">
                    {/* Desktop layout */}
                    <div className="lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                      {/* Product */}
                      <div className="lg:col-span-6 flex gap-4 mb-4 lg:mb-0">
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-neutral-light-gray overflow-hidden">
                          <Image
                            src={item.image}
                            alt={`${item.name} – ${item.description}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-medium text-neutral-charcoal leading-snug">{item.name}</h3>
                          <p className="text-sm text-neutral-medium-gray">{item.description}</p>

                          {/* Mobile price + qty row */}
                          <div className="mt-3 flex items-center justify-between lg:hidden">
                            <span className="font-semibold text-neutral-charcoal">${item.price.toFixed(2)}</span>
                            <QuantityControl
                              quantity={item.quantity}
                              name={item.name}
                              onDecrease={() => updateQuantity(item.id, -1)}
                              onIncrease={() => updateQuantity(item.id, 1)}
                            />
                          </div>

                          {/* Actions */}
                          <div className="mt-3 flex gap-4 text-sm">
                            <button
                              onClick={() => saveForLater(item.id)}
                              className="text-primary hover:text-primary-dark transition-colors min-h-[44px] px-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                            >
                              Save for later
                            </button>
                            <span className="text-neutral-light-gray" aria-hidden="true">|</span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-error hover:text-red-700 transition-colors min-h-[44px] px-1 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price – desktop */}
                      <div className="hidden lg:block lg:col-span-2 text-center text-neutral-charcoal">
                        ${item.price.toFixed(2)}
                      </div>

                      {/* Quantity – desktop */}
                      <div className="hidden lg:flex lg:col-span-2 justify-center">
                        <QuantityControl
                          quantity={item.quantity}
                          name={item.name}
                          onDecrease={() => updateQuantity(item.id, -1)}
                          onIncrease={() => updateQuantity(item.id, 1)}
                        />
                      </div>

                      {/* Total */}
                      <div className="hidden lg:block lg:col-span-2 text-right font-semibold text-neutral-charcoal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      {/* Mobile total */}
                      <div className="flex justify-end lg:hidden mt-1">
                        <span className="font-semibold text-neutral-charcoal">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Saved for later ── */}
            {savedItems.length > 0 && (
              <section aria-label="Saved for later" className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-neutral-light-gray px-6 py-4 border-b border-neutral-light-gray">
                  <h2 className="text-lg font-semibold text-neutral-charcoal">
                    Saved for Later ({savedItems.length} {savedItems.length === 1 ? 'item' : 'items'})
                  </h2>
                </div>

                <ul role="list" className="divide-y divide-neutral-light-gray">
                  {savedItems.map((item) => (
                    <li key={item.id} className="p-4 sm:p-6 flex gap-4 items-start">
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-neutral-light-gray overflow-hidden">
                        <Image
                          src={item.image}
                          alt={`${item.name} – ${item.description}`}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h3 className="text-base font-medium text-neutral-charcoal">{item.name}</h3>
                          <p className="text-sm text-neutral-medium-gray">{item.description}</p>
                          <p className="text-sm font-medium text-neutral-charcoal">{item.price}</p>
                        </div>

                        <div className="flex gap-4 text-sm">
                          <button
                            onClick={() => moveToCart(item.id)}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          >
                            Move to cart
                          </button>
                          <button
                            onClick={() => removeSaved(item.id)}
                            className="text-error hover:text-red-700 transition-colors min-h-[44px] px-1 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </section>

          {/* ── Right column: order summary ── */}
          <aside aria-label="Order summary" className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold font-inter text-neutral-charcoal mb-6">Order Summary</h2>

              <dl className="space-y-3 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-neutral-dark-gray">Subtotal ({cartItems.length} items)</dt>
                  <dd className="text-neutral-charcoal">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-dark-gray">Shipping</dt>
                  <dd className="text-success font-medium">Free</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-dark-gray">Estimated Tax</dt>
                  <dd className="text-neutral-charcoal">${tax.toFixed(2)}</dd>
                </div>
              </dl>

              {/* Promo code – always visible on desktop, toggle on mobile */}
              <div className="mt-5">
                <div className="hidden lg:block">
                  <label htmlFor="promo-desktop" className="block text-sm font-medium text-neutral-dark-gray mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="promo-desktop"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 min-w-0 rounded-md border border-neutral-medium-gray px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <button className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Mobile promo toggle */}
                <div className="lg:hidden">
                  {!showMobilePromo ? (
                    <button
                      onClick={() => setShowMobilePromo(true)}
                      className="text-primary hover:text-primary-dark text-sm font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      + Add promo code
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <label htmlFor="promo-mobile" className="block text-sm font-medium text-neutral-dark-gray">
                        Promo Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="promo-mobile"
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 min-w-0 rounded-md border border-neutral-medium-gray px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                        <button className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider + total */}
              <div className="border-t border-neutral-light-gray mt-5 pt-5">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-neutral-charcoal">Estimated Total</span>
                  <span className="text-xl font-bold text-neutral-charcoal">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-6 space-y-3">
                <button className="w-full bg-accent hover:bg-accent-dark text-neutral-charcoal font-semibold py-3.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
                  Proceed to Checkout
                </button>
                <Link
                  href="/"
                  className="block w-full text-center bg-accent-light/40 hover:bg-accent-light/60 text-neutral-charcoal font-medium py-3.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

function QuantityControl({
  quantity,
  name,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  name: string;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="inline-flex items-center border border-neutral-light-gray rounded-md">
      <button
        onClick={onDecrease}
        aria-label={`Decrease quantity of ${name}`}
        className="w-9 h-9 flex items-center justify-center text-neutral-dark-gray hover:bg-neutral-light-gray transition-colors rounded-l-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
      >
        −
      </button>
      <span className="w-10 text-center text-sm font-medium tabular-nums" aria-label={`Quantity: ${quantity}`}>
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        aria-label={`Increase quantity of ${name}`}
        className="w-9 h-9 flex items-center justify-center text-neutral-dark-gray hover:bg-neutral-light-gray transition-colors rounded-r-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
      >
        +
      </button>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="min-h-screen bg-neutral-off-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-medium-gray">
          <Link href="/" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-dark-gray">Shopping Cart</span>
        </nav>

        <h1 className="text-3xl font-bold font-montserrat text-neutral-charcoal mb-8 sm:text-4xl">Shopping Cart</h1>

        <div className="mx-auto max-w-lg bg-white rounded-2xl shadow-sm p-12 text-center">
          <svg
            className="mx-auto mb-6 w-20 h-20 text-neutral-medium-gray"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>

          <h2 className="text-2xl font-bold text-neutral-charcoal mb-2">Your cart is empty</h2>
          <p className="text-neutral-medium-gray mb-8">
            Looks like you haven&apos;t added any items to your cart yet. Start browsing to find great deals!
          </p>

          <Link
            href="/"
            className="inline-block w-full max-w-xs bg-accent hover:bg-accent-dark text-neutral-charcoal font-semibold py-3.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Start Shopping
          </Link>

          <p className="mt-4">
            <Link href="/" className="text-primary hover:text-primary-dark text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
              or browse our collections
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}