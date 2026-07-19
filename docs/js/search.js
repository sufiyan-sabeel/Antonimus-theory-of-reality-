/* ================================================================ */
/* ANTONIMUS BOOK — SEARCH SYSTEM                                  */
/* Live search with result previews, highlighting, keyboard nav      */
/* ================================================================ */

const Search = (() => {
  let searchIndex = [];
  let isOpen = false;

  function buildIndex() {
    searchIndex = [];
    const content = document.querySelector('.book-content');
    if (!content) return;

    // Index all headings and their following paragraphs
    content.querySelectorAll('h2, h3, h4').forEach(heading => {
      const id = heading.id;
      const title = heading.textContent.trim();
      let preview = '';
      let el = heading.nextElementSibling;
      // Collect up to ~150 chars of content
      while (el && !el.matches('h2, h3, h4') && preview.length < 150) {
        preview += ' ' + (el.textContent || '').trim();
        el = el.nextElementSibling;
      }
      preview = preview.trim().substring(0, 200);

      searchIndex.push({
        id,
        title,
        preview,
        url: `#${id}`
      });
    });
  }

  function performSearch(query) {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchIndex.filter(item => {
      return item.title.toLowerCase().includes(q) || item.preview.toLowerCase().includes(q);
    }).slice(0, 20);
  }

  function renderResults(results, query) {
    const container = document.getElementById('search-results');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = '<div class="search-no-results">No results found for "' + query + '"</div>';
      return;
    }

    const q = query.toLowerCase();
    container.innerHTML = results.map((r, i) => {
      const titleHighlight = r.title.replace(new RegExp(q, 'gi'), m => `<mark>${m}</mark>`);
      const previewHighlight = r.preview.replace(new RegExp(q, 'gi'), m => `<mark>${m}</mark>`);
      return `<div class="search-result-item" data-index="${i}" data-url="${r.url}">
        <div class="result-title">${titleHighlight}</div>
        <div class="result-preview">${previewHighlight}</div>
      </div>`;
    }).join('');

    // Click handler
    container.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        window.location.hash = item.dataset.url;
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
      if (input.value.trim()) {
        openSearch();
      }
    });

    // Keyboard: Escape to close
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeSearch(); input.blur(); }
      if (e.key === 'Enter') {
        const first = document.querySelector('.search-result-item');
        if (first) { window.location.hash = first.dataset.url; closeSearch(); }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const first = document.querySelector('.search-result-item');
        first?.focus();
      }
    });

    // Overlay click to close
    document.getElementById('search-overlay')?.addEventListener('click', closeSearch);

    // Search button
    document.querySelectorAll('[data-action="search"]').forEach(btn => {
      btn.addEventListener('click', () => {
        openSearch();
        setTimeout(() => input.select(), 100);
      });
    });

    // Keyboard shortcut: Ctrl+K or /
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !e.ctrlKey && !e.metaKey && !['INPUT', 'TEXTAREA'].includes(e.target.tagName))) {
        e.preventDefault();
        openSearch();
      }
    });
  }

  function rebuildIndex() {
    buildIndex();
  }

  return { init, rebuildIndex };
})();

document.addEventListener('DOMContentLoaded', () => Search.init());
