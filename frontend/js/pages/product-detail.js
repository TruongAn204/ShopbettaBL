/**
 * Product Detail Page Logic
 */

import { productApi } from '../api/product.api.js';
import { formatCurrencyVND } from '../utils/formatters.js';
import { addToCart } from '../utils/storage.js';
import { showToast } from '../components/toast.js';
import { renderProductCardHTML, bindAddToCartEvents } from '../components/product-card.js';

let currentProduct = null;
let currentQuantity = 1;

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'prod_1';

  await loadProductDetail(productId);
  setupQuantityControls();
  setupTabs();
  setupAddToCart();
  await loadRelatedProducts();
});

async function loadProductDetail(id) {
  try {
    currentProduct = await productApi.getProductById(id);
    if (!currentProduct) return;

    // Document title
    document.title = `${currentProduct.name} - Shop Betta Bạc Liêu`;

    // Elements
    document.getElementById('detail-title').textContent = currentProduct.name;
    document.getElementById('detail-category').textContent = currentProduct.category?.name || currentProduct.category || 'Betta Fish';
    document.getElementById('detail-price').textContent = formatCurrencyVND(currentProduct.price);
    
    const oldPriceEl = document.getElementById('detail-old-price');
    if (oldPriceEl) {
      if (currentProduct.originalPrice) {
        oldPriceEl.textContent = formatCurrencyVND(currentProduct.originalPrice);
        oldPriceEl.style.display = 'inline';
      } else {
        oldPriceEl.style.display = 'none';
      }
    }

    document.getElementById('detail-rating').textContent = currentProduct.rating || 5.0;
    document.getElementById('detail-reviews-count').textContent = `(${currentProduct.reviewCount || 12} đánh giá)`;
    document.getElementById('detail-short-desc').textContent = currentProduct.description || '';
    document.getElementById('tab-desc-content').innerHTML = `
      <p style="margin-bottom: 1rem;">${currentProduct.description || ''}</p>
      <h4 style="margin: 1.5rem 0 0.5rem;">Đặc tính giống cá Betta Bạc Liêu:</h4>
      <ul style="list-style: disc; margin-left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <li>Sức khỏe dẻo dai, thuần nước tốt, tỷ lệ sống trên 99%.</li>
        <li>Kè sung mãn khi thấy đối thủ, vây xòe căng đét không rách tưa.</li>
        <li>Màu sắc bắt mắt, ánh kim tuyến quang phổ rực rỡ dưới ánh đèn thủy sinh.</li>
        <li>Bảo hành 1 đổi 1 nếu cá chết hoặc hao hụt trong quá trình vận chuyển toàn quốc.</li>
      </ul>
    `;

    // Render Gallery
    const mainImg = document.getElementById('detail-main-img');
    const images = Array.isArray(currentProduct.images) && currentProduct.images.length > 0
      ? currentProduct.images
      : ['https://images.unsplash.com/photo-1576836165612-8bc9b07e7778?auto=format&fit=crop&w=800&q=80'];

    mainImg.src = images[0];
    mainImg.alt = currentProduct.name;

    const thumbList = document.getElementById('detail-thumbnails');
    if (thumbList) {
      thumbList.innerHTML = images.map((img, idx) => `
        <div class="thumb-item ${idx === 0 ? 'active' : ''}" data-src="${img}">
          <img src="${img}" alt="Thumbnail ${idx + 1}" />
        </div>
      `).join('');

      thumbList.querySelectorAll('.thumb-item').forEach((thumb) => {
        thumb.addEventListener('click', () => {
          thumbList.querySelectorAll('.thumb-item').forEach((t) => t.classList.remove('active'));
          thumb.classList.add('active');
          mainImg.src = thumb.getAttribute('data-src');
        });
      });
    }
  } catch (err) {
    console.error('Error loading product detail:', err);
  }
}

function setupQuantityControls() {
  const minusBtn = document.getElementById('qty-minus');
  const plusBtn = document.getElementById('qty-plus');
  const input = document.getElementById('qty-input');

  if (!minusBtn || !plusBtn || !input) return;

  minusBtn.addEventListener('click', () => {
    if (currentQuantity > 1) {
      currentQuantity--;
      input.value = currentQuantity;
    }
  });

  plusBtn.addEventListener('click', () => {
    currentQuantity++;
    input.value = currentQuantity;
  });

  input.addEventListener('change', () => {
    const val = parseInt(input.value, 10);
    currentQuantity = isNaN(val) || val < 1 ? 1 : val;
    input.value = currentQuantity;
  });
}

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetId)?.classList.add('active');
    });
  });
}

function setupAddToCart() {
  const btnAdd = document.getElementById('btn-add-to-cart');
  const btnBuyNow = document.getElementById('btn-buy-now');

  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      if (!currentProduct) return;
      addToCart(currentProduct, currentQuantity);
      showToast(`Đã thêm ${currentQuantity} x "${currentProduct.name}" vào giỏ hàng!`, 'success');
    });
  }

  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', () => {
      if (!currentProduct) return;
      addToCart(currentProduct, currentQuantity);
      window.location.href = 'checkout.html';
    });
  }
}

async function loadRelatedProducts() {
  const container = document.getElementById('related-products-grid');
  if (!container) return;

  try {
    const featured = await productApi.getFeaturedProducts();
    const related = featured.slice(0, 4);
    container.innerHTML = related.map((p) => renderProductCardHTML(p)).join('');
    bindAddToCartEvents(container, related);
  } catch (err) {
    console.error('Error loading related products:', err);
  }
}
