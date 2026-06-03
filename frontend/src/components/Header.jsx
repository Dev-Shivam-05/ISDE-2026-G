import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Plus, Search, Menu, X, Sparkles } from 'lucide-react';

function Header({ cartItemCount = 0, searchQuery, setSearchQuery }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navClass = ({ isActive }) =>
    `relative text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
      isActive 
        ? 'bg-slate-900 text-white shadow-md' 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'glass py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
          
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={20} className="text-indigo-400" />
            </div>
            <div className="hidden sm:block">
              <div className="font-heading font-bold text-xl text-slate-900 tracking-tight leading-none">
                Lumina
              </div>
              <div className="text-slate-500 text-xs font-medium mt-0.5 tracking-wide">
                STUDIO EDITION
              </div>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery || ''}
              onChange={e => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-white/50 backdrop-blur-sm border border-slate-200/80 text-slate-900 text-sm font-medium px-5 py-2.5 pl-11 rounded-full outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-slate-200/80 shadow-sm">
            <NavLink to="/" className={navClass}>
              Explore
            </NavLink>
            <NavLink to="/add-product" className={navClass}>
              <Plus size={16} /> Create
            </NavLink>
            <NavLink to="/cart" className={navClass}>
              <div className="relative flex items-center gap-2">
                <ShoppingBag size={16} />
                Bag
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-indigo-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </NavLink>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-200 text-slate-700 active:scale-95 transition-transform"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] transition-opacity duration-300 md:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[70] shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) md:hidden flex flex-col ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="font-heading font-bold text-lg text-slate-900">Menu</div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="relative mb-8">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery || ''}
              onChange={e => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm px-4 py-3 pl-10 rounded-xl outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <nav className="flex flex-col gap-4">
            <NavLink to="/" className="text-lg font-medium text-slate-600 hover:text-slate-900">Explore Collections</NavLink>
            <NavLink to="/add-product" className="text-lg font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2">
              <Plus size={20} /> Create Listing
            </NavLink>
            <NavLink to="/cart" className="text-lg font-medium text-slate-600 hover:text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2"><ShoppingBag size={20} /> Shopping Bag</span>
              {cartItemCount > 0 && (
                <span className="bg-indigo-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Header;
