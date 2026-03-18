'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';
import { CartProduct, CartItem, CartState, CartContextType } from '../types/cart';

const CART_STORAGE_KEY = 'zava-cart';

const initialState: CartState = {
  items: [],
  isHydrated: false,
};

type CartAction =
  | { type: 'HYDRATE'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartProduct }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.payload, isHydrated: true };

    case 'ADD_ITEM': {
      const existing = state.items.find(item => item.product.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload),
      };

    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case 'DECREMENT':
      return {
        ...state,
        items: state.items
          .map(item =>
            item.product.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter(item => item.quantity > 0),
      };

    case 'CLEAR':
      return { ...state, items: [] };

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        dispatch({ type: 'HYDRATE', payload: parsed });
      } else {
        dispatch({ type: 'HYDRATE', payload: [] });
      }
    } catch {
      dispatch({ type: 'HYDRATE', payload: [] });
    }
  }, []);

  // Persist to localStorage on change (after hydration)
  useEffect(() => {
    if (cartState.isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState.items));
    }
  }, [cartState.items, cartState.isHydrated]);

  const addToCart = useCallback((product: CartProduct) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const incrementQuantity = useCallback((productId: number) => {
    dispatch({ type: 'INCREMENT', payload: productId });
  }, []);

  const decrementQuantity = useCallback((productId: number) => {
    dispatch({ type: 'DECREMENT', payload: productId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const itemCount = useMemo(
    () => cartState.items.reduce((sum, item) => sum + item.quantity, 0),
    [cartState.items]
  );

  const subtotal = useMemo(
    () => cartState.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartState.items]
  );

  const value: CartContextType = {
    cartState,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
