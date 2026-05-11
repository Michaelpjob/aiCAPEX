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
    return {
      ...ticker,
      computed: {
        theoretical_flow_b: flow,
        implied_growth_b:   growth,
        fcr:                fcr,
        auto_call:          autoCall,
        effective_call:     manualCall || autoCall,
        call_source:        manualCall ? "author" : "auto",
        one_year_return:    yr
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
    reconcileSegmentRollup,
    augment
  };
})();

if (typeof window !== 'undefined') {
  window.AICAPEX_CALC = AICAPEX_CALC;
}
