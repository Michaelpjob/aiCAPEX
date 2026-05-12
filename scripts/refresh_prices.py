#!/usr/bin/env python3
"""
Refresh stocks.json with latest prices from yfinance.

Updates per ticker (only these fields — manual fields like fwd_revenue_2026_b,
conversion_factor, thesis, and notes are left untouched):
    - financials.price_usd
    - financials.price_12mo_ago_usd
    - financials.price_36mo_ago_usd
    - financials.market_cap_b
    - financials.ttm_revenue_b   (best-effort from yfinance.info['totalRevenue'])
    - financials.fwd_pe          (best-effort from yfinance.info['forwardPE'])
    - financials.as_of

Safety guards:
    - Per-ticker try/except — one failure doesn't kill the whole run.
    - Sanity check: if current price would change > MAX_INTRADAY_MOVE_PCT vs
      the stored price, skip that ticker (likely a yfinance data glitch).
    - Tickers with financials == null (e.g. PNR/WTS/MWA placeholders) are
      skipped entirely.

Run locally:
    pip install yfinance
    python scripts/refresh_prices.py

Run on GitHub Actions: see .github/workflows/refresh-prices.yml
"""

import json
import datetime
import sys
from pathlib import Path

try:
    import yfinance as yf
except ImportError:
    print("ERROR: yfinance not installed. Run: pip install yfinance", file=sys.stderr)
    sys.exit(1)

# Map our internal ticker keys to the symbol yfinance understands.
# If the key matches a US ticker that yfinance accepts as-is, no entry needed.
SYMBOL_MAP = {
    "HXSCL":      "000660.KS",   # SK Hynix (KRX)
    "SSNLF":      "005930.KS",   # Samsung Electronics (KRX)
    "QUANTA_TW":  "2382.TW",     # Quanta Computer
    "WIWYNN_TW":  "6669.TW",     # Wiwynn
    "FOXCONN_TW": "2317.TW",     # Hon Hai
    "SBGSY":      "SU.PA",       # Schneider Electric (Euronext)
    "ABBNY":      "ABBN.SW",     # ABB (SIX)
    "SIEGY":      "SIE.DE",      # Siemens (XETRA)
    "LGRDY":      "LR.PA",       # Legrand (Euronext)
    "ENGGY":      "ENR.DE",      # Siemens Energy (XETRA)
    "RYCEY":      "RR.L",        # Rolls-Royce (LSE)
}

MAX_INTRADAY_MOVE_PCT = 50.0   # if price would change > 50% in one run, skip


def resolve_symbol(key: str, ticker_data: dict) -> str:
    """Return the yfinance symbol for this ticker key."""
    if key in SYMBOL_MAP:
        return SYMBOL_MAP[key]
    if ticker_data.get("native_ticker"):
        return ticker_data["native_ticker"]
    return key


def find_price_near(history_df, target_date) -> float | None:
    """Pick the closest available close price within +/- 14 days of target_date."""
    if history_df is None or history_df.empty:
        return None
    try:
        # history_df is indexed by date — find the row closest to target_date
        import pandas as pd  # yfinance brings pandas in
        target = pd.Timestamp(target_date)
        if hasattr(history_df.index, "tz"):
            try:
                target = target.tz_localize(history_df.index.tz)
            except (TypeError, AttributeError):
                pass
        idx = history_df.index.get_indexer([target], method="nearest")
        if len(idx) and idx[0] >= 0:
            return float(history_df["Close"].iloc[idx[0]])
    except Exception:
        # Fallback: just return the first close in the window
        try:
            return float(history_df["Close"].iloc[0])
        except Exception:
            return None
    return None


def refresh_one(key: str, ticker_data: dict, log: list[str]) -> bool:
    """Update one ticker in-place. Returns True if updated."""
    fin = ticker_data.get("financials")
    if not fin:
        log.append(f"  - {key}: skipped (no financials block)")
        return False

    symbol = resolve_symbol(key, ticker_data)
    today = datetime.date.today()

    try:
        tk = yf.Ticker(symbol)

        # Use a single 3y+30d window then pluck out the points we need.
        # This is one HTTP roundtrip rather than three.
        start = today - datetime.timedelta(days=365 * 3 + 30)
        end   = today + datetime.timedelta(days=1)
        hist  = tk.history(start=start.isoformat(), end=end.isoformat(), auto_adjust=True)

        if hist is None or hist.empty:
            log.append(f"  - {key} ({symbol}): no history returned")
            return False

        # Latest close as current price
        current_price = float(hist["Close"].iloc[-1])
        # Sanity guard
        prev_price = fin.get("price_usd")
        if prev_price and prev_price > 0:
            move = abs(current_price - prev_price) / prev_price
            if move > MAX_INTRADAY_MOVE_PCT / 100:
                log.append(
                    f"  - {key} ({symbol}): sanity-skip "
                    f"(stored ${prev_price:.2f} -> live ${current_price:.2f}, "
                    f"move {move*100:.1f}% > {MAX_INTRADAY_MOVE_PCT}%)"
                )
                return False

        # 12-mo-ago and 36-mo-ago closes
        p12 = find_price_near(hist, today - datetime.timedelta(days=365))
        p36 = find_price_near(hist, today - datetime.timedelta(days=365 * 3))

        # Info fields (market cap, TTM rev, fwd PE)
        info = {}
        try:
            info = tk.info or {}
        except Exception:
            info = {}

        market_cap = info.get("marketCap")
        ttm_rev    = info.get("totalRevenue")  # in dollars (or native cur)
        fwd_pe     = info.get("forwardPE")

        # Write back
        fin["price_usd"] = round(current_price, 2)
        if p12 is not None:
            fin["price_12mo_ago_usd"] = round(p12, 2)
        if p36 is not None:
            fin["price_36mo_ago_usd"] = round(p36, 2)
        if market_cap:
            fin["market_cap_b"] = round(market_cap / 1e9, 2)
        if ttm_rev:
            fin["ttm_revenue_b"] = round(ttm_rev / 1e9, 2)
        if fwd_pe and 0 < fwd_pe < 500:
            fin["fwd_pe"] = round(fwd_pe, 1)
        fin["as_of"] = today.isoformat()

        log.append(
            f"  - {key} ({symbol}): ${current_price:.2f}  "
            f"(mkt cap ${(market_cap/1e9 if market_cap else 0):.1f}B)"
        )
        return True

    except Exception as e:
        log.append(f"  - {key} ({symbol}): ERROR {type(e).__name__}: {e}")
        return False


def main():
    repo_root = Path(__file__).resolve().parent.parent
    stocks_path = repo_root / "stocks.json"
    if not stocks_path.exists():
        print(f"ERROR: {stocks_path} not found", file=sys.stderr)
        sys.exit(1)

    data = json.loads(stocks_path.read_text(encoding="utf-8"))
    tickers = data.get("tickers", {})

    print(f"Refreshing {len(tickers)} tickers from yfinance...")
    log = []
    updated = 0
    for key, td in tickers.items():
        if refresh_one(key, td, log):
            updated += 1

    today = datetime.date.today().isoformat()
    data["last_updated"] = today

    stocks_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")

    print("\n".join(log))
    print(f"\nUpdated {updated}/{len(tickers)} tickers. last_updated = {today}")


if __name__ == "__main__":
    main()
