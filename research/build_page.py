import re, math, markdown, html

import os
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "datacenter-efficiency-vs-power-demand.md")
OUT = os.path.join(HERE, "datacenter-efficiency-vs-power-demand.html")

md = open(SRC).read()
md = re.sub(r"^\*\*File:\*\*.*?\n\n", "", md, count=1, flags=re.S)  # drop document header block
# Strip the H1 + subtitle + prep line: rendered in the hero instead
lines = md.split("\n")
title = lines[0].lstrip("# ").strip()
subtitle = lines[2].strip().strip("*")
body_md = "\n".join(lines[3:])
body_md = re.sub(r"^Research brief\. Prepared.*?\n", "", body_md, count=1, flags=re.M)
body_md = re.sub(r"^\s*---\s*$", "", body_md, flags=re.M)  # drop hr's; sections carry the rhythm

body = markdown.markdown(body_md, extensions=["tables"])

# Wrap tables for horizontal scroll
body = body.replace("<table>", '<div class="tablewrap"><table>').replace("</table>", "</table></div>")
# Section ids for h2
def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
body = re.sub(r"<h2>(.*?)</h2>", lambda m: f'<h2 id="{slug(html.unescape(re.sub("<.*?>","",m.group(1))))}">{m.group(1)}</h2>', body)

# ---------- Chart 1: annual multipliers on a log axis ----------
def chart_multipliers():
    W, H = 720, 250
    L, R, T = 210, 40, 36
    rowh = 40
    rows = [
        ("Token volume, Google", 6.7, 6.7, "growth", "6.7x year on year, May 2025 to May 2026 (measured)"),
        ("Per-token efficiency", 3.0, 6.0, "eff", "3x to 6x per year at fixed output quality (estimated)"),
        ("Net inference energy", 1.2, 2.3, "net", "1.2x to 2.3x per year, tokens divided by efficiency (inferred)"),
        ("AI datacenter electricity", 1.5, 1.5, "meas", "1.5x in 2025, IEA (measured)"),
    ]
    plotw = W - L - R
    def x(v): return L + (math.log10(v) / 1.0) * plotw
    out = [f'<svg class="chart" viewBox="0 0 {W} {H}" role="img" aria-labelledby="c1t" font-family="var(--mono)">',
           '<title id="c1t">Annual multipliers: token growth against per-token efficiency, log scale</title>']
    # grid
    for v in [1, 1.5, 2, 3, 5, 7, 10]:
        xx = x(v)
        out.append(f'<line x1="{xx:.1f}" y1="{T-8}" x2="{xx:.1f}" y2="{T+rowh*len(rows)}" class="grid"/>')
        out.append(f'<text x="{xx:.1f}" y="{T+rowh*len(rows)+18}" class="tick" text-anchor="middle">{v}x</text>')
    out.append(f'<text x="{L}" y="{T-16}" class="axlabel">Multiplier per year (log scale)</text>')
    for i, (label, lo, hi, cls, tip) in enumerate(rows):
        cy = T + rowh * i + rowh / 2
        out.append(f'<text x="{L-12}" y="{cy+4}" class="rowlabel" text-anchor="end">{label}</text>')
        x0, x1 = x(lo), x(hi)
        if lo == hi:
            out.append(f'<g class="mark {cls}" data-tip="{html.escape(tip)}"><circle cx="{x0:.1f}" cy="{cy}" r="7"/><rect x="{x0-14:.1f}" y="{cy-16}" width="28" height="32" class="hit"/></g>')
            out.append(f'<text x="{x0+14:.1f}" y="{cy+4}" class="val">{lo:g}x</text>')
        else:
            out.append(f'<g class="mark {cls}" data-tip="{html.escape(tip)}"><rect x="{x0:.1f}" y="{cy-9}" width="{x1-x0:.1f}" height="18" rx="4"/><rect x="{x0-4:.1f}" y="{cy-16}" width="{x1-x0+8:.1f}" height="32" class="hit"/></g>')
            out.append(f'<text x="{x0-8:.1f}" y="{cy+4}" class="val" text-anchor="end">{lo:g}x</text>')
            out.append(f'<text x="{x1+8:.1f}" y="{cy+4}" class="val">{hi:g}x</text>')
    out.append("</svg>")
    return "\n".join(out)

