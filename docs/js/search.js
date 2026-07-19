/* ================================================================ */
/* ANTONIMUS BOOK — SEARCH SYSTEM                                  */
/* Live search with result previews, highlighting, keyboard nav      */
/* Uses Security utility for XSS prevention                         */
/* ================================================================ */

const Search = (() => {
  let searchIndex = [];
  let isOpen = false;

  function buildIndex() {
    searchIndex = [];
    const content = document.querySelector('.book-content');
    if (!content) return;

    content.querySelectorAll('h2, h3, h4').forEach(heading => {
      const id = heading.id || '';
      const title = heading.textContent.trim();
      let preview = '';
      let el = heading.nextElementSibling;
      while (el && !el.matches('h2, h3, h4') && preview.length < 150) {
        preview += ' ' + (el.textContent || '').trim();
        el = el.nextElementSibling;
      }
      preview = preview.trim().substring(0, 200);

      searchIndex.push({
        id: Security.safeId(id),
        title,
        preview,
        url: Security.safeHash(id)
      });
    });
  }

  function performSearch(query) {
    const q = Security.sanitizeSearchQuery(query);
    if (!q) return [];
    const lower = q.toLowerCase();
    return searchIndex.filter(item => {
      return item.title.toLowerCase().includes(lower) || item.preview.toLowerCase().includes(lower);
    }).slice(0, 20);
  }

  function renderResults(results, query) {
    const container = document.getElementById('search-results');
    if (!container) return;

    const safeQuery = Security.sanitizeSearchQuery(query);

    if (results.length === 0) {
      Security.setSafeHTML(container, '<div class="search-no-results">No results found for "' + Security.escapeHtml(safeQuery) + '"</div>');
      return;
    }

    const q = safeQuery.toLowerCase();
    const html = results.map((r, i) => {
      const titleSafe = Security.escapeHtml(r.title);
      const previewSafe = Security.escapeHtml(r.preview);
      const titleHighlight = q ? titleSafe.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => '<mark>' + m + '</mark>') : titleSafe;
      const previewHighlight = q ? previewSafe.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => '<mark>' + m + '</mark>') : previewSafe;
      return '<div class="search-result-item" data-index="' + i + '" data-url="' + Security.escapeHtml(r.url) + '">' +
        '<div class="result-title">' + titleHighlight + '</div>' +
        '<div class="result-preview">' + previewHighlight + '</div>' +
        '</div>';
    }).join('');

    Security.setSafeHTML(container, html);

    container.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.getAttribute('data-url');
        if (url) window.location.hash = Security.safeHash(url);
        closeSearch();
      });
    });
  }

  function openSearch() {
    isOpen = true;
    document.getElementById('search-overlay')?.classList.add('open');
    document.getElementById('search-results')?.classList.add('open');
    document.getElementById('search-input')?.focus();
  }

  function closeSearch() {
    isOpen = false;
    document.getElementById('search-overlay')?.classList.remove('open');
    document.getElementById('search-results')?.classList.remove('open');
  }

  function init() {
    buildIndex();

    const input = document.getElementById('search-input');
    if (!input) return;

    input.addEventListener('input', () => {
      const results = performSearch(input.value);
      renderResults(results, input.value);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim()) openSearch();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeSearch(); input.blur(); }
      if (e.key === 'Enter') {
        const first = document.querySelector('.search-result-item');
        if (first) {
          const url = first.getAttribute('data-url');
          if (url) window.location.hash = Security.safeHash(url);
          closeSearch();
        }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const first = document.querySelector('.search-result-item');
        first?.focus();
      }
    });

    document.getElementById('search-overlay')?.addEventListener('click', closeSearch);

    document.querySelectorAll('[data-action="search"]').forEach(btn => {
      btn.addEventListener('click', () => {
        openSearch();
        setTimeout(() => input.select(), 100);
      });
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !e.ctrlKey && !e.metaKey && !['INPUT', 'TEXTAREA'].includes(e.target.tagName))) {
        e.preventDefault();
        openSearch();
      }
    });
  }

  function rebuildIndex() { buildIndex(); }

  return { init, rebuildIndex };
})();

// Must come after Security is loaded
document.addEventListener('DOMContentLoaded', () => Search.init());
