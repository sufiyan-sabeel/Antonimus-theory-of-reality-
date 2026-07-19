/* ================================================================ */
/* ANTONIMUS BOOK — THEME SWITCHER                                 */
/* ================================================================ */

const ThemeManager = (() => {
  const STORAGE_KEY = 'antonimus-theme';
  const THEMES = ['light', 'dark', 'amoled', 'highcontrast'];

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES.includes(stored)) return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    // Update meta theme-color
    const colors = {
      light: '#f5f0e8',
      dark: '#1a1612',
      amoled: '#000000',
      highcontrast: '#ffffff'
    };
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors[theme] || colors.light);
  }

  function init() {
    const theme = getPreferredTheme();
    applyTheme(theme);

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  return { init, applyTheme, THEMES };
})();

document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
