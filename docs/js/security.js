/* ================================================================ */
/* ANTONIMUS BOOK — SECURITY UTILITY                               */
/* Input sanitization, safe HTML escaping, XSS prevention           */
/* ================================================================ */

const Security = (() => {
  'use strict';

  /**
   * Sanitize a string for safe insertion into HTML.
   * Escapes &, <, >, ", ', and / to prevent XSS.
   */
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitize a string for safe attribute insertion.
   * Removes dangerous characters that could break out of attributes.
   */
  function sanitizeAttribute(str) {
    if (str == null) return '';
    return String(str).replace(/["'<>`]/g, '').trim();
  }

  /**
   * Validate that a string is a safe ID selector (alphanumeric + hyphens + underscores)
   */
  function safeId(str) {
    if (str == null) return '';
    return String(str).replace(/[^a-zA-Z0-9\-_]/g, '');
  }

  /**
   * Sanitize a URL hash fragment for navigation.
   */
  function safeHash(str) {
    if (str == null) return '';
    const clean = String(str).replace(/[^a-zA-Z0-9\-_.#]/g, '');
    if (clean.startsWith('#')) return clean;
    return '#' + clean;
  }

  /**
   * Sanitize search query input - allow letters, numbers, spaces and basic punctuation.
   */
  function sanitizeSearchQuery(str) {
    if (str == null) return '';
    return String(str).replace(/[<>&"'`]/g, '').trim();
  }

  /**
   * Safe textContent setter - alternative to innerHTML for plain text.
   */
  function setText(el, text) {
    if (!el) return;
    el.textContent = text;
  }

  /**
   * Safe innerHTML setter with automatic escaping for text content.
   * Only use this when you need HTML; prefer textContent otherwise.
   */
  function setSafeHTML(el, html) {
    if (!el) return;
    // Strip script tags and event handlers
    const safe = String(html)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*["']?[^"']*["']?/gi, '')
      .replace(/javascript:/gi, '');
    el.innerHTML = safe;
  }

  /**
   * Validate that a value is a safe number for calculations.
   */
  function safeNumber(val, defaultVal = 0) {
    const n = parseFloat(val);
    return isNaN(n) ? defaultVal : n;
  }

  /**
   * Check if localStorage is available (private browsing may block it).
   */
  function isLocalStorageAvailable() {
    try {
      const key = '__antonimus_test__';
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Safely get an item from localStorage.
   */
  function getStorage(key, defaultVal = null) {
    try {
      if (!isLocalStorageAvailable()) return defaultVal;
      const val = localStorage.getItem(key);
      return val !== null ? val : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  /**
   * Safely set an item in localStorage.
   */
  function setStorage(key, val) {
    try {
      if (!isLocalStorageAvailable()) return false;
      localStorage.setItem(key, String(val));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Safely remove an item from localStorage.
   */
  function removeStorage(key) {
    try {
      if (!isLocalStorageAvailable()) return;
      localStorage.removeItem(key);
    } catch (e) { /* ignore */ }
  }

  /**
   * Create a text node safely - avoids HTML interpretation entirely.
   */
  function createText(text) {
    return document.createTextNode(String(text));
  }

  return {
    escapeHtml,
    sanitizeAttribute,
    safeId,
    safeHash,
    sanitizeSearchQuery,
    setText,
    setSafeHTML,
    safeNumber,
    isLocalStorageAvailable,
    getStorage,
    setStorage,
    removeStorage,
    createText
  };
})();
