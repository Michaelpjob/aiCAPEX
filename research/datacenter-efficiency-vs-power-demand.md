**File:** datacenter-efficiency-vs-power-demand.md
**Supersedes:** none
**Status:** PROPOSED
**Changes:** v1. First issue.

# Efficiency Is Winning Per Token and Losing Per Gigawatt

*How hardware, routing, and model gains change the datacenter power number, and why none of it has bent the growth curve yet.*

Research brief. Prepared 6 September 2026. Figures are labelled **measured** (company-reported or peer-reviewed), **estimated** (analyst projection or vendor claim), or **inferred** (our own arithmetic). Vendor performance claims are treated as estimates, not measurements.

---

## Executive summary

The energy cost of a unit of AI output is collapsing faster than any forecaster's model assumes, and it does not matter for the gigawatt number. That is the finding.

Per token, the gains are real and large. Google measured a 33x drop in energy per median Gemini text prompt between May 2024 and May 2025, to 0.24 Wh. Independent academic estimates for a frontier query converged on roughly 0.3 Wh in 2025, about a tenth of the 3 Wh figure that circulated in 2023. Underneath that sit three recurring engines: accelerator performance per watt improving about 1.4x a year (Epoch AI), algorithmic efficiency improving about 3x a year for a fixed capability level (MIT FutureTech, Nov 2025), and serving software adding 1.5x to 4x on a given chip over its life (Microsoft reported a 4x Copilot throughput gain in the first seven months of 2026). Stacked, per-token energy for a fixed quality of answer falls somewhere between 3x and 6x a year in steady state, with one-time step changes on top from FP4 numerics, mixture-of-experts, distillation, liquid cooling, and power oversubscription.

Per gigawatt, none of this shows up. Google's monthly token volume went from 480 trillion in May 2025 to 3.2 quadrillion in May 2026, a 6.7x increase. Reasoning models multiply tokens per task by 10x to 100x. Frontier training power doubles every year (Epoch: 2.1x). The IEA reports AI-focused datacenter electricity grew 50% in 2025. That 1.5x is the residual: 7x volume divided by roughly 5x efficiency. Efficiency is not reducing the total. It is the reason the total grows 50% a year rather than 500%.

Every major forecast revised in 2026 went up, not down: BloombergNEF's US 2035 number rose from 106 GW to 194 GW in eight months, EPRI's 2030 range rose 60%, S&P's rose from 134 GW to 183 GW. The number that actually binds is on the supply side. Gas turbine backlogs run to 2029, transformer lead times run to five years, and ERCOT has approved about 9 GW of a 474 GW request queue. On our inferred arithmetic, US AI datacenter capacity lands at 65 GW to 135 GW in 2030 depending on whether net growth runs 1.3x or 1.5x a year. The supply chain caps it near the top of that band. Efficiency decides how much intelligence that capacity produces, not how much capacity gets built.

Efficiency only starts cutting gigawatts when demand saturates, meaning the marginal token is worth less than it costs. Watch for token prices falling without a volume response, fleet utilization dropping, and a forecaster cutting a 2030 number. As of September 2026, none of the three has happened.

---

## 1. There are four different "GW" numbers, and efficiency hits each one differently

Most of the confusion in this debate comes from conflating four quantities that all get quoted in gigawatts.

| Quantity | What it is | Rough US scale, 2026 | Which levers move it |
|---|---|---|---|
| Requested load | Interconnection queue applications | ERCOT alone: 474 GW (Aug 2026) | Queue reform, deposits, audits. Not efficiency. |
| Nameplate capacity | Energized, contracted IT power | ~54 GW total DC installed (Q1 2025, Synergy); ~15-20 GW AI (inferred) | Hardware perf/W, model efficiency, serving software |
| Actual draw | Metered average consumption | ~67% of nameplate on average (E3/PG&E) | Utilization, batching, oversubscription, power smoothing |
| New generation required | Firm capacity the grid must add | Duke study: 76-126 GW absorbable with 0.25-1% curtailment | Flexible load, demand response, batteries, geographic shifting |

Hardware and model efficiency reduce the energy per unit of output and therefore the nameplate needed for a fixed workload. Routing and utilization levers raise the useful output extracted from each energized megawatt. Grid flexibility reduces the new generation needed per energized megawatt. The question "will efficiency reduce total required GW" has a different answer for each row, and the honest answer for row two is no, for row three is partly, and for row four is yes and substantially.

---

## 2. The efficiency stack, lever by lever

The table separates recurring annual rates from one-time step changes, because the distinction decides whether a 2030 forecast should compound the gain or bank it once.

