
import React, { useState } from 'react';
import { StoreProvider, useStore } from './StoreContext';
import BuyerPortal from './components/BuyerPortal';
import AdminPortal from './components/AdminPortal';
import Navbar from './components/Navbar';

const Main: React.FC = () => {
  const { activePortal, isAdmin, setPortal, login } = useStore();
  const [showLogin, setShowLogin] = useState(false);
  const [pass, setPass] = useState('');

  const handleAdminAccess = () => {
    if (isAdmin) {
      setPortal('admin');
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(pass)) {
      setPortal('admin');
      setShowLogin(false);
      setPass('');
    } else {
      alert('Invalid Credentials (Hint: admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
      <nav className="fixed top-0 left-0 right-0 z-[100] glass-panel py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => setPortal('buyer')}
          >
            <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center font-bold text-black">Z</div>
            <span className="font-heading font-black text-xl tracking-tighter">ZERONE <span className="text-cyan-400">SHOP</span></span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setPortal('buyer')}
              className={`text-sm font-bold uppercase tracking-widest ${activePortal === 'buyer' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
              Shop
            </button>
            <button 
              onClick={handleAdminAccess}
              className={`text-sm font-bold uppercase tracking-widest ${activePortal === 'admin' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
            >
              Admin
            </button>
          </div>
        </div>
      </nav>

      {activePortal === 'buyer' ? <BuyerPortal /> : <AdminPortal />}

      {showLogin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowLogin(false)}></div>
          <div className="glass-panel w-full max-w-sm p-8 rounded-3xl relative z-10 text-center border-cyan-500/30">
            <h2 className="text-2xl font-bold mb-2">Admin Portal</h2>
            <p className="text-gray-400 text-sm mb-6">Enter access code for management</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password"
                autoFocus
                placeholder="Access Key"
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-center outline-none focus:border-cyan-500 font-mono"
              />
              <button className="w-full bg-cyan-500 text-black font-bold py-3 rounded-xl hover:bg-cyan-400 transition-all">
                Login
              </button>
              <button 
                type="button"
                onClick={() => setShowLogin(false)} 
                className="text-gray-500 hover:text-white text-xs uppercase"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Main />
    </StoreProvider>
  );
};

export default App;