# ---------- Chart 2: 2030 US AI GW scenarios vs supply ceiling ----------
def chart_scenarios():
    W, H = 720, 240
    L, R, T = 210, 40, 36
    rowh = 40
    plotw = W - L - R
    vmax = 280
    def x(v): return L + v / vmax * plotw
    rows = [
        ("1.3x net growth", 65, "eff", "About 65 GW. Efficiency outruns volume. Reads like Grid Strategies' 65 GW and the LBNL reference case."),
        ("1.5x net growth", 135, "net", "About 135 GW. The 2025 observed rate. Reads like Epoch's ~100 GW trend and Anthropic's 50 GW by 2028."),
        ("1.7x net growth", 250, "growth", "About 250 GW. The pipeline-tracker world: RAND 327 GW global, BNEF 194 GW by 2035."),
    ]
    out = [f'<svg class="chart" viewBox="0 0 {W} {H}" role="img" aria-labelledby="c2t" font-family="var(--mono)">',
           '<title id="c2t">US AI datacenter capacity in 2030 under three net growth rates, against the supply-chain ceiling</title>']
    # ceiling band
    out.append(f'<g class="mark ceil" data-tip="Supply ceiling, roughly 100 to 140 GW: turbine backlogs to 2029, five-year transformer lead times, ERCOT approving about 9 GW of 474 GW requested (inferred)"><rect x="{x(100):.1f}" y="{T-8}" width="{x(140)-x(100):.1f}" height="{rowh*len(rows)+8}" class="band"/><rect x="{x(100):.1f}" y="{T-8}" width="{x(140)-x(100):.1f}" height="{rowh*len(rows)+8}" class="hit"/></g>')
    out.append(f'<text x="{x(120):.1f}" y="{T-14}" class="axlabel" text-anchor="middle">supply ceiling</text>')
    for v in [0, 50, 100, 150, 200, 250]:
        xx = x(v)
        out.append(f'<line x1="{xx:.1f}" y1="{T-8}" x2="{xx:.1f}" y2="{T+rowh*len(rows)}" class="grid"/>')
        out.append(f'<text x="{xx:.1f}" y="{T+rowh*len(rows)+18}" class="tick" text-anchor="middle">{v}</text>')
    out.append(f'<text x="{W-R}" y="{T+rowh*len(rows)+36}" class="axlabel" text-anchor="end">GW, US AI datacenters, 2030 (inferred from a 15-20 GW 2025 base)</text>')
    for i, (label, v, cls, tip) in enumerate(rows):
        cy = T + rowh * i + rowh / 2
        out.append(f'<text x="{L-12}" y="{cy+4}" class="rowlabel" text-anchor="end">{label}</text>')
        out.append(f'<g class="mark {cls}" data-tip="{html.escape(tip)}"><rect x="{x(0):.1f}" y="{cy-9}" width="{x(v)-x(0):.1f}" height="18" rx="4"/><rect x="{x(0):.1f}" y="{cy-16}" width="{x(v)-x(0)+8:.1f}" height="32" class="hit"/></g>')
        out.append(f'<text x="{x(v)+8:.1f}" y="{cy+4}" class="val">~{v} GW</text>')
    out.append("</svg>")
    return "\n".join(out)

fig1 = f'''
<figure class="fig">
  <figcaption><span class="figlabel">Figure 1</span> Volume is growing faster than efficiency is improving. The measured 1.5x is the residual.</figcaption>
  {chart_multipliers()}
  <div class="legend"><span><i class="sw growth"></i>Growth</span><span><i class="sw eff"></i>Efficiency</span><span><i class="sw net"></i>Net, inferred</span><span><i class="sw meas"></i>Measured</span></div>
</figure>'''

fig2 = f'''
<figure class="fig">
  <figcaption><span class="figlabel">Figure 2</span> The supply chain caps 2030 near the observed-growth path. The high scenario is not physically reachable.</figcaption>
  {chart_scenarios()}
  <div class="legend"><span><i class="sw eff"></i>Efficiency dominant</span><span><i class="sw net"></i>Observed rate</span><span><i class="sw growth"></i>Pipeline-tracker rate</span><span><i class="sw ceil"></i>Supply ceiling</span></div>
</figure>'''

# Splice figures: fig1 after the first net-growth table in section 5, fig2 after the scenario table
sec5 = body.index('<h2 id="5-netting-it-out')
first_table_end = body.index("</table></div>", sec5) + len("</table></div>")
body = body[:first_table_end] + fig1 + body[first_table_end:]
second_table_end = body.index("</table></div>", first_table_end + len(fig1)) + len("</table></div>")
body = body[:second_table_end] + fig2 + body[second_table_end:]

# Table of contents from h2s
tocs = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', body)
toc = "\n".join(f'<li><a href="#{i}">{re.sub("<.*?>","",t)}</a></li>' for i, t in tocs)

