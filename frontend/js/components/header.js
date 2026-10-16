/**
 * Header & Navigation Component
 * Handles dynamic auth status, cart badge counter, live search bar, and theme switcher
 */

import { getUser, isAuthenticated, getCartCount, removeToken } from '../utils/storage.js';

export function initHeader() {
  updateCartBadge();
  updateAuthStatus();
  setupSearch();
  setupTheme();

  // Listen to cart change events from anywhere in the app
  window.addEventListener('betta-cart-updated', () => {
    updateCartBadge();
  });
}

/**
 * Updates the notification badge on the cart button
 */
export function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  const count = getCartCount();
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

/**
 * Renders user login/logout status in header
 */
export function updateAuthStatus() {
  const authContainer = document.querySelector('.header-auth-slot');
  if (!authContainer) return;

  if (isAuthenticated()) {
    const user = getUser();
    const displayName = user?.fullName || user?.email?.split('@')[0] || 'Tài khoản';
    
    authContainer.innerHTML = `
      <div class="user-profile-menu">
        <a href="javascript:void(0)" class="action-btn" id="btn-user-menu" title="${displayName}">
          <span style="font-weight:700; font-size:0.85rem;">👤</span>
        </a>
        <span style="font-size:0.85rem; font-weight:600; color:var(--text-primary); max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          ${displayName}
        </span>
        <button id="btn-logout" class="btn btn-sm btn-secondary" style="margin-left:0.5rem;" title="Đăng xuất">
          Thoát
        </button>
      </div>
    `;

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      removeToken();
      window.location.reload();
    });
  } else {
    authContainer.innerHTML = `
      <a href="login.html" class="btn btn-sm btn-primary" title="Đăng nhập tài khoản">
        Đăng nhập
      </a>
    `;
  }
}

/**
 * Handles header search input submission
 */
function setupSearch() {
  const searchInput = document.getElementById('header-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim();
      if (q) {
        window.location.href = `products.html?search=${encodeURIComponent(q)}`;
      }
    }
  });
}

/**
 * Toggle dark / light theme
 */
function setupTheme() {
  const savedTheme = localStorage.getItem('betta_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('betta_theme', next);
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }
}

// Auto init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
});
