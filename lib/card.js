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

  // Sparkline modes (priority):
  //   1. price_history (real series — Phase 2 future)
  //   2. Forward trajectory: current_price (year Y0) → projected fair prices Y0+1..Y0+3
  //      Derived from theoretical capex flow growth applied to today's fair-value
  //      baseline. The Y0 anchor is the actual current price; the discontinuity
  //      between Y0 and Y0+1 visually represents the modeled re-rating.
  //   3. Legacy 2-anchor fallback: price_12mo_ago_usd → price_usd (kept only as
  //      a defensive fallback when forward trajectory cannot be computed)
  function buildSparkline(financials, color, ticker) {
    if (!financials) return "";
    const history = financials.price_history;

    let pts;        // numeric series (smoothed + interpolated)
    let anchorIdx;  // indices into pts that are the "real" year anchors
    let labels;     // labels under each anchor (year strings or short tags)

    if (Array.isArray(history) && history.length >= 2) {
      pts = history.slice();
      anchorIdx = [0, pts.length - 1];
      labels = ['', ''];
    } else if (ticker && typeof window !== 'undefined' && window.AICAPEX_CALC) {
      // Forward projection mode
      const traj = window.AICAPEX_CALC.computeForwardPriceTrajectory(ticker);
      if (traj && traj.length >= 2) {
        pts = [];
        anchorIdx = [];
        labels = [];
        // Wiggle gives the line a faintly organic look; deterministic per index.
        const wiggle = (i) => 1 + 0.006 * Math.sin(i * 1.7) * Math.cos(i * 0.6);
        for (let i = 0; i < traj.length - 1; i++) {
          anchorIdx.push(pts.length);
          labels.push(traj[i].label);
          pts.push(traj[i].price);
          // 11 interpolated monthly points between this anchor and the next
          for (let m = 1; m < 12; m++) {
            const t = m / 12;
            const interp = traj[i].price + (traj[i + 1].price - traj[i].price) * t;
            pts.push(interp * wiggle(pts.length));
          }
        }
        anchorIdx.push(pts.length);
        labels.push(traj[traj.length - 1].label);
        pts.push(traj[traj.length - 1].price);
      }
    }

    // Fallback if forward trajectory not computable
    if (!pts) {
      const p12 = financials.price_12mo_ago_usd;
      const p0  = financials.price_usd;
      if (p12 != null && p0 != null) {
        pts = [p12, p0];
        anchorIdx = [0, 1];
        labels = ['1Y', ''];
      } else {
        return "";
      }
    }

    const w = 200, h = 40, pad = 2;
    const min = Math.min(...pts), max = Math.max(...pts);
    const range = (max - min) || Math.abs(max) || 1;
    const xs = pts.map((_, i) => pad + (i / (pts.length - 1)) * (w - 2 * pad));
    const ys = pts.map(v => h - pad - 4 - ((v - min) / range) * (h - 2 * pad - 8));
    const d = xs.map((x, i) => (i === 0 ? "M" : "L") + x.toFixed(1) + "," + ys[i].toFixed(1)).join(" ");
    const lastUp = pts[pts.length - 1] >= pts[0];
    const stroke = color || (lastUp ? "#51cf66" : "#ff6b6b");
    const fill = lastUp ? "rgba(81,207,102,0.10)" : "rgba(255,107,107,0.10)";

    // Build area-fill underneath for a richer look
    const areaD = d + ' L ' + xs[xs.length - 1].toFixed(1) + ',' + (h - pad).toFixed(1) +
                       ' L ' + xs[0].toFixed(1) + ',' + (h - pad).toFixed(1) + ' Z';

    let dots = '';
    anchorIdx.forEach((idx, n) => {
      const isLast = n === anchorIdx.length - 1;
      dots += '<circle cx="' + xs[idx].toFixed(1) + '" cy="' + ys[idx].toFixed(1) + '" r="' +
              (isLast ? '2.6' : '1.8') + '" fill="' + stroke + '" stroke="var(--panel,#131722)" stroke-width="0.8"/>';
    });

    // Time labels under the anchors
    let labelEls = '';
    anchorIdx.forEach((idx, n) => {
      const lab = labels[n];
      if (!lab) return;
      labelEls += '<text x="' + xs[idx].toFixed(1) + '" y="' + (h - 0.5).toFixed(1) +
                  '" text-anchor="middle" font-size="6.5" fill="rgba(255,255,255,0.45)" font-family="-apple-system, Segoe UI, Roboto, sans-serif">' +
                  lab + '</text>';
    });

    return (
      '<svg class="sparkline" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' +
        '<path d="' + areaD + '" fill="' + fill + '" stroke="none"/>' +
        '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>' +
        dots +
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
