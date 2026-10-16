/**
 * Checkout Page Logic
 */

import { getCart, getCartSubtotal, clearCart, getUser } from '../utils/storage.js';
import { formatCurrencyVND } from '../utils/formatters.js';
import { orderApi } from '../api/order.api.js';
import { showToast } from '../components/toast.js';

let selectedPaymentMethod = 'COD';

document.addEventListener('DOMContentLoaded', () => {
  const cart = getCart();
  if (!cart || cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  populateUserData();
  renderOrderReview(cart);
  setupPaymentSelection();
  setupCheckoutForm();
});

function populateUserData() {
  const user = getUser();
  if (user) {
    if (document.getElementById('checkout-fullname')) {
      document.getElementById('checkout-fullname').value = user.fullName || '';
    }
    if (document.getElementById('checkout-email')) {
      document.getElementById('checkout-email').value = user.email || '';
    }
    if (document.getElementById('checkout-phone')) {
      document.getElementById('checkout-phone').value = user.phone || '';
    }
    if (document.getElementById('checkout-address')) {
      document.getElementById('checkout-address').value = user.address || '';
    }
  }
}

function renderOrderReview(cart) {
  const itemsContainer = document.getElementById('checkout-items-list');
  const subtotal = getCartSubtotal();
  const shipping = subtotal >= 500000 ? 0 : 35000;
  const total = subtotal + shipping;

  if (itemsContainer) {
    itemsContainer.innerHTML = cart.map((item) => `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; font-size:0.9rem;">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <span style="font-weight:700; color:var(--primary); font-size:0.85rem;">${item.quantity}x</span>
          <span style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</span>
        </div>
        <span style="font-weight:600;">${formatCurrencyVND(item.price * item.quantity)}</span>
      </div>
    `).join('');
  }

  document.getElementById('checkout-subtotal').textContent = formatCurrencyVND(subtotal);
  document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'Miễn phí' : formatCurrencyVND(shipping);
  document.getElementById('checkout-total').textContent = formatCurrencyVND(total);
}

function setupPaymentSelection() {
  const options = document.querySelectorAll('.payment-option');
  options.forEach((opt) => {
    opt.addEventListener('click', () => {
      options.forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedPaymentMethod = radio.value;
      }
    });
  });
}

function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('checkout-fullname').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    const address = document.getElementById('checkout-address').value.trim();
    const notes = document.getElementById('checkout-notes')?.value.trim() || '';

    if (!fullName || !phone || !address) {
      showToast('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng!', 'warning');
      return;
    }

    const cart = getCart();
    const subtotal = getCartSubtotal();
    const shipping = subtotal >= 500000 ? 0 : 35000;
    const totalAmount = subtotal + shipping;

    const submitBtn = document.getElementById('btn-submit-order');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang xử lý đơn hàng...';
    }

    try {
      const orderPayload = {
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        shippingAddress: address,
        notes,
        paymentMethod: selectedPaymentMethod,
        totalAmount,
        items: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const result = await orderApi.createOrder(orderPayload);
      clearCart();

      // Show success modal
      showSuccessModal(result.orderNumber || 'BL-' + Math.floor(100000 + Math.random() * 900000), totalAmount);
    } catch (err) {
      showToast('Đặt hàng thất bại: ' + err.message, 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Xác nhận đặt hàng';
      }
    }
  });
}

function showSuccessModal(orderCode, total) {
  const modal = document.getElementById('order-success-modal');
  if (!modal) {
    showToast(`Đặt hàng thành công! Mã đơn: ${orderCode}`, 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    return;
  }

  document.getElementById('modal-order-code').textContent = orderCode;
  document.getElementById('modal-order-total').textContent = formatCurrencyVND(total);
  modal.classList.add('active');
}