| Lever | Gain | Recurring or one-time | Evidence | Confidence |
|---|---|---|---|---|
| Accelerator perf per watt | ~1.4x per year (doubling every ~2 years) | Recurring | Epoch AI, 170+ chips; Stanford AI Index cites ~40%/yr | High (measured trend) |
| Generation jump, independently measured | B200 vs H100: median 35% less energy per token at BF16 (ML.ENERGY, Jan 2026); ~3x tokens/MW at FP4 (SemiAnalysis InferenceMAX) | Per generation | Independent | High |
| Generation jump, vendor claim | 25x (GB200 vs H100), 10x per MW (Rubin vs GB200), 35x per MW with Groq LPX | Per generation | NVIDIA marketing; bundles FP4 vs FP8, liquid cooling, 72-GPU NVLink domain | Low as stated; ~2-3x underneath |
| Low-precision numerics (FP8 to NVFP4) | ~2x throughput, 41% less energy in one microbenchmark; 3.5x smaller weights than BF16 | One-time (mostly banked 2025-2026) | NVIDIA paper, arXiv 2601.09527 | Medium |
| Algorithmic efficiency at fixed capability | ~3x per year (open-weight, hardware-price-adjusted); Epoch 2024: compute halves every ~8 months | Recurring | arXiv 2511.23455; Ho et al. 2024 | Medium-High |
| Mixture-of-experts | 2-3.5x less energy per token vs dense at same quality (30B-A3B vs 32B dense: 3.56x) | One-time architectural shift, now standard | ML.ENERGY; DeepSeek-V3 activates 5.5% of weights | High |
| Serving software on a fixed chip | 2.3x in months (TensorRT-LLM on Blackwell); 9% per MLPerf round from software alone; Microsoft Copilot throughput 4x in 7 months | Recurring but decaying per chip | Vendor and consortium | Medium |
| Continuous batching, paged KV, prefix caching | 2-4x throughput (vLLM, peer-reviewed); 60-85% cache hit rates on agent loops | One-time, now baseline | Kwon et al. 2023 | High |
| Disaggregated prefill/decode | Up to 7.4x lower cost per query at same SLO (DistServe, OSDI 2024); NVIDIA Dynamo claims up to 30x on DeepSeek-R1 | One-time, rolling out 2025-2027 | Academic plus vendor | Medium |
| Model routing to cheapest capable model | RouteLLM: 85% cost cut at 95% of GPT-4 quality; GPT-5 routes in production | One-time per fleet, no fleet-level MW measurement exists | LMSYS; OpenAI | Medium on cost, Low on GW |
| Facility PUE | Industry average 1.54 (flat six years); Google 1.09; liquid cooling takes new builds to 1.03-1.20 | One-time, already banked by hyperscalers | Uptime Institute 2025; Google | High |
| 800 VDC distribution | ~5% end-to-end power efficiency | One-time, 2027+ | NVIDIA white paper with Vertiv, Eaton, Schneider | Medium |
| Power oversubscription and capping | +8% (Meta Dynamo), +25% (Google, multi-year production), +30% servers in inference clusters (Microsoft POLCA) | One-time per fleet | Peer-reviewed, production | High |
| Rack-level power smoothing | 13% peak reduction, up to 10% more racks per MW (Vera Rubin) | One-time | Vendor | Medium |
| Optical networking | OCS fabric: 40% less power (Google Jupiter); co-packaged optics: 3.5x efficiency on a 5-10% slice of IT power | One-time, worth 3-5% of total | Google, measured; Broadcom, NVIDIA claims | High on OCS |
| Grid flexibility | 25% power cut for 3 hours with all jobs in SLA (Emerald AI/EPRI, Phoenix); Google 1 GW demand response in PPAs | Reduces new generation, not consumption | Field demonstration | High on feasibility, Low on scale |

Three things stand out.

First, the recurring engines are hardware at 1.4x and algorithms at 3x. Everything else is a one-time step. That matters because the 33x Google achieved in twelve months was mostly one-time steps taken together: MoE, distillation into Flash and Flash-Lite, speculative decoding, quantized training, larger batches, and Ironwood. Google will not do 33x again next year. A steady-state rate of 3x to 6x per year for a fixed quality of output is the defensible planning number.

Second, the vendor multiples are system claims, not silicon. NVIDIA's 25x for GB200 over H100 compares FP4 on a liquid-cooled 72-GPU NVLink rack against FP8 on air-cooled 8-GPU nodes over InfiniBand at a specific latency target. The independent number for the same generation jump is 35% to 3x depending on precision. AMD's own accounting shows the same pattern: a 38x gain 2020-2025 at the node level, restated as 4x rack-level progress against a 2024 baseline by mid-2026.

