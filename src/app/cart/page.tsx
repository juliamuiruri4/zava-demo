'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function EmptyCart() {
  return (
    <div className="flex justify-center py-12">
      <div className="bg-white rounded-2xl p-12 text-center max-w-lg w-full">
        <div className="mx-auto w-30 h-30 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </div>
        <h2 className="font-montserrat text-2xl font-semibold text-gray-900 mb-3">
          Your cart is empty
        </h2>
        <p className="text-base text-gray-500 mb-8">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link
          href="/"
          className="inline-block bg-teal-600 text-white font-semibold py-3.5 px-12 rounded-xl hover:bg-teal-700 transition-colors duration-200"
        >
          Continue Shopping
        </Link>
        <p className="mt-4 text-sm text-teal-600">
          <Link href="/" className="hover:underline">
            or browse categories
          </Link>
        </p>
      </div>
    </div>
  );
}

interface QuantityControlsProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  productName: string;
}

function QuantityControls({ quantity, onIncrement, onDecrement, productName }: QuantityControlsProps) {
  return (
    <div className="inline-flex items-center border border-gray-200 rounded-lg bg-gray-50">
      <button
        onClick={onDecrement}
        aria-label={`Decrease quantity of ${productName}`}
        className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-l-lg transition-colors duration-200"
      >
        <span className="text-lg font-medium leading-none">−</span>
      </button>
      <span className="w-8 text-center text-base font-semibold text-gray-900" aria-label={`Quantity: ${quantity}`}>
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        aria-label={`Increase quantity of ${productName}`}
        className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-r-lg transition-colors duration-200"
      >
        <span className="text-lg font-medium leading-none">+</span>
      </button>
    </div>
  );
}

function CartItemRow({ item, onIncrement, onDecrement, onRemove }: {
  item: { product: { id: number; name: string; price: number; image: string; category?: string }; quantity: number };
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-white rounded-xl p-4">
      {/* Desktop layout */}
      <div className="hidden md:flex items-center gap-6">
        <div className="relative w-[90px] h-[90px] flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            sizes="90px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900">{item.product.name}</h3>
          <p className="text-xs text-gray-400 mt-1">{item.product.category || 'Home Improvement'}</p>
          <button
            onClick={onRemove}
            className="text-xs text-red-500 hover:underline mt-1"
            aria-label={`Remove ${item.product.name} from cart`}
          >
            Remove
          </button>
        </div>
        <div className="w-24 text-base font-medium text-gray-900">
          {formatCurrency(item.product.price)}
        </div>
        <div className="w-28">
          <QuantityControls
            quantity={item.quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            productName={item.product.name}
          />
        </div>
        <div className="w-24 text-right text-base font-bold text-gray-900">
          {formatCurrency(item.product.price * item.quantity)}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden gap-4">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-gray-900">{item.product.name}</h3>
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 p-1 -mr-1"
              aria-label={`Remove ${item.product.name} from cart`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {formatCurrency(item.product.price)}
          </p>
          <div className="mt-2">
            <QuantityControls
              quantity={item.quantity}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              productName={item.product.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ subtotal, itemCount }: { subtotal: number; itemCount: number }) {
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-montserrat text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-700">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <div className="flex justify-between text-sm text-gray-700">
          <span>Tax (estimated)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="border-t-2 border-gray-900 mt-4 pt-4">
        <div className="flex justify-between items-baseline">
          <span className="font-montserrat text-lg font-bold text-gray-900">Total</span>
          <span className="font-montserrat text-xl font-bold text-gray-900">{formatCurrency(total)}</span>
        </div>
      </div>

      <button
        className="w-full mt-5 bg-teal-600 text-white font-semibold py-3.5 rounded-xl hover:bg-teal-700 transition-colors duration-200"
        aria-label="Proceed to checkout"
      >
        Proceed to Checkout
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        🔒 Secure checkout
      </p>

      <div className="mt-4 flex border border-gray-200 rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2.5 text-sm bg-gray-50 outline-none placeholder:text-gray-400"
          aria-label="Coupon code"
        />
        <button className="px-4 text-sm font-semibold text-teal-600 hover:bg-gray-100 transition-colors duration-200">
          Apply
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        💳 Visa • Mastercard • PayPal
      </p>
    </div>
  );
}

export default function CartPage() {
  const { cartState, incrementQuantity, decrementQuantity, removeFromCart, itemCount, subtotal } = useCart();

  if (!cartState.isHydrated) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-teal-600 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900">Shopping Cart</li>
          </ol>
        </nav>

        {/* Page Title */}
        <h1 className="font-montserrat text-3xl font-bold text-gray-900 mb-1">Shopping Cart</h1>

        {cartState.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items Column */}
              <div className="flex-1">
                {/* Column Headers (desktop only) */}
                <div className="hidden md:flex gap-6 px-4 mb-3 text-xs font-semibold text-gray-400">
                  <div className="w-[90px] flex-shrink-0" />
                  <div className="flex-1">Product</div>
                  <div className="w-24">Price</div>
                  <div className="w-28">Quantity</div>
                  <div className="w-24 text-right">Total</div>
                </div>

                <div className="space-y-3">
                  {cartState.items.map(item => (
                    <CartItemRow
                      key={item.product.id}
                      item={item}
                      onIncrement={() => incrementQuantity(item.product.id)}
                      onDecrement={() => decrementQuantity(item.product.id)}
                      onRemove={() => removeFromCart(item.product.id)}
                    />
                  ))}
                </div>

                <div className="mt-6">
                  <Link
                    href="/"
                    className="text-sm font-medium text-teal-600 hover:underline inline-flex items-center gap-1"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="w-full lg:w-[340px] flex-shrink-0">
                <div className="lg:sticky lg:top-8">
                  <OrderSummary subtotal={subtotal} itemCount={itemCount} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
