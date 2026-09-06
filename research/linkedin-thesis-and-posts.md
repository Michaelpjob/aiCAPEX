**File:** linkedin-thesis-and-posts.md
**Supersedes:** v2 (6 Sep 2026)
**Status:** PROPOSED
**Changes:** v3. §3 adds the no-fragment rule. §4 all six posts rewritten in full sentences; datelines and staccato openers removed. §5 opener variants rewritten as sentences.

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

These are the SMBai copy standard applied to a post, plus one rule the standard's own LinkedIn example gets wrong. Where an earlier draft of this file said otherwise, this section wins.

- Write in full sentences of varied length. No datelines, no fragment openers, no chains of short sentences for effect. A moment is described in a sentence, not stamped like a log entry. "Tuesday, 7:04 AM. An RFP lands." is the pattern to avoid, even though the standard cites it.
- Open on a specific moment, in prose. Never on a thesis and never on a question.
- One idea per post.
- Land on something concrete: an event, a number, a thing that happened. Never on a lesson.
- The contrast cadence ("X does this. It does not do that.") gets one use per post at most, where it does the most work. The thesis line is that construction, so a post that carries the thesis line carries no other.
- The source goes in the same sentence as the figure. Credibility on this topic comes from Google, the IEA, Epoch AI, and peer-reviewed papers, never from opinion.
- No em dashes. No banned vocabulary (streamline, empower, unlock, leverage as a verb, seamless, robust, transform, journey, solutions, harness). No first-person plural. No emoji, no hashtags in the body. First person singular is fine; these go out under Michael's name.
- Numbers as digits.
- Each post names the next post in a closing sentence, after the concrete landing.
- Do not post the 2030 scenario grid. It is inferred, it invites nitpicking, and it dilutes the thesis.

## 4. The series

Six posts. Post 0 carries the thesis. Posts 1 to 4 each take one of the four "gigawatt" numbers from the brief and the misunderstanding attached to it. Post 5 closes with the signals that would change the conclusion. One a week, same weekday. Each fits LinkedIn's 3,000-character limit with the moment inside the first two lines.

### Post 0. The thesis

When Sundar Pichai stood up at Google I/O in May and said Google was now processing 3.2 quadrillion tokens a month, the number I kept thinking about was a different one from the same company. Nine months earlier Google's engineers had published that a median Gemini prompt used 0.24 watt-hours of electricity, 33 times less than the year before.

Those two numbers are the whole AI power debate, and they come from one source.

The energy per answer keeps falling. Chips gain about 40% a year in work per watt, according to Epoch AI's tracking of 170 accelerators. Algorithms gain about 3x a year for a fixed level of capability, according to a November 2025 paper out of MIT. Serving software adds more on top of any given chip over its life. Taken together, the energy per answer at a fixed quality of output falls somewhere between 3x and 6x a year.

The volume rises faster than that. Google's tokens went up 6.7x over the same twelve months. Reasoning models use 10 to 100 times more tokens per task than the models they replaced. Frontier training runs double their power every year.

Divide 7x volume by 5x efficiency and you get 1.4x. The IEA measured AI datacenter electricity growing 50% in 2025, which is the same number arrived at from the other direction.

Efficiency decides how much intelligence a gigawatt buys. It does not decide how many gigawatts get built. Microsoft added another gigawatt in the quarter that ended in June, and that is the pattern to expect for a while.

Next week I will take apart the four different numbers that all get called gigawatts in the headlines, and why most of the pipeline is not real.

### Post 1. Requested versus built

In early August the governor of Texas paused approvals for new large connections to the grid, because the queue of datacenter requests at ERCOT had reached 474 gigawatts. Of that, about 9 gigawatts had been approved to energize, and the actual peak draw from every large load running in the state was under 4. Twenty months earlier the queue had been 63.

Texas is the loud case, and it is also the typical one. Utilities around the country are seeing five to ten times more connection requests than datacenters that get built, largely because the same project files in several states and gets counted in each of them. Grid Strategies, which reads utility filings for a living, puts datacenter load growth through 2030 at about 65 gigawatts against the 90 the utilities themselves forecast, and its own report says the difference is double counting. A review of Southeast utility plans by London Economics found that building what they describe would take roughly 90% of the world's chip supply.

So when a gigawatt figure shows up in a headline, it is worth asking which of four things it is: requested, energized, actually drawn, or new generation the grid has to build. Those differ by an order of magnitude. Efficiency improvements move the last three and do nothing to the first, and the first is the one that gets reported.

The Texas pause came with an audit of roughly 200 gigawatts of applications, which is more than twice the highest demand the state has ever recorded.

Next week: the number the grid plans around, and why almost nobody draws it.

### Post 2. Nameplate versus draw

In 2024 a team at Microsoft published what it had measured across its own GPU fleet. A training cluster leaves about 3% of its power headroom unused, because tens of thousands of chips peak at the same moment, while an inference cluster leaves about 21%, because requests arrive at random and average out. Then they used the 21%. Their scheduling framework put 30% more inference servers into existing clusters without a new power feed.

