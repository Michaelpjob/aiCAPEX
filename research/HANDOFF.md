# Datacenter efficiency research: handoff for the next session

**Who this is for:** a Claude Code session run by Michael Job (michael.job.gb@gmail.com), picking this work up in the `Michaelpjob/aiCAPEX` repo. Michael owns the decisions; you own the verification, the edits, and the rebuilds. Nothing in this folder has been posted anywhere or linked from the site.

**Your job, in order of value:** verify the flagged figures against primary sources, correct the brief and the posts where a figure moves, rebuild the page, and keep the labels honest. Do not draft new sections, do not post to LinkedIn, and do not change the site's index page unless Michael asks in this session.

---

## 1. What is in this folder

| File | What it is | State |
| --- | --- | --- |
| `datacenter-efficiency-vs-power-demand.md` | The brief. Source of truth. Full source list at the end. | PROPOSED v1, 6 Sep 2026 |
| `datacenter-efficiency-vs-power-demand.html` | The brief as a standalone dark-palette page with two inline-SVG charts. | Generated. Never edit by hand; rebuild it. |
| `build_page.py` | Generates the HTML from the markdown. | Run after any edit to the brief. |
| `linkedin-thesis-and-posts.md` | The one-line thesis, three-beat structure, voice rules, six drafted posts, the verification list (section 6), and the channel. | PROPOSED v3 |
| `HANDOFF.md` | This file. | n/a |

Published copy of the page: https://claude.ai/code/artifact/d8cb7836-43a4-4c39-a464-f5a5a5b5edd8 (private artifact owned by Michael).

## 2. The argument, so you can judge whether an edit breaks it

1. Energy per AI answer falls 3x to 6x a year. Hardware perf/W about 1.4x (Epoch AI), algorithms about 3x for fixed capability (arXiv 2511.23455), serving software 1.5x to 4x per chip over its life, plus one-time steps (FP4, MoE, distillation, liquid cooling, oversubscription). Google measured 33x in one year (arXiv 2508.15734).
2. Volume rises faster. Google tokens 6.7x year on year to 3.2 quadrillion a month (I/O, May 2026). Reasoning models use 10x to 100x more tokens per task. Frontier training power doubles annually (Epoch, 2.1x).
3. The residual is about 1.5x a year. The IEA measured AI-focused datacenter electricity growing 50% in 2025. Same number.
4. Supply caps the buildout: turbine slots sold to 2029, transformer lead times to five years, ERCOT approving about 9 GW of 474 GW requested. Efficiency sets what a gigawatt buys. It does not set how many get built.

If a verified figure changes one of these four lines, say so to Michael before editing the executive summary. A figure that changes a table cell without changing a line above is yours to fix directly.

## 3. Labels, and the rule that follows from them

Every figure in the brief is labelled **measured** (company-reported or peer-reviewed), **estimated** (analyst projection or vendor claim), or **inferred** (our own arithmetic). Vendor performance claims are always estimated, never measured. The 2030 scenario grid and the supply ceiling in section 5 are inferred from a 15-20 GW US AI base, itself inferred from Epoch AI's ~30 GW global figure.

The rule: inferred figures may appear in the brief with their label. They may not appear in a LinkedIn post. If you touch the posts, keep them to measured and estimated figures only.

## 4. The verification job

The research session's egress proxy blocked most primary hosts (epoch.ai, iea.org, arxiv.org, nvidia.com, lbl.gov, bnef.com, rand.org, and others). Figures from those sources were taken from search-engine extracts of the primary page plus secondary coverage. They are probably right and have not been confirmed.

Work through `linkedin-thesis-and-posts.md` section 6 first. It lists the seven figures that carry the posts, each with the source to open. For each one:

1. Fetch the primary document named in the table. If your session can reach it, read the figure in context, including the definition and date.
2. If it matches, leave the text and note the confirmation in the brief's Confidence and caveats section by moving the item from Medium to High confidence.
3. If it differs, change the figure in the brief, in the posts file, and in `build_page.py` if it is one of the chart values (chart data is hard-coded in the two chart functions). Then update the brief's header `Changes:` line by section, in the form `§5 table: ERCOT queue 474 GW corrected to 461 GW per ERCOT Aug 2026 update.`
4. If the primary is still unreachable, leave the figure and leave its label. Do not upgrade confidence on the strength of a second secondary source.

After section 6, the brief's Confidence and caveats section lists the remaining items: the Vera Rubin NVL72 rack power conflict (130 kW vs 230 kW), HBM energy per bit, Microsoft's 2026 capex, and the combined hyperscaler capex tally. Resolve them the same way if you can. The Epoch training-power figure is 2.1x per year; a 2.3x figure appears in some secondary coverage and is wrong.

## 5. Rebuilding the page

```
pip install --quiet markdown
python3 research/build_page.py
```

The script strips the four-line document header at the top of the markdown, converts the body with the tables extension, wraps it in the dark palette, splices Figure 1 after the first table in section 5 and Figure 2 after the second, and writes the HTML beside the markdown. If you add or remove a table in section 5, the splice points move; check the figures land under the right tables. The page was screenshot-checked once at 1200 px wide in the light theme; the two charts are the parts worth looking at after a rebuild.

To republish the artifact at the same URL, pass the URL above as `url` to the Artifact tool with the HTML file, after removing the `<!doctype>`, `<html>`, `<head>`, and `<body>` wrappers and the three `<meta>` tags. The footer line should stay as it is.

## 6. Copy rules

The posts follow the SMBai copy standard, summarized in section 3 of the posts file. The parts that matter most when editing: no em dashes anywhere, including table cells (use `n/a`); the contrast cadence ("X does this. It does not do that.") once per asset at most; no banned vocabulary (streamline, empower, unlock, leverage as a verb, seamless, robust, transform, journey, solutions, harness); no first-person plural; sentences under 25 words; numbers as digits; source in the same sentence as the figure. A LinkedIn post opens on a specific moment written as a sentence, carries one idea, and lands on something concrete rather than a lesson. No datelines and no fragment chains; the standard's own "Tuesday, 7:04 AM. An RFP lands." example is the pattern to avoid.

## 7. Git

- Work on the branch `claude/datacenter-efficiency-research`. Do not push to `main`; a GitHub Action commits price refreshes to `main` three times a day and the site deploys from it.
- Commit in small steps with the section and the figure named in the message.
- This repo is public. Anything committed here is public on push.

## 8. Decisions that are Michael's, not yours

- Whether to merge the branch or open a pull request for it.
- Whether the brief gets a link from the aiCAPEX index page.
- When Post 0 goes out. Channel is settled: Michael's profile, not the company page.
- Whether the long-form article version of the brief gets drafted. If asked, it is a compression of the executive summary plus sections 5 and 8, at 800 to 1,200 words, in the posts file's voice.

## 9. What was not done

- No figure was verified against a primary document the proxy blocked. That is section 4.
- The index page was not changed.
- Nothing was posted.
