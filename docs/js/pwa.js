/* ================================================================ */
/* ANTONIMUS BOOK — PWA (Progressive Web App) SUPPORT              */
/* Service worker registration, offline caching, manifest          */
/* ================================================================ */

const PWA = (() => {
  function init() {
    registerSW();
    setupInstallPrompt();
  }

  function registerSW() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
          console.log('SW registered:', reg.scope);
        }).catch(err => {
          console.log('SW registration failed:', err);
        });
      });
    }
  }

  function setupInstallPrompt() {
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) installBtn.style.display = 'inline-flex';
    });

    installBtn?.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        console.log('Install result:', result.outcome);
        deferredPrompt = null;
        installBtn.style.display = 'none';
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      if (installBtn) installBtn.style.display = 'none';
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => PWA.init());
