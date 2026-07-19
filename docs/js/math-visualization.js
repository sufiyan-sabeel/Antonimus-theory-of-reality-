/* ================================================================ */
/* ANTONIMUS BOOK — MATHEMATICS & VISUALIZATION SYSTEM            */
/* Interactive graphs, geometry, calculators, practice problems    */
/* ================================================================ */

const MathViz = (() => {
  'use strict';

  // ================================================================
  // CONFIGURATION & CONSTANTS
  // ================================================================
  const CONFIG = {
    colors: {
      primary: '#4a90d9',
      secondary: '#27ae60',
      accent: '#e74c3c',
      gold: '#f39c12',
      purple: '#9b59b6',
      gray: '#95a5a6',
      dark: '#2c3e50',
      light: '#ecf0f1',
      grid: '#e0e0e0',
      axis: '#34495e'
    },
    chartDefaults: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { enabled: true, mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { color: '#e0e0e0' }, title: { display: true, text: 'x' } },
        y: { grid: { color: '#e0e0e0' }, title: { display: true, text: 'y' } }
      }
    },
    isAntonimusModel: false // Flag to distinguish Antonimus models from established math
  };

  // ================================================================
  // UTILITY FUNCTIONS
  // ================================================================
  function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k.startsWith('on') && typeof v === 'function') {
        el.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (k === 'style' && typeof v === 'object') {
        Object.assign(el.style, v);
      } else {
        el.setAttribute(k, v);
      }
    });
    children.forEach(c => {
      if (typeof c === 'string') el.appendChild(document.createTextNode(c));
      else if (c instanceof Node) el.appendChild(c);
    });
    return el;
  }

  function createSVG(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function debounce(fn, ms = 150) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function formatNumber(n, decimals = 2) {
    if (Math.abs(n) >= 1e6 || (Math.abs(n) < 1e-3 && n !== 0)) return n.toExponential(decimals);
    return n.toFixed(decimals);
  }

  // ================================================================
  // SVG ICONS FOR MATH VIZ UI
  // ================================================================
  const ICONS = {
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    fullscreen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    math: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2v20"/><path d="M16 2v20"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  };

  // ================================================================
  // CHART.JS INTEGRATION (Dynamic Charts)
  // ================================================================
  let Chart = null;
  let chartInstances = new Map();

  async function loadChartJS() {
    if (typeof window.Chart !== 'undefined') {
      Chart = window.Chart;
      return Chart;
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      script.integrity = 'sha384-MVbQm6g7V2J9bZzQj0J9R7T9vV7Z9Y9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9';
      script.crossOrigin = 'anonymous';
      script.onload = () => { Chart = window.Chart; resolve(Chart); };
      script.onerror = () => reject(new Error('Failed to load Chart.js'));
      document.head.appendChild(script);
    });
  }

  function createChart(containerId, type, data, options = {}) {
    const canvas = document.getElementById(containerId);
    if (!canvas || !Chart) return null;
    const ctx = canvas.getContext('2d');
    const mergedOptions = deepMerge(CONFIG.chartDefaults, options);
    const chart = new Chart(ctx, { type, data, options: mergedOptions });
    chartInstances.set(containerId, chart);
    return chart;
  }

  function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  function destroyChart(containerId) {
    const chart = chartInstances.get(containerId);
    if (chart) { chart.destroy(); chartInstances.delete(containerId); }
  }

  // ================================================================
  // FUNCTION PLOTTER (Interactive Canvas-based)
  // ================================================================
  class FunctionPlotter {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.options = {
        width: options.width || 600,
        height: options.height || 400,
        xMin: options.xMin || -10,
        xMax: options.xMax || 10,
        yMin: options.yMin || -10,
        yMax: options.yMax || 10,
        gridStep: options.gridStep || 1,
        showGrid: true,
        showAxes: true,
        zoomFactor: 1.2,
        panSpeed: 0.1,
        ...options
      };
      this.functions = [];
      this.isPanning = false;
      this.lastMouse = { x: 0, y: 0 };
      this.transform = { scale: 1, translateX: 0, translateY: 0 };
      this.init();
    }

    init() {
      this.canvas = createElement('canvas', {
        width: this.options.width,
        height: this.options.height,
        style: { border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-primary)', cursor: 'grab', touchAction: 'none' }
      });
      this.ctx = this.canvas.getContext('2d');
      this.container.innerHTML = '';
      this.container.appendChild(this.canvas);
      this.bindEvents();
      this.render();
    }

    bindEvents() {
      this.canvas.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
      this.canvas.addEventListener('mousedown', (e) => this.startPan(e));
      window.addEventListener('mousemove', (e) => this.pan(e));
      window.addEventListener('mouseup', () => this.endPan());
      this.canvas.addEventListener('touchstart', (e) => this.startPan(e.touches[0]), { passive: false });
      this.canvas.addEventListener('touchmove', (e) => this.pan(e.touches[0]), { passive: false });
      this.canvas.addEventListener('touchend', () => this.endPan());
    }

    handleWheel(e) {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const factor = e.deltaY > 0 ? 1 / this.options.zoomFactor : this.options.zoomFactor;
      this.zoomAt(mouseX, mouseY, factor);
    }

    startPan(e) {
      this.isPanning = true;
      this.lastMouse = { x: e.clientX, y: e.clientY };
      this.canvas.style.cursor = 'grabbing';
    }

    pan(e) {
      if (!this.isPanning) return;
      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;
      this.transform.translateX += dx / this.transform.scale;
      this.transform.translateY += dy / this.transform.scale;
      this.lastMouse = { x: e.clientX, y: e.clientY };
      this.render();
    }

    endPan() {
      this.isPanning = false;
      this.canvas.style.cursor = 'grab';
    }

    zoomAt(x, y, factor) {
      const newScale = clamp(this.transform.scale * factor, 0.1, 50);
      const scaleRatio = newScale / this.transform.scale;
      this.transform.translateX = x - (x - this.transform.translateX) * scaleRatio;
      this.transform.translateY = y - (y - this.transform.translateY) * scaleRatio;
      this.transform.scale = newScale;
      this.render();
    }

    addFunction(fn, options = {}) {
      this.functions.push({
        fn,
        color: options.color || CONFIG.colors.primary,
        label: options.label || 'f(x)',
        lineWidth: options.lineWidth || 2,
        dashed: options.dashed || false,
        domain: options.domain || [this.options.xMin, this.options.xMax],
        samples: options.samples || 500
      });
      this.render();
    }

    clearFunctions() {
      this.functions = [];
      this.render();
    }

    resetView() {
      this.transform = { scale: 1, translateX: 0, translateY: 0 };
      this.render();
    }

    screenToMath(sx, sy) {
      const cx = this.canvas.width / 2 + this.transform.translateX * this.transform.scale;
      const cy = this.canvas.height / 2 + this.transform.translateY * this.transform.scale;
      const x = (sx - cx) / (this.transform.scale * this.pixelsPerUnitX);
      const y = (cy - sy) / (this.transform.scale * this.pixelsPerUnitY);
      return { x, y };
    }

    render() {
      if (!this.ctx) return;
      const { width, height } = this.canvas;
      this.ctx.clearRect(0, 0, width, height);
      this.ctx.save();
      this.ctx.translate(width / 2, height / 2);
      this.ctx.scale(this.transform.scale, this.transform.scale);
      this.ctx.translate(this.transform.translateX, this.transform.translateY);

      // Calculate pixels per unit
      this.pixelsPerUnitX = width / (this.options.xMax - this.options.xMin);
      this.pixelsPerUnitY = height / (this.options.yMax - this.options.yMin);

      // Draw grid
      if (this.options.showGrid) this.drawGrid();
      // Draw axes
      if (this.options.showAxes) this.drawAxes();
      // Draw functions
      this.drawFunctions();

      this.ctx.restore();
    }

    drawGrid() {
      const { xMin, xMax, yMin, yMax, gridStep } = this.options;
      this.ctx.strokeStyle = CONFIG.colors.grid;
      this.ctx.lineWidth = 0.5 / this.transform.scale;
      this.ctx.beginPath();
      for (let x = Math.ceil(xMin / gridStep) * gridStep; x <= xMax; x += gridStep) {
        const px = x * this.pixelsPerUnitX;
        this.ctx.moveTo(px, yMin * this.pixelsPerUnitY);
        this.ctx.lineTo(px, yMax * this.pixelsPerUnitY);
      }
      for (let y = Math.ceil(yMin / gridStep) * gridStep; y <= yMax; y += gridStep) {
        const py = y * this.pixelsPerUnitY;
        this.ctx.moveTo(xMin * this.pixelsPerUnitX, py);
        this.ctx.lineTo(xMax * this.pixelsPerUnitX, py);
      }
      this.ctx.stroke();
    }

    drawAxes() {
      const { xMin, xMax, yMin, yMax } = this.options;
      this.ctx.strokeStyle = CONFIG.colors.axis;
      this.ctx.lineWidth = 1.5 / this.transform.scale;
      this.ctx.font = `${12 / this.transform.scale}px sans-serif`;
      this.ctx.fillStyle = CONFIG.colors.axis;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'top';

      // X axis
      this.ctx.beginPath();
      this.ctx.moveTo(xMin * this.pixelsPerUnitX, 0);
      this.ctx.lineTo(xMax * this.pixelsPerUnitX, 0);
      this.ctx.stroke();

      // Y axis
      this.ctx.beginPath();
      this.ctx.moveTo(0, yMin * this.pixelsPerUnitY);
      this.ctx.lineTo(0, yMax * this.pixelsPerUnitY);
      this.ctx.stroke();

      // Tick marks and labels
      const gridStep = this.options.gridStep;
      for (let x = Math.ceil(xMin / gridStep) * gridStep; x <= xMax; x += gridStep) {
        if (x === 0) continue;
        const px = x * this.pixelsPerUnitX;
        this.ctx.beginPath();
        this.ctx.moveTo(px, -5 / this.transform.scale);
        this.ctx.lineTo(px, 5 / this.transform.scale);
        this.ctx.stroke();
        this.ctx.fillText(x.toString(), px, 8 / this.transform.scale);
      }
      for (let y = Math.ceil(yMin / gridStep) * gridStep; y <= yMax; y += gridStep) {
        if (y === 0) continue;
        const py = y * this.pixelsPerUnitY;
        this.ctx.beginPath();
        this.ctx.moveTo(-5 / this.transform.scale, py);
        this.ctx.lineTo(5 / this.transform.scale, py);
        this.ctx.stroke();
        this.ctx.fillText(y.toString(), -8 / this.transform.scale, py + 4 / this.transform.scale);
      }
      this.ctx.fillText('0', 8 / this.transform.scale, 14 / this.transform.scale);
    }

    drawFunctions() {
      this.functions.forEach(func => {
        this.ctx.strokeStyle = func.color;
        this.ctx.lineWidth = func.lineWidth / this.transform.scale;
        if (func.dashed) {
          this.ctx.setLineDash([10 / this.transform.scale, 5 / this.transform.scale]);
        } else {
          this.ctx.setLineDash([]);
        }
        this.ctx.beginPath();
        let first = true;
        const [xStart, xEnd] = func.domain;
        for (let i = 0; i <= func.samples; i++) {
          const x = xStart + (xEnd - xStart) * i / func.samples;
          try {
            const y = func.fn(x);
            if (isFinite(y) && y >= this.options.yMin - 10 && y <= this.options.yMax + 10) {
              const px = x * this.pixelsPerUnitX;
              const py = y * this.pixelsPerUnitY;
              if (first) { this.ctx.moveTo(px, py); first = false; }
              else this.ctx.lineTo(px, py);
            } else {
              first = true;
            }
          } catch (e) {
            first = true;
          }
        }
        this.ctx.stroke();
      });
    }

    exportSVG() {
      const svg = createSVG('svg', {
        width: this.canvas.width,
        height: this.canvas.height,
        viewBox: `0 0 ${this.canvas.width} ${this.canvas.height}`,
        xmlns: 'http://www.w3.org/2000/svg'
      });
      // This is a simplified export - for full fidelity, would need to recreate in SVG
      return svg.outerHTML;
    }

    exportPNG() {
      return this.canvas.toDataURL('image/png');
    }
  }

  // ================================================================
  // GEOMETRY DIAGRAMS (SVG-based)
  // ================================================================
  class GeometryDiagram {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.width = options.width || 400;
      this.height = options.height || 400;
      this.viewBox = options.viewBox || `0 0 ${this.width} ${this.height}`;
      this.elements = [];
      this.init();
    }

    init() {
      this.svg = createSVG('svg', {
        width: this.width,
        height: this.height,
        viewBox: this.viewBox,
        style: { border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-primary)' }
      });
      this.container.innerHTML = '';
      this.container.appendChild(this.svg);
      this.defs = createSVG('defs', {});
      this.svg.appendChild(this.defs);
      this.addArrowMarker();
    }

    addArrowMarker() {
      const marker = createSVG('marker', {
        id: 'arrowhead',
        markerWidth: 10,
        markerHeight: 7,
        refX: 9,
        refY: 3.5,
        orient: 'auto'
      });
      marker.appendChild(createSVG('polygon', { points: '0 0, 10 3.5, 0 7', fill: CONFIG.colors.axis }));
      this.defs.appendChild(marker);
    }

    clear() {
      while (this.svg.firstChild) {
        if (this.svg.firstChild !== this.defs) this.svg.removeChild(this.svg.firstChild);
        else break;
      }
      this.elements = [];
    }

    // Coordinate system helpers
    drawGrid(step = 1, color = CONFIG.colors.grid) {
      const [, , w, h] = this.viewBox.split(' ').map(Number);
      const group = createSVG('g', { class: 'grid' });
      for (let x = 0; x <= w; x += step * (w / 10)) {
        group.appendChild(createSVG('line', { x1: x, y1: 0, x2: x, y2: h, stroke: color, 'stroke-width': 0.5 }));
      }
      for (let y = 0; y <= h; y += step * (h / 10)) {
        group.appendChild(createSVG('line', { x1: 0, y1: y, x2: w, y2: y, stroke: color, 'stroke-width': 0.5 }));
      }
      this.svg.appendChild(group);
    }

    drawAxes(color = CONFIG.colors.axis) {
      const [, , w, h] = this.viewBox.split(' ').map(Number);
      const cx = w / 2, cy = h / 2;
      const group = createSVG('g', { class: 'axes' });
      // X axis
      group.appendChild(createSVG('line', { x1: 0, y1: cy, x2: w, y2: cy, stroke: color, 'stroke-width': 2 }));
      // Y axis
      group.appendChild(createSVG('line', { x1: cx, y1: 0, x2: cx, y2: h, stroke: color, 'stroke-width': 2 }));
      // Arrowheads
      group.appendChild(createSVG('path', { d: `M${w-10} ${cy-5} L${w} ${cy} L${w-10} ${cy+5}`, fill: color }));
      group.appendChild(createSVG('path', { d: `M${cx-5} 10 L${cx} 0 L${cx+5} 10`, fill: color }));
      this.svg.appendChild(group);
    }

    // Shapes
    drawCircle(cx, cy, r, options = {}) {
      const circle = createSVG('circle', {
        cx, cy, r,
        fill: options.fill || 'none',
        stroke: options.stroke || CONFIG.colors.primary,
        'stroke-width': options.strokeWidth || 2,
        'stroke-dasharray': options.dashed ? '5,5' : 'none'
      });
      this.svg.appendChild(circle);
      if (options.label) {
        this.drawText(cx, cy - r - 10, options.label, { textAnchor: 'middle', fill: options.stroke || CONFIG.colors.primary });
      }
      return circle;
    }

    drawRectangle(x, y, w, h, options = {}) {
      const rect = createSVG('rect', {
        x, y, width: w, height: h,
        fill: options.fill || 'none',
        stroke: options.stroke || CONFIG.colors.primary,
        'stroke-width': options.strokeWidth || 2,
        rx: options.rx || 0,
        ry: options.ry || 0
      });
      this.svg.appendChild(rect);
      return rect;
    }

    drawLine(x1, y1, x2, y2, options = {}) {
      const line = createSVG('line', {
        x1, y1, x2, y2,
        stroke: options.stroke || CONFIG.colors.primary,
        'stroke-width': options.strokeWidth || 2,
        'stroke-dasharray': options.dashed ? '5,5' : 'none',
        'marker-end': options.arrow ? 'url(#arrowhead)' : 'none'
      });
      this.svg.appendChild(line);
      return line;
    }

    drawPolygon(points, options = {}) {
      const polygon = createSVG('polygon', {
        points: points.map(p => `${p.x},${p.y}`).join(' '),
        fill: options.fill || 'none',
        stroke: options.stroke || CONFIG.colors.primary,
        'stroke-width': options.strokeWidth || 2
      });
      this.svg.appendChild(polygon);
      return polygon;
    }

    drawTriangle(p1, p2, p3, options = {}) {
      return this.drawPolygon([p1, p2, p3], options);
    }

    drawVector(x1, y1, x2, y2, options = {}) {
      return this.drawLine(x1, y1, x2, y2, {
        stroke: options.stroke || CONFIG.colors.secondary,
        strokeWidth: options.strokeWidth || 3,
        arrow: true
      });
    }

    drawAngle(p1, p2, p3, radius = 20, options = {}) {
      // p2 is vertex, p1 and p3 are points on the rays
      const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
      const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
      let startAngle = angle1;
      let endAngle = angle2;
      if (endAngle < startAngle) endAngle += 2 * Math.PI;
      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      const x1 = p2.x + radius * Math.cos(startAngle);
      const y1 = p2.y + radius * Math.sin(startAngle);
      const x2 = p2.x + radius * Math.cos(endAngle);
      const y2 = p2.y + radius * Math.sin(endAngle);
      const path = createSVG('path', {
        d: `M${x1} ${y1} A${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        fill: 'none',
        stroke: options.stroke || CONFIG.colors.accent,
        'stroke-width': options.strokeWidth || 2
      });
      this.svg.appendChild(path);
      // Angle label
      const midAngle = (startAngle + endAngle) / 2;
      const lx = p2.x + (radius + 10) * Math.cos(midAngle);
      const ly = p2.y + (radius + 10) * Math.sin(midAngle);
      this.drawText(lx, ly, options.label || 'θ', { textAnchor: 'middle', fill: options.stroke || CONFIG.colors.accent });
    }

    drawText(x, y, text, options = {}) {
      const t = createSVG('text', {
        x, y,
        'font-family': options.fontFamily || 'sans-serif',
        'font-size': options.fontSize || 14,
        fill: options.fill || CONFIG.colors.dark,
        'text-anchor': options.textAnchor || 'start',
        'dominant-baseline': options.dominantBaseline || 'alphabetic',
        'font-weight': options.bold ? 'bold' : 'normal'
      });
      t.textContent = text;
      this.svg.appendChild(t);
      return t;
    }

    drawPoint(x, y, options = {}) {
      const circle = createSVG('circle', {
        cx: x, cy: y, r: options.r || 4,
        fill: options.fill || CONFIG.colors.primary,
        stroke: options.stroke || 'white',
        'stroke-width': 1
      });
      this.svg.appendChild(circle);
      if (options.label) {
        this.drawText(x + 8, y - 8, options.label, { fontSize: 12, fill: options.fill || CONFIG.colors.dark });
      }
      return circle;
    }

    // Predefined diagrams
    drawRightTriangle(a, b, options = {}) {
      // a, b are legs; right angle at origin
      const scale = options.scale || 1;
      const p1 = { x: 50, y: 300 };
      const p2 = { x: 50 + a * scale, y: 300 };
      const p3 = { x: 50, y: 300 - b * scale };
      this.drawTriangle(p1, p2, p3, options);
      // Right angle mark
      const markSize = 15;
      this.drawLine(p1.x, p1.y - markSize, p1.x + markSize, p1.y - markSize, { stroke: CONFIG.colors.accent });
      this.drawLine(p1.x + markSize, p1.y - markSize, p1.x + markSize, p1.y, { stroke: CONFIG.colors.accent });
      // Labels
      this.drawText(p1.x + a * scale / 2, p1.y + 20, `a = ${a}`, { textAnchor: 'middle' });
      this.drawText(p1.x - 20, p1.y - b * scale / 2, `b = ${b}`, { textAnchor: 'end', dominantBaseline: 'middle' });
      const hyp = Math.sqrt(a*a + b*b);
      this.drawText(p1.x + a * scale / 2 + 10, p1.y - b * scale / 2 - 10, `c = ${hyp.toFixed(1)}`, { textAnchor: 'middle' });
    }

    drawUnitCircle(options = {}) {
      const cx = this.width / 2, cy = this.height / 2;
      const r = Math.min(this.width, this.height) / 2 - 20;
      this.drawCircle(cx, cy, r, { stroke: CONFIG.colors.primary, strokeWidth: 2 });
      this.drawLine(cx - r, cy, cx + r, cy, { stroke: CONFIG.colors.gray, strokeWidth: 1, dashed: true });
      this.drawLine(cx, cy - r, cx, cy + r, { stroke: CONFIG.colors.gray, strokeWidth: 1, dashed: true });
      // Angle markers
      const angles = options.angles || [30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
      angles.forEach(deg => {
        const rad = deg * Math.PI / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy - r * Math.sin(rad);
        this.drawLine(cx, cy, x, y, { stroke: CONFIG.colors.gray, strokeWidth: 0.5, dashed: true });
        this.drawPoint(x, y, { r: 3, fill: CONFIG.colors.secondary });
        // Label
        const lx = cx + (r + 15) * Math.cos(rad);
        const ly = cy - (r + 15) * Math.sin(rad);
        this.drawText(lx, ly, `${deg}°`, { fontSize: 10, textAnchor: 'middle', fill: CONFIG.colors.gray });
      });
      // Quadrant labels
      this.drawText(cx + r/2, cy - r/2, 'I', { fontSize: 14, fill: CONFIG.colors.gray, textAnchor: 'middle' });
      this.drawText(cx - r/2, cy - r/2, 'II', { fontSize: 14, fill: CONFIG.colors.gray, textAnchor: 'middle' });
      this.drawText(cx - r/2, cy + r/2, 'III', { fontSize: 14, fill: CONFIG.colors.gray, textAnchor: 'middle' });
      this.drawText(cx + r/2, cy + r/2, 'IV', { fontSize: 14, fill: CONFIG.colors.gray, textAnchor: 'middle' });
    }

    drawCoordinatePlane(options = {}) {
      this.drawAxes();
      this.drawGrid(1, CONFIG.colors.grid);
    }

    exportSVG() {
      return this.svg.outerHTML;
    }

    exportPNG() {
      const svgData = this.exportSVG();
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      return new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      });
    }
  }

  // ================================================================
  // SCIENTIFIC CALCULATOR
  // ================================================================
  class ScientificCalculator {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.history = [];
      this.memory = 0;
      this.angleMode = 'deg'; // 'deg' or 'rad'
      this.init();
    }

    init() {
      this.container.innerHTML = `
        <div class="calc-container" style="font-family: 'JetBrains Mono', monospace;">
          <div class="calc-display">
            <div class="calc-history" style="font-size: 0.75rem; color: var(--text-muted); min-height: 1.2em;"></div>
            <input type="text" class="calc-input" readonly style="width: 100%; font-size: 1.5rem; padding: 10px; text-align: right; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-card); color: var(--text-primary);" value="0">
          </div>
          <div class="calc-modes" style="display: flex; gap: 8px; margin: 8px 0; font-size: 0.75rem;">
            <button class="calc-mode-btn" data-mode="deg" style="flex:1; padding:4px; border:1px solid var(--border-color); background:var(--bg-card); border-radius:4px; cursor:pointer;">DEG</button>
            <button class="calc-mode-btn" data-mode="rad" style="flex:1; padding:4px; border:1px solid var(--border-color); background:var(--bg-card); border-radius:4px; cursor:pointer;">RAD</button>
          </div>
          <div class="calc-buttons" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px;">
            ${this.getButtonLayout().map(row => row.map(btn => this.createButton(btn)).join('')).join('')}
          </div>
          <div class="calc-memory" style="margin-top: 8px; font-size: 0.75rem; color: var(--text-muted);"></div>
        </div>
      `;
      this.bindEvents();
      this.updateDisplay();
    }

    getButtonLayout() {
      return [
        ['C', '⌫', 'M+', 'M-', 'MR'],
        ['sin', 'cos', 'tan', 'π', 'e'],
        ['asin', 'acos', 'atan', 'x²', 'xʸ'],
        ['√', 'log', 'ln', '10ˣ', 'eˣ'],
        ['7', '8', '9', '/', '!'],
        ['4', '5', '6', '*', '('],
        ['1', '2', '3', '-', ')'],
        ['0', '.', '±', '+', '=']
      ];
    }

    createButton(btn) {
      const isOp = ['+', '-', '*', '/', '='].includes(btn);
      const isFunc = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', '√', 'log', 'ln', 'x²', 'xʸ', '10ˣ', 'eˣ', '!', 'π', 'e'].includes(btn);
      const style = `padding: 12px; border: 1px solid var(--border-color); border-radius: 6px; background: ${isOp ? 'var(--accent-gold)' : isFunc ? 'var(--accent-brown)' : 'var(--bg-card)'}; color: ${isOp || isFunc ? 'white' : 'var(--text-primary)'}; cursor: pointer; font-size: 0.9rem; transition: all 0.1s;`;
      return `<button class="calc-btn" data-key="${btn}" style="${style}">${btn}</button>`;
    }

    bindEvents() {
      this.container.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', () => this.handleInput(btn.dataset.key));
      });
      this.container.querySelectorAll('.calc-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => this.setAngleMode(btn.dataset.mode));
      });
      this.container.querySelector('.calc-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleInput('=');
        else if (e.key === 'Escape') this.handleInput('C');
        else if (e.key === 'Backspace') this.handleInput('⌫');
        else if (/[0-9+\-*/().]/.test(e.key)) this.handleInput(e.key);
      });
    }

    setAngleMode(mode) {
      this.angleMode = mode;
      this.container.querySelectorAll('.calc-mode-btn').forEach(btn => {
        btn.style.background = btn.dataset.mode === mode ? 'var(--accent-brown)' : 'var(--bg-card)';
        btn.style.color = btn.dataset.mode === mode ? 'white' : 'var(--text-primary)';
      });
    }

    handleInput(key) {
      const input = this.container.querySelector('.calc-input');
      let val = input.value;

      if (key === 'C') { val = '0'; this.history = []; }
      else if (key === '⌫') { val = val.length > 1 ? val.slice(0, -1) : '0'; }
      else if (key === '=') { this.evaluate(); return; }
      else if (key === '±') { val = (parseFloat(val) * -1).toString(); }
      else if (key === 'π') { val = val === '0' ? Math.PI.toString() : val + '*' + Math.PI; }
      else if (key === 'e') { val = val === '0' ? Math.E.toString() : val + '*' + Math.E; }
      else if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', '√', 'log', 'ln', 'x²', 'xʸ', '10ˣ', 'eˣ', '!'].includes(key)) {
        this.applyFunction(key, val); return;
      }
      else if (key === 'M+') { this.memory += parseFloat(val) || 0; this.updateMemory(); return; }
      else if (key === 'M-') { this.memory -= parseFloat(val) || 0; this.updateMemory(); return; }
      else if (key === 'MR') { val = this.memory.toString(); }
      else { val = val === '0' ? key : val + key; }

      input.value = val;
    }

    applyFunction(fn, val) {
      const input = this.container.querySelector('.calc-input');
      let n = parseFloat(val);
      if (isNaN(n)) return;
      let result;
      const isDeg = this.angleMode === 'deg';
      const toRad = isDeg ? Math.PI / 180 : 1;
      const toDeg = isDeg ? 180 / Math.PI : 1;

      switch (fn) {
        case 'sin': result = Math.sin(n * toRad); break;
        case 'cos': result = Math.cos(n * toRad); break;
        case 'tan': result = Math.tan(n * toRad); break;
        case 'asin': result = Math.asin(clamp(n, -1, 1)) * toDeg; break;
        case 'acos': result = Math.acos(clamp(n, -1, 1)) * toDeg; break;
        case 'atan': result = Math.atan(n) * toDeg; break;
        case '√': result = n >= 0 ? Math.sqrt(n) : NaN; break;
        case 'log': result = n > 0 ? Math.log10(n) : NaN; break;
        case 'ln': result = n > 0 ? Math.log(n) : NaN; break;
        case 'x²': result = n * n; break;
        case 'xʸ': input.value = val + '^'; return;
        case '10ˣ': result = Math.pow(10, n); break;
        case 'eˣ': result = Math.exp(n); break;
        case '!': result = n >= 0 && n === Math.floor(n) ? this.factorial(n) : NaN; break;
      }
      this.addToHistory(`${fn}(${val}) = ${result}`);
      input.value = isNaN(result) ? 'Error' : formatNumber(result);
    }

    factorial(n) {
      if (n > 170) return Infinity;
      let r = 1;
      for (let i = 2; i <= n; i++) r *= i;
      return r;
    }

    evaluate() {
      const input = this.container.querySelector('.calc-input');
      let expr = input.value.replace(/\^/g, '**');
      try {
        // Safe evaluation - only allow math expressions
        const allowed = /^[0-9+\-*/().\s\*]+$/;
        if (!allowed.test(expr.replace(/\*\*/g, ''))) throw new Error('Invalid expression');
        const result = Function('"use strict"; return (' + expr + ')')();
        this.addToHistory(`${input.value} = ${result}`);
        input.value = isNaN(result) || !isFinite(result) ? 'Error' : formatNumber(result);
      } catch (e) {
        input.value = 'Error';
      }
    }

    addToHistory(text) {
      this.history.unshift(text);
      if (this.history.length > 10) this.history.pop();
      this.updateDisplay();
    }

    updateDisplay() {
      const histEl = this.container.querySelector('.calc-history');
      if (histEl) histEl.textContent = this.history.join(' | ');
    }

    updateMemory() {
      const memEl = this.container.querySelector('.calc-memory');
      if (memEl) memEl.textContent = `Memory: ${this.memory}`;
    }
  }

  // ================================================================
  // UNIT CONVERSION TOOL
  // ================================================================
  class UnitConverter {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.categories = {
        length: {
          name: 'Length',
          units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.34 }
        },
        mass: {
          name: 'Mass',
          units: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000 }
        },
        temperature: {
          name: 'Temperature',
          units: { c: 1, f: 1, k: 1 },
          convert: (val, from, to) => {
            let c;
            if (from === 'c') c = val;
            else if (from === 'f') c = (val - 32) * 5/9;
            else if (from === 'k') c = val - 273.15;
            if (to === 'c') return c;
            if (to === 'f') return c * 9/5 + 32;
            if (to === 'k') return c + 273.15;
          }
        },
        area: {
          name: 'Area',
          units: { m2: 1, km2: 1e6, cm2: 1e-4, mm2: 1e-6, ha: 10000, acre: 4046.86, ft2: 0.092903 }
        },
        volume: {
          name: 'Volume',
          units: { m3: 1, l: 0.001, ml: 1e-6, gal: 0.00378541, qt: 0.000946353, pt: 0.000473176, ft3: 0.0283168 }
        },
        speed: {
          name: 'Speed',
          units: { ms: 1, kmh: 1/3.6, mph: 0.44704, knot: 0.514444 }
        },
        energy: {
          name: 'Energy',
          units: { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, Wh: 3600, kWh: 3.6e6, eV: 1.602e-19 }
        },
        pressure: {
          name: 'Pressure',
          units: { Pa: 1, kPa: 1000, bar: 1e5, atm: 101325, psi: 6894.76, mmHg: 133.322 }
        }
      };
      this.currentCategory = 'length';
      this.init();
    }

    init() {
      this.render();
      this.bindEvents();
    }

    render() {
      const cats = Object.keys(this.categories);
      this.container.innerHTML = `
        <div class="converter-container" style="font-family: 'JetBrains Mono', monospace;">
          <div class="converter-tabs" style="display: flex; gap: 4px; margin-bottom: 12px; flex-wrap: wrap;">
            ${cats.map(c => `<button class="conv-tab" data-cat="${c}" style="padding: 8px 12px; border: 1px solid var(--border-color); background: ${c === this.currentCategory ? 'var(--accent-brown)' : 'var(--bg-card)'}; color: ${c === this.currentCategory ? 'white' : 'var(--text-primary)'}; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">${this.categories[c].name}</button>`).join('')}
          </div>
          <div class="converter-body">
            <div class="conv-input-group" style="margin-bottom: 16px;">
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">From</label>
              <div style="display: flex; gap: 8px;">
                <input type="number" class="conv-from-val" step="any" style="flex: 1; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-card); color: var(--text-primary); font-size: 1.1rem;" value="1">
                <select class="conv-from-unit" style="padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-card); color: var(--text-primary); min-width: 120px;">
                  ${Object.keys(this.categories[this.currentCategory].units).map(u => `<option value="${u}">${u}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="conv-swap" style="text-align: center; margin: 8px 0;">
              <button class="conv-swap-btn" style="padding: 8px 16px; border: 1px solid var(--border-color); background: var(--bg-card); border-radius: 50%; cursor: pointer;">⇅</button>
            </div>
            <div class="conv-input-group">
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">To</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" class="conv-to-val" readonly style="flex: 1; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); font-size: 1.1rem; font-weight: bold;">
                <select class="conv-to-unit" style="padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-card); color: var(--text-primary); min-width: 120px;">
                  ${Object.keys(this.categories[this.currentCategory].units).map(u => `<option value="${u}">${u}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="conv-formula" style="margin-top: 12px; padding: 10px; background: var(--bg-secondary); border-radius: 4px; font-size: 0.85rem; color: var(--text-secondary);"></div>
          </div>
        </div>
      `;
    }

    bindEvents() {
      this.container.querySelectorAll('.conv-tab').forEach(btn => {
        btn.addEventListener('click', () => this.switchCategory(btn.dataset.cat));
      });
      this.container.querySelector('.conv-from-val').addEventListener('input', () => this.convert());
      this.container.querySelector('.conv-from-unit').addEventListener('change', () => this.convert());
      this.container.querySelector('.conv-to-unit').addEventListener('change', () => this.convert());
      this.container.querySelector('.conv-swap-btn').addEventListener('click', () => this.swap());
    }

    switchCategory(cat) {
      this.currentCategory = cat;
      this.render();
      this.bindEvents();
    }

    swap() {
      const fromVal = this.container.querySelector('.conv-from-val');
      const toVal = this.container.querySelector('.conv-to-val');
      const fromUnit = this.container.querySelector('.conv-from-unit');
      const toUnit = this.container.querySelector('.conv-to-unit');
      const tempVal = fromVal.value;
      const tempUnit = fromUnit.value;
      fromVal.value = toVal.value === '' ? '1' : toVal.value;
      fromUnit.value = toUnit.value;
      toUnit.value = tempUnit;
      this.convert();
    }

    convert() {
      const cat = this.categories[this.currentCategory];
      const fromVal = parseFloat(this.container.querySelector('.conv-from-val').value) || 0;
      const fromUnit = this.container.querySelector('.conv-from-unit').value;
      const toUnit = this.container.querySelector('.conv-to-unit').value;
      let result;

      if (cat.convert) {
        result = cat.convert(fromVal, fromUnit, toUnit);
      } else {
        const base = fromVal * cat.units[fromUnit];
        result = base / cat.units[toUnit];
      }

      this.container.querySelector('.conv-to-val').value = formatNumber(result);
      this.showFormula(fromVal, fromUnit, result, toUnit);
    }

    showFormula(fromVal, fromUnit, toVal, toUnit) {
      const formulaEl = this.container.querySelector('.conv-formula');
      const cat = this.categories[this.currentCategory];
      if (cat.convert) {
        formulaEl.textContent = `${fromVal} ${fromUnit} = ${formatNumber(toVal)} ${toUnit}`;
      } else {
        const factor = cat.units[fromUnit] / cat.units[toUnit];
        formulaEl.textContent = `${fromVal} ${fromUnit} × ${formatNumber(factor)} = ${formatNumber(toVal)} ${toUnit}`;
      }
    }
  }

  // ================================================================
  // PRACTICE PROBLEMS WITH STEP-BY-STEP SOLUTIONS
  // ================================================================
  class PracticeProblems {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.topic = options.topic || 'arithmetic';
      this.difficulty = options.difficulty || 'easy';
      this.problem = null;
      this.showSolution = false;
      this.init();
    }

    init() {
      this.generateProblem();
      this.render();
      this.bindEvents();
    }

    generateProblem() {
      const generators = {
        arithmetic: () => this.genArithmetic(),
        algebra: () => this.genAlgebra(),
        trigonometry: () => this.genTrigonometry(),
        calculus: () => this.genCalculus(),
        probability: () => this.genProbability(),
        statistics: () => this.genStatistics(),
        linearAlgebra: () => this.genLinearAlgebra(),
        physics: () => this.genPhysics()
      };
      const gen = generators[this.topic] || generators.arithmetic;
      this.problem = gen();
    }

    genArithmetic() {
      const ops = ['+', '-', '*', '/'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a, b, answer, steps;
      switch (op) {
        case '+':
          a = Math.floor(Math.random() * 100) + 1;
          b = Math.floor(Math.random() * 100) + 1;
          answer = a + b;
          steps = [`Add ${a} and ${b}`, `${a} + ${b} = ${answer}`];
          break;
        case '-':
          a = Math.floor(Math.random() * 100) + 1;
          b = Math.floor(Math.random() * a);
          answer = a - b;
          steps = [`Subtract ${b} from ${a}`, `${a} - ${b} = ${answer}`];
          break;
        case '*':
          a = Math.floor(Math.random() * 12) + 1;
          b = Math.floor(Math.random() * 12) + 1;
          answer = a * b;
          steps = [`Multiply ${a} by ${b}`, `${a} × ${b} = ${answer}`];
          break;
        case '/':
          answer = Math.floor(Math.random() * 12) + 1;
          b = Math.floor(Math.random() * 12) + 1;
          a = answer * b;
          steps = [`Divide ${a} by ${b}`, `${a} ÷ ${b} = ${answer}`];
          break;
      }
      return { question: `${a} ${op} ${b} = ?`, answer: answer.toString(), steps, type: 'arithmetic' };
    }

    genAlgebra() {
      const type = Math.random() < 0.5 ? 'linear' : 'quadratic';
      if (type === 'linear') {
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 20) - 10;
        const c = Math.floor(Math.random() * 20) - 10;
        const x = (c - b) / a;
        return {
          question: `Solve for x: ${a}x + ${b} = ${c}`,
          answer: `x = ${formatNumber(x)}`,
          steps: [
            `Subtract ${b} from both sides: ${a}x = ${c - b}`,
            `Divide by ${a}: x = ${formatNumber(x)}`
          ],
          type: 'algebra'
        };
      } else {
        const a = 1;
        const b = Math.floor(Math.random() * 10) - 5;
        const c = Math.floor(Math.random() * 10) - 5;
        const disc = b*b - 4*a*c;
        if (disc < 0) return this.genAlgebra();
        const x1 = (-b + Math.sqrt(disc)) / (2*a);
        const x2 = (-b - Math.sqrt(disc)) / (2*a);
        return {
          question: `Solve: x² + ${b}x + ${c} = 0`,
          answer: `x = ${formatNumber(x1)} or x = ${formatNumber(x2)}`,
          steps: [
            `Quadratic formula: x = (-b ± √(b²-4ac)) / 2a`,
            `a=1, b=${b}, c=${c}`,
            `Discriminant: ${b}² - 4(1)(${c}) = ${disc}`,
            `x = ${formatNumber(x1)} or x = ${formatNumber(x2)}`
          ],
          type: 'algebra'
        };
      }
    }

    genTrigonometry() {
      const angles = [30, 45, 60, 90, 120, 135, 150, 180];
      const angle = angles[Math.floor(Math.random() * angles.length)];
      const func = ['sin', 'cos', 'tan'][Math.floor(Math.random() * 3)];
      let answer, exact;
      const rad = angle * Math.PI / 180;
      switch (func) {
        case 'sin': answer = Math.sin(rad); exact = this.exactTrig(angle, 'sin'); break;
        case 'cos': answer = Math.cos(rad); exact = this.exactTrig(angle, 'cos'); break;
        case 'tan': answer = Math.tan(rad); exact = this.exactTrig(angle, 'tan'); break;
      }
      return {
        question: `${func}(${angle}°) = ?`,
        answer: exact || formatNumber(answer),
        steps: [
          `Angle: ${angle}° = ${formatNumber(rad)} radians`,
          `${func}(${angle}°) = ${exact || formatNumber(answer)}`,
          exact ? `Exact value: ${exact}` : `Approximate: ${formatNumber(answer)}`
        ],
        type: 'trigonometry'
      };
    }

    exactTrig(angle, func) {
      const exact = {
        30: { sin: '1/2', cos: '√3/2', tan: '√3/3' },
        45: { sin: '√2/2', cos: '√2/2', tan: '1' },
        60: { sin: '√3/2', cos: '1/2', tan: '√3' },
        90: { sin: '1', cos: '0', tan: 'undefined' },
        120: { sin: '√3/2', cos: '-1/2', tan: '-√3' },
        135: { sin: '√2/2', cos: '-√2/2', tan: '-1' },
        150: { sin: '1/2', cos: '-√3/2', tan: '-√3/3' },
        180: { sin: '0', cos: '-1', tan: '0' }
      };
      return exact[angle]?.[func] || null;
    }

    genCalculus() {
      const type = Math.random() < 0.5 ? 'derivative' : 'integral';
      if (type === 'derivative') {
        const funcs = [
          { fn: 'x²', deriv: '2x' },
          { fn: 'x³', deriv: '3x²' },
          { fn: 'sin(x)', deriv: 'cos(x)' },
          { fn: 'cos(x)', deriv: '-sin(x)' },
          { fn: 'eˣ', deriv: 'eˣ' },
          { fn: 'ln(x)', deriv: '1/x' }
        ];
        const f = funcs[Math.floor(Math.random() * funcs.length)];
        return {
          question: `Find d/dx [${f.fn}]`,
          answer: f.deriv,
          steps: [`Apply derivative rules`, `d/dx [${f.fn}] = ${f.deriv}`],
          type: 'calculus'
        };
      } else {
        const funcs = [
          { fn: 'x²', integr: 'x³/3 + C' },
          { fn: 'x³', integr: 'x⁴/4 + C' },
          { fn: 'sin(x)', integr: '-cos(x) + C' },
          { fn: 'cos(x)', integr: 'sin(x) + C' },
          { fn: 'eˣ', integr: 'eˣ + C' }
        ];
        const f = funcs[Math.floor(Math.random() * funcs.length)];
        return {
          question: `∫ ${f.fn} dx`,
          answer: f.integr,
          steps: [`Apply integration rules`, `∫ ${f.fn} dx = ${f.integr}`],
          type: 'calculus'
        };
      }
    }

    genProbability() {
      const scenarios = [
        { q: 'Coin flip: P(heads)?', a: '1/2', steps: ['2 outcomes (H,T)', '1 favorable', 'P = 1/2'] },
        { q: 'Die roll: P(even)?', a: '1/2', steps: ['6 outcomes', '3 favorable (2,4,6)', 'P = 3/6 = 1/2'] },
        { q: 'Deck of cards: P(ace)?', a: '1/13', steps: ['52 cards', '4 aces', 'P = 4/52 = 1/13'] },
        { q: 'Two dice: P(sum=7)?', a: '1/6', steps: ['36 outcomes', '6 pairs sum to 7', 'P = 6/36 = 1/6'] }
      ];
      const s = scenarios[Math.floor(Math.random() * scenarios.length)];
      return { question: s.q, answer: s.a, steps: s.steps, type: 'probability' };
    }

    genStatistics() {
      const data = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1).sort((a,b) => a-b);
      const mean = data.reduce((a,b) => a+b, 0) / data.length;
      const median = data[2];
      const type = Math.random() < 0.5 ? 'mean' : 'median';
      return {
        question: `Find the ${type} of: [${data.join(', ')}]`,
        answer: type === 'mean' ? formatNumber(mean) : median.toString(),
        steps: type === 'mean'
          ? [`Sum: ${data.join('+')} = ${data.reduce((a,b)=>a+b,0)}`, `Count: 5`, `Mean = ${data.reduce((a,b)=>a+b,0)}/5 = ${formatNumber(mean)}`]
          : [`Sorted: [${data.join(', ')}]`, `Middle value (3rd): ${median}`],
        type: 'statistics'
      };
    }

    genLinearAlgebra() {
      const a = Math.floor(Math.random() * 3) + 1;
      const b = Math.floor(Math.random() * 3) + 1;
      const c = Math.floor(Math.random() * 3) + 1;
      const d = Math.floor(Math.random() * 3) + 1;
      const det = a*d - b*c;
      return {
        question: `Determinant of [[${a}, ${b}], [${c}, ${d}]]`,
        answer: det.toString(),
        steps: [`Formula: ad - bc`, `(${a}×${d}) - (${b}×${c}) = ${a*d} - ${b*c} = ${det}`],
        type: 'linearAlgebra'
      };
    }

    genPhysics() {
      const problems = [
        { q: 'Force = mass × acceleration. m=5kg, a=2m/s². F=?', a: '10 N', steps: ['F = m·a', 'F = 5 × 2 = 10 N'] },
        { q: 'Work = force × distance. F=10N, d=5m. W=?', a: '50 J', steps: ['W = F·d', 'W = 10 × 5 = 50 J'] },
        { q: 'v = u + at. u=0, a=9.8, t=2. v=?', a: '19.6 m/s', steps: ['v = u + at', 'v = 0 + 9.8×2 = 19.6 m/s'] },
        { q: 'KE = ½mv². m=2kg, v=3m/s. KE=?', a: '9 J', steps: ['KE = ½mv²', 'KE = 0.5×2×9 = 9 J'] }
      ];
      const p = problems[Math.floor(Math.random() * problems.length)];
      return { question: p.q, answer: p.a, steps: p.steps, type: 'physics' };
    }

    render() {
      this.container.innerHTML = `
        <div class="practice-container" style="border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; background: var(--bg-card);">
          <div class="practice-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h4 style="margin: 0; color: var(--accent-brown);">${this.topic.charAt(0).toUpperCase() + this.topic.slice(1)} Practice</h4>
            <div style="display: flex; gap: 8px;">
              <select class="practice-topic" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary);">
                <option value="arithmetic"${this.topic==='arithmetic'?' selected':''}>Arithmetic</option>
                <option value="algebra"${this.topic==='algebra'?' selected':''}>Algebra</option>
                <option value="trigonometry"${this.topic==='trigonometry'?' selected':''}>Trigonometry</option>
                <option value="calculus"${this.topic==='calculus'?' selected':''}>Calculus</option>
                <option value="probability"${this.topic==='probability'?' selected':''}>Probability</option>
                <option value="statistics"${this.topic==='statistics'?' selected':''}>Statistics</option>
                <option value="linearAlgebra"${this.topic==='linearAlgebra'?' selected':''}>Linear Algebra</option>
                <option value="physics"${this.topic==='physics'?' selected':''}>Physics</option>
              </select>
              <button class="practice-new" style="padding: 6px 12px; border: 1px solid var(--border-color); background: var(--accent-gold); color: white; border-radius: 4px; cursor: pointer;">New Problem</button>
            </div>
          </div>
          <div class="practice-question" style="font-size: 1.2rem; padding: 16px; background: var(--bg-secondary); border-radius: 6px; margin-bottom: 16px; font-family: 'JetBrains Mono', monospace;">
            ${this.problem.question}
          </div>
          <div class="practice-answer" style="display: flex; gap: 8px; margin-bottom: 16px;">
            <input type="text" class="practice-input" placeholder="Your answer..." style="flex: 1; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-primary); font-size: 1rem;">
            <button class="practice-check" style="padding: 10px 20px; border: none; background: var(--accent-brown); color: white; border-radius: 4px; cursor: pointer;">Check</button>
            <button class="practice-show" style="padding: 10px 20px; border: 1px solid var(--border-color); background: var(--bg-primary); border-radius: 4px; cursor: pointer;">${this.showSolution ? 'Hide' : 'Show'} Solution</button>
          </div>
          <div class="practice-result" style="min-height: 2em; font-weight: bold;"></div>
          <div class="practice-solution" style="${this.showSolution ? '' : 'display:none;'} margin-top: 16px; padding: 16px; background: var(--bg-secondary); border-radius: 6px; border-left: 4px solid var(--accent-brown);">
            <strong>Step-by-step solution:</strong>
            <ol style="margin: 8px 0; padding-left: 20px;">
              ${this.problem.steps.map(s => `<li>${s}</li>`).join('')}
            </ol>
            <p style="margin-top: 8px;"><strong>Answer:</strong> ${this.problem.answer}</p>
          </div>
        </div>
      `;
    }

    bindEvents() {
      this.container.querySelector('.practice-topic').addEventListener('change', (e) => {
        this.topic = e.target.value;
        this.generateProblem();
        this.showSolution = false;
        this.render();
        this.bindEvents();
      });
      this.container.querySelector('.practice-new').addEventListener('click', () => {
        this.generateProblem();
        this.showSolution = false;
        this.render();
        this.bindEvents();
      });
      this.container.querySelector('.practice-check').addEventListener('click', () => this.checkAnswer());
      this.container.querySelector('.practice-show').addEventListener('click', () => {
        this.showSolution = !this.showSolution;
        this.render();
        this.bindEvents();
      });
      this.container.querySelector('.practice-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.checkAnswer();
      });
    }

    checkAnswer() {
      const input = this.container.querySelector('.practice-input').value.trim();
      const resultEl = this.container.querySelector('.practice-result');
      const correct = this.normalizeAnswer(input) === this.normalizeAnswer(this.problem.answer);
      resultEl.innerHTML = correct
        ? `<span style="color: var(--secondary);">${ICONS.check} Correct!</span>`
        : `<span style="color: var(--accent);">${ICONS.x} Incorrect. Answer: ${this.problem.answer}</span>`;
    }

    normalizeAnswer(ans) {
      return ans.toLowerCase().replace(/\s+/g, '').replace(/[×*]/g, '').replace(/[÷\/]/g, '/');
    }
  }

  // ================================================================
  // FORMULA VISUALIZER (Interactive parameter exploration)
  // ================================================================
  class FormulaVisualizer {
    constructor(containerId, formula, options = {}) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.formula = formula; // function(params) => result
      this.params = options.params || {};
      this.paramRanges = options.ranges || {};
      this.plotter = null;
      this.init();
    }

    init() {
      this.render();
      this.bindEvents();
      this.updatePlot();
    }

    render() {
      const paramControls = Object.entries(this.params).map(([key, val]) => {
        const range = this.paramRanges[key] || { min: -10, max: 10, step: 0.1 };
        return `
          <div class="fv-param" style="margin: 8px 0;">
            <label style="display: flex; align-items: center; gap: 8px;">
              <span style="font-family: 'JetBrains Mono', monospace; min-width: 30px;">${key}</span>
              <input type="range" class="fv-slider" data-param="${key}" min="${range.min}" max="${range.max}" step="${range.step}" value="${val}" style="flex: 1;">
              <span class="fv-value" data-param="${key}" style="min-width: 50px; font-family: 'JetBrains Mono', monospace;">${val}</span>
            </label>
          </div>
        `;
      }).join('');

      this.container.innerHTML = `
        <div class="formula-viz">
          <div class="fv-controls" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 16px;">
            <h4 style="margin: 0 0 12px; color: var(--accent-brown);">Formula Explorer</h4>
            ${paramControls}
            <div class="fv-formula-display" style="margin-top: 12px; padding: 10px; background: var(--bg-primary); border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 1.1rem; text-align: center;"></div>
          </div>
          <div class="fv-plot" id="fv-plot-${this.container.id}" style="width: 100%; height: 400px;"></div>
          <div class="fv-results" style="margin-top: 12px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px;"></div>
        </div>
      `;
      this.plotter = new FunctionPlotter(`fv-plot-${this.container.id}`, { width: this.container.clientWidth, height: 400 });
    }

    bindEvents() {
      this.container.querySelectorAll('.fv-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
          const key = e.target.dataset.param;
          const val = parseFloat(e.target.value);
          this.params[key] = val;
          const rangeInfo = this.paramRanges[key] || { step: 0.1 };
          this.container.querySelector(`.fv-value[data-param="${key}"]`).textContent = val.toFixed(rangeInfo.step < 1 ? 2 : 0);
          this.updatePlot();
        });
      });
    }

    updatePlot() {
      if (!this.plotter) return;
      this.plotter.clearFunctions();
      const fn = this.formula(this.params);
      if (typeof fn === 'function') {
        this.plotter.addFunction(fn, { color: CONFIG.colors.primary, label: 'f(x)' });
      }
      this.updateFormulaDisplay();
      this.updateResults();
    }

    updateFormulaDisplay() {
      const display = this.container.querySelector('.fv-formula-display');
      if (display) {
        const paramStr = Object.entries(this.params).map(([k,v]) => `${k}=${v.toFixed(2)}`).join(', ');
        display.textContent = `Parameters: ${paramStr}`;
      }
    }

    updateResults() {
      const resultsEl = this.container.querySelector('.fv-results');
      if (!resultsEl) return;
      // Evaluate at a few points
      const fn = this.formula(this.params);
      if (typeof fn !== 'function') return;
      const points = [-5, -2, -1, 0, 1, 2, 5];
      resultsEl.innerHTML = points.map(x => {
        const y = fn(x);
        return `<div style="padding: 8px; background: var(--bg-secondary); border-radius: 4px; text-align: center; font-family: 'JetBrains Mono', monospace;">
          f(${x}) = ${isFinite(y) ? formatNumber(y) : 'undefined'}
        </div>`;
      }).join('');
    }
  }

  // ================================================================
  // DYNAMIC CHARTS (using Chart.js)
  // ================================================================
  async function renderChart(containerId, chartConfig) {
    await loadChartJS();
    const canvas = document.getElementById(containerId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, deepMerge(CONFIG.chartDefaults, chartConfig));
    chartInstances.set(containerId, chart);
    return chart;
  }

  function createLineChart(containerId, data, options = {}) {
    return renderChart(containerId, { type: 'line', data, options });
  }

  function createBarChart(containerId, data, options = {}) {
    return renderChart(containerId, { type: 'bar', data, options });
  }

  function createPieChart(containerId, data, options = {}) {
    return renderChart(containerId, { type: 'pie', data, options: { ...CONFIG.chartDefaults, scales: {}, ...options } });
  }

  function createScatterChart(containerId, data, options = {}) {
    return renderChart(containerId, { type: 'scatter', data, options });
  }

  function createHistogramChart(containerId, data, options = {}) {
    return renderChart(containerId, { type: 'bar', data, options: {
      ...CONFIG.chartDefaults,
      options: { ...CONFIG.chartDefaults, scales: { x: { ...CONFIG.chartDefaults.scales.x, title: { display: true, text: 'Value' } }, y: { ...CONFIG.chartDefaults.scales.y, title: { display: true, text: 'Frequency' } } }, ...options }
    }});
  }

  // ================================================================
  // ANTONIMUS MODEL DISTINCTION
  // ================================================================
  function createAntonimusBadge() {
    return createElement('span', {
      class: 'antonimus-badge',
      style: 'display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: linear-gradient(135deg, #f39c12, #e67e22); color: white; border-radius: 20px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;'
    }, [
      ICONS.warning,
      'Antonimus Conceptual Model'
    ]);
  }

  function createEstablishedMathBadge() {
    return createElement('span', {
      class: 'established-math-badge',
      style: 'display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; border-radius: 20px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;'
    }, [
      ICONS.math,
      'Established Mathematics'
    ]);
  }

  // ================================================================
  // EXPORT UTILITIES
  // ================================================================
  function exportSVG(element, filename = 'math-viz.svg') {
    const svg = element.querySelector('svg');
    if (!svg) return;
    const svgData = svg.outerHTML;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = createElement('a', { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportPNG(canvas, filename = 'math-viz.png') {
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const url = canvas.toDataURL('image/png');
    const a = createElement('a', { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function createExportButtons(targetElement, baseName = 'math-viz') {
    const container = createElement('div', { style: 'display: flex; gap: 8px; margin-top: 12px;' });
    const svgBtn = createElement('button', {
      style: 'padding: 8px 16px; border: 1px solid var(--border-color); background: var(--bg-card); border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px;',
      onclick: () => {
        const svg = targetElement.querySelector('svg');
        if (svg) exportSVG(targetElement, `${baseName}.svg`);
        else if (targetElement instanceof HTMLCanvasElement) exportPNG(targetElement, `${baseName}.png`);
      }
    }, [ICONS.download, 'Export SVG']);
    const pngBtn = createElement('button', {
      style: 'padding: 8px 16px; border: 1px solid var(--border-color); background: var(--bg-card); border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px;',
      onclick: () => {
        const canvas = targetElement.querySelector('canvas') || targetElement;
        if (canvas instanceof HTMLCanvasElement) exportPNG(canvas, `${baseName}.png`);
      }
    }, [ICONS.download, 'Export PNG']);
    container.append(svgBtn, pngBtn);
    return container;
  }

  // ================================================================
  // GLOBAL HELPER FUNCTIONS FOR MATH VIZ SECTION
  // ================================================================
  let functionPlotterInstance = null;
  let geometryDiagramInstance = null;
  let dynamicChartInstance = null;

  window.addSin = function() {
    if (functionPlotterInstance) functionPlotterInstance.addFunction(Math.sin, { color: '#4a90d9', label: 'sin(x)' });
  };
  window.addCos = function() {
    if (functionPlotterInstance) functionPlotterInstance.addFunction(Math.cos, { color: '#27ae60', label: 'cos(x)' });
  };
  window.addPoly = function() {
    if (functionPlotterInstance) functionPlotterInstance.addFunction(x => x*x, { color: '#e74c3c', label: 'x²' });
  };
  window.addExp = function() {
    if (functionPlotterInstance) functionPlotterInstance.addFunction(Math.exp, { color: '#9b59b6', label: 'eˣ' });
  };
  window.resetPlotter = function() {
    if (functionPlotterInstance) {
      functionPlotterInstance.clearFunctions();
      functionPlotterInstance.resetView();
    }
  };
  window.exportPlotterSVG = function() {
    if (functionPlotterInstance) {
      const svgData = functionPlotterInstance.exportSVG();
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'function-plot.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  window.exportPlotterPNG = function() {
    if (functionPlotterInstance && functionPlotterInstance.canvas) {
      const url = functionPlotterInstance.canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'function-plot.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  window.switchGeometry = function(type) {
    if (!geometryDiagramInstance) return;
    geometryDiagramInstance.clear();
    switch (type) {
      case 'right-triangle':
        geometryDiagramInstance.drawRightTriangle(3, 4);
        break;
      case 'unit-circle':
        geometryDiagramInstance.drawUnitCircle();
        break;
      case 'coordinate-plane':
        geometryDiagramInstance.drawCoordinatePlane();
        break;
      case 'vectors':
        geometryDiagramInstance.drawVector(200, 300, 300, 150, { stroke: CONFIG.colors.secondary, strokeWidth: 3, arrow: true });
        geometryDiagramInstance.drawVector(200, 300, 350, 300, { stroke: CONFIG.colors.primary, strokeWidth: 3, arrow: true });
        geometryDiagramInstance.drawVector(200, 300, 300, 150, { stroke: CONFIG.colors.accent, strokeWidth: 3, arrow: true });
        geometryDiagramInstance.drawText(250, 200, 'Vector Addition', { textAnchor: 'middle', fill: CONFIG.colors.dark });
        break;
      case 'circle-theorems':
        geometryDiagramInstance.drawCircle(200, 200, 100, { stroke: CONFIG.colors.primary, strokeWidth: 2 });
        geometryDiagramInstance.drawLine(100, 200, 300, 200, { stroke: CONFIG.colors.gray, strokeWidth: 1, dashed: true });
        geometryDiagramInstance.drawLine(200, 100, 200, 300, { stroke: CONFIG.colors.gray, strokeWidth: 1, dashed: true });
        geometryDiagramInstance.drawAngle({x:300,y:200}, {x:200,y:200}, {x:200,y:100}, 30, { label: '90°' });
        break;
    }
  };
  window.exportGeometrySVG = function() {
    if (geometryDiagramInstance) {
      const svgData = geometryDiagramInstance.exportSVG();
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'geometry-diagram.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  window.exportGeometryPNG = function() {
    if (geometryDiagramInstance) {
      geometryDiagramInstance.exportPNG().then(url => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'geometry-diagram.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
  };

  window.switchChart = async function(type) {
    if (dynamicChartInstance) {
      dynamicChartInstance.destroy();
      dynamicChartInstance = null;
    }
    await loadChartJS();
    if (!Chart) return;
    
    const canvas = document.getElementById('dynamic-chart');
    if (!canvas) return;
    
    const sampleData = getSampleChartData(type);
    const options = { responsive: true, maintainAspectRatio: false };
    dynamicChartInstance = new Chart(canvas.getContext('2d'), { type, data: sampleData, options });
  };

  window.randomizeChartData = function() {
    if (!dynamicChartInstance) return;
    const type = dynamicChartInstance.config.type;
    const newData = getSampleChartData(type);
    dynamicChartInstance.data = newData;
    dynamicChartInstance.update();
  };

  window.exportChartSVG = function() {
    if (dynamicChartInstance && dynamicChartInstance.canvas) {
      const url = dynamicChartInstance.toBase64Image();
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chart.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  window.exportChartPNG = function() {
    if (dynamicChartInstance && dynamicChartInstance.canvas) {
      const url = dynamicChartInstance.toBase64Image();
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chart.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  function getSampleChartData(type) {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const datasets = [
      { label: 'Dataset A', data: [12, 19, 3, 5, 2, 3], borderColor: '#4a90d9', backgroundColor: 'rgba(74, 144, 217, 0.2)' },
      { label: 'Dataset B', data: [5, 10, 15, 8, 12, 7], borderColor: '#27ae60', backgroundColor: 'rgba(39, 174, 96, 0.2)' }
    ];
    
    if (type === 'pie' || type === 'doughnut') {
      return { labels: ['A', 'B', 'C', 'D'], datasets: [{ data: [30, 25, 20, 25], backgroundColor: ['#4a90d9', '#27ae60', '#e74c3c', '#f39c12'] }] };
    }
    if (type === 'scatter') {
      return { datasets: [
        { label: 'Series 1', data: [{x:1,y:2},{x:2,y:4},{x:3,y:1},{x:4,y:5},{x:5,y:3}], borderColor: '#4a90d9' },
        { label: 'Series 2', data: [{x:1,y:3},{x:2,y:2},{x:3,y:5},{x:4,y:2},{x:5,y:4}], borderColor: '#27ae60' }
      ] };
    }
    if (type === 'histogram') {
      return { labels: ['0-10', '10-20', '20-30', '30-40', '40-50'], datasets: [{ label: 'Frequency', data: [5, 12, 18, 7, 3], backgroundColor: 'rgba(74, 144, 217, 0.6)' }] };
    }
    return { labels, datasets };
  }

  function initDynamicChart() {
    const canvas = document.getElementById('dynamic-chart');
    if (!canvas) return;
    
    loadChartJS().then(() => {
      if (!Chart) return;
      const sampleData = getSampleChartData('line');
      const options = { responsive: true, maintainAspectRatio: false };
      dynamicChartInstance = new Chart(canvas.getContext('2d'), { type: 'line', data: sampleData, options });
    }).catch(e => console.warn('Chart.js failed to load:', e));
  }

  // ================================================================
  // AUTO-INITIALIZATION
  // ================================================================
  function autoInit() {
    // Initialize function plotter in math viz section
    const fpContainer = document.getElementById('function-plotter');
    if (fpContainer) {
      functionPlotterInstance = new FunctionPlotter('function-plotter', {
        xMin: -10, xMax: 10, yMin: -10, yMax: 10,
        gridStep: 1
      });
      // Add default functions
      functionPlotterInstance.addFunction(Math.sin, { color: '#4a90d9', label: 'sin(x)' });
      functionPlotterInstance.addFunction(Math.cos, { color: '#27ae60', label: 'cos(x)' });
      functionPlotterInstance.addFunction(x => x*x, { color: '#e74c3c', label: 'x²', dashed: true });
      functionPlotterInstance.addFunction(Math.exp, { color: '#9b59b6', label: 'eˣ' });
    }

    // Initialize geometry diagram
    const geoContainer = document.getElementById('geometry-diagram');
    if (geoContainer) {
      geometryDiagramInstance = new GeometryDiagram('geometry-diagram', { width: 500, height: 500, viewBox: '0 0 500 500' });
      geometryDiagramInstance.drawRightTriangle(3, 4);
    }

    // Initialize dynamic chart
    initDynamicChart();

    // Function plotters
    document.querySelectorAll('[data-math-viz="function-plot"]').forEach(el => {
      const options = {};
      try { Object.assign(options, JSON.parse(el.dataset.plotOptions || '{}')); } catch {}
      new FunctionPlotter(el.id, options);
    });

    // Geometry diagrams
    document.querySelectorAll('[data-math-viz="geometry"]').forEach(el => {
      const type = el.dataset.geometryType;
      const diagram = new GeometryDiagram(el.id);
      if (type === 'unit-circle') diagram.drawUnitCircle();
      else if (type === 'right-triangle') {
        const a = parseFloat(el.dataset.a) || 3;
        const b = parseFloat(el.dataset.b) || 4;
        diagram.drawRightTriangle(a, b);
      } else if (type === 'coordinate-plane') {
        diagram.drawCoordinatePlane();
      }
    });

    // Scientific calculators
    document.querySelectorAll('[data-math-viz="calculator"]').forEach(el => {
      new ScientificCalculator(el.id);
    });

    // Unit converters
    document.querySelectorAll('[data-math-viz="unit-converter"]').forEach(el => {
      new UnitConverter(el.id);
    });

    // Practice problems
    document.querySelectorAll('[data-math-viz="practice"]').forEach(el => {
      const topic = el.dataset.topic || 'arithmetic';
      new PracticeProblems(el.id, { topic });
    });

    // Formula visualizers
    document.querySelectorAll('[data-math-viz="formula-viz"]').forEach(el => {
      const formulaName = el.dataset.formula;
      const formulas = {
        'reality-formation': (p) => (x) => p.I * p.K * p.A,
        'expanded': (p) => (x) => ((p.I * p.K * p.A) * p.O) / p.U,
        'prediction': (p) => (x) => p.I + p.E + p.K,
        'small-cause': (p) => (x) => p.s * p.C,
        'quadratic': (p) => (x) => p.a * x * x + p.b * x + p.c,
        'sine': (p) => (x) => p.A * Math.sin(p.B * x + p.C) + p.D,
        'exponential': (p) => (x) => p.A * Math.exp(p.k * x) + p.C,
        'projectile': (p) => (x) => p.v0 * x * Math.sin(p.theta) - 0.5 * 9.8 * x * x
      };
      const formula = formulas[formulaName];
      if (formula) {
        try {
          const params = JSON.parse(el.dataset.params || '{}');
          const ranges = JSON.parse(el.dataset.ranges || '{}');
          new FormulaVisualizer(el.id, formula, { params, ranges });
        } catch (e) {
          console.warn('FormulaViz init error:', e);
        }
      }
    });

    // Dynamic charts
    document.querySelectorAll('[data-math-viz="chart"]').forEach(async el => {
      const type = el.dataset.chartType;
      const chartData = JSON.parse(el.dataset.chartData || '{}');
      if (type === 'line') createLineChart(el.id, chartData);
      else if (type === 'bar') createBarChart(el.id, chartData);
      else if (type === 'pie') createPieChart(el.id, chartData);
      else if (type === 'scatter') createScatterChart(el.id, chartData);
      else if (type === 'histogram') createHistogramChart(el.id, chartData);
    });
  }

  // Run auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  // ================================================================
  // PUBLIC API
  // ================================================================
  return {
    // Classes
    FunctionPlotter,
    GeometryDiagram,
    ScientificCalculator,
    UnitConverter,
    PracticeProblems,
    FormulaVisualizer,
    // Chart functions
    createLineChart,
    createBarChart,
    createPieChart,
    createScatterChart,
    createHistogramChart,
    // Badges
    createAntonimusBadge,
    createEstablishedMathBadge,
    // Export
    exportSVG,
    exportPNG,
    createExportButtons,
    // Config
    CONFIG,
    // Icons
    ICONS
  };
})();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MathViz;
}