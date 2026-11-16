(function () {
'use strict';

/* ================= CONFIG (edit prices & rules here) ================= */
var CFG = { GST: 0.05, FREE_AT: 3500, SHIP_FEE: 99, COLOR_MATCH: 499 };

var COLORS = {
  ecru: { name: 'Natural Ecru',    base: '#EADFC8', a1: '#D8C6A2', a2: '#C86D51', a3: '#F4EDDD', stem: '#6F8069', flower: '#C86D51' },
  clay: { name: 'Terracotta Clay', base: '#C86D51', a1: '#DD9378', a2: '#EBBBA6', a3: '#F6E3D6', stem: '#5F7059', flower: '#C86D51' },
  moss: { name: 'Sage Moss',       base: '#7A8B76', a1: '#9CAB97', a2: '#C1CBBC', a3: '#E6EBE2', stem: '#46573F', flower: '#C86D51' }
};
var SIZES = {
  std: { label: 'Standard', dim: '18" × 24"', price: 1699, mrp: 2199, w: 150, h: 200 },
  lg:  { label: 'Large',    dim: '24" × 36"', price: 2199, mrp: 2899, w: 200, h: 300 }
};
var T1 = [
  { id: 'CRF-CO-01', cat: 'coasters', name: 'Marigold Round Coasters',              spec: 'Set of 4 · 4" round',  price: 499,  mrp: 649,  pal: 'ecru', art: 'coaster' },
  { id: 'CRF-CO-02', cat: 'coasters', name: 'Scallop Edge Coasters',                spec: 'Set of 6 · 4" round',  price: 699,  mrp: 899,  pal: 'moss', art: 'coaster' },
  { id: 'CRF-PL-01', cat: 'planters', name: 'Boho Crochet Planter Cover',           spec: 'Fits a 5" pot',        price: 799,  mrp: 999,  pal: 'ecru', art: 'planter' },
  { id: 'CRF-PL-02', cat: 'planters', name: 'Terracotta Planter with Crochet Trim', spec: '6" pot included',      price: 1299, mrp: 1599, pal: 'clay', art: 'planter' },
  { id: 'CRF-TR-01', cat: 'runners',  name: 'Daisy Lace Table Runner',              spec: '14" × 48"',            price: 1499, mrp: 1899, pal: 'ecru', art: 'runner' },
  { id: 'CRF-TR-02', cat: 'runners',  name: 'Sage Garden Table Runner',             spec: '14" × 72"',            price: 1999, mrp: 2499, pal: 'moss', art: 'runner' }
];
var QUICK = ['CRF-CO-01', 'CRF-PL-02', 'CRF-TR-02'];
var PIECES = {
  tap:  { name: 'Custom Wall Tapestry',  art: 'tap',     pal: 'ecru', blurb: 'Your size, your palette, handcrafted to hang.',
          sizes: [{ l: 'Small', d: '18" × 24"', p: 2499 }, { l: 'Medium', d: '24" × 36"', p: 3799 }, { l: 'Large', d: '30" × 48"', p: 5499 }] },
  cush: { name: 'Cushion & Throw Set',   art: 'cushion', pal: 'clay', blurb: 'Matching textures in the colours of your room.',
          sizes: [{ l: 'Small', d: '2 cushions', p: 2999 }, { l: 'Medium', d: '4 cushions', p: 3999 }, { l: 'Large', d: '4 cushions + throw', p: 5499 }] },
  curt: { name: 'Crochet Curtain Panel', art: 'curtain', pal: 'moss', blurb: 'Filtered light and handmade texture for any window.',
          sizes: [{ l: 'Single', d: '36" × 60" panel', p: 4499 }, { l: 'Tall', d: '42" × 84" panel', p: 6499 }, { l: 'Pair', d: '2 × 42" × 84" panels', p: 8499 }] }
};
var T3 = {
  wall:   { name: 'Feature Wall Installation', from: 19999, plus: false, blurb: 'A signature crochet wall for reception, café or boutique.' },
  window: { name: 'Window & Façade Accent',    from: 34999, plus: false, blurb: 'Entrance, awning and window styling that stops foot traffic.' },
  full:   { name: 'Full Spatial Makeover',     from: 69999, plus: true,  blurb: 'Storefront and interior designed, made and fitted as one story.' }
};

/* ================= helpers ================= */
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
var inr = function (n) { return '₹' + Math.round(n).toLocaleString('en-IN'); };
var pct = function (price, mrp) { return Math.round((mrp - price) / mrp * 100); };
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function load(k) { try { var v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
function persist() { try { localStorage.setItem('cf-bag', JSON.stringify(bag)); localStorage.setItem('cf-quotes', JSON.stringify(quotes)); } catch (e) {} }
var ICO = {
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>',
  truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};

/* ================= artwork (inline SVG) ================= */
function tapestry(c, sz, mini) {
  var cx = 160, y0 = 70, w = sz.w, h = sz.h, x0 = cx - w / 2, k = w / 150, fr = 26;
  var r = w * 0.37, cY = y0 + r + 20, bot = y0 + h - 16, stemTop = cY - r * 0.18, o = '', i, n, x, y, t, s;
  function arch(f, fill) {
    var rr = r * f;
    return '<path d="M' + (cx - rr) + ' ' + bot + 'V' + cY + 'A' + rr + ' ' + rr + ' 0 0 1 ' + (cx + rr) + ' ' + cY + 'V' + bot + 'Z" fill="' + fill + '"/>';
  }
  if (!mini) {
    o += '<defs><pattern id="cfst" width="7" height="6" patternUnits="userSpaceOnUse"><path d="M.8 .8L3.5 5L6.2 .8" fill="none" stroke="rgba(0,0,0,.13)" stroke-width=".9" stroke-linecap="round"/></pattern>' +
         '<filter id="cfsh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>' +
         '<radialGradient id="cfwl" cx=".5" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
    o += '<rect width="320" height="440" style="fill:var(--wall)"/><rect width="320" height="440" fill="url(#cfwl)"/>';
    o += '<rect y="412" width="320" height="28" fill="rgba(0,0,0,.06)"/>';
    o += '<use href="#pl" x="262" y="344" width="52" height="73"/>';
    o += '<path d="M' + (x0 + 8) + ' ' + (y0 - 16) + 'L' + cx + ' ' + (y0 - 54) + 'L' + (x0 + w - 8) + ' ' + (y0 - 16) + '" fill="none" stroke="#8C7B63" stroke-width="1.4"/><circle cx="' + cx + '" cy="' + (y0 - 54) + '" r="3.2" fill="#6e5d49"/>';
  } else {
    o += '<rect x="0" y="0" width="320" height="440" style="fill:var(--wall)"/>';
  }
  for (i = 0; i < 5; i++) { x = x0 + 8 + i * (w - 16) / 4; o += '<line x1="' + x + '" y1="' + (y0 - 9) + '" x2="' + x + '" y2="' + (y0 + 4) + '" stroke="' + c.base + '" stroke-width="3" stroke-linecap="round"/>'; }
  o += '<rect x="' + (x0 - 12) + '" y="' + (y0 - 16) + '" width="' + (w + 24) + '" height="7" rx="3.5" fill="#9A7B5B"/><circle cx="' + (x0 - 12) + '" cy="' + (y0 - 12.5) + '" r="5" fill="#8A6C4D"/><circle cx="' + (x0 + w + 12) + '" cy="' + (y0 - 12.5) + '" r="5" fill="#8A6C4D"/>';
  if (!mini) o += '<rect x="' + (x0 + 6) + '" y="' + (y0 + 10) + '" width="' + w + '" height="' + h + '" rx="4" fill="rgba(0,0,0,.2)" filter="url(#cfsh)"/>';
  n = Math.round(w / 9);
  for (i = 0; i < n; i++) {
    x = x0 + 4 + i * (w - 8) / (n - 1);
    o += '<line x1="' + x.toFixed(1) + '" y1="' + (y0 + h - 2) + '" x2="' + x.toFixed(1) + '" y2="' + (y0 + h + fr - (i % 3) * 4) + '" stroke="' + c.base + '" stroke-width="3.2" stroke-linecap="round"/>';
  }
  o += '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" rx="3" fill="' + c.base + '"/>';
  o += arch(1, c.a1) + arch(0.74, c.a2) + arch(0.48, c.a3);
  o += '<line x1="' + cx + '" y1="' + (bot - 2) + '" x2="' + cx + '" y2="' + stemTop + '" stroke="' + c.stem + '" stroke-width="' + (2.2 * k) + '" stroke-linecap="round"/>';
  for (i = 1; i <= 4; i++) {
    t = i / 5; y = bot - 4 - (bot - 4 - stemTop) * t * 0.95;
    for (s = -1; s <= 1; s += 2) {
      o += '<ellipse cx="' + (cx + s * 8 * k) + '" cy="' + (y - 3 * k) + '" rx="' + (8 * k * (1 - t * 0.25)) + '" ry="' + (3.2 * k * (1 - t * 0.25)) + '" fill="' + c.stem + '" transform="rotate(' + (-s * 35) + ' ' + (cx + s * 8 * k) + ' ' + (y - 3 * k) + ')"/>';
    }
  }
  for (i = 0; i < 6; i++) {
    o += '<circle cx="' + (cx + Math.cos(i * 1.047) * 5.5 * k).toFixed(1) + '" cy="' + (stemTop - 2 * k + Math.sin(i * 1.047) * 5.5 * k).toFixed(1) + '" r="' + (3.6 * k) + '" fill="' + c.flower + '"/>';
  }
  o += '<circle cx="' + cx + '" cy="' + (stemTop - 2 * k) + '" r="' + (2.6 * k) + '" fill="#FAF7F2"/>';
  if (!mini) o += '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" rx="3" fill="url(#cfst)"/>';
  o += '<rect x="' + (x0 + 5) + '" y="' + (y0 + 5) + '" width="' + (w - 10) + '" height="' + (h - 10) + '" rx="2" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="1" stroke-dasharray="3 4"/>';
  return o;
}
function miniTap(c, sz) {
  return '<svg viewBox="40 44 240 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + tapestry(c, sz, true) + '</svg>';
}
function art(type, palKey, extra) {
  var c = COLORS[palKey] || COLORS.ecru, st = 'stroke="rgba(0,0,0,.16)" stroke-width="1"', o = '', i, x;
  if (type === 'coaster') {
    var one = function (cx, cy, r) {
      return '<circle cx="' + (cx + 3) + '" cy="' + (cy + 4) + '" r="' + r + '" fill="rgba(0,0,0,.1)"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + c.a1 + '" ' + st + '/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 6) + '" fill="none" stroke="' + c.base + '" stroke-width="3" stroke-dasharray="2 3.2" stroke-linecap="round"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.55) + '" fill="' + c.base + '"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.34) + '" fill="' + c.a2 + '"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.14) + '" fill="' + c.a3 + '"/>';
    };
    return '<svg viewBox="0 0 160 120" aria-hidden="true">' + one(58, 68, 38) + one(108, 52, 32) + '</svg>';
  }
  if (type === 'planter') {
    o = '<ellipse cx="60" cy="112" rx="34" ry="5" fill="rgba(0,0,0,.1)"/>' +
      '<g fill="#46573F"><ellipse cx="60" cy="40" rx="9" ry="26"/><ellipse cx="40" cy="52" rx="8" ry="21" transform="rotate(-32 40 52)"/><ellipse cx="80" cy="52" rx="8" ry="21" transform="rotate(32 80 52)"/></g>' +
      '<path d="M30 70h60l-7 40H37z" fill="' + c.a1 + '" ' + st + '/><rect x="28" y="66" width="64" height="12" rx="4" fill="' + c.a2 + '" ' + st + '/>' +
      '<path d="M34 88h52M36 97h48" stroke="' + c.base + '" stroke-width="3" stroke-dasharray="2 3.2" stroke-linecap="round" fill="none"/>';
    return '<svg viewBox="0 0 120 120" aria-hidden="true">' + o + '</svg>';
  }
  if (type === 'runner') {
    o = '<rect x="17" y="40" width="172" height="34" rx="3" fill="rgba(0,0,0,.1)"/><rect x="14" y="36" width="172" height="34" rx="3" fill="' + c.a1 + '" ' + st + '/>';
    for (i = 0; i < 12; i++) { x = 20 + i * (160 / 11); o += '<circle cx="' + x.toFixed(1) + '" cy="70" r="6" fill="' + c.a1 + '" ' + st + '/>'; }
    o += '<rect x="14" y="36" width="172" height="34" rx="3" fill="' + c.a1 + '"/><rect x="20" y="42" width="160" height="22" rx="2" fill="none" stroke="' + c.base + '" stroke-width="2.4" stroke-dasharray="2 3.2" stroke-linecap="round"/>';
    for (i = 0; i < 5; i++) { x = 40 + i * 30; o += '<path d="M' + x + ' 53l8-7 8 7-8 7z" fill="' + (i % 2 ? c.a3 : c.a2) + '"/>'; }
    return '<svg viewBox="0 0 200 100" aria-hidden="true">' + o + '</svg>';
  }
  if (type === 'cushion') {
    o = '<g transform="rotate(-8 56 64)"><rect x="22" y="30" width="70" height="70" rx="12" fill="rgba(0,0,0,.1)" transform="translate(3 4)"/><rect x="22" y="30" width="70" height="70" rx="12" fill="' + c.a1 + '" ' + st + '/><rect x="29" y="37" width="56" height="56" rx="8" fill="none" stroke="' + c.base + '" stroke-width="3" stroke-dasharray="2 3.2" stroke-linecap="round"/><circle cx="57" cy="65" r="14" fill="' + c.base + '"/><circle cx="57" cy="65" r="7" fill="' + c.a3 + '"/></g>' +
      '<g transform="rotate(7 112 58)"><rect x="82" y="22" width="60" height="60" rx="10" fill="' + c.a2 + '" ' + st + '/><rect x="88" y="28" width="48" height="48" rx="7" fill="none" stroke="' + c.base + '" stroke-width="3" stroke-dasharray="2 3.2" stroke-linecap="round"/><circle cx="112" cy="52" r="10" fill="' + c.a3 + '"/></g>';
    return '<svg viewBox="0 0 160 120" aria-hidden="true">' + o + '</svg>';
  }
  if (type === 'curtain') {
    o = '<rect x="16" y="14" width="128" height="6" rx="3" fill="#9A7B5B"/>';
    [[28, 52], [82, 52]].forEach(function (p) {
      o += '<rect x="' + p[0] + '" y="20" width="' + p[1] + '" height="88" rx="2" fill="' + c.a1 + '" ' + st + '/>';
      for (i = 1; i < 5; i++) o += '<line x1="' + (p[0] + i * 10.4) + '" y1="24" x2="' + (p[0] + i * 10.4) + '" y2="104" stroke="' + c.base + '" stroke-width="2.4" stroke-dasharray="2 3.2" stroke-linecap="round"/>';
      for (i = 0; i < 5; i++) o += '<circle cx="' + (p[0] + 5 + i * 10.4) + '" cy="108" r="5" fill="' + c.a1 + '" ' + st + '/>';
    });
    return '<svg viewBox="0 0 160 120" aria-hidden="true">' + o + '</svg>';
  }
  if (type === 'tap') return miniTap(COLORS[palKey] || COLORS.ecru, SIZES.std);
  return '';
}

/* ================= state ================= */
var bag = load('cf-bag'), quotes = load('cf-quotes');
var pdp = { color: 'ecru', size: 'std', qty: 1 };
var lastFocus = null, toastT = null, drawerView = 'bag';

/* ================= shipping meter ================= */
function updateShip(root, amount) {
  var ok = amount >= CFG.FREE_AT, p = Math.min(100, amount / CFG.FREE_AT * 100);
  root.classList.toggle('ok', ok);
  $('.cf-ship-txt', root).textContent = ok ? 'Free Pan-India shipping unlocked' : 'Add ' + inr(CFG.FREE_AT - amount) + ' more to unlock free Pan-India shipping';
  var b = $('.cf-bar', root);
  b.setAttribute('aria-valuenow', Math.round(Math.min(amount, CFG.FREE_AT)));
  b.setAttribute('aria-valuetext', ok ? 'Free shipping unlocked' : inr(CFG.FREE_AT - amount) + ' to go');
  $('i', b).style.width = p + '%';
}
function pdpKey() { return 'CRF-WH-01|' + pdp.color + '|' + pdp.size; }
function bagSubtotal(excludeKey) {
  return bag.reduce(function (s, it) { return s + (it.key === excludeKey ? 0 : it.price * it.qty); }, 0);
}

/* ================= PDP render ================= */
function renderPDP() {
  var c = COLORS[pdp.color], s = SIZES[pdp.size], off = pct(s.price, s.mrp);
  $('#cfPrice').textContent = inr(s.price);
  $('#cfMrp').textContent = inr(s.mrp);
  $('#cfOff').textContent = off + '% OFF (Launch Offer)';
  $('#cfSave').textContent = 'You save ' + inr(s.mrp - s.price) + ' on this piece';
  $('#cfSpec').textContent = s.dim + ' | 100% Combed Cotton';
  $('#cfColName').textContent = c.name;
  $('#cfWhy').textContent = 'Why ' + inr(s.price) + '?';
  $('#cfStageChip').textContent = c.name + ' · ' + s.dim;
  $('#cfStageSvg').innerHTML = tapestry(c, s, false);
  $('#cfStageSvg').setAttribute('aria-label', 'Colourway preview: ' + c.name + ', ' + s.dim.replace(/"/g, ' inches'));
  $('#cfThumbSvg').innerHTML = miniTap(c, s);
  $$('[data-sizeprice]').forEach(function (e) { e.textContent = inr(SIZES[e.getAttribute('data-sizeprice')].price); });
  $('#cfQty').textContent = pdp.qty;
  $('#cfDec').disabled = pdp.qty <= 1;
  $('#cfInc').disabled = pdp.qty >= 10;
  $('#cfAdd').textContent = 'Add to Bag · ' + inr(s.price * pdp.qty);
  updateShip($('#cfShip'), bagSubtotal(pdpKey()) + s.price * pdp.qty);
}
function pdpItem() {
  var c = COLORS[pdp.color], s = SIZES[pdp.size];
  return { key: pdpKey(), sku: 'CRF-WH-01', name: 'Botanical Arch Hand-Crocheted Wall Tapestry', variant: c.name + ' · ' + s.dim, price: s.price, mrp: s.mrp, art: { t: 'tap', c: pdp.color, s: pdp.size } };
}

/* ================= bag ================= */
function addToBag(item, qty) {
  var f = bag.filter(function (b) { return b.key === item.key; })[0];
  if (f) f.qty = Math.min(10, f.qty + qty); else { item.qty = qty; bag.push(item); }
  persist(); renderBag(); bump();
}
function bump() { var b = $('#cfBadge'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
function thumbFor(a) { return a.t === 'tap' ? miniTap(COLORS[a.c], SIZES[a.s]) : art(a.t, a.p); }
function totals() {
  var sub = bagSubtotal(), free = sub >= CFG.FREE_AT, ship = !bag.length ? 0 : (free ? 0 : CFG.SHIP_FEE);
  return { sub: sub, ship: ship, free: free, gst: sub - sub / (1 + CFG.GST), total: sub + ship };
}
function renderBag() {
  var n = bag.reduce(function (s, b) { return s + b.qty; }, 0), q = quotes.length, T = totals();
  $('#bagList').innerHTML = bag.map(function (it) {
    return '<div class="dw-line" data-key="' + esc(it.key) + '"><div class="dw-thumb">' + thumbFor(it.art) + '</div><div class="dw-info"><p class="dw-name">' + esc(it.name) + '</p><p class="dw-var">' + esc(it.variant) + '</p>' +
      '<div class="dw-pr"><div class="cf-qty sm" role="group" aria-label="Quantity for ' + esc(it.name) + '"><button type="button" data-act="dec" aria-label="Decrease quantity"' + (it.qty <= 1 ? ' disabled' : '') + '>−</button><output>' + it.qty + '</output><button type="button" data-act="inc" aria-label="Increase quantity"' + (it.qty >= 10 ? ' disabled' : '') + '>+</button></div><b>' + inr(it.price * it.qty) + '</b></div></div>' +
      '<button type="button" class="dw-rm" data-act="rm" aria-label="Remove ' + esc(it.name) + ' from bag">' + ICO.trash + '</button></div>';
  }).join('');
  $('#bagEmpty').hidden = bag.length > 0;
  $('#dwShip').hidden = !bag.length;
  updateShip($('#dwShip'), T.sub);
  $('#dwSum').innerHTML = '<div><dt>Subtotal</dt><dd>' + inr(T.sub) + '</dd></div><div><dt>Shipping</dt><dd>' + (T.free ? 'Free' : inr(T.ship)) + '</dd></div><div><dt>GST (5%) included</dt><dd>' + inr(T.gst) + '</dd></div><div class="tot"><dt>Total</dt><dd>' + inr(T.total) + '</dd></div>';
  $('#goCheckout').textContent = 'Checkout · ' + inr(T.total);
  var cb = $('#cfBadge'); cb.textContent = n + q; cb.hidden = !(n + q);
  $('#cfCartBtn').setAttribute('aria-label', 'Open bag, ' + n + (n === 1 ? ' item' : ' items') + (q ? ', ' + q + ' quote request' + (q > 1 ? 's' : '') : ''));
  var bn = $('#dwBagN'); bn.textContent = n; bn.hidden = !n;
  var qn = $('#dwQuoteN'); qn.textContent = q; qn.hidden = !q;
  renderQuotes(); renderPDP(); syncFoot();
}

/* ================= quotes ================= */
function renderQuotes() {
  $('#quoteList').innerHTML = quotes.map(function (q) {
    return '<div class="dw-quote" data-qid="' + esc(q.id) + '"><div class="q-i"><span class="tg">' + esc(q.tag) + '</span><b>' + esc(q.title) + '</b><p>' + esc(q.details.join(' · ')) + '</p><p class="est">' + esc(q.est) + ' <span style="font-weight:500;color:var(--muted)">· ' + esc(q.lead) + '</span></p></div>' +
      '<button type="button" class="dw-rm" data-act="rmq" aria-label="Remove ' + esc(q.title) + ' from quote request">' + ICO.trash + '</button></div>';
  }).join('');
  $('#quoteEmpty').hidden = quotes.length > 0;
  $('#qForm').hidden = !quotes.length;
}

/* ================= drawer ================= */
var PAGE = ['header', 'main', 'footer'];
function setPageInert(on) { PAGE.forEach(function (s) { var e = $(s); if (e) { if (on) e.setAttribute('inert', ''); else e.removeAttribute('inert'); } }); }
function showView(v) {
  drawerView = v;
  ['bag', 'checkout', 'orderDone', 'quote', 'quoteDone'].forEach(function (k) {
    var id = { bag: 'vBag', checkout: 'vCheckout', orderDone: 'vOrderDone', quote: 'vQuote', quoteDone: 'vQuoteDone' }[k];
    $('#' + id).hidden = k !== v;
  });
  var isQ = v === 'quote' || v === 'quoteDone';
  $('#dwTabBag').setAttribute('aria-pressed', !isQ);
  $('#dwTabQuote').setAttribute('aria-pressed', isQ);
  $('#dwTitle').textContent = isQ ? 'Quote requests' : (v === 'checkout' ? 'Checkout' : 'Your bag');
  $('#dwBody').scrollTop = 0;
  syncFoot();
}
function syncFoot() { $('#dwFoot').hidden = !(drawerView === 'bag' && bag.length); }
function openDrawer(v) {
  if (!$('#drawer').classList.contains('open')) lastFocus = document.activeElement;
  showView(v || 'bag');
  var d = $('#drawer');
  d.removeAttribute('inert'); d.classList.add('open'); $('#dwOverlay').classList.add('open');
  setPageInert(true); document.documentElement.style.overflow = 'hidden';
  setTimeout(function () { $('#dwClose').focus(); }, 60);
}
function closeDrawer(go) {
  var d = $('#drawer');
  if (!d.classList.contains('open')) return;
  d.classList.remove('open'); $('#dwOverlay').classList.remove('open'); d.setAttribute('inert', '');
  setPageInert(false); document.documentElement.style.overflow = '';
  if (go) { var t = $(go); if (t) t.scrollIntoView(); }
  else if (lastFocus && lastFocus.focus) lastFocus.focus();
}
function toast(msg, action) {
  var t = $('#cfToast'), b = $('#cfToastBtn');
  $('#cfToastTxt').textContent = msg;
  b.hidden = !action; if (action) b.textContent = action;
  t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 4200);
}
function submitToBackend(kind, payload) {
  /* TODO: replace with your real endpoint (Shopify / Razorpay / Formspree / your API).
     This storefront is front-end only, so nothing leaves the browser until you wire this up. */
  if (window.console) console.info('[Craftora]', kind, payload);
  return Promise.resolve({ ok: true });
}
function refId(p) { var d = new Date(); return p + '-' + String(d.getFullYear()).slice(2) + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(); }

/* ================= tier catalogue ================= */
function t1Card(p) {
  return '<div class="cf-pc"><div class="art">' + art(p.art, p.pal) + '</div><h4>' + esc(p.name) + '</h4><p class="sp">' + esc(p.spec) + '</p>' +
    '<div class="pr"><b>' + inr(p.price) + '</b><s>' + inr(p.mrp) + '</s><em>' + pct(p.price, p.mrp) + '% off</em></div>' +
    '<button type="button" class="btn p" data-add="' + p.id + '">Add to Bag</button></div>';
}
function renderT1(cat) {
  $('#cfT1Grid').innerHTML = T1.filter(function (p) { return cat === 'all' || p.cat === cat; }).map(t1Card).join('');
  $$('#cfChips .cf-chip').forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-cat') === cat); });
}
function renderTiers() {
  $('#cfQuick').innerHTML = QUICK.map(function (id) {
    var p = T1.filter(function (x) { return x.id === id; })[0];
    return '<div class="cf-qrow"><div class="cf-qthumb">' + art(p.art, p.pal) + '</div><div class="cf-qinfo"><b>' + esc(p.name) + '</b><span>' + inr(p.price) + '</span></div><button type="button" class="cf-mini" data-add="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to bag">Add</button></div>';
  }).join('');
  renderT1('all');
  $('#cfT2Grid').innerHTML = Object.keys(PIECES).map(function (k) {
    var P = PIECES[k], lo = P.sizes[0].p, hi = P.sizes[P.sizes.length - 1].p;
    return '<div class="cf-pc"><div class="art">' + art(P.art, P.pal) + '</div><h4>' + esc(P.name) + '</h4><p class="sp">' + esc(P.blurb) + '</p><div class="pr"><b>' + inr(lo) + ' – ' + inr(hi) + '</b></div><button type="button" class="btn p" data-custom="' + k + '">Customize Piece</button></div>';
  }).join('');
  $('#cfT3Grid').innerHTML = Object.keys(T3).map(function (k) {
    var P = T3[k];
    return '<div class="cf-pc"><h4 style="margin-top:6px">' + esc(P.name) + '</h4><p class="sp">' + esc(P.blurb) + '</p><div class="pr"><b>from ' + inr(P.from) + (P.plus ? '+' : '') + '</b></div><button type="button" class="btn p" data-quote="' + k + '">Request Studio Quote</button></div>';
  }).join('');
}
function setTier(v, scroll) {
  $('#cfTiers').setAttribute('data-view', v);
  $$('.cf-f').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tier') === v); });
  $('#cfFilterMsg').textContent = { all: 'Showing all three tiers', 1: 'Showing ready-to-ship home accents', 2: 'Showing bespoke custom orders', 3: 'Showing commercial installations' }[v];
  if (scroll) $('#pricing').scrollIntoView();
}

/* ================= customiser dialog ================= */
var dlg, cfg;
function radioCards(name, items, checked) {
  return '<div class="cf-opts">' + items.map(function (it, i) {
    return '<label class="cf-opt cf-card-opt"><input class="cf-vh" type="radio" name="' + name + '" value="' + esc(it.v) + '"' + (it.v === checked ? ' checked' : '') + '><span class="box"><b>' + esc(it.t) + '</b>' + (it.s ? '<span data-sub="' + name + i + '">' + esc(it.s) + '</span>' : '') + (it.e ? '<em data-em="' + name + i + '">' + esc(it.e) + '</em>' : '') + '</span></label>';
  }).join('') + '</div>';
}
function dlgShell(eyebrow, title, body, foot) {
  return '<div class="cf-dlg-in"><div class="cf-dlg-hd"><div><p class="cf-eyebrow" style="margin-bottom:6px">' + eyebrow + '</p><h3 id="dlgTitle">' + title + '</h3></div><button type="button" class="dw-x" data-dlg-close aria-label="Close">' + ICO.close + '</button></div><div class="cf-dlg-bd">' + body + '</div><div class="cf-dlg-ft">' + foot + '</div></div>';
}
function openCustom(piece) {
  cfg = { kind: 'bespoke', piece: piece || 'tap', size: 0, color: 'ecru', note: '', ref: '' };
  var swatches = Object.keys(COLORS).map(function (k) { return '<label class="cf-opt cf-sw"><input class="cf-vh" type="radio" name="dColor" value="' + k + '"' + (k === 'ecru' ? ' checked' : '') + '><span class="dot" style="--c:' + COLORS[k].base + '"></span><span class="cf-sr">' + COLORS[k].name + '</span></label>'; }).join('') +
    '<label class="cf-opt cf-sw"><input class="cf-vh" type="radio" name="dColor" value="match"><span class="dot" style="--c:#FAF7F2;display:grid;place-items:center;font-weight:800;font-size:20px;color:#A9553A">+</span><span class="cf-sr">Match my own colours</span></label>';
  var body = '<fieldset class="cf-fs"><legend>1. Choose your piece</legend>' + radioCards('dPiece', Object.keys(PIECES).map(function (k) { return { v: k, t: PIECES[k].name, s: 'from ' + inr(PIECES[k].sizes[0].p) }; }), cfg.piece) + '</fieldset>' +
    '<fieldset class="cf-fs"><legend>2. Choose a size</legend><div id="dSizes"></div></fieldset>' +
    '<fieldset class="cf-fs"><legend>3. Colourway: <b id="dColName">Natural Ecru</b></legend><div class="cf-opts">' + swatches + '</div><label class="fld" id="dMatchWrap" hidden>Describe your colours or paste a hex code (+' + inr(CFG.COLOR_MATCH) + ' for colour-matching)<input id="dMatch" placeholder="e.g. dusty rose, #C9A9A6"></label></fieldset>' +
    '<label class="fld"><span>4. Notes for our artisans <span style="font-weight:500;color:var(--muted)">(optional)</span></span><textarea id="dNote" rows="3" placeholder="Wall dimensions, room mood, a reference photo link…"></textarea></label>' +
    '<p class="cf-dlg-note">Indicative price shown. Your final quote is confirmed in writing within 2 business days.</p>';
  var foot = '<div class="cf-est"><small>Indicative price</small><b id="dPrice"></b><span>Handcrafted in 2–3 weeks</span></div><button type="button" class="btn p" id="dAdd">Add to quote request</button>';
  dlg.innerHTML = dlgShell('Bespoke custom order', 'Customize your piece', body, foot);
  refreshCustom(); dlg.showModal();
}
function refreshCustom() {
  var P = PIECES[cfg.piece];
  $('#dSizes').innerHTML = radioCards('dSize', P.sizes.map(function (s, i) { return { v: String(i), t: s.l, s: s.d, e: inr(s.p) }; }), String(cfg.size));
  updateCustomPrice();
}
function customPrice() {
  var s = PIECES[cfg.piece].sizes[cfg.size];
  return s.p + (cfg.color === 'match' ? CFG.COLOR_MATCH : 0);
}
function updateCustomPrice() {
  $('#dPrice').textContent = inr(customPrice());
  $('#dColName').textContent = cfg.color === 'match' ? 'Match my own colours' : COLORS[cfg.color].name;
  $('#dMatchWrap').hidden = cfg.color !== 'match';
}
function openStudio(pkg) {
  cfg = { kind: 'studio', pkg: pkg || 'wall', space: 'Café' };
  var spaces = ['Café', 'Boutique', 'Storefront'].map(function (s) { return { v: s, t: s }; });
  var body = '<fieldset class="cf-fs"><legend>1. What kind of space?</legend>' + radioCards('sSpace', spaces, 'Café') + '</fieldset>' +
    '<fieldset class="cf-fs"><legend>2. What do you have in mind?</legend>' + radioCards('sPkg', Object.keys(T3).map(function (k) { return { v: k, t: T3[k].name, s: T3[k].blurb, e: 'from ' + inr(T3[k].from) + (T3[k].plus ? '+' : '') }; }), cfg.pkg) + '</fieldset>' +
    '<div class="cf-dlg-grid two"><label class="fld"><span>Approx. area or wall size <span style="font-weight:500;color:var(--muted)">(sq ft, optional)</span></span><input id="sArea" inputmode="numeric" placeholder="e.g. 120"></label><label class="fld">City<input id="sCity" autocomplete="address-level2" placeholder="e.g. Bengaluru"></label></div>' +
    '<label class="fld">Ideal timeline<select id="sTime"><option>Under 1 month</option><option>1 to 3 months</option><option>3 to 6 months</option><option>Flexible</option></select></label>' +
    '<p class="cf-dlg-note">Prices shown are starting points. Our studio visits or video-calls first, then sends an itemised written quote.</p>';
  var foot = '<div class="cf-est"><small>Starting from</small><b id="sPrice"></b><span>Typical timeline 3–4 weeks</span></div><button type="button" class="btn p" id="sAdd">Add to quote request</button>';
  dlg.innerHTML = dlgShell('Commercial &amp; spatial installation', 'Request a studio quote', body, foot);
  updateStudioPrice(); dlg.showModal();
}
function updateStudioPrice() { var P = T3[cfg.pkg]; $('#sPrice').textContent = inr(P.from) + (P.plus ? '+' : ''); }

function addQuoteFromDialog() {
  var q;
  if (cfg.kind === 'bespoke') {
    var P = PIECES[cfg.piece], s = P.sizes[cfg.size], note = ($('#dNote').value || '').trim(), match = ($('#dMatch').value || '').trim();
    q = { id: 'q' + Date.now(), tag: 'Tier 2 · Bespoke', title: P.name, details: [s.l + ' (' + s.d + ')', cfg.color === 'match' ? 'Colour-match' + (match ? ': ' + match : '') : COLORS[cfg.color].name].concat(note ? ['Note: ' + note] : []), est: 'Indicative ' + inr(customPrice()), lead: '2–3 weeks' };
  } else {
    var T = T3[cfg.pkg], area = ($('#sArea').value || '').trim(), city = ($('#sCity').value || '').trim();
    q = { id: 'q' + Date.now(), tag: 'Tier 3 · Commercial', title: T.name, details: [cfg.space].concat(area ? [area + ' sq ft'] : [], city ? [city] : [], [$('#sTime').value]), est: 'From ' + inr(T.from) + (T.plus ? '+' : ''), lead: '3–4 weeks typical' };
  }
  quotes.push(q); persist(); renderBag(); bump();
  dlg.close(); openDrawer('quote');
}

/* ================= events ================= */
function bind() {
  dlg = $('#cfDlg');

  /* PDP variants */
  $$('input[name=cfColor]').forEach(function (r) { r.addEventListener('change', function () { pdp.color = r.value; renderPDP(); }); });
  $$('input[name=cfSize]').forEach(function (r) { r.addEventListener('change', function () { pdp.size = r.value; renderPDP(); }); });
  $('#cfDec').addEventListener('click', function () { if (pdp.qty > 1) { pdp.qty--; renderPDP(); } });
  $('#cfInc').addEventListener('click', function () { if (pdp.qty < 10) { pdp.qty++; renderPDP(); } });
  $('#cfAdd').addEventListener('click', function () { addToBag(pdpItem(), pdp.qty); pdp.qty = 1; renderPDP(); openDrawer('bag'); });
  $('#cfBuy').addEventListener('click', function () { addToBag(pdpItem(), pdp.qty); pdp.qty = 1; renderPDP(); openDrawer('checkout'); });
  $$('.cf-thumb').forEach(function (b) {
    b.addEventListener('click', function () {
      var photo = b.getAttribute('data-view') === 'photo';
      $('#cfStageSvg').hidden = photo; $('#cfPhoto').hidden = !photo; $('#cfStageChip').hidden = photo;
      $$('.cf-thumb').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    });
  });
  $('#cfAccB').addEventListener('click', function () {
    var a = $('#cfAcc'), o = !a.classList.contains('open');
    a.classList.toggle('open', o); this.setAttribute('aria-expanded', o);
  });

  /* pincode */
  $('#cfPinForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('#cfPin').value.trim(), m = $('#cfPinMsg');
    if (!/^[1-9][0-9]{5}$/.test(v)) { m.className = 'cf-pinmsg bad'; m.textContent = 'Please enter a valid 6-digit pincode.'; return; }
    var lo = v.slice(0, 3) === '560' ? 3 : 5, hi = lo + (lo === 3 ? 1 : 2), d1 = new Date(), d2 = new Date();
    d1.setDate(d1.getDate() + lo); d2.setDate(d2.getDate() + hi);
    var f = function (d) { return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }); };
    m.className = 'cf-pinmsg good'; m.textContent = 'Estimated delivery to ' + v + ': ' + f(d1) + ' – ' + f(d2);
  });

  /* tier filters */
  $$('.cf-f').forEach(function (b) { b.addEventListener('click', function () { setTier(b.getAttribute('data-tier')); }); });
  $('#cfChips').addEventListener('click', function (e) { var c = e.target.closest('[data-cat]'); if (c) renderT1(c.getAttribute('data-cat')); });

  /* global delegated clicks */
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-add]'))) {
      var p = T1.filter(function (x) { return x.id === t.getAttribute('data-add'); })[0];
      addToBag({ key: p.id, sku: p.id, name: p.name, variant: p.spec, price: p.price, mrp: p.mrp, art: { t: p.art, p: p.pal } }, 1);
      toast(p.name + ' added to your bag', 'View bag'); return;
    }
    if ((t = e.target.closest('[data-custom]'))) { openCustom(t.getAttribute('data-custom')); return; }
    if ((t = e.target.closest('[data-quote]'))) { openStudio(t.getAttribute('data-quote')); return; }
    if ((t = e.target.closest('[data-tier-go]'))) { setTier(t.getAttribute('data-tier-go'), true); return; }
    if ((t = e.target.closest('[data-close-go]'))) { closeDrawer(t.getAttribute('data-close-go')); return; }
    if (e.target.closest('[data-dlg-close]')) { dlg.close(); return; }
    if (e.target === dlg) { dlg.close(); return; }
  });

  /* cart button, drawer chrome */
  $('#cfCartBtn').addEventListener('click', function () { openDrawer(!bag.length && quotes.length ? 'quote' : 'bag'); });
  $('#dwClose').addEventListener('click', function () { closeDrawer(); });
  $('#dwOverlay').addEventListener('click', function () { closeDrawer(); });
  $('#dwTabBag').addEventListener('click', function () { showView('bag'); });
  $('#dwTabQuote').addEventListener('click', function () { showView('quote'); });
  $('#cfToastBtn').addEventListener('click', function () { $('#cfToast').classList.remove('show'); openDrawer('bag'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('#drawer').classList.contains('open') && !dlg.open) closeDrawer(); });

  /* bag line actions */
  $('#bagList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var key = b.closest('.dw-line').getAttribute('data-key'), it = bag.filter(function (x) { return x.key === key; })[0];
    if (!it) return;
    var act = b.getAttribute('data-act');
    if (act === 'inc') it.qty = Math.min(10, it.qty + 1);
    if (act === 'dec') it.qty = Math.max(1, it.qty - 1);
    if (act === 'rm') bag = bag.filter(function (x) { return x !== it; });
    persist(); renderBag();
    var again = act === 'rm' ? null : $('[data-key="' + key.replace(/"/g, '\\"') + '"] [data-act="' + act + '"]', $('#bagList'));
    if (again && !again.disabled) again.focus();
  });
  $('#quoteList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act=rmq]'); if (!b) return;
    var id = b.closest('.dw-quote').getAttribute('data-qid');
    quotes = quotes.filter(function (q) { return q.id !== id; }); persist(); renderBag();
  });

  /* checkout */
  $('#goCheckout').addEventListener('click', function () { showView('checkout'); });
  $('#coBack').addEventListener('click', function () { showView('bag'); });
  $('#vCheckout').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, err = $('#coErr'); err.textContent = '';
    if (!f.n.value.trim() || !f.a.value.trim() || !f.c.value.trim()) { err.textContent = 'Please fill in all the delivery details.'; return; }
    if (!/^[6-9][0-9]{9}$/.test(f.m.value.trim())) { err.textContent = 'Please enter a valid 10-digit mobile number.'; f.m.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(f.e.value.trim())) { err.textContent = 'Please enter a valid email address.'; f.e.focus(); return; }
    if (!/^[1-9][0-9]{5}$/.test(f.p.value.trim())) { err.textContent = 'Please enter a valid 6-digit pincode.'; f.p.focus(); return; }
    var ref = refId('CRF'), T = totals();
    submitToBackend('order', { ref: ref, customer: { name: f.n.value, mobile: f.m.value, email: f.e.value, address: f.a.value, city: f.c.value, pincode: f.p.value }, items: bag, totals: T }).then(function () {
      $('#orderRef').textContent = ref; bag = []; persist(); renderBag(); f.reset(); showView('orderDone');
    });
  });
  $('#qForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, err = $('#qErr'); err.textContent = '';
    if (!f.n.value.trim() || !f.c.value.trim()) { err.textContent = 'Please fill in your name and city.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(f.e.value.trim())) { err.textContent = 'Please enter a valid email address.'; f.e.focus(); return; }
    if (!/^[6-9][0-9]{9}$/.test(f.m.value.trim())) { err.textContent = 'Please enter a valid 10-digit mobile number.'; f.m.focus(); return; }
    var ref = refId('CQ');
    submitToBackend('quote', { ref: ref, contact: { name: f.n.value, email: f.e.value, phone: f.m.value, city: f.c.value, note: f.x.value }, requests: quotes }).then(function () {
      $('#quoteRef').textContent = ref; quotes = []; persist(); renderBag(); f.reset(); showView('quoteDone');
    });
  });

  /* dialog: delegated change/input */
  dlg.addEventListener('change', function (e) {
    var n = e.target.name;
    if (n === 'dPiece') { cfg.piece = e.target.value; cfg.size = 0; refreshCustom(); }
    else if (n === 'dSize') { cfg.size = +e.target.value; updateCustomPrice(); }
    else if (n === 'dColor') { cfg.color = e.target.value; updateCustomPrice(); if (cfg.color === 'match') { var m = $('#dMatch'); if (m) m.focus(); } }
    else if (n === 'sPkg') { cfg.pkg = e.target.value; updateStudioPrice(); }
    else if (n === 'sSpace') { cfg.space = e.target.value; }
  });
  dlg.addEventListener('click', function (e) {
    if (e.target.id === 'dAdd' || e.target.id === 'sAdd') addQuoteFromDialog();
  });
}

/* ================= boot ================= */
function boot() {
  bind();
  renderTiers();
  renderBag();
  /* reuse photos already on the page so the file stays lean */
  var sf = $('#p0 img'); if (sf) $('#cfT3Img').src = sf.getAttribute('src');
  $('#cfThumbImg').src = $('#cfPhoto').getAttribute('src');
  setTier('all');
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
