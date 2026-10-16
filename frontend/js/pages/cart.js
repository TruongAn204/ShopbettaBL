/**
 * Cart Page Logic
 */

import { getCart, updateCartQuantity, removeFromCart, getCartSubtotal, clearCart } from '../utils/storage.js';
import { formatCurrencyVND } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

let discountRate = 0; // e.g. 0.1 for 10%

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  setupCoupon();
  
  window.addEventListener('betta-cart-updated', () => {
    renderCart();
  });
});

export function renderCart() {
  const cart = getCart();
  const tableContainer = document.getElementById('cart-table-wrap');
  const emptyContainer = document.getElementById('cart-empty-wrap');
  const summaryWrap = document.getElementById('cart-summary-wrap');

  if (!cart || cart.length === 0) {
    if (tableContainer) tableContainer.style.display = 'none';
    if (summaryWrap) summaryWrap.style.display = 'none';
    if (emptyContainer) emptyContainer.style.display = 'block';
    return;
  }

  if (tableContainer) tableContainer.style.display = 'block';
  if (summaryWrap) summaryWrap.style.display = 'block';
  if (emptyContainer) emptyContainer.style.display = 'none';

  const tbody = document.getElementById('cart-items-tbody');
  if (!tbody) return;

  tbody.innerHTML = cart.map((item) => `
    <tr data-id="${item.id}">
      <td>
        <div class="cart-item-product">
          <img src="${item.image || 'assets/images/placeholder.svg'}" onerror="this.onerror=null; this.src='assets/images/placeholder.svg';" alt="${item.name}" class="cart-item-thumb" />
          <div>
            <a href="product-detail.html?id=${item.id}" class="cart-item-title">${item.name}</a>
            <div class="cart-item-category">${item.category || ''}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="cart-item-price">${formatCurrencyVND(item.price)}</span>
      </td>
      <td>
        <div class="qty-counter">
          <button class="cart-qty-btn-minus" data-id="${item.id}">-</button>
          <input type="text" value="${item.quantity}" readonly />
          <button class="cart-qty-btn-plus" data-id="${item.id}">+</button>
        </div>
      </td>
      <td>
        <span class="cart-item-subtotal">${formatCurrencyVND(item.price * item.quantity)}</span>
      </td>
      <td>
        <button class="cart-item-remove" data-id="${item.id}" title="Xóa khỏi giỏ">
          🗑
        </button>
      </td>
    </tr>
  `).join('');

  bindCartRowEvents();
  updateOrderSummary();
}

function bindCartRowEvents() {
  // Minus buttons
  document.querySelectorAll('.cart-qty-btn-minus').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = getCart().find((i) => String(i.id) === String(id));
      if (item) {
        updateCartQuantity(id, item.quantity - 1);
      }
    });
  });

  // Plus buttons
  document.querySelectorAll('.cart-qty-btn-plus').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = getCart().find((i) => String(i.id) === String(id));
      if (item) {
        updateCartQuantity(id, item.quantity + 1);
      }
    });
  });

  // Remove buttons
  document.querySelectorAll('.cart-item-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      removeFromCart(id);
      showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
    });
  });
}

function updateOrderSummary() {
  const subtotal = getCartSubtotal();
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 35000;
  const discountAmount = Math.round(subtotal * discountRate);
  const total = Math.max(0, subtotal + shipping - discountAmount);

  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const discountRow = document.getElementById('summary-discount-row');
  const discountEl = document.getElementById('summary-discount');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = formatCurrencyVND(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Miễn phí' : formatCurrencyVND(shipping);
  
  if (discountRow && discountEl) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-${formatCurrencyVND(discountAmount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (totalEl) totalEl.textContent = formatCurrencyVND(total);
}

function setupCoupon() {
  const applyBtn = document.getElementById('btn-apply-coupon');
  const couponInput = document.getElementById('coupon-code-input');

  if (!applyBtn || !couponInput) return;

  applyBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    if (code === 'BETTA10') {
      discountRate = 0.1;
      showToast('Áp dụng mã giảm giá 10% thành công!', 'success');
      updateOrderSummary();
    } else if (code === 'FREESHIP') {
      discountRate = 0.05;
      showToast('Áp dụng mã ưu đãi vận chuyển thành công!', 'success');
      updateOrderSummary();
    } else {
      showToast('Mã giảm giá không hợp lệ hoặc đã hết hạn!', 'warning');
    }
  });
}
