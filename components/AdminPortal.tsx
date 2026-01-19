
import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Product } from '../types';
import { generateProductDescription } from '../services/geminiService';

const AdminPortal: React.FC = () => {
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus, logout } = useStore();
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const prod = {
      ...editingProduct,
      id: editingProduct.id || Date.now().toString(),
      category: editingProduct.category || 'Uncategorized',
      image: editingProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    } as Product;

    if (products.find(p => p.id === prod.id)) {
      updateProduct(prod);
    } else {
      addProduct(prod);
    }
    setEditingProduct(null);
  };

  const handleGenerateDescription = async () => {
    if (!editingProduct?.name) return alert("Enter a product name first");
    setAiLoading(true);
    try {
      const desc = await generateProductDescription(editingProduct.name, "Modern, sleek, premium features");
      setEditingProduct({ ...editingProduct, description: desc });
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white">Admin <span className="text-cyan-400">Dashboard</span></h1>
          <button onClick={logout} className="text-gray-400 hover:text-white transition-colors">Logout</button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Total Revenue</div>
            <div className="text-2xl font-bold text-cyan-400">${totalRevenue.toLocaleString()}</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Products Sold</div>
            <div className="text-2xl font-bold text-white">{orders.reduce((acc, o) => acc + o.items.length, 0)}</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Inventory Count</div>
            <div className="text-2xl font-bold text-white">{products.length}</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border-cyan-500/30">
            <div className="text-gray-400 text-sm mb-1 uppercase tracking-wider">Pending Orders</div>
            <div className="text-2xl font-bold text-orange-400">{pendingOrders}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Inventory Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Product Management</h2>
              <button 
                onClick={() => setEditingProduct({})}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg font-bold text-sm"
              >
                + Add Product
              </button>
            </div>
            
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-white/2">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <img src={p.image} className="w-10 h-10 rounded object-cover" alt="" />
                        <span className="font-medium">{p.name}</span>
                      </td>
                      <td className="px-6 py-4 text-cyan-400 font-bold">${p.price}</td>
                      <td className="px-6 py-4">{p.stock}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => setEditingProduct(p)} className="text-gray-400 hover:text-cyan-400">Edit</button>
                        <button onClick={() => deleteProduct(p.id)} className="text-gray-400 hover:text-red-400">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orders Management */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <div className="space-y-4">
              {orders.map(o => (
                <div key={o.id} className="glass-panel p-4 rounded-xl border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-sm">{o.id}</div>
                      <div className="text-xs text-gray-500">{new Date(o.date).toLocaleDateString()}</div>
                    </div>
                    <select 
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                      className="bg-slate-900 text-xs border border-white/10 rounded px-2 py-1 outline-none focus:border-cyan-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">{o.customerName}</div>
                  <div className="flex justify-between items-center text-sm">
                    <span>{o.items.length} items</span>
                    <span className="font-bold text-cyan-400">${o.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal for Edit/Add */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="glass-panel w-full max-w-lg rounded-3xl p-8 border-cyan-500/20">
              <h2 className="text-2xl font-bold mb-6">{editingProduct.id ? 'Edit' : 'Add'} Product</h2>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Name</label>
                    <input 
                      required
                      value={editingProduct.name || ''} 
                      onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Category</label>
                    <input 
                      value={editingProduct.category || ''} 
                      onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs uppercase text-gray-400">Description</label>
                    <button 
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={aiLoading}
                      className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30 hover:bg-cyan-500/20 disabled:opacity-50"
                    >
                      {aiLoading ? 'Thinking...' : '⚡ Generate AI Pitch'}
                    </button>
                  </div>
                  <textarea 
                    rows={3}
                    value={editingProduct.description || ''} 
                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Price ($)</label>
                    <input 
                      type="number"
                      required
                      value={editingProduct.price || 0} 
                      onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Stock</label>
                    <input 
                      type="number"
                      required
                      value={editingProduct.stock || 0} 
                      onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-3 text-gray-400 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-cyan-500 text-black font-bold py-3 rounded-xl hover:bg-cyan-400 transition-all">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
