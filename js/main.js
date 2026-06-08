/* ============================================
   ETHAN'S ENTERTAINMENT REVIEWS — main.js
   ============================================ */

/* ── RESOLVE ASSET BASE PATH based on folder depth ── */
const _pathDepth = (window.location.pathname.match(/\//g) || []).length;
const _base = _pathDepth <= 1 ? '' : '../../';

/* ================================================================
   CUSTOM CURSOR
   — Covers iframes by overlaying a transparent pointer-events:none
     shield, so the cursor ring stays visible over Spotify etc.
================================================================ */
(function initCursor() {
  const wrap = document.createElement('div');
  wrap.id = 'custom-cursor';
  wrap.innerHTML = '<div id="cursor-ring"></div><div id="cursor-dot"></div>';
  document.body.appendChild(wrap);

  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');

  let rx = -100, ry = -100;
  let mx = -100, my = -100;

  // Track mouse globally — works even while hovering iframes via the
  // shield div below, which re-emits events on the parent document.
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-press'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-press'));

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, [role="button"], .card-link, .article-item-link, .hero-cta, .album-link, .read-more, .album-link-review')) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, [role="button"], .card-link, .article-item-link, .hero-cta, .album-link, .read-more, .album-link-review')) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Place a transparent shield over every iframe so mousemove keeps firing
  // when the cursor crosses into iframe territory (e.g. Spotify embed).
  function shieldIframes() {
    document.querySelectorAll('iframe').forEach(iframe => {
      if (iframe.dataset.shielded) return;
      iframe.dataset.shielded = '1';
      const shield = document.createElement('div');
      shield.style.cssText = `
        position:absolute; inset:0; z-index:1;
        pointer-events:all; background:transparent;
      `;
      // The iframe's offsetParent must be position:relative
      const wrapper = iframe.parentElement;
      const wStyle = window.getComputedStyle(wrapper);
      if (wStyle.position === 'static') wrapper.style.position = 'relative';
      wrapper.appendChild(shield);

      // Forward mouse events from the shield to the document cursor tracker
      shield.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        document.body.classList.remove('cursor-hover');
      });
      shield.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }
  shieldIframes();
  // Re-run if content is added dynamically
  new MutationObserver(shieldIframes).observe(document.body, { childList: true, subtree: true });

  (function tickCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    requestAnimationFrame(tickCursor);
  })();
})();

/* ================================================================
   NAV BURGER
================================================================ */
const burger   = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
}

/* ── ACTIVE NAV LINK ── */
const _path = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(link => {
  const hrefFile = link.getAttribute('href').replace(/^(\.\.\/)*/, '');
  if (_path.endsWith(hrefFile) || (_path.endsWith('/') && hrefFile === 'index.html')) {
    link.classList.add('active');
  }
});