Third, rack power is going up, not down. GB200 NVL72 draws 120-132 kW, Rubin Ultra Kyber racks are specified at 600 kW for late 2027, and NVIDIA's 800 VDC roadmap targets 1 MW racks. Efficiency is per token. The buildings get hungrier.

---

## 3. What efficiency has actually delivered, measured

The per-query numbers now agree across independent sources, which they did not in 2024.

| Source | Date | Figure | Boundary |
|---|---|---|---|
| Google (arXiv 2508.15734) | Aug 2025 | 0.24 Wh median Gemini text prompt; 33x energy and 44x carbon reduction in 12 months | Full: accelerators, host CPU/DRAM, idle failover capacity, PUE 1.09 |
| Epoch AI | Feb 2025 | ~0.3 Wh typical GPT-4o query | Estimate, ~1 H100-second |
| Microsoft Research / Joule | Sep 2025, Apr 2026 | 0.31-0.34 Wh median for >200B models on H100; 8-20x further reduction in line of sight | Peer-reviewed, vendor-authored |
| Jegham et al., "How Hungry is AI?" | May 2025 | 0.42 Wh short GPT-4o query | Independent |
| OpenAI (Altman blog) | Jun 2025 | 0.34 Wh | No methodology |
| ML.ENERGY, 46 models on H100 and B200 | Jan 2026 | B200 median 35% less energy per token than H100 at BF16 | Independent, 1,858 configurations |

The counter-trend is in the same papers. Hugging Face's AI Energy Score v2 (Dec 2025) measured reasoning modes at 30x the energy of standard modes on average, with a range of 150x to 700x. Microsoft's Joule paper models a 13x per-query energy increase for outputs 15x longer. DeepSeek-R1 averaged about 4,700 output tokens per query, roughly 10x a non-reasoning model. The per-token cost is falling. The tokens per useful answer are rising faster on the workloads that are growing fastest, which are agents and reasoning.

---

## 4. The growth stack

| Driver | Rate | Source | Class |
|---|---|---|---|
| Google monthly tokens | 9.7T (Apr 2024) to 480T (May 2025) to 3.2 quadrillion (May 2026): ~50x then ~7x year on year | Pichai, I/O | Measured (company-reported) |
| OpenRouter platform tokens | ~10T/yr to >100T/yr; coding rose from 11% to >50% of tokens | a16z / OpenRouter State of AI, Jan 2026 | Measured |
| Microsoft Foundry | 1T-token annualized customers up 4x year on year; another 1 GW added in the June 2026 quarter | FY26 Q4 earnings | Measured |
| AI-focused datacenter electricity | +50% in 2025; all datacenters +17% to 485 TWh | IEA, Apr 2026 | Measured |
| Frontier training power | 2.1x per year (90% CI 1.9-2.2x); largest run 4-16 GW by 2030 | Epoch AI | Measured trend, extrapolated |
| Frontier training compute | ~4x per year, so perf/W at 1.34x/yr leaves a 2x/yr power gap | Epoch AI, arXiv 2504.16026 | Measured trend |
| Big-four hyperscaler 2026 capex | $720-745B guidance (Amazon, Alphabet, Meta, Microsoft), up from ~$600B tallies in January | Q2 2026 earnings, secondary tally | Estimated |
| Tokens per task (reasoning, agents) | 10-100x more output tokens per query | Hugging Face, arXiv 2501.18576 | Measured |

---

## 5. Netting it out: an inferred model

This section is our own arithmetic. Every input is labelled above; the combination is inferred.

Inference energy in any year equals tokens served times energy per token. Token growth at Google ran 6.7x in the year to May 2026. Per-token efficiency at a fixed quality of output is running 3x to 6x a year (hardware 1.4x, serving 1.5x, algorithms up to 3x, with algorithmic gains partly absorbed at the frontier by larger models). Divide:

| Token growth | Per-token efficiency | Net inference energy growth |
|---|---|---|
| 7x | 3x | 2.3x |
| 7x | 5x | 1.4x |
| 7x | 6x | 1.2x |

The IEA's measured 1.5x for AI-focused datacenters in 2025 sits inside that band. So does Microsoft's cadence of a gigawatt a quarter on a base that doubles every two years. The observed growth is exactly what you would predict from very fast efficiency gains running against even faster volume growth. Nothing here is mysterious and nothing here is a forecasting error.

Project that forward from an inferred base of 15-20 GW of energized US AI datacenter capacity at end-2025 (Epoch AI puts global AI datacenter power at about 30 GW in Q4 2025; the US carries the majority of it):

