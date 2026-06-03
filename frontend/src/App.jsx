import React, { useState, useEffect } from 'react';
import { api } from './api';
import Header from './components/Header';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import CartPage from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import NotFound from './pages/NotFound';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function AppContent() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [cart, setCart] = useState({ cart_id: 'default', items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast helper
  const showToast = (title, text, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Load data
  const loadProducts = async (category = null) => {
    try {
      const res = await api.listProducts(category);
      setProducts(res.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res.categories || {});
    } catch (err) {
      console.error(err);
    }
  };

  const loadCart = async () => {
    try {
      const res = await api.viewCart('default');
      setCart(res);
    } catch (err) {
      console.error(err);
    }
  };

  const initializeApp = async () => {
    setLoading(true);
    try {
      await api.getWelcome();
      await Promise.all([loadProducts(), loadCategories(), loadCart()]);
    } catch (err) {
      showToast('Connection Error', 'Could not connect to backend. Make sure FastAPI is running on port 8000.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  // Category filter
  const handleCategoryChange = async (cat) => {
    setActiveCategory(cat);
    await loadProducts(cat);
  };

  // Add to cart
  const handleAddToCart = async (productId, productName, stock, qty = 1) => {
    setLoading(true);
    try {
      const res = await api.addToCart(productId, qty, 'default');
      if (res.error) {
        showToast('Failed', res.error, 'error');
      } else {
        showToast('Added to Cart', res.message, 'success');
        await loadCart();
      }
    } catch (err) {
      showToast('Error', err.message || 'Failed to add to cart.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      await api.removeFromCart(productId, 'default');
      showToast('Removed', 'Item removed from cart.', 'info');
      await loadCart();
    } catch (err) {
      showToast('Error', err.message, 'error');
    }
  };

  // Checkout
  const handleCheckout = () => {
    if (cart.items.length === 0) {
      showToast('Empty Cart', 'Add items before placing order.', 'error');
      return;
    }
    setReceipt({
      cart_id: cart.cart_id,
      items: [...cart.items],
      total: cart.total,
      date: new Date().toLocaleString(),
      transactionId: 'ORD-' + Math.floor(10000000 + Math.random() * 90000000)
    });
    navigate('/checkout');
  };

  const closeCheckoutAndReset = () => {
    setReceipt(null);
    loadCart();
    loadProducts(activeCategory);
    navigate('/');
  };

  // Refresh products (after adding)
  const refreshProducts = async () => {
    await loadProducts(activeCategory);
  };

  const cartItemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast-message ${t.type === 'success' ? 'toast-success' : t.type === 'error' ? 'toast-error' : 'toast-info'}`}>
            <div className="toast-icon">
              {t.type === 'success' && <CheckCircle2 size={18} className="text-success" />}
              {t.type === 'error' && <AlertCircle size={18} className="text-danger" />}
              {t.type === 'info' && <Info size={18} className="text-primary" />}
            </div>
            <div className="toast-content">
              <div className="toast-title">{t.title}</div>
              <div className="toast-text">{t.text}</div>
            </div>
            <button className="toast-close" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <Header
        cartItemCount={cartItemCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Pages */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <Home
              products={products}
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              onAddToCart={handleAddToCart}
              loading={loading}
              searchQuery={searchQuery}
            />
          } />
          <Route path="/product/:id" element={
            <ProductDetail
              onAddToCart={handleAddToCart}
              loading={loading}
              showToast={showToast}
            />
          } />
          <Route path="/add-product" element={
            <AddProduct
              showToast={showToast}
              refreshProducts={refreshProducts}
            />
          } />
          <Route path="/cart" element={
            <CartPage
              cart={cart}
              onRemoveFromCart={handleRemoveFromCart}
              onCheckout={handleCheckout}
              loading={loading}
            />
          } />
          <Route path="/checkout" element={
            <Checkout
              receipt={receipt}
              closeCheckoutAndReset={closeCheckoutAndReset}
            />
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-8 py-6 text-center text-xs text-text-secondary">
        <p>© 2026 ISDE MiniShop — Built with FastAPI & React</p>
        <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-1 inline-block">
          FastAPI Docs ↗
        </a>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
