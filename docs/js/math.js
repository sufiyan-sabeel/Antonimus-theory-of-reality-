/* ================================================================ */
/* ANTONIMUS BOOK — MATH EQUATION SUPPORT                          */
/* ================================================================ */

const MathManager = (() => {
  let mathJaxLoaded = false;

  function init() {
    // Configure MathJax
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        tags: 'ams',
        tagIndent: '0em',
        multlineWidth: '80%'
      },
      options: {
        skipHtmlTypes: 'script',
        enableMenu: true,
        renderActions: {
          addCopy: [150, (doc) => {
            if (!doc) return;
            // Add copy buttons after rendering
            doc.querySelectorAll('.equation-box .MathJax').forEach(eq => {
              const btn = document.createElement('button');
              btn.className = 'eq-copy';
              btn.textContent = 'Copy LaTeX';
              btn.onclick = () => {
                const tex = eq.closest('.equation-box')?.querySelector('script[type="math/tex"]')?.textContent;
                if (tex) {
                  navigator.clipboard.writeText(tex).then(() => {
                    btn.textContent = 'Copied!';
                    setTimeout(() => { btn.textContent = 'Copy LaTeX'; }, 2000);
                  });
                }
              };
              eq.closest('.equation-box')?.querySelector('h3')?.after(btn);
            });
          }, '']
        }
      },
      startup: {
        pageReady: () => {
          mathJaxLoaded = true;
          document.dispatchEvent(new CustomEvent('mathjax-ready'));
          return MathJax.startup.defaultPageReady();
        }
      }
    };

    // Load MathJax
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);
  }

  function rerender() {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }

  return { init, rerender };
})();

document.addEventListener('DOMContentLoaded', () => MathManager.init());