page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>{html.escape(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<meta name="description" content="{html.escape(subtitle)}" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root {{
    color-scheme: dark;
    --bg:        #07090d;
    --surface:   #0f141d;
    --surface-2: #141a25;
    --line:      rgba(255,255,255,0.08);
    --line-2:    rgba(255,255,255,0.14);
    --fg:        #f0f3f8;
    --fg-2:      rgba(240,243,248,0.76);
    --fg-3:      rgba(240,243,248,0.52);
    --cyan:      oklch(0.82 0.13 220);
    --cyan-soft: oklch(0.82 0.13 220 / 0.14);
    --violet-soft: oklch(0.66 0.18 295 / 0.12);
    --blue-soft: oklch(0.68 0.16 250 / 0.14);
    --s-growth:  #d95926;
    --s-eff:     #3987e5;
    --s-net:     #199e70;
    --s-meas:    #c98500;
    --s-ceil:    rgba(240,243,248,0.10);
    --s-ceil-edge: rgba(240,243,248,0.35);
    --sans: "Space Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --mono: "IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  }}
  @media (prefers-color-scheme: light) {{
    :root:not([data-theme="dark"]) {{
      color-scheme: light;
      --bg: #f5f7fa; --surface: #ffffff; --surface-2: #eef2f7;
      --line: rgba(10,16,28,0.10); --line-2: rgba(10,16,28,0.18);
      --fg: #0b1220; --fg-2: rgba(11,18,32,0.78); --fg-3: rgba(11,18,32,0.56);
      --cyan: oklch(0.55 0.13 220); --cyan-soft: oklch(0.55 0.13 220 / 0.12);
      --violet-soft: oklch(0.66 0.18 295 / 0.08); --blue-soft: oklch(0.68 0.16 250 / 0.10);
      --s-growth: #eb6834; --s-eff: #2a78d6; --s-net: #1baf7a; --s-meas: #eda100;
      --s-ceil: rgba(11,18,32,0.07); --s-ceil-edge: rgba(11,18,32,0.35);
    }}
  }}
  :root[data-theme="light"] {{
    color-scheme: light;
    --bg: #f5f7fa; --surface: #ffffff; --surface-2: #eef2f7;
    --line: rgba(10,16,28,0.10); --line-2: rgba(10,16,28,0.18);
    --fg: #0b1220; --fg-2: rgba(11,18,32,0.78); --fg-3: rgba(11,18,32,0.56);
    --cyan: oklch(0.55 0.13 220); --cyan-soft: oklch(0.55 0.13 220 / 0.12);
    --violet-soft: oklch(0.66 0.18 295 / 0.08); --blue-soft: oklch(0.68 0.16 250 / 0.10);
    --s-growth: #eb6834; --s-eff: #2a78d6; --s-net: #1baf7a; --s-meas: #eda100;
    --s-ceil: rgba(11,18,32,0.07); --s-ceil-edge: rgba(11,18,32,0.35);
  }}

  * {{ box-sizing: border-box; }}
  html, body {{ margin: 0; padding: 0; }}
  body {{
    background: var(--bg); color: var(--fg); font-family: var(--sans);
    font-size: 17px; line-height: 1.6; -webkit-font-smoothing: antialiased;
    position: relative; overflow-x: hidden;
  }}
  body::before {{
    content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      radial-gradient(900px 500px at 85% -10%, var(--violet-soft), transparent 60%),
      radial-gradient(1000px 540px at -10% 5%, var(--blue-soft), transparent 55%);
  }}
  .page {{ position: relative; z-index: 1; max-width: 1040px; margin: 0 auto; padding: 56px 24px 96px; }}

  /* Hero */
  .eyebrow {{ font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--cyan); margin: 0 0 18px; }}
  h1 {{ font-size: clamp(34px, 5vw, 56px); line-height: 1.04; letter-spacing: -0.02em; font-weight: 700; margin: 0 0 18px; max-width: 18ch; text-wrap: balance; }}
  .sub {{ font-size: 20px; line-height: 1.45; color: var(--fg-2); max-width: 60ch; margin: 0 0 12px; text-wrap: balance; }}
  .meta {{ font-family: var(--mono); font-size: 12.5px; color: var(--fg-3); margin: 0 0 40px; }}
  .meta b {{ color: var(--fg-2); font-weight: 500; }}

  .tiles {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--line-2); border: 1px solid var(--line-2); border-radius: 10px; overflow: hidden; margin: 0 0 56px; }}
  .tile {{ background: var(--surface); padding: 22px 22px 20px; }}
  .tile .n {{ font-family: var(--mono); font-size: 34px; font-weight: 600; letter-spacing: -0.02em; line-height: 1; margin: 0 0 8px; font-variant-numeric: tabular-nums; }}
  .tile .n small {{ font-size: 16px; font-weight: 500; color: var(--fg-3); margin-left: 4px; }}
  .tile .l {{ font-size: 14px; color: var(--fg-2); line-height: 1.4; margin: 0; }}
  .tile .s {{ font-family: var(--mono); font-size: 11.5px; color: var(--fg-3); margin: 8px 0 0; }}
  .tile.up .n {{ color: var(--s-growth); }}
  .tile.down .n {{ color: var(--s-eff); }}
  .tile.net .n {{ color: var(--s-net); }}

  /* Layout: body column plus TOC rail */
  .grid {{ display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 48px; align-items: start; }}
  nav.toc {{ position: sticky; top: 24px; font-size: 13px; }}
  nav.toc h4 {{ font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-3); margin: 0 0 10px; font-weight: 500; }}
  nav.toc ol {{ list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }}
  nav.toc a {{ color: var(--fg-2); text-decoration: none; display: block; padding: 3px 0 3px 10px; border-left: 2px solid var(--line); line-height: 1.35; }}
  nav.toc a:hover, nav.toc a:focus-visible {{ color: var(--fg); border-left-color: var(--cyan); outline: none; }}

  article {{ min-width: 0; }}
  article > p, article > ul, article > ol {{ max-width: 68ch; }}
  article h2 {{ font-size: 27px; line-height: 1.2; letter-spacing: -0.015em; margin: 60px 0 16px; text-wrap: balance; max-width: 30ch; }}
  article h2:first-of-type {{ margin-top: 0; }}
  article h3 {{ font-size: 19px; margin: 28px 0 10px; }}
  article p {{ margin: 0 0 18px; color: var(--fg-2); }}
  article p strong {{ color: var(--fg); font-weight: 600; }}
  article li {{ color: var(--fg-2); margin-bottom: 8px; }}
  article a {{ color: var(--cyan); text-decoration: none; border-bottom: 1px solid var(--cyan-soft); overflow-wrap: anywhere; }}
  article a:hover {{ border-bottom-color: var(--cyan); }}
  article em {{ color: var(--fg); font-style: italic; }}
  article code {{ font-family: var(--mono); font-size: 0.9em; }}

  /* Executive summary block */
  article h2#executive-summary + p {{ font-size: 20px; line-height: 1.45; color: var(--fg); }}

  /* Tables */
  .tablewrap {{ overflow-x: auto; margin: 8px 0 28px; border: 1px solid var(--line-2); border-radius: 8px; background: var(--surface); }}
  table {{ border-collapse: collapse; width: 100%; font-size: 14px; line-height: 1.4; }}
  th, td {{ padding: 10px 12px; text-align: left; vertical-align: top; border-bottom: 1px solid var(--line); }}
  th {{ font-family: var(--mono); font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--fg-3); font-weight: 500; background: var(--surface-2); white-space: nowrap; }}
  tbody tr:last-child td {{ border-bottom: 0; }}
  td {{ color: var(--fg-2); font-variant-numeric: tabular-nums; }}
  td:first-child {{ color: var(--fg); font-weight: 500; }}

  /* Figures */
  .fig {{ margin: 8px 0 36px; padding: 18px 18px 14px; border: 1px solid var(--line-2); border-radius: 8px; background: var(--surface); }}
  .fig figcaption {{ font-size: 14px; color: var(--fg-2); margin: 0 0 14px; line-height: 1.4; }}
  .figlabel {{ font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cyan); margin-right: 8px; }}
  .chart {{ width: 100%; height: auto; display: block; }}
  .chart .grid {{ stroke: var(--line); stroke-width: 1; }}
  .chart .tick, .chart .axlabel {{ fill: var(--fg-3); font-size: 11px; }}
  .chart .rowlabel {{ fill: var(--fg); font-size: 12.5px; font-family: var(--sans); }}
  .chart .val {{ fill: var(--fg-2); font-size: 11.5px; }}
  .chart .mark rect, .chart .mark circle {{ fill: var(--fg-3); }}
  .chart .mark.growth rect, .chart .mark.growth circle {{ fill: var(--s-growth); }}
  .chart .mark.eff rect, .chart .mark.eff circle {{ fill: var(--s-eff); }}
  .chart .mark.net rect, .chart .mark.net circle {{ fill: var(--s-net); }}
  .chart .mark.meas rect, .chart .mark.meas circle {{ fill: var(--s-meas); }}
  .chart .mark.ceil .band {{ fill: var(--s-ceil); stroke: var(--s-ceil-edge); stroke-dasharray: 4 3; }}
  .chart .hit {{ fill: transparent !important; stroke: none !important; cursor: default; }}
  .chart .mark:hover rect:not(.hit), .chart .mark:hover circle {{ filter: brightness(1.15); }}
  .legend {{ display: flex; flex-wrap: wrap; gap: 16px; font-family: var(--mono); font-size: 11.5px; color: var(--fg-2); margin-top: 8px; }}
  .legend span {{ display: inline-flex; align-items: center; gap: 6px; }}
  .sw {{ width: 12px; height: 12px; border-radius: 3px; display: inline-block; background: var(--fg-3); }}
  .sw.growth {{ background: var(--s-growth); }} .sw.eff {{ background: var(--s-eff); }} .sw.net {{ background: var(--s-net); }} .sw.meas {{ background: var(--s-meas); }}
  .sw.ceil {{ background: var(--s-ceil); border: 1px dashed var(--s-ceil-edge); }}
  #tip {{ position: fixed; z-index: 10; pointer-events: none; max-width: 300px; background: var(--surface-2); color: var(--fg); border: 1px solid var(--line-2); border-radius: 6px; padding: 8px 10px; font-size: 12.5px; line-height: 1.4; box-shadow: 0 8px 24px rgba(0,0,0,0.35); }}
  #tip[hidden] {{ display: none; }}

  /* Sources */
  article h2#sources ~ ul {{ font-size: 13.5px; }}
  article h2#sources ~ p strong {{ font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fg-3); }}

  footer {{ margin-top: 72px; padding-top: 20px; border-top: 1px solid var(--line); font-family: var(--mono); font-size: 12px; color: var(--fg-3); }}
  footer a {{ color: var(--fg-2); text-decoration: none; }}

  @media (max-width: 860px) {{
    .grid {{ grid-template-columns: 1fr; gap: 24px; }}
    nav.toc {{ position: static; }}
    nav.toc ol {{ grid-template-columns: 1fr 1fr; }}
    .tiles {{ grid-template-columns: 1fr; }}
    body {{ font-size: 16px; }}
  }}
  @media (prefers-reduced-motion: reduce) {{ * {{ transition: none !important; }} }}
