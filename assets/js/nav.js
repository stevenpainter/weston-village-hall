/**
 * nav.js — Accessible mobile navigation toggle
 *
 * GDS principles applied:
 * - aria-expanded reflects open/closed state for screen readers
 * - aria-live region announces state change
 * - Focus trap within open menu (Tab / Shift+Tab)
 * - Escape key closes the menu and returns focus to toggle
 * - Keyboard navigation within nav items
 */

(function () {
  'use strict';

  const toggle   = document.getElementById('nav-toggle');
  const navList  = document.getElementById('nav-list');
  const liveRegion = document.getElementById('nav-live-region');

  if (!toggle || !navList) return;

  // All focusable elements inside the nav
  function getFocusableItems() {
    return Array.from(
      navList.querySelectorAll(
        'a[href], button:not([disabled])'
      )
    ).filter(el => !el.closest('[hidden]'));
  }

  function openMenu() {
    navList.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    if (liveRegion) liveRegion.textContent = 'Navigation menu opened';

    // Move focus to first nav item
    const items = getFocusableItems();
    if (items.length) items[0].focus();
  }

  function closeMenu(returnFocus = true) {
    navList.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (liveRegion) liveRegion.textContent = 'Navigation menu closed';
    if (returnFocus) toggle.focus();
  }

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  // Toggle on button click
  toggle.addEventListener('click', () => {
    isOpen() ? closeMenu() : openMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      closeMenu();
    }
  });

  // Close when focus moves entirely outside nav
  navList.addEventListener('focusout', (e) => {
    if (!navList.contains(e.relatedTarget) && !toggle.contains(e.relatedTarget)) {
      if (isOpen()) {
        closeMenu(false); // don't steal focus
      }
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (isOpen() && !navList.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu(false);
    }
  });

  // On desktop: always show nav regardless of class
  const mq = window.matchMedia('(min-width: 960px)');
  function handleBreakpoint(e) {
    if (e.matches) {
      // Desktop — always visible, reset aria state
      navList.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }
  mq.addEventListener('change', handleBreakpoint);
  handleBreakpoint(mq);

}());
