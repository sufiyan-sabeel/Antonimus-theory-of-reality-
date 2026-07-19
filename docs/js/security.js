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

  /* ================================================================ */
  /* Web Crypto API — Public API Integrity Verification                */
  /* Uses the browser's native SubtleCrypto for SHA-256 hashing        */
  /* ================================================================ */

  /**
   * Check if the Web Crypto API is available.
   * This is a standard public API available in all modern browsers.
   */
  function isCryptoAvailable() {
    return typeof window !== 'undefined' &&
      window.crypto &&
      window.crypto.subtle &&
      typeof window.crypto.subtle.digest === 'function';
  }

  /**
   * Compute a SHA-256 hex digest of a string using the Web Crypto API.
   * This can be used to verify content integrity without loading external
   * hashing libraries.
   * @param {string} data - The data to hash
   * @returns {Promise<string>} Hex-encoded SHA-256 hash
   */
  async function sha256(data) {
    if (!isCryptoAvailable()) {
      throw new Error('Web Crypto API not available');
    }
    const encoder = new TextEncoder();
    const buffer = encoder.encode(String(data));
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify a SHA-256 hash against a known value.
   * Useful for checking if dynamically loaded content has been tampered with.
   * @param {string} data - The data to verify
   * @param {string} expectedHash - The expected SHA-256 hex hash
   * @returns {Promise<boolean>} Whether the hash matches
   */
  async function verifyHash(data, expectedHash) {
    try {
      const actual = await sha256(data);
      // Constant-time comparison to prevent timing attacks
      if (actual.length !== expectedHash.length) return false;
      let result = 0;
      for (let i = 0; i < actual.length; i++) {
        result |= actual.charCodeAt(i) ^ expectedHash.charCodeAt(i);
      }
      return result === 0;
    } catch (e) {
      return false;
    }
  }

  /**
   * Fetch a resource and verify its SHA-256 hash against an expected value.
   * Uses the Fetch API + Web Crypto API for end-to-end integrity checking.
   * @param {string} url - The URL to fetch
   * @param {string} expectedHash - Expected SHA-256 hex hash
   * @returns {Promise<{ok: boolean, data: string|null, error: string|null}>}
   */
  async function fetchAndVerify(url, expectedHash) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return { ok: false, data: null, error: 'HTTP ' + response.status };
      }
      const text = await response.text();
      const valid = await verifyHash(text, expectedHash);
      return {
        ok: valid,
        data: valid ? text : null,
        error: valid ? null : 'Hash mismatch: content may have been tampered with'
      };
    } catch (e) {
      return { ok: false, data: null, error: e.message };
    }
  }

  /**
   * Generate a random content integrity nonce using the Web Crypto API.
   * Useful for inline script/style CSP nonces.
   * @param {number} length - Number of bytes (default 16 = 128 bits)
   * @returns {Promise<string>} Base64-encoded nonce
   */
  async function generateNonce(length = 16) {
    if (!isCryptoAvailable()) {
      // Fallback for older browsers
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
    const buffer = new Uint8Array(length);
    window.crypto.getRandomValues(buffer);
    return btoa(String.fromCharCode.apply(null, buffer));
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
    createText,
    /* Web Crypto API methods */
    isCryptoAvailable,
    sha256,
    verifyHash,
    fetchAndVerify,
    generateNonce
  };
})();
