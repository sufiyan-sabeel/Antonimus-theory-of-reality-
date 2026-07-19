/* ================================================================ */
/* ANTONIMUS BOOK — NAVIGATION SYSTEM                              */
/* Auto-generates TOC, sidebar nav, prev/next buttons, scroll spy   */
/* ================================================================ */

const Navigation = (() => {
  function buildSidebar() {
    const nav = document.getElementById('sidebar-nav');
    if (!nav) return;

    const headings = document.querySelectorAll('.book-content h2, .book-content h3');
    const sections = [];
    let currentSection = null;

    headings.forEach(h => {
      // Skip h2/h3 inside callouts or tables
      if (h.closest('.callout, .law-box, .equation-box, table, blockquote')) return;

      const id = h.id || h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!h.id) h.id = id;

      const title = h.textContent.replace(/^\d+[\.\s]*/, '').trim();
      const level = h.tagName;

      if (level === 'H2') {
        currentSection = { id, title, subs: [] };
        sections.push(currentSection);
      } else if (level === 'H3' && currentSection) {
        currentSection.subs.push({ id, title });
      }
    });

    // Build nav HTML
    let html = '<ul>';
    sections.forEach((sec, i) => {
      const secNum = String(i + 1);
      html += `<li><a href="#${sec.id}" data-section="${secNum}">${secNum}. ${sec.title}</a>`;
      if (sec.subs.length > 0) {
        html += '<ul class="nav-sub">';
        sec.subs.forEach(sub => {
          html += `<li><a href="#${sub.id}">${sub.title}</a></li>`;
        });
        html += '</ul>';
      }
      html += '</li>';
    });
    html += '</ul>';
    nav.innerHTML = html;

    // Build prev/next
    buildPrevNext(sections);
  }

  function buildPrevNext(sections) {
    const container = document.getElementById('prev-next');
    if (!container) return;

    const allLinks = document.querySelectorAll('#sidebar-nav a');
    const currentPath = window.location.hash || `#${sections[0]?.id}`;

    let currentIdx = -1;
    allLinks.forEach((a, i) => {
      if (a.getAttribute('href') === currentPath) currentIdx = i;
    });

    const prev = currentIdx > 0 ? allLinks[currentIdx - 1] : null;
    const next = currentIdx < allLinks.length - 1 ? allLinks[currentIdx + 1] : null;

    let html = '<div class="prev-next-nav">';
    if (prev) {
      const title = prev.textContent.trim();
      html += `<a href="${prev.getAttribute('href')}" class="nav-prev">
        <div class="nav-label">Previous</div>
        <div class="nav-title">${title}</div>
      </a>`;
    } else {
      html += '<div></div>';
    }
    if (next) {
      const title = next.textContent.trim();
      html += `<a href="${next.getAttribute('href')}" class="nav-next">
        <div class="nav-label">Next</div>
        <div class="nav-title">${title}</div>
      </a>`;
    } else {
      html += '<div></div>';
    }
    html += '</div>';
    container.innerHTML = html;
  }

  function scrollSpy() {
    const links = document.querySelectorAll('#sidebar-nav a');
    const headings = document.querySelectorAll('.book-content h2[id], .book-content h3[id]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + 20}px 0px -60% 0px` });

    headings.forEach(h => observer.observe(h));
  }

  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('.main-content');
    sidebar.classList.toggle('open');
    main.classList.toggle('sidebar-open');
  }

  function init() {
    buildSidebar();
    scrollSpy();

    // Sidebar toggle
    document.querySelectorAll('.menu-btn, .sidebar-close, .sidebar-overlay').forEach(el => {
      el?.addEventListener('click', toggleSidebar);
    });

    // Close sidebar on nav click (mobile)
    document.querySelectorAll('#sidebar-nav a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth < 768) toggleSidebar();
      });
    });

    // Update prev/next on hash change
    window.addEventListener('hashchange', () => {
      const sections = [];
      document.querySelectorAll('#sidebar-nav a').forEach(a => {
        sections.push({ id: a.getAttribute('href').replace('#', ''), title: a.textContent.trim() });
      });
      buildPrevNext(sections);
    });
  }

  return { init, toggleSidebar };
})();

document.addEventListener('DOMContentLoaded', () => Navigation.init());