| Net annual growth | Multiplier 2025-2030 | US AI datacenter capacity, 2030 | Reads like |
|---|---|---|---|
| 1.3x (efficiency dominant) | 3.7x | ~65 GW | Grid Strategies' skeptical 65 GW; LBNL reference case |
| 1.5x (observed 2025) | 7.6x | ~135 GW | Epoch trend (~100 GW), S&P 183 GW total DC, Anthropic's 50 GW by 2028 |
| 1.7x (pipeline-tracker world) | 14x | ~250 GW | RAND 327 GW global; BNEF 194 GW by 2035 |

Now overlay supply. GE Vernova's gas turbine backlog reached 116 GW in Q2 2026 with slots allocated through 2029, and its production runs about 20 GW a year, rising to 30 GW by 2030. Siemens Energy carries 69 GW, Mitsubishi 35 GW. Transformer lead times run to five years. ERCOT has approved about 9 GW to energize out of 474 GW requested, and observed large-load peak is 3.9 GW. SemiAnalysis, the most bullish credible tracker, expects roughly 20 GW energized globally in 2026 and 30 GW in 2027. On those constraints, cumulative US datacenter additions through 2030 top out in the range of 120-200 GW all-in, of which AI takes perhaps 70%.

The supply ceiling therefore lands almost exactly on the 1.5x path. The 1.7x path is not physically reachable by 2030 regardless of demand. The 1.3x path requires efficiency to outrun volume, which has not happened in any measured year since 2023.

The implication is the central point of this brief. In a regime where capital is committed years ahead and demand is elastic, gigawatts are an input the industry chooses to buy. Efficiency sets the output per gigawatt. It does not reduce the gigawatts until the marginal token stops being worth buying.

---

## 6. The forecast landscape

| Source | Date | Geography | 2024/25 base | 2030 figure | Implied CAGR | Models efficiency? |
|---|---|---|---|---|---|---|
| IEA Energy and AI | Apr 2025 | Global, TWh | 415 (2024) | 945 base | ~15% | Yes, scenario-based |
| IEA Key Questions | Apr 2026 | Global, TWh | 485 (2025) | 950; AI-focused 465 | ~14% | Yes |
| Goldman Sachs | Feb 2025 | Global, GW | ~55 | 122 | 17% | Implicit |
| McKinsey | Apr 2025 | Global, GW | ~82 (2025) | 219, of which 156 AI | ~22% | Scenario range |
| RAND | Jan 2025 | Global AI, GW | n/a | 327 (68 in 2027) | ~2x/yr | PUE only; no supply constraint |
| SemiAnalysis | 2024 model | Global AI critical IT, GW | 16.4 (2025) | 56.3 (2028) | ~50% | Yes, shipment-based |
| Epoch AI | 2025-26 | Global AI, GW | ~30 (Q4 2025) | US ~100 on trend | ~2x/yr | Yes, 1.34x/yr perf/W |
| LBNL | Dec 2024 | US, TWh | 176 (2023) | 325-580 by 2028 | 13-27% | Yes; range is mostly efficiency and utilization |
| LBNL update | Jun 2026 | US, TWh | 192 (2024) | 649 (521-843) | ~22% | Yes |
| EPRI | Feb 2026 | US, TWh | 177-192 (2024) | 380-790 (9-17% of US) | 12-27% | Yes, explicit high/low efficiency |
| BloombergNEF | Aug 2026 | US, GW | ~5.9% of US load | 194 by 2035 (was 106 in Dec 2025) | n/a | No, pipeline tracker |
| S&P Global / 451 | Jun 2026 | US, GW | ~62 (2025) | 183 (was 134 in Oct 2025) | ~24% | Not stated |
| Grid Strategies | Dec 2025 | US peak, GW added | n/a | 166 total, ~90 DC; analysts see ~65 | n/a | Flags double-counting |
| Anthropic | Jul 2025 | US AI, GW | n/a | 50 by 2028 | n/a | Not stated |

Two patterns. The forecasts that model efficiency explicitly (IEA, LBNL, EPRI, Epoch) produce the lower and narrower numbers. The forecasts that count announced megawatts (BNEF, S&P, utility filings) produce the highest numbers and revise fastest, because they are counting the request queue, not energized load. Grid Strategies, which reads utility filings for a living, warns in its own report that the same project gets counted in several jurisdictions and that assumed load factors are unrealistic. Southeast utility plans were assessed by LEI for the Southern Environmental Law Center at roughly 0.2% probability, on the grounds that meeting them would consume about 90% of global chip supply.

