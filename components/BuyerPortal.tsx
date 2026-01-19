
import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Product } from '../types';

const BuyerPortal: React.FC = () => {
  const { products, cart, addToCart, removeFromCart, placeOrder } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName) return;
    placeOrder(checkoutName);
    setOrderConfirmed(true);
    setCheckoutName('');
    setTimeout(() => {
      setOrderConfirmed(false);
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight">
            FUTURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">STREET</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Exclusive technology and hardware for the modern innovator. Direct from ZERONE labs.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-24 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="glass-panel group rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all">
                <div className="aspect-square overflow-hidden bg-slate-900 relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" 
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-xs font-bold text-cyan-400 px-3 py-1 rounded-full">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <span className="text-cyan-400 font-bold">${product.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                    </span>
                    <button 
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className="bg-white/10 hover:bg-cyan-500 hover:text-black text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-cyan-500 text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50"
      >
        <span className="sr-only">Open Cart</span>
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 font-bold">
              {cart.reduce((a, c) => a + c.quantity, 0)}
            </span>
          )}
        </div>
      </button>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="w-full max-w-md bg-slate-950 border-l border-white/10 h-full relative z-10 flex flex-col p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold font-heading">Shopping <span className="text-cyan-400">Cart</span></h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">Close</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-500 italic">Your cart is empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex space-x-4">
                    <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
                    <div className="flex-1">
                      <div className="flex justify-between font-bold">
                        <span>{item.name}</span>
                        <span className="text-cyan-400">${item.price * item.quantity}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase text-red-500 mt-2 font-bold tracking-widest">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && !orderConfirmed && (
              <div className="pt-8 border-t border-white/10 mt-auto">
                <div className="flex justify-between text-xl font-bold mb-6">
                  <span>Total</span>
                  <span className="text-cyan-400">${cartTotal}</span>
                </div>
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <input 
                    required
                    placeholder="Enter Full Name" 
                    value={checkoutName}
                    onChange={e => setCheckoutName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                  />
                  <button className="w-full bg-cyan-500 text-black font-bold py-4 rounded-xl hover:bg-cyan-400 transition-all uppercase tracking-widest text-sm">
                    Complete Purchase
                  </button>
                </form>
              </div>
            )}

            {orderConfirmed && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Order Received!</h3>
                <p className="text-gray-400">Your futuristic gear is on its way.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerPortal;
