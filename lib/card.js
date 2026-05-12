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

  // Forward-projection mini-chart.
  // Modes (priority):
  //   1. Forward trajectory from calc.js: current_price → projected prices for
  //      each subsequent year through 2029. Plotted as a clean polyline with
  //      one dot per year and year labels along the bottom. Start/end price
  //      labels float above the chart at the endpoints.
  //   2. Legacy 2-anchor fallback: 1-year price change (used only if forward
  //      trajectory cannot be computed).
  //
  // No interpolation, no wiggle — every point on the line is a real annual
  // anchor. Honest visual: the segments are deliberately straight.
  function fmtPriceCompact(v) {
    if (v == null) return '';
    if (v >= 10000) return '$' + (v / 1000).toFixed(1) + 'K';
    if (v >= 1000)  return '$' + (v / 1000).toFixed(2) + 'K';
    if (v >= 100)   return '$' + Math.round(v);
    return '$' + v.toFixed(1);
  }

  function buildSparkline(financials, color, ticker) {
    if (!financials) return "";

    let pts;     // raw price points (one per anchor — typically 4 for 2026..2029)
    let labels;  // text labels aligned 1:1 with pts (e.g. ['2026','2027','2028','2029'])

    if (ticker && typeof window !== 'undefined' && window.AICAPEX_CALC) {
      const traj = window.AICAPEX_CALC.computeForwardPriceTrajectory(ticker);
      if (traj && traj.length >= 2) {
        pts    = traj.map(p => p.price);
        labels = traj.map(p => p.label);
      }
    }

    if (!pts) {
      const p12 = financials.price_12mo_ago_usd;
      const p0  = financials.price_usd;
      if (p12 != null && p0 != null) {
        pts    = [p12, p0];
        labels = ['1Y ago', 'now'];
      } else {
        return "";
      }
    }

    // ---- Geometry ----
    // viewBox is 280×80 to give text room without stretch artifacts.
    // We keep preserveAspectRatio="xMidYMid meet" so labels don't get squished
    // when the card is wider than the chart's intrinsic ratio.
    const W = 280;
    const H = 80;
    const padL = 28, padR = 28;          // room for endpoint price labels
    const padTop = 14, padBottom = 18;   // room for top labels + year labels
    const plotW = W - padL - padR;
    const plotH = H - padTop - padBottom;

    const minP = Math.min.apply(null, pts);
    const maxP = Math.max.apply(null, pts);
    let span = maxP - minP;
    if (span === 0) span = Math.abs(maxP) || 1;
    // 8% headroom each side so endpoints aren't pinned to the plot edges
    const yMin = minP - span * 0.08;
    const yMax = maxP + span * 0.08;

    const xs = pts.map((_, i) => padL + (pts.length === 1 ? plotW / 2 : (i / (pts.length - 1)) * plotW));
    const ys = pts.map(v => padTop + plotH - ((v - yMin) / (yMax - yMin)) * plotH);

    const d = xs.map((x, i) => (i === 0 ? "M" : "L") + x.toFixed(1) + "," + ys[i].toFixed(1)).join(" ");

    const lastUp = pts[pts.length - 1] >= pts[0];
    const stroke = color || (lastUp ? "#51cf66" : "#ff6b6b");
    const fillCol = lastUp ? "rgba(81,207,102,0.12)" : "rgba(255,107,107,0.12)";

    // Area path closes back to the plot baseline (not the SVG bottom — keeps
    // the fill out of the label band).
    const baseY = padTop + plotH;
    const areaD = d +
                  ' L ' + xs[xs.length - 1].toFixed(1) + ',' + baseY.toFixed(1) +
                  ' L ' + xs[0].toFixed(1) + ',' + baseY.toFixed(1) + ' Z';

    // Anchor dots — every plotted point gets one (each is a real annual anchor)
    let dots = '';
    for (let i = 0; i < pts.length; i++) {
      const isEdge = (i === 0 || i === pts.length - 1);
      dots += '<circle cx="' + xs[i].toFixed(1) + '" cy="' + ys[i].toFixed(1) +
              '" r="' + (isEdge ? '3' : '2.4') +
              '" fill="' + stroke + '" stroke="#131722" stroke-width="1.2"/>';
    }

    // Endpoint price labels: small text above each endpoint dot
    const startPriceY = Math.max(10, ys[0] - 8);
    const endPriceY   = Math.max(10, ys[ys.length - 1] - 8);
    const startPrice = fmtPriceCompact(pts[0]);
    const endPrice   = fmtPriceCompact(pts[pts.length - 1]);
    const priceLabelEls =
      '<text x="' + xs[0].toFixed(1) + '" y="' + startPriceY.toFixed(1) +
        '" text-anchor="middle" font-size="11" font-weight="500" fill="rgba(255,255,255,0.65)" font-family="-apple-system, Segoe UI, Roboto, sans-serif">' + startPrice + '</text>' +
      '<text x="' + xs[xs.length - 1].toFixed(1) + '" y="' + endPriceY.toFixed(1) +
        '" text-anchor="middle" font-size="12" font-weight="700" fill="' + stroke + '" font-family="-apple-system, Segoe UI, Roboto, sans-serif">' + endPrice + '</text>';

    // Year labels along the bottom, centered under each anchor
    let labelEls = '';
    const labelY = H - 5;
    for (let i = 0; i < pts.length; i++) {
      const lab = labels[i];
      if (!lab) continue;
      let anchor = 'middle';
      if (i === 0) anchor = 'start';
      if (i === pts.length - 1) anchor = 'end';
      const dx = (i === 0) ? -3 : (i === pts.length - 1) ? 3 : 0;
      labelEls += '<text x="' + (xs[i] + dx).toFixed(1) + '" y="' + labelY +
                  '" text-anchor="' + anchor + '" font-size="10" fill="rgba(255,255,255,0.5)" font-family="-apple-system, Segoe UI, Roboto, sans-serif">' +
                  lab + '</text>';
    }

    // Faint baseline at the current-price level so the eye can see where
    // the line crosses today's value vs. projected forward.
    const baseline =
      '<line x1="' + padL + '" y1="' + ys[0].toFixed(1) +
      '" x2="' + (W - padR) + '" y2="' + ys[0].toFixed(1) +
      '" stroke="rgba(255,255,255,0.08)" stroke-width="0.8" stroke-dasharray="2,3"/>';

    return (
      '<svg class="sparkline" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">' +
        baseline +
        '<path d="' + areaD + '" fill="' + fillCol + '" stroke="none"/>' +
        '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>' +
        dots +
        priceLabelEls +
        labelEls +
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

      buildSparkline(t.financials, null, t) +

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