The IEA is the cleanest case study in how efficiency enters a forecast. Between its April 2025 and April 2026 reports it raised the 2025 starting point sharply, having measured 17% growth, and left the 2030 endpoint essentially unchanged at 950 TWh. The IEA is, in effect, assuming efficiency and constraint absorb the near-term overshoot. That is a defensible position and it is also the one most exposed if the 1.5x residual persists.

---

## 7. The strongest counterargument: it happened before

Between 2010 and 2018, global datacenter compute instances rose about 6x while energy rose about 6%, from roughly 194 TWh to 205 TWh (Masanet, Shehabi, Lei, Smith, Koomey, *Science*, Feb 2020). In 1999 Mills and Huber predicted the internet would consume half of US electricity by 2008; LBNL later found the estimate overstated by about 8x. Jonathan Koomey and GridLab argued in March 2026 that current forecasts lack rigor and that compute datacenters were about 1.5% of global electricity in 2024. The IEA's own 4E review found 2030 literature spanning 200 to 8,000 TWh, a factor of 40.

This history is correct and it is the reason to distrust any single number above. But the mechanism of 2010-2018 should be read carefully before it is extrapolated. That decade's flat energy came from two one-time catch-ups: virtualization lifted server utilization from around 10% to a multiple of that, and hyperscale consolidation moved workloads from PUE 2.0 enterprise closets into PUE 1.1 facilities. Both were taken once. They are the reason Google sits at 1.09 today and cannot take the gain again.

AI's equivalent one-time catch-ups are FP4, MoE, distillation, disaggregated serving, liquid cooling, and power oversubscription. They are being banked between 2024 and 2027, and the 33x Google year is what banking them looks like. After 2027 the recurring rate reverts to roughly hardware at 1.4x times serving at 1.5x times whatever algorithmic gain the frontier does not immediately reinvest in larger models, which is 2x to 3x a year. That is still fast. It is not 33x.

The other difference is demand. Enterprise compute in 2010-2018 was serving a workload that grew with the economy. AI token volume is growing 7x a year on a product whose price falls 10x a year (a16z "LLMflation") and whose per-task consumption is rising with reasoning. The precedent tells you forecasts overshoot. It does not tell you that this one overshoots by 8x.

---

## 8. Where efficiency genuinely cuts the number

Four places, in order of how much gigawatt they are worth.

**Flexibility reduces new generation more than any chip does.** The Duke Nicholas Institute study (Feb 2025) found US balancing areas could absorb 76 GW of new load with curtailment 0.25% of hours, 98 GW at 0.5%, and 126 GW at 1%, in roughly 85 hours a year of two-hour events. Emerald AI and EPRI demonstrated a 256-GPU Oracle cluster in Phoenix cutting power 25% for three hours during utility peaks with every job finishing within its service level. Google now has 1 GW of demand response written into power purchase agreements with five utilities. Inference clusters offer about 21% cluster-level power headroom through statistical multiplexing, per Microsoft's ASPLOS 2024 paper; training clusters offer only 3% because tens of thousands of GPUs peak in lockstep. This is the lever that turns a 100 GW request into something a grid can connect without 100 GW of new turbines.

**Oversubscription and smoothing put more servers behind each energized megawatt.** Google has run 25% oversubscription in production for years. Microsoft's POLCA framework deploys 30% more inference servers in existing clusters. Rubin's rack-level energy buffering claims 10% more racks per megawatt and cuts the tens-of-megawatts power swings that synchronous training imposes on the grid, swings that xAI currently absorbs with roughly 600 MWh of Tesla Megapacks at Colossus. These are one-time gains of 10% to 30% on the nameplate-to-output ratio, well evidenced, and mostly not yet taken outside the largest three or four operators.

**Model efficiency reduces the training gigawatt more than the inference gigawatt.** DeepSeek-V3 trained for 2.8 million H800 hours, roughly $5.6M for the final run, because it activates 37B of 671B parameters. Frontier labs reinvest that gain in larger runs, which is why training power still doubles annually, but the cost per unit of capability is falling around 3x a year and the largest single-site training runs are being split across sites (Microsoft Fairwater links Atlanta and Wisconsin over 120,000 fibre miles). Splitting caps the gigawatts any one substation must serve, which is a grid-connection lever more than an energy lever.

**Routing reduces cost per query, and no one has measured whether it reduces fleet megawatts.** RouteLLM's 85% cost reduction at 95% quality is peer-reviewed. GPT-5 ships a real-time router. But every routing gain frees capacity that gets filled, and no operator has published a fleet-level MW reduction from routing. Treat routing as a margin lever, not a grid lever, until someone publishes one.

---

## 9. What would change the conclusion

Efficiency starts cutting gigawatts, rather than multiplying output, when demand saturates. Three observable signals, none of which has fired:

