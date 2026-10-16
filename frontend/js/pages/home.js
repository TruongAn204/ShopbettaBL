/**
 * Home Page Logic
 */

import { productApi } from '../api/product.api.js';
import { renderProductCardHTML, bindAddToCartEvents } from '../components/product-card.js';

document.addEventListener('DOMContentLoaded', async () => {
  initCountdown();
  await loadCategories();
  await loadFeaturedProducts();
});

/**
 * Flash sale countdown timer simulation
 */
function initCountdown() {
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!hoursEl || !minsEl || !secsEl) return;

  let totalSeconds = 14 * 3600 + 45 * 60 + 20;

  setInterval(() => {
    if (totalSeconds <= 0) return;
    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }, 1000);
}

/**
 * Load categories and render cards
 */
async function loadCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  try {
    const categories = await productApi.getCategories();
    container.innerHTML = categories.map((cat) => `
      <a href="products.html?category=${cat.id}" class="category-card">
        <div class="category-icon">${cat.icon || '🐟'}</div>
        <h3>${cat.name}</h3>
        <p>${cat.count || 10}+ sản phẩm</p>
      </a>
    `).join('');
  } catch (err) {
    console.error('Error loading categories:', err);
  }
}

/**
 * Load featured products
 */
async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products-grid');
  if (!container) return;

  try {
    const products = await productApi.getFeaturedProducts();
    if (!products || products.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Đang cập nhật sản phẩm nổi bật...</p>`;
      return;
    }

    container.innerHTML = products.map((prod) => renderProductCardHTML(prod)).join('');
    bindAddToCartEvents(container, products);
  } catch (err) {
    console.error('Error loading featured products:', err);
  }
}
