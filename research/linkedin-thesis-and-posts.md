**File:** linkedin-thesis-and-posts.md
**Supersedes:** v1 (6 Sep 2026)
**Status:** PROPOSED
**Changes:** v2. §3 voice rules replaced with the SMBai copy standard. §4 all six posts rewritten with moment openers and concrete landings. §5 hook variants replaced. §7 channel added.

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

These are the SMBai copy standard applied to a post. Where an earlier draft of this file said otherwise, this section wins.

- Open on a specific moment: a date, a place, a number on a screen. Never on a thesis and never on a question.
- One idea per post.
- Land on something concrete: an event, a number, a thing that happened. Never on a lesson.
- The contrast cadence ("X does this. It does not do that.") gets one use per post at most, where it does the most work. The thesis line is that construction, so a post that carries the thesis line carries no other.
- The source goes in the same sentence as the figure. Credibility on this topic comes from Google, the IEA, Epoch AI, and peer-reviewed papers, never from opinion.
- No em dashes. No banned vocabulary (streamline, empower, unlock, leverage as a verb, seamless, robust, transform, journey, solutions, harness). No first-person plural. No emoji, no hashtags in the body.
- Sentences under 25 words by default. Numbers as digits.
- Every post names the next post in one short line at the end, after the concrete landing.
- Do not post the 2030 scenario grid. It is inferred, it invites nitpicking, and it dilutes the thesis.

## 4. The series

Six posts. Post 0 carries the thesis. Posts 1 to 4 each take one of the four "gigawatt" numbers from the brief and the misunderstanding attached to it. Post 5 closes with the signals that would change the conclusion. One a week, same weekday. Each fits LinkedIn's 3,000-character limit with the moment inside the first two lines.

### Post 0. The thesis

May 19, 2026. Google I/O. Sundar Pichai puts one number on the screen: 3.2 quadrillion tokens a month, up from 480 trillion a year earlier. Nine months before that, Google's own engineers had published the other number. A median Gemini prompt used 0.24 watt-hours, 33 times less than the year before.

Both numbers are Google's. Put them side by side and the AI power debate gets simple.

Per answer, the energy keeps falling. Chips gain about 1.4x a year in work per watt, per Epoch AI. Algorithms gain about 3x a year for a fixed capability, per a November 2025 MIT FutureTech paper. Serving software adds more on top of a chip over its life. Call it 3x to 6x a year, all in.

Per company, the volume rises faster. Google's tokens went up 6.7x. Reasoning models use 10x to 100x more tokens per task than the models they replaced. Frontier training power doubles every year, per Epoch AI.

Divide 7x volume by 5x efficiency and you get about 1.4x. The IEA measured AI datacenter electricity growing 50% in 2025. Same number.

Efficiency decides how much intelligence a gigawatt buys. It does not decide how many gigawatts get built.

Microsoft added another gigawatt of capacity in the quarter ending June 2026.

Next week: the four different "gigawatt" numbers in the headlines, and why most of the pipeline is not real.

### Post 1. Requested versus built

August 3, 2026. The governor of Texas pauses approval of new large grid connections. Behind the pause: 474 gigawatts of datacenter requests in ERCOT's queue. Approved to energize: about 9. Peak draw from every large load actually running: 3.9.

Twenty months earlier the queue was 63 gigawatts.

Texas is loud and typical. Utilities across the country report five to ten times more connection requests than datacenters that get built, because the same project files in several states and is counted in each. Grid Strategies, which reads utility filings for a living, puts datacenter growth through 2030 at about 65 gigawatts against the 90 the utilities forecast, and says in its own report that the forecasts double-count. A review of Southeast utility plans by London Economics found that meeting them would take about 90% of global chip supply.

When a gigawatt number lands in a headline, it is one of four things: requested, energized, actually drawn, or new generation the grid must build. They differ by an order of magnitude. Efficiency moves the last three. It does nothing to the first, and the first is the one in the headline.

The 474 came with an audit attached: roughly 200 gigawatts of applications, more than twice the state's record peak.

Next week: the number the grid plans around, and why nobody draws it.

### Post 2. Nameplate versus draw

April 2024, the ASPLOS conference. A Microsoft team publishes what it measured across its own GPU fleet. A training cluster leaves about 3% of its power headroom unused, because tens of thousands of chips peak in lockstep. An inference cluster leaves about 21%, because requests arrive at random and average out.

Then they used it. Their framework put 30% more inference servers into existing clusters with no new power feed.

The rest of the industry runs the same physics without using it. Datacenters draw about 67% of the power they contract for, per PG&E data analyzed by E3, and take years after energization to climb toward full load. The grid plans for 100.

Google has run its fleet at 25% oversubscription for years, with priority capping that trims low-priority work in the rare hours it matters. Meta's version, published in 2016, added 8% and saved what Meta described as hundreds of millions of dollars.

None of this changes the energy a token needs. It changes how many tokens come out of each energized megawatt, which to a utility is the same thing as a smaller connection.

Three or four operators have taken the gain. The other several hundred have not.

Next week: how a 25x chip becomes a 35% chip once someone measures it.

### Post 3. Vendor claims versus measurement

March 18, 2024. GTC keynote. Jensen Huang says the new Blackwell rack uses 25 times less energy per inference than the Hopper it replaces. The footnote says what was compared.

FP4 arithmetic on a liquid-cooled 72-GPU rack, against FP8 on air-cooled 8-GPU servers over InfiniBand, at one latency target. About 2x of the 25 is the number format. Most of the rest is the rack, the cooling, and the interconnect. The silicon is a fraction.