1. **Token prices fall without a volume response.** So far every price cut has been met with more than proportional volume: DeepSeek halved prices in September 2025 and Google's volume rose 7x in the following year.
2. **Fleet utilization drops.** Goldman expects datacenter occupancy to peak above 95% in late 2026 and moderate from 2027. If it moderates because of oversupply rather than efficiency, that is the first real evidence of saturation. Watch Oracle's delivered capacity against contracted capacity, and watch whether the Abilene pullback (Oracle and OpenAI capped the site near 2 GW in March 2026 over financing and shifting demand forecasts) becomes a pattern.
3. **A modeler cuts a 2030 number.** Every 2026 revision so far went up. The first downward revision from IEA, LBNL, or EPRI will be the market's signal that efficiency has begun to outrun volume.

Until then the planning assumption should be that per-token efficiency runs 3x to 6x a year, volume runs 5x to 7x a year, net AI power grows 1.3x to 1.5x a year, and the supply chain caps 2030 US AI capacity around 100-135 GW whatever the demand curve says. The efficiency story is real. It is a story about how much intelligence a gigawatt buys, and it is the best story in the industry. It is not a story about fewer gigawatts.

---

## Confidence and caveats

- **High confidence:** the per-token efficiency figures from Google, ML.ENERGY, Microsoft/Joule, and Epoch; the Epoch hardware trend; the IEA measured 2025 growth; the ERCOT queue and approval figures; the turbine backlogs; the Duke and Emerald AI flexibility results.
- **Medium confidence:** the 3x/yr algorithmic rate (single paper, open-weight models only); the serving-software rates (vendor-reported); the 2030 forecast table values, most of which were confirmed from search extracts rather than primary documents because the primary hosts were unreachable from this session.
- **Inferred, treat as illustrative:** the 15-20 GW US AI base, the three-scenario 2030 grid, the 120-200 GW supply ceiling, and the 70% AI share of additions.
- **Known unverified:** rack power for Vera Rubin NVL72 (sources conflict between 130 kW and 230 kW); HBM energy per bit; Microsoft's 2026 capex; the combined hyperscaler capex tally, which is a secondary-source sum.

---

## Sources

**Hardware and facility**
- Epoch AI, ML hardware energy efficiency: https://epoch.ai/data-insights/ml-hardware-energy-efficiency
- Epoch AI, Trends in ML hardware: https://epoch.ai/blog/trends-in-machine-learning-hardware
- Epoch AI, GPU share of datacenter power: https://epoch.ai/data-insights/gpus-power-usage-in-ai-data-centers
- NVIDIA GB200 NVL72: https://www.nvidia.com/en-us/data-center/gb200-nvl72/
- Cockcroft, Blackwell benchmark teardown: https://adrianco.medium.com/deep-dive-into-nvidia-blackwell-benchmarks-where-does-the-4x-training-and-30x-inference-0209f1971e71
- NVIDIA Vera Rubin (GTC 2026): https://blogs.nvidia.com/blog/vera-rubin/
- DCD, Rubin Ultra 600 kW racks: https://www.datacenterdynamics.com/en/news/nvidias-rubin-ultra-nvl576-rack-expected-to-be-600kw-coming-second-half-of-2027/
- AMD 20x by 2030 goal: https://www.amd.com/en/blogs/2025/amd-surpasses-30x25-goal-sets-ambitious-new-20x-rack-scale-energy-efficiency-target-for-ai-systems-by-2030.html
- AMD 2026 progress: https://newsroom.amd.com/news/amd-tracks-ahead-of-rack-scale-ai-energy-efficiency-goal/
- Google Ironwood: https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/ironwood-tpu-age-of-inference/
- AWS Trainium3: https://aws.amazon.com/ec2/instance-types/trn3/
- Microsoft Maia 200: https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/
- Uptime Institute 2025 survey: https://uptimeinstitute.com/about-ui/press-releases/uptimes-15th-annual-global-data-center-survey-results-shows-both-commitment-and-hesitancy
- Google PUE: https://datacenters.google/efficiency/
- NVIDIA 800 VDC: https://developer.nvidia.com/blog/nvidia-800-v-hvdc-architecture-will-power-the-next-generation-of-ai-factories/
- SemiAnalysis InferenceMAX: https://newsletter.semianalysis.com/p/inferencemax-open-source-inference
- NVFP4 energy study: https://arxiv.org/pdf/2601.09527
- ML.ENERGY, Where Do the Joules Go: https://arxiv.org/pdf/2601.22076
- Koomey's law: https://en.wikipedia.org/wiki/Koomey's_law

