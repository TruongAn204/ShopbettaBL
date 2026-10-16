/**
 * Products Catalog Page Logic
 */

import { productApi } from '../api/product.api.js';
import { renderProductCardHTML, bindAddToCartEvents } from '../components/product-card.js';

let currentQuery = {
  search: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
  page: 1,
};

document.addEventListener('DOMContentLoaded', async () => {
  // Parse URL parameters
  const params = new URLSearchParams(window.location.search);
  if (params.get('search')) currentQuery.search = params.get('search');
  if (params.get('category')) currentQuery.category = params.get('category');
  if (params.get('sort')) currentQuery.sort = params.get('sort');

  setupFiltersUI();
  setupSortingUI();
  await fetchAndRenderProducts();
});

function setupFiltersUI() {
  // Price inputs
  const minPriceInput = document.getElementById('filter-min-price');
  const maxPriceInput = document.getElementById('filter-max-price');
  const applyPriceBtn = document.getElementById('btn-apply-price');

  if (applyPriceBtn) {
    applyPriceBtn.addEventListener('click', () => {
      currentQuery.minPrice = minPriceInput.value;
      currentQuery.maxPrice = maxPriceInput.value;
      fetchAndRenderProducts();
    });
  }

  // Category radio items
  const catInputs = document.querySelectorAll('input[name="filter-category"]');
  catInputs.forEach((input) => {
    if (input.value === currentQuery.category) {
      input.checked = true;
    }
    input.addEventListener('change', () => {
      currentQuery.category = input.value;
      fetchAndRenderProducts();
    });
  });

  // Reset filters
  const resetBtn = document.getElementById('btn-reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentQuery = { search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 };
      catInputs.forEach((i) => (i.checked = false));
      if (document.getElementById('cat-all')) document.getElementById('cat-all').checked = true;
      if (minPriceInput) minPriceInput.value = '';
      if (maxPriceInput) maxPriceInput.value = '';
      fetchAndRenderProducts();
    });
  }
}

function setupSortingUI() {
  const sortSelect = document.getElementById('catalog-sort-select');
  if (sortSelect) {
    sortSelect.value = currentQuery.sort;
    sortSelect.addEventListener('change', () => {
      currentQuery.sort = sortSelect.value;
      fetchAndRenderProducts();
    });
  }
}

async function fetchAndRenderProducts() {
  const gridContainer = document.getElementById('catalog-products-grid');
  const countLabel = document.getElementById('catalog-result-count');

  if (!gridContainer) return;
  gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem;"><div class="spinner"></div><p style="margin-top: 1rem; color: var(--text-muted);">Đang tải danh sách cá...</p></div>`;

  try {
    const res = await productApi.getProducts(currentQuery);
    const items = res.items || res;

    if (countLabel) {
      countLabel.textContent = `Hiển có ${items.length} sản phẩm`;
    }

    if (items.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>Không tìm thấy sản phẩm phù hợp</h3>
          <p style="color: var(--text-muted); margin: 0.5rem 0 1.5rem;">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
          <button class="btn btn-primary" id="btn-empty-reset">Xem tất cả sản phẩm</button>
        </div>
      `;
      document.getElementById('btn-empty-reset')?.addEventListener('click', () => {
        document.getElementById('btn-reset-filters')?.click();
      });
      return;
    }

    gridContainer.innerHTML = items.map((p) => renderProductCardHTML(p)).join('');
    bindAddToCartEvents(gridContainer, items);
  } catch (err) {
    console.error('Error fetching catalog:', err);
    gridContainer.innerHTML = `<p style="grid-column: 1/-1; color: var(--error); text-align: center;">Lỗi tải dữ liệu. Vui lòng thử lại sau.</p>`;
  }
}
