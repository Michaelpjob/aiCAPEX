**File:** linkedin-thesis-and-posts.md
**Supersedes:** none
**Status:** PROPOSED
**Changes:** v1. First issue.

# LinkedIn thesis and post series: AI efficiency and the gigawatt number

Source: `datacenter-efficiency-vs-power-demand.md` (the brief). Every figure below is taken from the brief and carries the brief's label: measured, estimated, or inferred. Only measured and estimated figures appear in the posts. The inferred 2030 scenario grid stays out of public posts on purpose.

---

## 1. The thesis

One line, said the same way every time:

> Efficiency decides how much intelligence a gigawatt buys. It does not decide how many gigawatts get built.

The longer form, for a profile headline or the top of an article:

> AI energy per answer is falling 3x to 6x a year. AI energy in total is rising 50% a year. Both are true, and the gap between them is the whole story of datacenter power demand.

Why it works: it contradicts both camps. The "efficiency will save us" reader and the "AI will eat the grid" reader are each half right. A thesis people can argue with gets shared. A summary gets scrolled past.

## 2. The three-beat structure

Every post in the series is built on the same three beats, in the same order.

1. **The per-token gain.** Energy per AI answer fell 33x in one year at Google, to 0.24 Wh. Measured, and faster than any forecaster assumed.
2. **The volume growth.** Google's token volume rose 6.7x over the following year. Reasoning models use 10x to 100x more tokens per task. Frontier training power doubles every year.
3. **The residual.** Volume divided by efficiency is about 1.5x. The IEA measured AI datacenter electricity growing 50% in 2025. Same number.

Then the reframe: the number that caps the buildout is turbines, transformers, and interconnection. Gas turbine slots are sold out to 2029. Texas has approved about 9 GW of a 474 GW request queue.

## 3. Voice rules for the series

- Lead with the number. The source goes in the same sentence as the figure. Credibility on this topic comes from citing Google, the IEA, Epoch AI, and peer-reviewed papers, never from opinion.
- One idea per sentence. No em dashes. No "not X but Y" constructions. No emoji, no hashtags in the body.
- End each post with the reframe. Never end with a question to the audience.
- Every post names the next post, so the series reads as a series.
- Do not post the 2030 scenario grid. It is inferred, it invites nitpicking, and it dilutes the thesis.

## 4. The series

Six posts. Post 0 carries the thesis. Posts 1 to 4 each take one of the four "gigawatt" numbers from the brief and the misunderstanding attached to it. Post 5 closes with the signals that would change the conclusion. Suggested cadence: one a week, same weekday. Each is written to fit LinkedIn's 3,000-character limit with the hook inside the first two lines.

### Post 0. The thesis

Google cut the energy per AI prompt 33x in one year. Its AI electricity use went up anyway.

That is the whole story of AI power demand, and almost everyone tells half of it.

The per-token numbers are real. Google measured a median Gemini text prompt at 0.24 watt-hours in 2025, a 33x drop from a year earlier. Independent estimates from Epoch AI, Microsoft Research, and the University of Michigan converge on about 0.3 watt-hours per frontier query. Chips improve about 1.4x a year in performance per watt. Algorithms improve about 3x a year for a fixed level of capability. Stack them and the energy per answer falls 3x to 6x every year.

The volume numbers are bigger. Google's monthly token volume rose 6.7x in the year to May 2026, to 3.2 quadrillion. Reasoning models use 10x to 100x more tokens per task than the models they replaced. Frontier training power doubles every year, per Epoch AI.

Divide 7x volume by 5x efficiency and you get 1.4x. The IEA measured AI-focused datacenter electricity growing 50% in 2025. It is the same number. Nothing is mysterious about it.

So efficiency is doing exactly what it should. It decides how much intelligence a gigawatt buys. It does not decide how many gigawatts get built. Capital, demand, and the supply chain decide that.

Next week: there are four different "gigawatt" numbers in circulation, and most of the pipeline is phantom load.

### Post 1. Requested versus built

Texas has 474 gigawatts of datacenter connection requests in its queue. It has approved about 9.

That gap is the most misread number in the AI power debate.

ERCOT's large-load queue went from 63 GW at the end of 2024 to 474 GW in August 2026. The observed peak from all large loads actually running is 3.9 GW. In August the governor paused new approvals pending an audit of roughly 200 GW of applications, more than twice the state's record peak demand.

Texas is the loud case, and it is typical. Utilities report five to ten times more connection requests than datacenters that get built. The same project files in several jurisdictions and gets counted in each. Grid Strategies, which reads utility filings for a living, puts datacenter growth through 2030 at about 65 GW against the 90 GW utilities are forecasting, and warns in its own report about double-counting. A review of Southeast utility plans found that meeting them would require about 90% of global chip supply.

When you read a gigawatt headline, ask which of four numbers it is: requested, energized, actually drawn, or new generation needed. They differ by an order of magnitude and they respond to completely different levers. Efficiency touches the last three. It does nothing to the first, and the first is the one in the headlines.

Next week: the number the grid is planning around, and why nobody draws it.

### Post 2. Nameplate versus draw

Datacenters draw about 67% of the power they contract for. The grid plans for 100%.

That 33% is the cheapest capacity in the country, and the operators who know how to use it are already doing so.

The 67% figure comes from PG&E data analysed by E3, and facilities take years after energization to climb toward full load. Underneath it is a physics problem Microsoft described in a 2024 ASPLOS paper: a training cluster offers about 3% power headroom because tens of thousands of GPUs peak in lockstep, but an inference cluster offers about 21% because requests arrive at random and average out. Their framework put 30% more inference servers into existing clusters with no new power.

Google has run its fleet at 25% oversubscription for years, with priority-aware capping that trims low-priority work in the rare hours it matters. Meta's version, from 2016, added 8% and saved, in their words, hundreds of millions of dollars.