**Model and inference efficiency**
- Ho et al., Algorithmic progress in language models: https://arxiv.org/abs/2403.05812
- The Price of Progress (arXiv 2511.23455): https://arxiv.org/abs/2511.23455
- a16z, LLMflation: https://a16z.com/llmflation-llm-inference-cost/
- Stanford AI Index 2025: https://hai.stanford.edu/ai-index/2025-ai-index-report/research-and-development
- Epoch AI, inference price trends: https://epoch.ai/data-insights/llm-inference-price-trends
- Epoch AI, ChatGPT energy: https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use
- DeepSeek-V3 technical report: https://arxiv.org/abs/2412.19437
- DeepSeek V3.2-Exp: https://api-docs.deepseek.com/news/news250929/
- vLLM / PagedAttention: https://github.com/vllm-project/vllm
- EAGLE-3: https://arxiv.org/abs/2503.01840
- NVIDIA TensorRT-LLM DeepSeek-R1 on Blackwell: https://github.com/NVIDIA/TensorRT-LLM/blob/main/docs/source/blogs/tech_blog/blog3_Optimizing_DeepSeek_R1_Throughput_on_NVIDIA_Blackwell_GPUs.md
- MLPerf Inference v6.0: https://mlcommons.org/2026/04/mlperf-inference-v6-0-results/
- Microsoft FY26 Q4 earnings: https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4
- Google, environmental impact of AI inference: https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference and https://arxiv.org/abs/2508.15734
- Altman, The Gentle Singularity: https://blog.samaltman.com/the-gentle-singularity
- Microsoft/Joule, Energy use of AI inference: https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5
- Jegham et al., How Hungry is AI: https://arxiv.org/abs/2505.09598
- Hugging Face AI Energy Score v2: https://huggingface.co/blog/sasha/ai-energy-score-v2
- DeepSeek-R1 token usage: https://arxiv.org/abs/2501.18576
- Google I/O 2026 token volume: https://blog.google/innovation-and-ai/sundar-pichai-io-2026/
- OpenRouter State of AI: https://arxiv.org/abs/2601.10088
- Luccioni et al., Jevons in AI (FAccT 2025): https://dl.acm.org/doi/10.1145/3715275.3732007

**Routing, networking, utilization**
- RouteLLM: https://github.com/lm-sys/routellm
- OpenAI GPT-5: https://openai.com/index/introducing-gpt-5/
- Llama 3 paper (MFU): https://arxiv.org/abs/2407.21783
- Microsoft ASPLOS 2024, POLCA: https://www.microsoft.com/en-us/research/wp-content/uploads/2024/03/GPU_Power_ASPLOS_24.pdf
- Meta Dynamo (ISCA 2016): https://dl.acm.org/doi/10.1145/3007787.3001187
- Google power oversubscription: https://research.google/pubs/data-center-power-oversubscription-with-a-medium-voltage-power-plane-and-priority-aware-capping/
- E3, datacenter load forecasting: https://www.ethree.com/wp-content/uploads/2025/12/E3Whitepaper_DataCenterForecasting.pdf
- Emerald AI Phoenix demonstration: https://arxiv.org/abs/2507.00909
- Duke Nicholas Institute, Rethinking Load Growth: https://nicholasinstitute.duke.edu/publications/rethinking-load-growth
- EPRI DCFlex: https://dcflex.epri.com/
- Google 1 GW demand response: https://blog.google/innovation-and-ai/infrastructure-and-cloud/global-network/demand-response-data-center-milestone/
- Google Jupiter OCS: https://cloud.google.com/blog/topics/systems/the-evolution-of-googles-jupiter-data-center-network
- TPU v4 (OCS power share): https://arxiv.org/abs/2304.01433
- NVIDIA co-packaged optics: https://nvidianews.nvidia.com/news/nvidia-spectrum-x-co-packaged-optics-networking-switches-ai-factories
- Broadcom Tomahawk 6 Davisson: https://www.globenewswire.com/news-release/2025/10/08/3163429/19933/en/Broadcom-Announces-Tomahawk-6-Davisson-the-Industry-s-First-102-4-Tbps-Ethernet-Switch-with-Co-Packaged-Optics.html
- Microsoft MOSAIC: https://www.microsoft.com/en-us/research/blog/breaking-the-networking-wall-in-ai-infrastructure/
- Microsoft Fairwater: https://blogs.microsoft.com/blog/2025/11/12/infinite-scale-the-architecture-behind-the-azure-ai-superfactory/
- Power stabilization for AI training datacenters: https://arxiv.org/abs/2508.14318
- SemiAnalysis, load fluctuations at gigawatt scale: https://newsletter.semianalysis.com/p/ai-training-load-fluctuations-at-gigawatt-scale-risk-of-power-grid-blackout
- DistServe: https://arxiv.org/abs/2401.09670
- NVIDIA Dynamo: https://developer.nvidia.com/blog/introducing-nvidia-dynamo-a-low-latency-distributed-inference-framework-for-scaling-reasoning-ai-models
- Phantom datacenter loads: https://www.utilitydive.com/news/a-fraction-of-proposed-data-centers-will-get-built-utilities-are-wising-up/748214/

