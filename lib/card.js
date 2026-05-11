// ============================================================
// aiCAPEX — Calls page card renderer
// renderCard(augmentedTicker, symbol) → HTMLElement
// Depends on: data.js (AICAPEX globals), calc.js (AICAPEX_CALC).
// ============================================================

const AICAPEX_CARD = (function () {

  function fmtUsdB(v) {
    if (v == null || !isFinite(v)) return "—";
    if (v >= 1000) return "$" + (v / 1000).toFixed(2) + "T";
    if (v >= 1)    return "$" + v.toFixed(1) + "B";
    return "$" + (v * 1000).toFixed(0) + "M";
  }

  function fmtPrice(v, ccy) {
    if (v == null) return "—";
    const symbol = (ccy === "USD") ? "$" : (ccy ? ccy + " " : "");
    return symbol + v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  function fmtPct(v) {
    if (v == null || !isFinite(v)) return "—";
    const pct = v * 100;
    const sign = pct >= 0 ? "+" : "";
    return sign + pct.toFixed(1) + "%";
  }

  function fmtFcr(v) {
    if (v == null) return "—";
    if (!isFinite(v)) return "∞";
    return v.toFixed(2);
  }

  // Tiny 2-point sparkline if price_history is missing.
  // If price_history (array of monthly prices) is present, draw it.
  function buildSparkline(financials, color) {
    if (!financials) return "";
    const history = financials.price_history;
    const p0 = financials.price_12mo_ago_usd;
    const p1 = financials.price_usd;
    let pts;
    if (Array.isArray(history) && history.length >= 2) {
      pts = history.slice();
    } else if (p0 != null && p1 != null) {
      pts = [p0, p1];
    } else {
      return "";
    }
    const w = 200, h = 36, pad = 2;
    const min = Math.min(...pts), max = Math.max(...pts);
    const range = (max - min) || 1;
    const xs = pts.map((_, i) => pad + (i / (pts.length - 1)) * (w - 2 * pad));
    const ys = pts.map(v => h - pad - ((v - min) / range) * (h - 2 * pad));
    const d = xs.map((x, i) => (i === 0 ? "M" : "L") + x.toFixed(1) + "," + ys[i].toFixed(1)).join(" ");
    const lastUp = pts[pts.length - 1] >= pts[0];
    const stroke = color || (lastUp ? "#51cf66" : "#ff6b6b");
    return (
      '<svg class="sparkline" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' +
        '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="1.6" stroke-linejoin="round" />' +
        '<circle cx="' + xs[xs.length-1].toFixed(1) + '" cy="' + ys[ys.length-1].toFixed(1) + '" r="2.2" fill="' + stroke + '"/>' +
      '</svg>'
    );
  }

  function callBadge(call) {
    const label = AICAPEX_CALC.CALL_LABELS[call] || "Watching";
    const color = AICAPEX_CALC.CALL_COLORS[call] || AICAPEX_CALC.CALL_COLORS.watching;
    return '<span class="call-badge" style="color:' + color + '; border-color:' + color + '">' +
      '<span class="dot" style="background:' + color + '"></span>' + label +
    '</span>';
  }

  function segmentChip(seg, share) {
    const color = (window.AICAPEX.segmentColor && window.AICAPEX.segmentColor[seg]) || "#888";
    return '<span class="seg-chip" style="color:' + color + '; border-color:' + color + '33; background:' + color + '14">' +
      seg + ' ' + (Math.round(share * 100)) + '%</span>';
  }

  function thesisPendingBlock() {
    return '<div class="thesis-pending">Thesis pending</div>';
  }

  function renderCard(t, symbol) {
    const card = document.createElement('article');
    card.className = 'stock-card';
    card.dataset.symbol = symbol;
    const c = t.computed;
    card.dataset.call = c.effective_call;
    card.dataset.segments = (t.segment_exposures || []).map(e => e.segment).join('|');

    const segs = (t.segment_exposures || []).map(e => segmentChip(e.segment, e.share_2026)).join(' ');
    const hasFinancials = !!t.financials;
    const yr = c.one_year_return;
    const yrCls = (yr != null && yr < 0) ? 'down' : 'up';
    const yrArrow = (yr != null && yr < 0) ? '↓' : (yr != null ? '↑' : '');
    const callBadgeHtml = hasFinancials ? callBadge(c.effective_call) : '<span class="call-badge dim">Pending</span>';
    const authorBadge = (c.call_source === "author" && hasFinancials)
      ? '<span class="author-badge" title="Manual author call (overrides auto-FCR)">Author view</span>' : '';

    const hasThesis = t.thesis && t.thesis.short;
    const thesisBlock = hasThesis
      ? ('<div class="thesis-text">' +
           '<p>' + escapeHtml(t.thesis.short) + '</p>' +
           (t.thesis.risks ? '<p class="risks"><strong>Risks:</strong> ' + escapeHtml(t.thesis.risks) + '</p>' : '') +
         '</div>')
      : thesisPendingBlock();

    const segExpDetail = (t.segment_exposures || []).map(e =>
      '<li><span class="seg-name" style="color:' + ((window.AICAPEX.segmentColor || {})[e.segment] || '#888') + '">'
      + e.segment + '</span> · ' + Math.round(e.share_2026 * 100) + '% share'
      + (e.note ? ' <span class="seg-note">— ' + escapeHtml(e.note) + '</span>' : '')
      + '</li>'
    ).join('');

    // Fair-value block
    const fairPrice = c.fair_price;
    const upside    = c.pct_upside;
    const kappa     = c.conversion_factor;
    let upsideCls = 'neutral';
    if (upside != null) {
      if (upside >  0.10) upsideCls = 'positive';
      else if (upside < -0.05) upsideCls = 'negative';
    }
    const fairBlock = (hasFinancials && fairPrice != null)
      ? ('<div class="fair-bar ' + upsideCls + '">' +
           '<div class="fair-left">' +
             '<span class="lbl">Modeled fair value</span>' +
             '<span class="val">' + fmtPrice(fairPrice, t.currency) + '</span>' +
           '</div>' +
           '<div class="fair-right">' +
             '<span class="upside-pct">' + fmtPct(upside) + '</span>' +
             (kappa != null ? '<span class="kappa" title="Conversion factor (κ): fraction of excess flow that converts to revenue">κ ' + kappa.toFixed(2) + '</span>' : '') +
           '</div>' +
         '</div>')
      : '';

    card.innerHTML =
      '<header class="card-head">' +
        '<div class="card-head-left">' +
          '<div class="ticker">' + escapeHtml(symbol) + '</div>' +
          '<div class="company">' + escapeHtml(t.name || '') +
            (t.native_ticker ? ' <span class="native-ticker">' + escapeHtml(t.native_ticker) + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="card-head-right">' + callBadgeHtml + authorBadge + '</div>' +
      '</header>' +

      '<div class="seg-chips">' + segs + '</div>' +

      '<div class="metrics">' +
        '<div class="metric"><span class="lbl">Price</span><span class="val">' + fmtPrice(t.financials && t.financials.price_usd, t.currency) + '</span>' +
          (yr != null ? '<span class="yoy ' + yrCls + '">' + yrArrow + ' ' + fmtPct(yr) + '</span>' : '') +
        '</div>' +
        '<div class="metric"><span class="lbl" title="Flow Coverage Ratio = Theoretical 2026 CapEx Flow / Implied Revenue Growth Increment">FCR</span><span class="val fcr">' + fmtFcr(c.fcr) + '</span></div>' +
        '<div class="metric"><span class="lbl">Theoretical 2026 Flow</span><span class="val flow">' + fmtUsdB(c.theoretical_flow_b) + '</span></div>' +
      '</div>' +

      fairBlock +

      buildSparkline(t.financials) +

      '<button class="thesis-toggle" type="button" aria-expanded="false">Read thesis <span class="caret">▾</span></button>' +
      '<div class="thesis-body" hidden>' +
        thesisBlock +
        '<details class="seg-exposures"><summary>Segment exposures &amp; shares</summary><ul class="seg-exp-list">' + segExpDetail + '</ul></details>' +
        (hasFinancials && t.financials.as_of ? '<div class="as-of">Financials as of ' + escapeHtml(t.financials.as_of) + '</div>' : '') +
      '</div>';

    // Expander
    const toggle = card.querySelector('.thesis-toggle');
    const body = card.querySelector('.thesis-body');
    toggle.addEventListener('click', () => {
      const open = body.hasAttribute('hidden') ? true : false;
      if (open) {
        body.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('open');
      } else {
        body.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('open');
      }
    });

    return card;
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  return { renderCard, fmtUsdB, fmtPrice, fmtPct, fmtFcr };
})();

if (typeof window !== 'undefined') {
  window.AICAPEX_CARD = AICAPEX_CARD;
}
