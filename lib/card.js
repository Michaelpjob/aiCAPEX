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

  // Forward-projection mini-chart with dual layers:
  //   - PRICE LINE in the top zone (green/red, scaled to price min/max)
  //   - THEORETICAL FLOW bars in the bottom zone (orange, anchored at baseline)
  // Both share the X axis (annual anchors 2026..2029). Each annual point on
  // the price line is a real projected value; each bar is the theoretical
  // capex flow attributable to that ticker that year.
  function fmtPriceCompact(v) {
    if (v == null) return '';
    if (v >= 10000) return '$' + (v / 1000).toFixed(1) + 'K';
    if (v >= 1000)  return '$' + (v / 1000).toFixed(2) + 'K';
    if (v >= 100)   return '$' + Math.round(v);
    return '$' + v.toFixed(1);
  }

  function fmtFlowCompact(v) {
    if (v == null) return '';
    if (v >= 1000) return '$' + (v / 1000).toFixed(1) + 'T';
    if (v >= 1)    return '$' + Math.round(v) + 'B';
    return '$' + (v * 1000).toFixed(0) + 'M';
  }

  function buildSparkline(financials, color, ticker) {
    if (!financials) return "";

    let pts;     // price points per year
    let flows;   // theoretical flow per year (parallel to pts)
    let labels;  // year labels (parallel to pts)

    if (ticker && typeof window !== 'undefined' && window.AICAPEX_CALC) {
      const traj = window.AICAPEX_CALC.computeForwardPriceTrajectory(ticker);
      if (traj && traj.length >= 2) {
        pts    = traj.map(p => p.price);
        flows  = traj.map(p => p.flow_b);
        labels = traj.map(p => p.label);
      }
    }

    // Fallback: no forward trajectory available — degrade to 2-point line
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

    // ---- Geometry: stacked layout ----
    //   padTop  | price-label band (above line)
    //   line zone (price line + dots)
    //   gap     | thin divider
    //   bar zone (flow bars + inside labels)
    //   padBottom (year labels)
    const W = 300;
    const H = 116;
    const padL = 30, padR = 30;
    const padTop = 14;
    const padBottom = 16;
    const innerH = H - padTop - padBottom;       // 86
    const lineZone = 44;
    const gap = 4;
    const barZone = innerH - lineZone - gap;     // 38
    const lineTop = padTop;
    const lineBottom = padTop + lineZone;
    const barTop = lineBottom + gap;
    const barBottom = H - padBottom;
    const plotW = W - padL - padR;               // 240

    const minP = Math.min.apply(null, pts);
    const maxP = Math.max.apply(null, pts);
    let pSpan = maxP - minP;
    if (pSpan === 0) pSpan = Math.abs(maxP) || 1;
    const yMin = minP - pSpan * 0.10;
    const yMax = maxP + pSpan * 0.10;
    const yPriceScale = (v) => lineBottom - ((v - yMin) / (yMax - yMin)) * lineZone;

    const xs = pts.map((_, i) =>
      padL + (pts.length === 1 ? plotW / 2 : (i / (pts.length - 1)) * plotW)
    );
    const lineYs = pts.map(yPriceScale);

    const lastUp = pts[pts.length - 1] >= pts[0];
    const stroke = color || (lastUp ? "#51cf66" : "#ff6b6b");

    // ---- Inception reference line (dashed horizontal at the called-at price) ----
    // Only shown when the card has inception data AND the inception price differs
    // materially from the current price. Helps visualize "I called this at $X,
    // it's now at $Y, model says $Z."
    let inceptionEls = '';
    if (ticker && ticker.financials && ticker.financials.inception_price_usd != null) {
      const ipx = ticker.financials.inception_price_usd;
      const cpx = ticker.financials.price_usd;
      const gap = (cpx && cpx > 0) ? Math.abs(ipx - cpx) / cpx : 0;
      if (gap > 0.005) {
        const yI = yPriceScale(ipx);
        // Only draw if it falls within (or just outside) the line zone
        if (yI >= padTop - 3 && yI <= lineBottom + 3) {
          inceptionEls =
            '<line x1="' + padL + '" y1="' + yI.toFixed(1) +
            '" x2="' + (W - padR) + '" y2="' + yI.toFixed(1) +
            '" stroke="rgba(255,255,255,0.28)" stroke-width="0.8" stroke-dasharray="3,3"/>' +
            '<text x="' + (padL + 4) + '" y="' + (yI - 3).toFixed(1) +
            '" font-size="9" fill="rgba(255,255,255,0.55)" font-family="-apple-system, Segoe UI, Roboto, sans-serif">' +
            'called ' + fmtPriceCompact(ipx) + '</text>';
        }
      }
    }

    // ---- Flow bars (orange, ambient background to the price line) ----
    let barEls = '';
    if (flows && flows.length === pts.length) {
      const maxFlow = Math.max.apply(null, flows);
      const colW = plotW / pts.length;
      const barW = Math.min(56, colW * 0.62);
      for (let i = 0; i < flows.length; i++) {
        const ratio = (maxFlow > 0) ? (flows[i] / maxFlow) : 0;
        const barH  = Math.max(8, ratio * (barZone - 2));
        const yBar  = barBottom - barH;
        const xBar  = xs[i] - barW / 2;
        barEls +=
          '<rect x="' + xBar.toFixed(1) +
          '" y="' + yBar.toFixed(1) +
          '" width="' + barW.toFixed(1) +
          '" height="' + barH.toFixed(1) +
          '" fill="rgba(255,140,66,0.20)" stroke="rgba(255,140,66,0.55)" stroke-width="0.7" rx="2" />';
        // Flow value label inside the bar at top, only if bar is tall enough
        if (barH >= 14) {
          barEls +=
            '<text x="' + xs[i].toFixed(1) +
            '" y="' + (yBar + 11).toFixed(1) +
            '" text-anchor="middle" font-size="10" font-weight="700" fill="rgba(255,184,118,1)"' +
            ' font-family="-apple-system, Segoe UI, Roboto, sans-serif">' +
            fmtFlowCompact(flows[i]) + '</text>';
        }
      }
    }

    // ---- Price line ----
    const d = xs.map((x, i) => (i === 0 ? "M" : "L") + x.toFixed(1) + "," + lineYs[i].toFixed(1)).join(" ");

    let dots = '';
    for (let i = 0; i < pts.length; i++) {
      const isEdge = (i === 0 || i === pts.length - 1);
      dots +=
        '<circle cx="' + xs[i].toFixed(1) + '" cy="' + lineYs[i].toFixed(1) +
        '" r="' + (isEdge ? '3' : '2.4') +
        '" fill="' + stroke + '" stroke="#131722" stroke-width="1.2"/>';
    }

    // Endpoint price labels (above the line)
    const startLY = Math.max(10, lineYs[0] - 8);
    const endLY   = Math.max(10, lineYs[lineYs.length - 1] - 8);
    const priceLabelEls =
      '<text x="' + xs[0].toFixed(1) + '" y="' + startLY.toFixed(1) +
        '" text-anchor="middle" font-size="11" font-weight="500" fill="rgba(255,255,255,0.65)" font-family="-apple-system, Segoe UI, Roboto, sans-serif">' +
        fmtPriceCompact(pts[0]) + '</text>' +
      '<text x="' + xs[xs.length - 1].toFixed(1) + '" y="' + endLY.toFixed(1) +
        '" text-anchor="middle" font-size="12" font-weight="700" fill="' + stroke + '" font-family="-apple-system, Segoe UI, Roboto, sans-serif">' +
        fmtPriceCompact(pts[pts.length - 1]) + '</text>';

    // Year labels at the bottom — edge-anchored so they never clip
    let yearLabelEls = '';
    const yearY = H - 4;
    for (let i = 0; i < pts.length; i++) {
      const lab = labels[i];
      if (!lab) continue;
      let anchor = 'middle';
      if (i === 0) anchor = 'start';
      if (i === pts.length - 1) anchor = 'end';
      const dx = (i === 0) ? -2 : (i === pts.length - 1) ? 2 : 0;
      yearLabelEls +=
        '<text x="' + (xs[i] + dx).toFixed(1) + '" y="' + yearY +
        '" text-anchor="' + anchor +
        '" font-size="10" fill="rgba(255,255,255,0.55)" font-family="-apple-system, Segoe UI, Roboto, sans-serif">' +
        lab + '</text>';
    }

    // Thin divider between line zone and bar zone
    const divider =
      '<line x1="' + padL + '" y1="' + (lineBottom + gap / 2).toFixed(1) +
      '" x2="' + (W - padR) + '" y2="' + (lineBottom + gap / 2).toFixed(1) +
      '" stroke="rgba(255,255,255,0.05)" stroke-width="0.6" />';

    return (
      '<svg class="sparkline" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">' +
        barEls +
        divider +
        inceptionEls +
        '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>' +
        dots +
        priceLabelEls +
        yearLabelEls +
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

    // "Since inception" change — prefer this over YoY when inception data is set.
    // This is the track-record: what % the stock has moved since the call was made.
    const inceptPx   = t.financials && t.financials.inception_price_usd;
    const inceptDate = t.financials && t.financials.inception_date;
    const curPx      = t.financials && t.financials.price_usd;
    let inceptReturn = null;
    if (inceptPx && curPx) inceptReturn = (curPx - inceptPx) / inceptPx;
    const inceptCls   = (inceptReturn != null && inceptReturn < 0) ? 'down' : 'up';
    const inceptArrow = (inceptReturn != null && inceptReturn < 0) ? '↓' : (inceptReturn != null ? '↑' : '');
    const inceptDateShort = inceptDate ? inceptDate.slice(5).replace('-', '/') : ''; // "MM/DD"
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
          (inceptReturn != null
            ? '<span class="yoy ' + inceptCls + '" title="Change since I called this on ' + (inceptDate || '') + ' at ' + fmtPrice(inceptPx, t.currency) + '">' + inceptArrow + ' ' + fmtPct(inceptReturn) + ' since ' + inceptDateShort + '</span>'
            : (yr != null ? '<span class="yoy ' + yrCls + '">' + yrArrow + ' ' + fmtPct(yr) + '</span>' : '')) +
        '</div>' +
        '<div class="metric"><span class="lbl" title="Flow Coverage Ratio = Theoretical 2026 CapEx Flow / Implied Revenue Growth Increment">FCR</span><span class="val fcr">' + fmtFcr(c.fcr) + '</span></div>' +
        '<div class="metric"><span class="lbl">Theoretical 2026 Flow</span><span class="val flow">' + fmtUsdB(c.theoretical_flow_b) + '</span></div>' +
      '</div>' +

      fairBlock +

      (hasFinancials ? (
        '<div class="chart-legend">' +
          '<span class="leg-item"><span class="leg-line"></span>Price target</span>' +
          '<span class="leg-item"><span class="leg-bar"></span>Theoretical flow ($B)</span>' +
        '</div>'
      ) : '') +
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
