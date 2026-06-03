// src/api.js
const BASE_URL = 'http://localhost:8000';

async function apiRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) {
      throw new Error(data.detail || data.error || `HTTP ${response.status}`);
    }
    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  getWelcome: () => apiRequest('/'),

  getCategories: () => apiRequest('/categories'),

  listProducts: (category = null) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const qs = params.toString();
    return apiRequest(`/products${qs ? '?' + qs : ''}`);
  },

  getProduct: (productId) => apiRequest(`/products/${productId}`),

  addProduct: (data) => apiRequest('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  updateProduct: (productId, data) => apiRequest(`/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),

  deleteProduct: (productId) => apiRequest(`/products/${productId}`, {
    method: 'DELETE'
  }),

  addToCart: (productId, quantity, cartId = 'default') => {
    const params = new URLSearchParams();
    params.append('product_id', productId.toString());
    params.append('quantity', quantity.toString());
    params.append('cart_id', cartId);
    return apiRequest('/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
  },

  viewCart: (cartId = 'default') => {
    return apiRequest(`/cart?cart_id=${encodeURIComponent(cartId)}`);
  },

  removeFromCart: (productId, cartId = 'default') => {
    return apiRequest(`/cart/${productId}?cart_id=${encodeURIComponent(cartId)}`, {
      method: 'DELETE'
    });
  }
};
