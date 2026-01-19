
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, CartItem, OrderStatus } from './types';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  isAdmin: boolean;
  activePortal: 'buyer' | 'admin';
  setPortal: (portal: 'buyer' | 'admin') => void;
  login: (password: string) => boolean;
  logout: () => void;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  placeOrder: (customerName: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Neural Link Hub', description: 'Next-gen cognitive interface for seamless device control.', price: 1299, stock: 15, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', category: 'Hardware' },
  { id: '2', name: 'Aero-Frame Glasses', description: 'Ultra-lightweight AR display with 4K resolution.', price: 899, stock: 24, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', category: 'Wearables' },
  { id: '3', name: 'Void-Sound Earbuds', description: 'Absolute silence with active sonic cancellation.', price: 299, stock: 50, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', category: 'Audio' },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activePortal, setPortal] = useState<'buyer' | 'admin'>('buyer');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [products, orders]);

  const login = (password: string) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setPortal('buyer');
  };

  const addProduct = (p: Product) => setProducts([...products, p]);
  const updateProduct = (p: Product) => setProducts(products.map(x => x.id === p.id ? p : x));
  const deleteProduct = (id: string) => setProducts(products.filter(x => x.id !== id));

  const addToCart = (p: Product) => {
    const existing = cart.find(item => item.id === p.id);
    if (existing) {
      setCart(cart.map(item => item.id === p.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...p, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => setCart(cart.filter(item => item.id !== id));

  const placeOrder = (customerName: string) => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: [...cart],
      total,
      status: 'Pending',
      customerName,
      date: new Date().toISOString(),
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <StoreContext.Provider value={{
      products, orders, cart, isAdmin, activePortal, setPortal,
      login, logout, addProduct, updateProduct, deleteProduct,
      addToCart, removeFromCart, placeOrder, updateOrderStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
