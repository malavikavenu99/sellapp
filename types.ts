
export type OrderStatus = 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  date: string;
}

export interface AppState {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  isAdmin: boolean;
  activePortal: 'buyer' | 'admin';
}

/**
 * Result structure for the AI pitch evaluation assistant.
 */
export interface AIPitchResponse {
  score: number;
  feedback: string;
  suggestions: string[];
}