/* ================================================================
   HERO — FORCE-FIELD DISCS (homepage only)
================================================================ */
(function initHero() {
  const stage  = document.querySelector('.hero-stage');
  if (!stage) return;
  const heroEl = document.querySelector('.hero');
  const imgBase = _base + 'assets/images/';

  const W = () => heroEl.offsetWidth;
  const H = () => heroEl.offsetHeight;

  const discDefs = [
    { type:'cd',    w:115, x:0.06,  y:0.13,  rot:-15, rotSpeed:0.50, opacity:0.88 },
    { type:'vinyl', w:155, x:0.83,  y:0.07,  rot:12,  rotSpeed:0.28, opacity:0.82 },
    { type:'spool', w:125, x:0.48,  y:0.06,  rot:5,   rotSpeed:0.22, opacity:0.80 },
    { type:'cd',    w: 95, x:0.93,  y:0.56,  rot:40,  rotSpeed:0.65, opacity:0.55 },
    { type:'vinyl', w:135, x:0.03,  y:0.60,  rot:-30, rotSpeed:0.38, opacity:0.65 },
    { type:'spool', w:105, x:0.71,  y:0.74,  rot:-8,  rotSpeed:0.30, opacity:0.60 },
    { type:'cd',    w: 80, x:0.58,  y:0.80,  rot:20,  rotSpeed:0.75, opacity:0.40 },
    { type:'vinyl', w:105, x:0.18,  y:-0.03, rot:5,   rotSpeed:0.48, opacity:0.48 },
    { type:'spool', w: 85, x:0.36,  y:0.87,  rot:15,  rotSpeed:0.55, opacity:0.38 },
    { type:'cd',    w:140, x:0.24,  y:0.30,  rot:-22, rotSpeed:0.32, opacity:0.50 },
    { type:'vinyl', w: 95, x:0.76,  y:0.40,  rot:33,  rotSpeed:0.42, opacity:0.55 },
    { type:'spool', w: 70, x:0.89,  y:0.22,  rot:-5,  rotSpeed:0.60, opacity:0.42 },
    { type:'cd',    w: 90, x:0.13,  y:0.45,  rot:28,  rotSpeed:0.44, opacity:0.38 },
    { type:'vinyl', w:120, x:0.52,  y:0.20,  rot:-18, rotSpeed:0.35, opacity:0.45 },
    { type:'spool', w: 80, x:0.40,  y:0.55,  rot:10,  rotSpeed:0.58, opacity:0.32 },
    { type:'cd',    w:100, x:0.65,  y:0.10,  rot:-8,  rotSpeed:0.40, opacity:0.50 },
  ];

  const elements = discDefs.map(d => {
    const src = d.type === 'cd' ? 'cd.png' : d.type === 'vinyl' ? 'vinyl.png' : 'spool.png';
    const wrap = document.createElement('div');
    wrap.className = 'disc';
    const img = document.createElement('img');
    img.src = imgBase + src;
    img.alt = '';
    img.draggable = false;
    img.style.cssText = `width:${d.w}px; opacity:${d.opacity};`;
    wrap.appendChild(img);
    stage.appendChild(wrap);
    return { el: wrap, ...d, currentRot: d.rot, cx: 0, cy: 0 };
  });

  const REPEL_RADIUS = 280;
  const REPEL_FORCE  = 200;

  let tMouseX = -9999, tMouseY = -9999;
  let sMouseX = -9999, sMouseY = -9999;

  heroEl.addEventListener('mousemove', e => {
    const r = heroEl.getBoundingClientRect();
    tMouseX = e.clientX - r.left;
    tMouseY = e.clientY - r.top;
  });
  heroEl.addEventListener('mouseleave', () => { tMouseX = -9999; tMouseY = -9999; });

  let lastT = 0;
  function animate(ts) {
    const dt = Math.min(ts - lastT, 50); lastT = ts;
    sMouseX += (tMouseX - sMouseX) * 0.1;
    sMouseY += (tMouseY - sMouseY) * 0.1;

    elements.forEach(d => {
      const baseCX = W() * d.x;
      const baseCY = H() * d.y;
      const dx = baseCX - sMouseX;
      const dy = baseCY - sMouseY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      let pushX = 0, pushY = 0;
      if (dist < REPEL_RADIUS && dist > 0) {
        const strength = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
        pushX = (dx / dist) * strength;
        pushY = (dy / dist) * strength;
      }
      const tCX = baseCX + pushX;
      const tCY = baseCY + pushY;
      d.cx += (tCX - d.cx) * 0.08;
      d.cy += (tCY - d.cy) * 0.08;
      const pushMag = Math.sqrt(pushX*pushX + pushY*pushY);
      d.currentRot += d.rotSpeed * (1 + pushMag / REPEL_FORCE) * (dt / 16);
      d.el.style.left      = `${d.cx - d.w/2}px`;
      d.el.style.top       = `${d.cy - d.w/2}px`;
      d.el.style.transform = `rotate(${d.currentRot}deg)`;
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();

/* ================================================================
   HERO CONTENT — cursor repulsion for title text + CTA button
   All elements inside .hero-content drift away from the cursor.
   The CTA button also scrolls to #latest on click.
================================================================ */
(function initHeroRepulsion() {
  const heroEl  = document.querySelector('.hero');
  if (!heroEl) return;

  const cta     = document.querySelector('.hero-cta');
  const tag     = document.querySelector('.hero-tag');
  const title   = document.querySelector('.hero-title');
  const sub     = document.querySelector('.hero-sub');

  // Scroll on click
  if (cta) {
    cta.addEventListener('click', e => {
      const target = document.getElementById('latest');
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  }

  // Each element has its own push strength so they drift at different rates
  const repelTargets = [
    { el: tag,   strength: 0.06 },
    { el: title, strength: 0.10 },
    { el: sub,   strength: 0.07 },
    { el: cta,   strength: 0.12 },
  ].filter(t => t.el);

  const RADIUS = 340; // px influence radius
  const MAX_PUSH = 28; // px max displacement

  let tMX = -9999, tMY = -9999;
  let sMX = -9999, sMY = -9999;

  // Per-element current offsets (lerped)
  repelTargets.forEach(t => { t.ox = 0; t.oy = 0; });

  heroEl.addEventListener('mousemove', e => {
    tMX = e.clientX; tMY = e.clientY;
    // Remove glow classes — no color change, just movement
    if (cta) cta.classList.remove('prox-near', 'prox-close', 'prox-touch');
  });
  heroEl.addEventListener('mouseleave', () => { tMX = -9999; tMY = -9999; });

  (function tick() {
    sMX += (tMX - sMX) * 0.1;
    sMY += (tMY - sMY) * 0.1;

    repelTargets.forEach(t => {
      const rect = t.el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = cx - sMX;
      const dy = cy - sMY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetOX = 0, targetOY = 0;
      if (dist < RADIUS && dist > 0) {
        const falloff = (1 - dist / RADIUS);
        const push = falloff * MAX_PUSH * t.strength / 0.1; // normalise
        targetOX = (dx / dist) * push;
        targetOY = (dy / dist) * push;
      }

      t.ox += (targetOX - t.ox) * 0.1;
      t.oy += (targetOY - t.oy) * 0.1;

      t.el.style.transform = `translate(${t.ox.toFixed(2)}px, ${t.oy.toFixed(2)}px)`;
    });

    requestAnimationFrame(tick);
  })();
})();

/* ================================================================
   SUBPAGE HERO — floating article images (music/film/tv pages)
================================================================ */
(function initPageHero() {
  const stage = document.querySelector('.page-hero-stage');
  if (!stage) return;
  const hero  = document.querySelector('.page-hero');

  const imgs = Array.from(stage.querySelectorAll('.ph-img'));
  if (!imgs.length) return;

  const W = () => hero.offsetWidth;
  const H = () => hero.offsetHeight;

  const items = imgs.map((img, i) => {
    const angle  = (i / imgs.length) * Math.PI * 2;
    const spread = 0.3 + Math.random() * 0.35;
    return {
      el: img,
      baseX: 0.5 + Math.cos(angle) * spread * 0.9,
      baseY: 0.5 + Math.sin(angle) * spread * 0.55,
      w: 180 + Math.random() * 100,
      rot: -12 + Math.random() * 24,
      rotSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.04 + Math.random() * 0.08),
      currentRot: -12 + Math.random() * 24,
      cx: 0, cy: 0,
    };
  });

  imgs.forEach(img => { img.style.opacity = '0'; img.style.transition = 'opacity .8s'; });
  window.setTimeout(() => imgs.forEach(img => { img.style.opacity = ''; img.style.removeProperty('transition'); }), 200);

  const REPEL_RADIUS = 200;
  const REPEL_FORCE  = 120;

  let tMX = -9999, tMY = -9999, sMX = -9999, sMY = -9999;

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    tMX = e.clientX - r.left;
    tMY = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => { tMX = -9999; tMY = -9999; });

  let lastT2 = 0;
  function tick(ts) {
    const dt = Math.min(ts - lastT2, 50); lastT2 = ts;
    sMX += (tMX - sMX) * 0.09;
    sMY += (tMY - sMY) * 0.09;

    items.forEach(d => {
      const baseCX = W() * d.baseX;
      const baseCY = H() * d.baseY;
      const dx = baseCX - sMX;
      const dy = baseCY - sMY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      let pushX = 0, pushY = 0;
      if (dist < REPEL_RADIUS && dist > 0) {
        const str = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
        pushX = (dx / dist) * str;
        pushY = (dy / dist) * str;
      }
      d.cx += (baseCX + pushX - d.cx) * 0.07;
      d.cy += (baseCY + pushY - d.cy) * 0.07;
      const pushMag = Math.sqrt(pushX*pushX + pushY*pushY);
      d.currentRot += d.rotSpeed * (1 + pushMag / REPEL_FORCE) * (dt / 16);
      d.el.style.left      = `${d.cx - d.w/2}px`;
      d.el.style.top       = `${d.cy - d.w/2}px`;
      d.el.style.width     = `${d.w}px`;
      d.el.style.transform = `rotate(${d.currentRot}deg)`;
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ================================================================
   LIGHTBOX — images: single-click opens, double-click zooms in.
              videos: lightbox player with native controls.
================================================================ */
(function initLightbox() {
  const overlay = document.createElement('div');
  overlay.id = 'lb-overlay';
  overlay.innerHTML = `
    <div id="lb-backdrop"></div>
    <button id="lb-close" aria-label="Close">&times;</button>
    <div id="lb-content"></div>
    <div id="lb-zoom-controls">
      <button id="lb-zoom-out" aria-label="Zoom out">&#8722;</button>
      <span id="lb-zoom-pct">100%</span>
      <button id="lb-zoom-in" aria-label="Zoom in">&#43;</button>
      <button id="lb-zoom-reset" aria-label="Reset">&#8857;</button>
    </div>`;
  document.body.appendChild(overlay);

  const content  = document.getElementById('lb-content');
  const zoomCtrl = document.getElementById('lb-zoom-controls');
  const zoomPct  = document.getElementById('lb-zoom-pct');
  let scale = 1, panX = 0, panY = 0;
  let isPanning = false, panSX, panSY;
  let activeImg = null;

  // ZOOM_STEP used for both buttons and double-click
  const ZOOM_STEP = 0.75;

  function setScale(s, originX, originY) {
    const prevScale = scale;
    scale = Math.max(0.5, Math.min(5, s));

    // If an origin point given (double-click), zoom toward that point
    if (originX !== undefined && activeImg) {
      const rect = activeImg.getBoundingClientRect();
      const relX = originX - (rect.left + rect.width  / 2);
      const relY = originY - (rect.top  + rect.height / 2);
      const scaleDelta = scale / prevScale;
      panX = originX - scaleDelta * (originX - panX);
      panY = originY - scaleDelta * (originY - panY);
      // Re-centre toward click point
      panX += relX * (1 - scaleDelta);
      panY += relY * (1 - scaleDelta);
    }

    if (activeImg) activeImg.style.transform = `translate(${panX}px,${panY}px) scale(${scale})`;
    zoomPct.textContent = Math.round(scale * 100) + '%';
    if (activeImg) activeImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
  }

  function openImage(src, alt) {
    content.innerHTML = '';
    zoomCtrl.style.display = 'flex';
    scale = 1; panX = 0; panY = 0;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.id  = 'lb-img';
    img.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:4px;cursor:zoom-in;user-select:none;transition:none;';

    // Single-click: pan when zoomed in
    img.addEventListener('mousedown', e => {
      if (scale <= 1) return;
      isPanning = true;
      panSX = e.clientX - panX;
      panSY = e.clientY - panY;
      img.style.cursor = 'grabbing';
      e.preventDefault();
    });

    content.appendChild(img);
    activeImg = img;
    zoomPct.textContent = '100%';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    const v = content.querySelector('video');
    if (v) v.pause();
    setTimeout(() => { content.innerHTML = ''; activeImg = null; }, 300);
  }

  // Pan on mousemove
  window.addEventListener('mousemove', e => {
    if (!isPanning || !activeImg) return;
    panX = e.clientX - panSX;
    panY = e.clientY - panSY;
    activeImg.style.transform = `translate(${panX}px,${panY}px) scale(${scale})`;
  });
  window.addEventListener('mouseup', () => {
    isPanning = false;
    if (activeImg) activeImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
  });

  // Button controls
  document.getElementById('lb-zoom-in').addEventListener('click',    () => setScale(scale + 0.25));
  document.getElementById('lb-zoom-out').addEventListener('click',   () => setScale(scale - 0.25));
  document.getElementById('lb-zoom-reset').addEventListener('click', () => { panX = 0; panY = 0; setScale(1); });
  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-backdrop').addEventListener('click', close);

  // Scroll to zoom
  content.addEventListener('wheel', e => {
    if (!activeImg) return;
    e.preventDefault();
    setScale(scale + (e.deltaY < 0 ? 0.15 : -0.15));
  }, { passive: false });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === '+' || e.key === '=') setScale(scale + 0.25);
    if (e.key === '-') setScale(scale - 0.25);
  });

  // Wire up media in article bodies
  function wireMedia() {
    document.querySelectorAll('.article-body figure img').forEach(img => {
      if (img.dataset.lb) return;
      img.dataset.lb = '1';
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', e => { e.stopPropagation(); openImage(img.src, img.alt); });
    });
    document.querySelectorAll('.article-body figure video').forEach(video => {
      if (video.dataset.lb) return;
      video.dataset.lb = '1';
      // Enable inline playback — never open lightbox or fullscreen on click
      video.controls = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      const wrap = video.parentElement;
      // Add a play-hint overlay that triggers inline play and then hides itself
      if (!wrap.querySelector('.lb-play-hint')) {
        const hint = document.createElement('div');
        hint.className = 'lb-play-hint'; hint.innerHTML = '▶';
        wrap.style.position = 'relative'; wrap.appendChild(hint);
        hint.addEventListener('click', e => {
          e.stopPropagation();
          hint.style.display = 'none';
          video.play();
        });
      }
      // Clicking the video itself just plays/pauses inline — no lightbox
      video.addEventListener('click', e => {
        e.stopPropagation();
        if (video.paused) { video.play(); } else { video.pause(); }
      });
      // Hide play hint once video starts playing
      video.addEventListener('play', () => {
        const h = wrap.querySelector('.lb-play-hint');
        if (h) h.style.display = 'none';
      });
      // Show play hint again when video is paused or ends
      video.addEventListener('pause', () => {
        const h = wrap.querySelector('.lb-play-hint');
        if (h) h.style.display = '';
      });
      video.addEventListener('ended', () => {
        const h = wrap.querySelector('.lb-play-hint');
        if (h) h.style.display = '';
      });
    });
  }
  wireMedia();
  document.addEventListener('DOMContentLoaded', wireMedia);
})();

/* ================================================================
   SCROLL REVEAL
================================================================ */
(function initReveal() {
  const items = document.querySelectorAll('.card, .article-item, .album-entry');
  if (!items.length || !('IntersectionObserver' in window)) return;
  items.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.06) + 's';
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
})();