Most of the industry runs on the same physics without using it. Datacenters draw about two thirds of the power they contract for, according to PG&E data analyzed by the consultancy E3, and they take years after energization to climb toward full load. The grid, meanwhile, plans for all of it.

Google has run its fleet at 25% oversubscription for years, with priority capping that trims low-value work in the rare hours it matters. Meta published its version in 2016; it added 8% and saved what Meta described as hundreds of millions of dollars.

None of this changes how much energy a token needs. It changes how many tokens come out of each energized megawatt, which from the utility's side of the meter is the same as a smaller connection. Three or four operators have taken that gain, and the other several hundred have not.

Next week: how a chip that is 25 times better becomes 35% better once somebody measures it.

### Post 3. Vendor claims versus measurement

At the GTC keynote in March 2024, Jensen Huang said the new Blackwell rack used 25 times less energy per inference than the Hopper generation it replaced. The footnote on that slide explains what was compared: FP4 arithmetic on a liquid-cooled rack of 72 GPUs, against FP8 on air-cooled 8-GPU servers connected over InfiniBand, at a single latency target. Roughly 2x of the 25 is the change in number format. Most of the rest is the rack, the cooling, and the interconnect. The silicon itself is a fraction.

This January the ML.ENERGY group at the University of Michigan measured 46 models across 1,858 configurations on the two chips at the same precision and found a median energy saving per token of 35%. SemiAnalysis's InferenceMAX benchmark, which lets the newer chip use FP4, found about 3x more tokens per megawatt. AMD's accounting follows the same pattern, with a 38x gain from 2020 to 2025 measured at the node restated as 4x against a 2024 baseline once measured at the rack.

Across 170 accelerators, the long-run improvement in work per watt is about 40% a year, according to Epoch AI. That is the number to compound. The rest of the headline multiple is a step that gets taken once per generation, and it has mostly been taken.

The 25x slide is still on NVIDIA's product page, footnote included.

Next week: the biggest lever on new power generation is a scheduling decision, and it belongs to the operator.

### Post 4. Flexibility versus new generation

On May 3 last year a utility in Phoenix called a peak event, and a 256-GPU cluster running Oracle workloads cut its power by 25% for three hours with every job finishing inside its service level. The utilities were APS and SRP, the software was Emerald AI's, and the results are on arXiv.

Three months before that, Duke University's Nicholas Institute had modeled the same idea at the scale of the whole grid. If datacenters accept curtailment 0.25% of the hours in a year, the existing US grid can absorb 76 gigawatts of new load without building a plant. At 0.5% it is 98 gigawatts. At 1%, which works out to about 85 hours a year in two-hour events, it is 126.

For scale, GE Vernova's backlog of gas turbines is 116 gigawatts, with delivery slots sold through 2029.

Chips and models decide how much energy a token needs. Flexibility decides how much new generation a datacenter needs, and that number is larger, available now, and controlled by whoever schedules the workload.

Google now has a gigawatt of demand response written into its power purchase agreements with five utilities, announced in March.

Next week: the three things that would change this whole argument.

### Post 5. What would change the conclusion

In March, Bloomberg reported that Oracle and OpenAI had capped their Abilene site near 2 gigawatts, citing financing and OpenAI's shifting demand forecasts. That is the kind of event this series has been building toward, and on its own it is not enough.

Efficiency starts cutting gigawatts, instead of multiplying output, on the day the marginal AI token stops being worth its cost. Three things would show that day had arrived.

The first is token prices falling without volume following. So far every price cut has pulled more than proportional volume: DeepSeek halved its API prices in September 2025 and Google's token volume rose 6.7x over the following year.

The second is fleet utilization dropping. Goldman Sachs expects datacenter occupancy to peak above 95% late this year and ease from 2027. Easing because of oversupply, as opposed to efficiency, would be the first real evidence of saturation, and Abilene is one data point.

The third is a forecaster cutting a 2030 number. Every revision this year has gone up: BloombergNEF's US figure rose from 106 gigawatts to 194 in eight months, EPRI's range rose 60%, and S&P's rose from 134 to 183. The first cut from the IEA, Lawrence Berkeley, or EPRI will be the market saying efficiency has begun to outrun volume.

None of the three has happened. Until one does, the planning assumption is that energy per token falls 3x to 6x a year, volume rises 5x to 7x, net AI power grows about 1.5x, and the turbine backlog decides the rest.

## 5. Opener variants for Post 0

Use one. The others work as a repost or a comment a week later.

- When Sundar Pichai stood up at Google I/O in May and said Google was processing 3.2 quadrillion tokens a month, the number I kept thinking about was a different one from the same company.
- Last August Google published what one Gemini prompt costs in electricity, 0.24 watt-hours, and noted it was 33 times less than a year earlier. Google's electricity use went up anyway.
- In the quarter that ended in June, Microsoft added a gigawatt of datacenter capacity and reported that Copilot throughput was up 4x since January. Both of those are true at once, and that is the whole story.

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