**Demand forecasts and supply constraints**
- IEA, Energy and AI (Apr 2025): https://www.iea.org/reports/energy-and-ai/executive-summary
- IEA, Key Questions on Energy and AI (Apr 2026): https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary
- IEA, 2025 datacenter electricity surge: https://www.iea.org/news/data-centre-electricity-use-surged-in-2025-even-with-tightening-bottlenecks-driving-a-scramble-for-solutions
- LBNL 2024 report: https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report_1.pdf
- LBNL 2025 update: https://eta.lbl.gov/publications/united-states-data-center-energy-2025
- EPRI 2026: https://www.globenewswire.com/news-release/2026/2/26/3245491/0/en/epri-data-centers-could-consume-up-to-17-of-u-s-electricity-by-2030.html
- Goldman Sachs: https://www.goldmansachs.com/insights/articles/ai-to-drive-165-increase-in-data-center-power-demand-by-2030
- McKinsey, The cost of compute: https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-cost-of-compute-a-7-trillion-dollar-race-to-scale-data-centers
- BloombergNEF US outlook: https://about.bnef.com/insights/data-centers/six-things-to-know-about-bnefs-new-us-data-center-capacity-outlook/ and https://www.datacenterdynamics.com/en/news/us-data-centers-to-consume-up-to-194gw-of-power-by-2035-report/
- S&P Global, Jun 2026: https://www.spglobal.com/market-intelligence/en/news-insights/articles/2026/6/s-p-webinar-data-center-power-demand-to-more-than-double-by-2030-102727689
- Grid Strategies 2025 load growth report: https://gridstrategiesllc.com/wp-content/uploads/Grid-Strategies-National-Load-Growth-Report-2025.pdf
- RAND, AI's power requirements under exponential growth: https://www.rand.org/pubs/research_reports/RRA3572-1.html
- SemiAnalysis datacenter model and 2026 rebuttal: https://semianalysis.com/datacenter-industry-model/ and https://newsletter.semianalysis.com/p/stop-saying-half-of-2026-us-datacenter
- Epoch AI, power usage trend: https://epoch.ai/data-insights/power-usage-trend and https://epoch.ai/blog/power-demands-of-frontier-ai-training
- Epoch AI, Trends in AI supercomputers: https://arxiv.org/abs/2504.16026
- Anthropic, Build AI in America: https://www.anthropic.com/news/build-ai-in-america
- OpenAI Stargate sites: https://openai.com/index/five-new-stargate-sites/
- Bloomberg, Oracle and OpenAI cap Abilene: https://www.bloomberg.com/news/articles/2026-03-06/oracle-and-openai-end-plans-to-expand-flagship-data-center
- ERCOT large-load queue and pause: https://www.utilitydive.com/news/texas-facing-438-gw-queue-approves-initial-large-load-interconnection-pro/823367/ and https://www.texastribune.org/2026/08/14/texas-data-center-approval-pause-ercot-power-grid/
- SELC / LEI Southeast load review: https://www.selc.org/press-release/new-report-exposes-inflated-load-growth-projections-from-data-centers-in-the-southeast/
- GE Vernova turbine backlog: https://www.turbomachinerymag.com/view/ge-vernova-gas-turbine-backlog-hits-116-gw-as-power-orders-more-than-double
- Siemens Energy backlog: https://www.utilitydive.com/news/siemens-gas-turbine-backlog-nears-70-gw-as-company-expands-manufacturing/827390/
- Synergy Research installed capacity: https://www.srgresearch.com/articles/the-worlds-total-data-center-capacity-is-shifting-rapidly-to-hyperscale-operators
- Masanet et al., Science 2020: https://www.science.org/doi/abs/10.1126/science.aba3758
- Koomey and GridLab, Separating fact from fiction: https://www.koomey.com/koomey_blog/new-report-out-today-separating-fact-from-fiction-in-data-center-electricity-forecasts-a-guide-for-regulators/
- IEA 4E critical review of models: https://www.iea-4e.org/wp-content/uploads/2025/05/Data-Centre-Energy-Use-Critical-Review-of-Models-and-Results.pdf
- de Vries-Gao, Joule 2025: https://www.cell.com/joule/abstract/S2542-4351(25)00142-4
