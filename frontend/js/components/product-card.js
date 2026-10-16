/**
 * Product Card Component
 * Renders reusable product cards and handles quick-add to cart
 */

import { formatCurrencyVND } from '../utils/formatters.js';
import { addToCart } from '../utils/storage.js';
import { showToast } from './toast.js';

/**
 * Creates HTML string for a product card
 * @param {Object} product
 * @returns {string} HTML string
 */
export function renderProductCardHTML(product) {
  const image = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (product.image || 'assets/images/placeholder.svg');

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const categoryName = product.category?.name || product.category || 'Betta Fish';

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="card-media">
        <div class="card-badge-wrap">
          ${discountPercent > 0 ? `<span class="badge badge-sale">-${discountPercent}%</span>` : ''}
          ${product.isFeatured ? `<span class="badge badge-hot">Hot 🔥</span>` : ''}
        </div>
        <button class="card-wishlist" title="Yêu thích" aria-label="Thêm vào yêu thích">
          ❤
        </button>
        <a href="product-detail.html?id=${product.id || product.slug}">
          <img src="${image}" onerror="this.onerror=null; this.src='assets/images/placeholder.svg';" alt="${product.name}" loading="lazy" />
        </a>
      </div>
      <div class="card-body">
        <span class="card-category">${categoryName}</span>
        <a href="product-detail.html?id=${product.id || product.slug}">
          <h3 class="card-title" title="${product.name}">${product.name}</h3>
        </a>
        <div class="card-rating">
          <span>★</span>
          <strong>${product.rating || 5.0}</strong>
          <span class="rating-count">(${product.reviewCount || 12} đánh giá)</span>
        </div>
        <div class="card-price-wrap">
          <span class="price-current">${formatCurrencyVND(product.price)}</span>
          ${product.originalPrice ? `<span class="price-old">${formatCurrencyVND(product.originalPrice)}</span>` : ''}
        </div>
        <div class="card-actions">
          <button class="btn-add-cart" data-id="${product.id}">
            🛒 Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Binds click events to Add-to-cart buttons within a container
 * @param {HTMLElement} container 
 * @param {Array} productList 
 */
export function bindAddToCartEvents(container, productList) {
  if (!container) return;
  const buttons = container.querySelectorAll('.btn-add-cart');

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prodId = btn.getAttribute('data-id');
      const product = productList.find((p) => String(p.id) === String(prodId));

      if (product) {
        addToCart(product, 1);
        showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
      }
    });
  });
}