None of this reduces the energy a token needs. It raises the useful output per energized megawatt, which for a utility is the same thing as a smaller interconnection. The largest three or four operators have taken these gains. Most of the market has not.

Next week: how a 25x chip becomes a 35% chip once someone measures it.

### Post 3. Vendor claims versus measurement

NVIDIA says its Blackwell rack uses 25x less energy per inference than the Hopper it replaced. Independent measurement says 35% to 3x.

Both numbers are honest. They measure different things, and the footnote is where the difference lives.

The 25x compares FP4 arithmetic on a liquid-cooled 72-GPU rack against FP8 on air-cooled 8-GPU servers over InfiniBand, at one latency target. About 2x of it is the number format. Most of the rest is the rack, the cooling, and the interconnect. The silicon itself accounts for a fraction.

The University of Michigan's ML.ENERGY group measured 46 models across 1,858 configurations on H100 and B200 at the same precision. Median energy saving per token: 35%. SemiAnalysis's InferenceMAX benchmark, using FP4 on the newer chip, found about 3x tokens per megawatt. AMD's own accounting tells the same story: a 38x gain 2020 to 2025 at node level, restated as 4x against a 2024 baseline once measured at rack level.

The long-run trend for accelerator performance per watt, across 170 chips, is about 1.4x a year, per Epoch AI. That is fast. It is also the number a planner should compound, because the rest of the headline multiple is a one-time step that gets taken once.

Next week: the largest lever on new power generation is a scheduling decision, and a chipmaker does not own it.

### Post 4. Flexibility versus new generation

If US datacenters agreed to cut power 1% of the hours in a year, the existing grid could absorb 126 gigawatts of them with no new plants.

That is a Duke University finding from February 2025, and the industry has spent 2025 and 2026 proving it works.

Duke's Nicholas Institute modelled balancing areas covering 95% of US load. Curtail 0.25% of hours and the headroom is 76 GW. Curtail 0.5% and it is 98 GW. Curtail 1%, about 85 hours a year in two-hour events, and it is 126 GW. For comparison, GE Vernova's gas turbine backlog is 116 GW, with delivery slots sold through 2029.

The demonstrations followed. Emerald AI and EPRI ran a 256-GPU Oracle cluster in Phoenix through utility peak events, cutting power 25% for three hours while every job finished inside its service level. Google now has one gigawatt of demand response written into power purchase agreements with five utilities.

Chips and models decide how much energy a token needs. Flexibility decides how much new generation a datacenter needs. The second lever is larger, it is available today, and it belongs to whoever schedules the workload, which is the operator, and the operator's software.

Next week: the three signals that would make me change this thesis.

### Post 5. What would change the conclusion

Efficiency starts cutting gigawatts, rather than multiplying output, on the day the marginal AI token stops being worth its cost. Three observable signals would tell us that day has arrived. None has fired.

First, token prices fall and volume does not respond. So far every price cut has been met with more than proportional volume. DeepSeek halved its API prices in September 2025. Google's token volume rose 6.7x over the following year.

Second, fleet utilization drops. Goldman Sachs expects datacenter occupancy to peak above 95% in late 2026 and ease from 2027. If it eases because of oversupply rather than efficiency, that is the first real evidence of saturation. Oracle and OpenAI capping their Abilene site near 2 GW in March 2026, citing financing and shifting demand forecasts, is the kind of event to watch for.

Third, a forecaster cuts a 2030 number. Every revision in 2026 went up. BloombergNEF's US number rose from 106 GW to 194 GW in eight months. EPRI's range rose 60%. S&P's rose from 134 GW to 183 GW. The first cut from the IEA, Lawrence Berkeley, or EPRI will be the market saying efficiency has begun to outrun volume.

Until then the planning assumption is simple. Energy per token falls 3x to 6x a year. Volume rises 5x to 7x. Net AI power grows about 1.5x. The supply chain, and only the supply chain, decides how far above that the buildout can run.

The efficiency story is the best story in the industry. It is a story about how much intelligence a gigawatt buys.

## 5. Hook variants for Post 0

Use one. Test the others as reposts or comments.

- Google cut the energy per AI prompt 33x in one year. Its electricity use went up anyway.
- AI energy per answer falls 5x a year. AI energy in total rises 50% a year. Both are true.
- The IEA measured AI datacenter power growing 50% in 2025. Here is the arithmetic that produces exactly that number.

## 6. Figures that need a primary-source check before their post goes out

These figures came from search extracts of the primary document rather than the document itself, because the primary hosts were unreachable during research. Check each against the named source before the post that carries it is published.

| Figure | Used in | Source to check |
|---|---|---|
| ERCOT queue 474 GW, Aug 2026; ~9 GW approved; 3.9 GW observed peak | Post 1 | ERCOT large-load update; Utility Dive; Texas Tribune, Aug 2026 |
| E3/PG&E 67% of nameplate | Post 2 | E3 white paper, Dec 2025 |
| Microsoft 3% training / 21% inference headroom; 30% more servers | Post 2 | Patel, Choukse et al., ASPLOS 2024 (full text was read; confirm the 30% figure) |
| ML.ENERGY 35% median, 46 models, 1,858 configs | Post 3 | arXiv 2601.22076 |
| Duke 76 / 98 / 126 GW at 0.25 / 0.5 / 1% | Post 4 | Nicholas Institute, Rethinking Load Growth, Feb 2025 |
| Google 1 GW demand response, five utilities | Post 4 | Google blog, Mar 2026 |
| BNEF 106 to 194 GW; EPRI +60%; S&P 134 to 183 GW | Post 5 | BNEF Aug 2026; EPRI Feb 2026; S&P Jun 2026 |
