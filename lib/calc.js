// ============================================================
// aiCAPEX — Calls page math (FCR + helpers)
// Pure functions. Tests in browser console:
//   AICAPEX_CALC.computeTheoreticalFlow(stocks.tickers.NVDA, 2026)
// ============================================================

const AICAPEX_CALC = (function () {
  // ---- Calling thresholds ----
  // Internal semantic keys stay 'underrated|priced|overrated|watching'.
  // Display labels are configurable (see CALL_LABELS) for liability framing.
  const FCR_THRESHOLDS = { underrated: 1.5, overrated: 0.7 };

  const CALL_LABELS = {
    underrated: "Higher conviction",
    priced:     "Priced",
    overrated:  "Lower conviction",
    watching:   "Watching"
  };

  const CALL_COLORS = {
    underrated: "#51cf66",
    priced:     "#8a93a6",
    overrated:  "#ff6b6b",
    watching:   "#ffd43b"
  };

  // ---- Core computations ----

  // Theoretical 2026 capex flow attributable to a ticker = Σ over segments
  // (segment_2026_spend × supplier_share_2026)
  function computeTheoreticalFlow(ticker, year) {
    year = year || 2026;
    if (!ticker || !ticker.segment_exposures) return 0;
    return ticker.segment_exposures.reduce((sum, exp) => {
      const segSpend = window.AICAPEX.segmentSpendForYear(year, exp.segment);
      return sum + segSpend * (exp.share_2026 || 0);
    }, 0);
  }

  function computeImpliedGrowth(financials) {
    if (!financials) return null;
    const fwd = financials.fwd_revenue_2026_b;
    const ttm = financials.ttm_revenue_b;
    if (fwd == null || ttm == null) return null;
    return fwd - ttm;
  }

  function computeFCR(ticker, year) {
    const flow = computeTheoreticalFlow(ticker, year || 2026);
    const growth = computeImpliedGrowth(ticker.financials);
    if (growth == null) return null;
    if (growth <= 0.01) return Infinity;  // Avoid div-by-zero
    return flow / growth;
  }

  function deriveAutoCall(fcr) {
    if (fcr == null) return "watching";
    if (!isFinite(fcr)) return "underrated"; // very-positive flow vs flat consensus
    if (fcr >= FCR_THRESHOLDS.underrated) return "underrated";
    if (fcr <  FCR_THRESHOLDS.overrated)  return "overrated";
    return "priced";
  }

  function oneYearReturn(financials) {
    if (!financials) return null;
    const p0 = financials.price_12mo_ago_usd;
    const p1 = financials.price_usd;
    if (!p0 || !p1) return null;
    return (p1 - p0) / p0;
  }

  // ---- Modeled fair-price + % upside ----
  // Methodology:
  //   Excess_Flow         = Theoretical_Flow − Implied_Growth
  //   Excess_Revenue_2026 = Excess_Flow × conversion_factor (κ)
  //   pct_upside          = Excess_Revenue_2026 / Consensus_FWD_Revenue
  //   Fair_Price          = current_price × (1 + pct_upside)
  // κ defaults to 0.4 if not set per-ticker.
  // Assumes same multiple — no P/E expansion is modeled.
  function defaultKappa(ticker) {
    // Heuristic default when conversion_factor is missing. Owner can override
    // by setting financials.conversion_factor on the ticker.
    return 0.4;
  }

  function computeModeledUpside(ticker, year) {
    year = year || 2026;
    const f = ticker.financials;
    if (!f) return null;
    const flow = computeTheoreticalFlow(ticker, year);
    const growth = computeImpliedGrowth(f);
    const consensus = f.fwd_revenue_2026_b;
    if (consensus == null || consensus <= 0 || growth == null) return null;
    const excess = flow - growth;
    const kappa = (f.conversion_factor != null) ? f.conversion_factor : defaultKappa(ticker);
    const excess_revenue = excess * kappa;
    const pct_upside = excess_revenue / consensus;
    return {
      excess_flow_b:    excess,
      conversion:       kappa,
      excess_revenue_b: excess_revenue,
      pct_upside:       pct_upside
    };
  }

  function computeFairPrice(ticker, year) {
    const f = ticker.financials;
    if (!f || f.price_usd == null) return null;
    const u = computeModeledUpside(ticker, year);
    if (!u) return null;
    return {
      fair_price:  f.price_usd * (1 + u.pct_upside),
      pct_upside:  u.pct_upside,
      conversion:  u.conversion
    };
  }

  // ---- Roll-up sanity check ----
  // For acceptance criterion #5: Σ supplier flow per segment ≈ segment total
  function reconcileSegmentRollup(stocksData, year) {
    year = year || 2026;
    const tickers = stocksData.tickers || {};
    const totalsPerSegment = {};
    Object.values(tickers).forEach(t => {
      (t.segment_exposures || []).forEach(e => {
        totalsPerSegment[e.segment] = (totalsPerSegment[e.segment] || 0)
          + window.AICAPEX.segmentSpendForYear(year, e.segment) * (e.share_2026 || 0);
      });
    });
    const result = [];
    Object.keys(totalsPerSegment).forEach(seg => {
      const segTotal = window.AICAPEX.segmentSpendForYear(year, seg);
      const trackedTotal = totalsPerSegment[seg];
      result.push({
        segment: seg,
        segment_total_b: segTotal,
        tracked_supplier_total_b: trackedTotal,
        coverage_pct: segTotal > 0 ? trackedTotal / segTotal : 0
      });
    });
    return result.sort((a, b) => b.segment_total_b - a.segment_total_b);
  }

  // ---- Convenience: full augmented ticker object for rendering ----
  function augment(ticker, year) {
    year = year || 2026;
    const flow = computeTheoreticalFlow(ticker, year);
    const growth = computeImpliedGrowth(ticker.financials);
    const fcr = computeFCR(ticker, year);
    const autoCall = deriveAutoCall(fcr);
    const yr = oneYearReturn(ticker.financials);
    const manualCall = ticker.thesis && ticker.thesis.call;
    const upside = computeModeledUpside(ticker, year);
    const fair = computeFairPrice(ticker, year);
    return {
      ...ticker,
      computed: {
        theoretical_flow_b: flow,
        implied_growth_b:   growth,
        fcr:                fcr,
        auto_call:          autoCall,
        effective_call:     manualCall || autoCall,
        call_source:        manualCall ? "author" : "auto",
        one_year_return:    yr,
        excess_flow_b:      upside ? upside.excess_flow_b : null,
        conversion_factor:  upside ? upside.conversion : null,
        excess_revenue_b:   upside ? upside.excess_revenue_b : null,
        pct_upside:         upside ? upside.pct_upside : null,
        fair_price:         fair  ? fair.fair_price  : null
      }
    };
  }

  return {
    FCR_THRESHOLDS,
    CALL_LABELS,
    CALL_COLORS,
    computeTheoreticalFlow,
    computeImpliedGrowth,
    computeFCR,
    deriveAutoCall,
    oneYearReturn,
    computeModeledUpside,
    computeFairPrice,
    reconcileSegmentRollup,
    augment
  };
})();

if (typeof window !== 'undefined') {
  window.AICAPEX_CALC = AICAPEX_CALC;
}
