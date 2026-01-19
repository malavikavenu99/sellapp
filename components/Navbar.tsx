
import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-panel py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-xl text-black">Z</div>
          <span className="font-heading font-bold text-xl tracking-tight hidden md:block">ZERONE <span className="text-cyan-400">7.0</span></span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-widest text-gray-300">
          <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
          <a href="#rules" className="hover:text-cyan-400 transition-colors">Rules</a>
          <a href="#ai-assistant" className="hover:text-cyan-400 transition-colors">AI Assistant</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>

        <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105 active:scale-95">
          REGISTER NOW
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