</style>
</head>
<body>
<div class="page">
  <header>
    <p class="eyebrow">Research brief</p>
    <h1>{html.escape(title)}</h1>
    <p class="sub">{html.escape(subtitle)}</p>
    <p class="meta"><b>6 September 2026.</b> Figures are labelled measured, estimated, or inferred. Vendor performance claims are treated as estimates.</p>
    <div class="tiles">
      <div class="tile down"><p class="n">33<small>x</small></p><p class="l">Drop in energy per median Gemini text prompt in twelve months, to 0.24 Wh.</p><p class="s">Google, Aug 2025. Measured.</p></div>
      <div class="tile up"><p class="n">6.7<small>x</small></p><p class="l">Growth in Google's monthly token volume over the following year, to 3.2 quadrillion.</p><p class="s">Google I/O, May 2026. Measured.</p></div>
      <div class="tile net"><p class="n">+50<small>%</small></p><p class="l">Growth in AI-focused datacenter electricity in 2025. The residual after efficiency.</p><p class="s">IEA, Apr 2026. Measured.</p></div>
    </div>
  </header>

  <div class="grid">
    <nav class="toc" aria-label="Contents">
      <h4>Contents</h4>
      <ol>{toc}</ol>
    </nav>
    <article>
{body}
    </article>
  </div>

  <footer>Source list at the end of the brief; primary hosts that were unreachable during research are noted in the caveats. <a href="datacenter-efficiency-vs-power-demand.md">Markdown version</a>.</footer>
</div>
<div id="tip" hidden></div>
<script>
(function() {{
  var tip = document.getElementById('tip');
  function show(e) {{
    var g = e.target.closest('.mark'); if (!g) return;
    tip.textContent = g.getAttribute('data-tip'); tip.hidden = false; move(e);
  }}
  function move(e) {{
    var x = e.clientX + 14, y = e.clientY + 14;
    var r = tip.getBoundingClientRect();
    if (x + r.width > window.innerWidth - 8) x = e.clientX - r.width - 14;
    if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - 14;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }}
  document.querySelectorAll('.chart').forEach(function(svg) {{
    svg.addEventListener('mouseover', show);
    svg.addEventListener('mousemove', function(e) {{ if (!tip.hidden) move(e); }});
    svg.addEventListener('mouseout', function(e) {{ if (!e.relatedTarget || !e.relatedTarget.closest('.mark')) tip.hidden = true; }});
  }});
}})();
</script>
</body>
</html>
'''
open(OUT, "w").write(page)
print("wrote", OUT, len(page), "bytes")