In January 2026 the University of Michigan's ML.ENERGY group measured 46 models across 1,858 configurations on the two chips at the same precision. Median energy saving per token: 35%. SemiAnalysis's InferenceMAX benchmark, using FP4 on the newer chip, found about 3x tokens per megawatt. AMD's own accounting runs the same way: a 38x gain from 2020 to 2025 measured at node level, restated as 4x against a 2024 baseline once measured at rack level.

Across 170 chips, the long-run trend for work per watt is about 1.4x a year, per Epoch AI. That is the number to compound. The rest of the headline multiple is a step that gets taken once.

The 25x slide is still on NVIDIA's product page, footnote included.

Next week: the largest lever on new power generation is a scheduling decision.

### Post 4. Flexibility versus new generation

May 3, 2025, Phoenix. A utility calls a peak event. A 256-GPU cluster running Oracle workloads cuts its power 25% for three hours. Every job finishes inside its service level. The utilities were APS and SRP, the operator was Emerald AI, and the paper is on arXiv.

Three months earlier, Duke University's Nicholas Institute had modeled the same idea at grid scale. Curtail datacenters 0.25% of hours a year and the existing US grid absorbs 76 gigawatts of new load with no new plants. Curtail 0.5% and it is 98. Curtail 1%, about 85 hours a year in two-hour events, and it is 126.

For scale: GE Vernova's gas turbine backlog is 116 gigawatts, with delivery slots sold through 2029.

Chips and models decide how much energy a token needs. Flexibility decides how much new generation a datacenter needs. The second number is larger, it is available now, and it belongs to whoever schedules the workload.

Google now has 1 gigawatt of demand response written into power purchase agreements with five utilities, announced March 2026.

Next week: the three signals that would change this whole argument.

### Post 5. What would change the conclusion

March 6, 2026. Bloomberg reports that Oracle and OpenAI have capped their Abilene site near 2 gigawatts, citing financing and shifting demand forecasts. That is the kind of event this series has been waiting for, and on its own it is not enough.

Efficiency starts cutting gigawatts, rather than multiplying output, on the day the marginal AI token stops being worth its cost. Three things would show that day has arrived.

Token prices fall and volume does not follow. So far every price cut has pulled more than proportional volume. DeepSeek halved its API prices in September 2025. Google's token volume rose 6.7x over the following year.

Fleet utilization drops. Goldman Sachs expects datacenter occupancy to peak above 95% in late 2026 and ease from 2027. Easing because of oversupply, rather than efficiency, would be the first real evidence of saturation. Abilene is one data point.

A forecaster cuts a 2030 number. Every revision in 2026 went up. BloombergNEF's US figure rose from 106 gigawatts to 194 in eight months. EPRI's range rose 60%. S&P's rose from 134 to 183. The first cut from the IEA, Lawrence Berkeley, or EPRI is the market saying efficiency has begun to outrun volume.

None of the three has happened. Planning assumption until one does: energy per token falls 3x to 6x a year, volume rises 5x to 7x, net AI power grows about 1.5x, and turbines decide the rest.

## 5. Opener variants for Post 0

Use one. The others work as a repost or a comment a week later.

- May 19, 2026. Google I/O. The number on the screen is 3.2 quadrillion tokens a month.
- August 21, 2025. Google publishes the energy cost of one Gemini prompt: 0.24 watt-hours, 33 times less than a year earlier. Its electricity use rose anyway.
- Quarter ending June 2026. Microsoft adds a gigawatt of datacenter capacity, the same quarter it reports Copilot throughput up 4x since January.

## 6. Figures that need a primary-source check before their post goes out

These figures came from search extracts of the primary document rather than the document itself, because the primary hosts were unreachable during research. Check each against the named source before the post that carries it is published.

| Figure | Used in | Source to check |
|---|---|---|
| ERCOT queue 474 GW, Aug 2026; ~9 GW approved; 3.9 GW observed peak; 63 GW at end-2024; ~200 GW audit | Post 1 | ERCOT large-load update; Utility Dive; Texas Tribune, Aug 2026 |
| E3/PG&E 67% of nameplate | Post 2 | E3 white paper, Dec 2025 |
| Microsoft 3% training / 21% inference headroom; 30% more servers | Post 2 | Patel, Choukse et al., ASPLOS 2024 (full text was read; confirm the 30% figure) |
| ML.ENERGY 35% median, 46 models, 1,858 configs | Post 3 | arXiv 2601.22076 |
| Duke 76 / 98 / 126 GW at 0.25 / 0.5 / 1% | Post 4 | Nicholas Institute, Rethinking Load Growth, Feb 2025 |
| Google 1 GW demand response, five utilities | Post 4 | Google blog, Mar 2026 |
| BNEF 106 to 194 GW; EPRI +60%; S&P 134 to 183 GW | Post 5 | BNEF Aug 2026; EPRI Feb 2026; S&P Jun 2026 |

Dates used as openers also need confirming against the primary: GTC keynote March 18, 2024; ASPLOS 2024 in April; Emerald AI Phoenix event May 3, 2025; Texas pause August 3, 2026; Bloomberg Abilene report March 6, 2026; Google I/O May 19, 2026.

## 7. Channel

Post from Michael's profile, not the company page, until the company page has an audience. This is the SMBai copy standard's rule and it settles the channel question in the handoff.
