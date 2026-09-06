# Datacenter efficiency research: handoff

**Goal:** a research brief on how hardware, model, and routing efficiency gains net against AI demand growth in the gigawatt forecasts, plus a LinkedIn thesis and post series built from it.

**Who this is for:** Michael, or a Claude Code session picking the work up. Everything is in this folder of the aiCAPEX repo. The site's index page does not link to it.

---

## 1. What is in this folder

| Thing | Where | Status |
| --- | --- | --- |
| The brief, markdown source with full source list | `datacenter-efficiency-vs-power-demand.md` | PROPOSED v1, 6 Sep 2026 |
| The brief as a standalone styled page, two charts | `datacenter-efficiency-vs-power-demand.html` | built from the markdown; regenerate rather than edit |
| Published copy of the page | https://claude.ai/code/artifact/d8cb7836-43a4-4c39-a464-f5a5a5b5edd8 | private artifact, first draft |
| LinkedIn thesis, voice rules, six drafted posts, verification list | `linkedin-thesis-and-posts.md` | PROPOSED v1 |
| Page build script | `build_page.py` | run after any edit to the markdown |
| This file | `HANDOFF.md` | n/a |

## 2. The argument in four lines

1. Energy per AI answer is falling 3x to 6x a year (hardware 1.4x, algorithms ~3x, serving software 1.5x, plus one-time steps). Google measured 33x in one year.
2. Volume is rising faster: Google tokens 6.7x in a year, reasoning models 10x to 100x more tokens per task, frontier training power doubling annually.
3. The residual is about 1.5x a year, which is what the IEA measured for AI datacenter electricity in 2025.
4. The number that caps the buildout is supply: turbines sold out to 2029, transformers on five-year lead times, ERCOT approving ~9 GW of 474 GW requested. Efficiency sets what a gigawatt buys, not how many get built.

## 3. What is verified and what is not

The brief labels every figure measured, estimated, or inferred. Three things a reader picking this up should know:

- **Primary hosts were blocked during research.** epoch.ai, iea.org, arxiv.org, nvidia.com, lbl.gov, bnef.com and others could not be fetched. Figures from those sources were taken from search-engine extracts of the primary page plus secondary coverage. The brief's Confidence and caveats section lists them. The posts file, section 6, lists the seven that must be checked before their post goes out.
- **The 2030 scenario grid and the supply ceiling are inferred.** They are our arithmetic from a 15-20 GW US AI base, itself inferred from Epoch AI's ~30 GW global figure. They belong in the brief with their label. They do not belong in a LinkedIn post.
- **Known conflicts.** Vera Rubin NVL72 rack power (130 kW vs 230 kW across sources), HBM energy per bit, and the combined hyperscaler capex tally are unresolved and flagged in the brief.

## 4. How to regenerate the page

The HTML is generated from the markdown by `build_page.py` in this folder. After editing the markdown, run `python3 research/build_page.py` (needs `pip install markdown`). The script strips the four-line document header, wraps the body in a dark palette, and splices the two inline-SVG figures after the two tables in section 5. Chart data is hard-coded in the script's two chart functions; if the section 5 tables change, change the figures with them.

To republish the artifact at the same URL, publish from the session that owns it or pass the URL above as `url`. The artifact copy is the same file with the `<!doctype>`, `<html>`, `<head>`, and `<body>` wrappers removed.

## 5. Open questions for the owner

- Whether the brief gets a link from the aiCAPEX index page.
- Whether the series runs weekly or twice weekly.

## 6. What was not done

- The index page was not changed.
- No figure was verified against a primary document that the proxy blocked; see section 3.
- The long-form LinkedIn article version of the brief was not drafted. The six posts cover the thesis; the article is a straight compression of the brief's executive summary plus sections 5 and 8 if it is wanted.
