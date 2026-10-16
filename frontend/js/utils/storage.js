/**
 * Storage Utility
 * Manages LocalStorage for authentication tokens, user data, and shopping cart
 */

const KEYS = {
  TOKEN: 'betta_auth_token',
  USER: 'betta_auth_user',
  CART: 'betta_cart_items',
  THEME: 'betta_theme',
};

/* --- AUTH & TOKEN --- */
export function getToken() {
  return localStorage.getItem(KEYS.TOKEN);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(KEYS.TOKEN);
  }
}

export function removeToken() {
  localStorage.removeItem(KEYS.TOKEN);
  localStorage.removeItem(KEYS.USER);
}

export function getUser() {
  try {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.USER);
  }
}

export function isAuthenticated() {
  return !!getToken();
}

/* --- SHOPPING CART --- */
export function getCart() {
  try {
    const raw = localStorage.getItem(KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(KEYS.CART, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('betta-cart-updated', { detail: { cart } }));
}

/**
 * Add a product to cart or increment quantity if exists
 * @param {Object} product - Product details { id, name, price, image, category }
 * @param {number} quantity - Quantity to add (default 1)
 */
export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existingIdx = cart.findIndex((item) => item.id === product.id);

  if (existingIdx > -1) {
    cart[existingIdx].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: Array.isArray(product.images) ? product.images[0] : (product.image || ''),
      category: product.category?.name || product.category || 'Betta Fish',
      quantity: quantity,
      stock: product.stock || 99,
    });
  }

  saveCart(cart);
  return cart;
}

/**
 * Update quantity for a specific product in the cart
 * @param {string|number} productId 
 * @param {number} newQuantity 
 */
export function updateCartQuantity(productId, newQuantity) {
  let cart = getCart();
  if (newQuantity <= 0) {
    cart = cart.filter((item) => String(item.id) !== String(productId));
  } else {
    const item = cart.find((item) => String(item.id) === String(productId));
    if (item) {
      item.quantity = newQuantity;
    }
  }
  saveCart(cart);
  return cart;
}

/**
 * Remove an item completely from cart
 * @param {string|number} productId 
 */
export function removeFromCart(productId) {
  const cart = getCart().filter((item) => String(item.id) !== String(productId));
  saveCart(cart);
  return cart;
}

/**
 * Clear the entire cart
 */
export function clearCart() {
  localStorage.removeItem(KEYS.CART);
  window.dispatchEvent(new CustomEvent('betta-cart-updated', { detail: { cart: [] } }));
}

/**
 * Get total quantity count of items in cart
 * @returns {number}
 */
export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Get total price of all items in cart
 * @returns {number}
 */
export function getCartSubtotal() {
  return getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
