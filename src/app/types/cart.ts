export interface CartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  link: string;
  category?: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isHydrated: boolean;
}

export interface CartContextType {
  cartState: CartState;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: number) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}
