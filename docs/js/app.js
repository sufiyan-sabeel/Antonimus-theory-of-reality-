/* ================================================================ */
/* ANTONIMUS BOOK — MAIN APPLICATION LOGIC                         */
/* Reading progress, scroll spy, keyboard shortcuts, bookmarks, etc.*/
/* ================================================================ */

const App = (() => {
  const STORAGE_PREFIX = 'antonimus-';

  function init() {
    readingProgress();
    backToTop();
    readingTime();
    keyboardShortcuts();
    bookmarking();
    fontControls();
    focusMode();
    fullscreenMode();
    copyButtons();
    headingAnchors();
    restorePosition();
    collapsibleSections();
    themeDropdown();
  }

  /* ---- Reading Progress ---- */
  function readingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    });
  }

  /* ---- Back to Top ---- */
  function backToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Reading Time ---- */
  function readingTime() {
    const el = document.getElementById('reading-time');
    if (!el) return;
    const text = document.querySelector('.book-content')?.textContent || '';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    el.textContent = `~${minutes} min read · ${words.toLocaleString()} words`;
  }

  /* ---- Keyboard Shortcuts ---- */
  function keyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      switch (e.key) {
        case '?':
          e.preventDefault();
          toggleShortcutsModal();
          break;
        case 'f':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleFocusMode();
          }
          break;
        case 'b':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleBookmark();
          }
          break;
        case 'ArrowLeft':
          if (e.altKey) { e.preventDefault(); navigatePrev(); }
          break;
        case 'ArrowRight':
          if (e.altKey) { e.preventDefault(); navigateNext(); }
          break;
      }
    });

    // Build shortcuts modal content
    const modal = document.getElementById('shortcuts-modal');
    if (modal) {
      modal.querySelector('.close-modal')?.addEventListener('click', () => modal.classList.remove('open'));
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    }
  }

  function toggleShortcutsModal() {
    document.getElementById('shortcuts-modal')?.classList.toggle('open');
  }

  function navigatePrev() {
    const prev = document.querySelector('.nav-prev');
    if (prev) prev.click();
  }

  function navigateNext() {
    const next = document.querySelector('.nav-next');
    if (next) next.click();
  }

  /* ---- Bookmarking ---- */
  function bookmarking() {
    const indicator = document.getElementById('bookmark-indicator');
    if (!indicator) return;

    // Check for saved bookmark
    const saved = localStorage.getItem(STORAGE_PREFIX + 'bookmark');
    if (saved) {
      indicator.classList.add('visible');
      indicator.querySelector('.bookmark-title').textContent = saved;
    }

    // Save bookmark button
    document.querySelectorAll('[data-action="bookmark"]').forEach(btn => {
      btn.addEventListener('click', toggleBookmark);
    });

    // Auto-save position on scroll
    let saveTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const hash = window.location.hash || '#abstract';
        const heading = document.querySelector(hash);
        if (heading) {
          const title = heading.textContent?.trim()?.substring(0, 60) || 'Current position';
          localStorage.setItem(STORAGE_PREFIX + 'position', JSON.stringify({
            hash,
            title,
            scrollY: window.scrollY,
            timestamp: Date.now()
          }));
        }
      }, 500);
    });
  }

  function toggleBookmark() {
    const indicator = document.getElementById('bookmark-indicator');
    const hash = window.location.hash || '#abstract';
    const heading = document.querySelector(hash);
    const title = heading?.textContent?.trim()?.substring(0, 60) || 'Current page';

    const saved = localStorage.getItem(STORAGE_PREFIX + 'bookmark');
    if (saved) {
      localStorage.removeItem(STORAGE_PREFIX + 'bookmark');
      indicator?.classList.remove('visible');
    } else {
      localStorage.setItem(STORAGE_PREFIX + 'bookmark', title);
      indicator?.classList.add('visible');
      indicator.querySelector('.bookmark-title').textContent = title;
    }
  }

  /* ---- Font Size Controls ---- */
  function fontControls() {
    const baseSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-size-base'));
    const html = document.documentElement;

    // Load saved size
    const saved = localStorage.getItem(STORAGE_PREFIX + 'fontsize');
    if (saved) {
      html.style.fontSize = saved + 'px';
    }

    document.querySelectorAll('[data-action="font-decrease"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = parseFloat(getComputedStyle(html).fontSize);
        if (current > 14) {
          html.style.fontSize = (current - 1) + 'px';
          localStorage.setItem(STORAGE_PREFIX + 'fontsize', current - 1);
        }
      });
    });

    document.querySelectorAll('[data-action="font-increase"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = parseFloat(getComputedStyle(html).fontSize);
        if (current < 22) {
          html.style.fontSize = (current + 1) + 'px';
          localStorage.setItem(STORAGE_PREFIX + 'fontsize', current + 1);
        }
      });
    });
  }

  /* ---- Focus Mode ---- */
  let focusModeActive = false;
  function toggleFocusMode() {
    focusModeActive = !focusModeActive;
    document.body.classList.toggle('focus-mode', focusModeActive);
    document.querySelectorAll('[data-action="focus"]').forEach(btn => {
      btn.classList.toggle('active', focusModeActive);
    });
  }

  function focusMode() {
    document.querySelectorAll('[data-action="focus"]').forEach(btn => {
      btn.addEventListener('click', toggleFocusMode);
    });
  }

  /* ---- Fullscreen Mode ---- */
  let fullscreenActive = false;
  function toggleFullscreen() {
    fullscreenActive = !fullscreenActive;
    document.body.classList.toggle('fullscreen-mode', fullscreenActive);
    document.querySelectorAll('[data-action="fullscreen"]').forEach(btn => {
      btn.classList.toggle('active', fullscreenActive);
    });
    if (fullscreenActive) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  }

  function fullscreenMode() {
    document.querySelectorAll('[data-action="fullscreen"]').forEach(btn => {
      btn.addEventListener('click', toggleFullscreen);
    });
  }

  /* ---- Copy Buttons for Code Blocks ---- */
  function copyButtons() {
    document.querySelectorAll('pre').forEach(pre => {
      // Only add if code block has content
      if (!pre.textContent.trim()) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.onclick = () => {
        const code = pre.querySelector('code')?.textContent || pre.textContent;
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
      };
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }

  /* ---- Heading Anchors ---- */
  function headingAnchors() {
    document.querySelectorAll('.book-content h2[id], .book-content h3[id]').forEach(h => {
      // Headings already have IDs from pandoc
      h.style.cursor = 'pointer';
      h.addEventListener('click', () => {
        window.location.hash = h.id;
      });
      // Add hover indicator
      h.addEventListener('mouseenter', () => {
        h.style.textDecoration = 'underline';
        h.style.textDecorationColor = 'var(--accent-gold)';
        h.style.textDecorationStyle = 'dotted';
      });
      h.addEventListener('mouseleave', () => {
        h.style.textDecoration = 'none';
      });
    });
  }

  /* ---- Restore Reading Position ---- */
  function restorePosition() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'position'));
      if (saved && saved.hash && (Date.now() - saved.timestamp < 86400000)) { // 24h
        // Show a small "Continue reading" banner
        const banner = document.createElement('div');
        banner.style.cssText = `
          position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
          background: var(--bg-card); border: 1px solid var(--accent-gold);
          border-radius: 8px; padding: 12px 20px; z-index: 95;
          box-shadow: 0 4px 20px var(--shadow-strong);
          display: flex; align-items: center; gap: 12px;
          font-size: 0.85rem;
        `;
        banner.innerHTML = `
          <span>Continue reading: <strong>${saved.title}</strong></span>
          <button style="background:var(--accent-brown);color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-family:inherit;">
            Resume
          </button>
          <button style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.1rem;padding:2px 6px;">&times;</button>
        `;
        document.body.appendChild(banner);

        banner.querySelector('button:first-of-type').addEventListener('click', () => {
          window.location.hash = saved.hash;
          setTimeout(() => window.scrollTo({ top: saved.scrollY, behavior: 'smooth' }), 100);
          banner.remove();
        });
        banner.querySelector('button:last-of-type').addEventListener('click', () => banner.remove());
      }
    } catch (e) { /* ignore */ }
  }

  /* ---- Theme Dropdown Toggle ---- */
  function themeDropdown() {
    document.querySelectorAll('[data-action="theme-toggle"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('theme-dropdown');
        dropdown?.classList.toggle('open');
      });
    });

    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ThemeManager.applyTheme(btn.dataset.theme);
        document.getElementById('theme-dropdown')?.classList.remove('open');
      });
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#theme-dropdown') && !e.target.closest('[data-action="theme-toggle"]')) {
        document.getElementById('theme-dropdown')?.classList.remove('open');
      }
    });
  }

  /* ---- Collapsible Sections ---- */
  function collapsibleSections() {
    // Make all h2 sections collapsible
    document.querySelectorAll('.book-content h2').forEach(h2 => {
      // Skip title-page headings and special sections
      if (h2.closest('.title-page')) return;

      const toggle = document.createElement('span');
      toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
      toggle.style.cssText = 'cursor:pointer;margin-left:8px;color:var(--text-muted);transition:transform 0.2s;display:inline-flex;align-items:center;';
      toggle.title = 'Collapse/Expand section';
      h2.appendChild(toggle);

      const siblings = [];
      let el = h2.nextElementSibling;
      while (el && el.tagName !== 'H2') {
        siblings.push(el);
        el = el.nextElementSibling;
      }

      toggle.addEventListener('click', () => {
        const collapsed = toggle.dataset.collapsed === 'true';
        siblings.forEach(s => { s.style.display = collapsed ? '' : 'none'; });
        toggle.dataset.collapsed = collapsed ? 'false' : 'true';
        toggle.style.transform = collapsed ? 'rotate(0deg)' : 'rotate(-90deg)';
      });
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
