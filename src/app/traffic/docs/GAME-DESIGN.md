# Greenwave — proposed game design

Status: a concrete starting proposal, not a claim about previously agreed mechanics. Tune through playtesting. Folder/route slug: `traffic`.

## Player promise

Turn an overwhelmed street into a coordinated traffic machine. Watch each investment produce visible flow, then survive a harder rush hour using a different upgrade combination.

This is an active incremental roguelike: automation and throughput grow within a short run. Offline income, real-world traffic accuracy, a freeform road editor and permanent stat grinding are outside the first prototype.

## Core decisions

- Trade one direction's waiting time against another's with signal timing.
- Spend limited credits on discharge speed, green-time allocation or revenue efficiency.
- Choose one of three run modifiers between waves; each should change the next decision.
- Read the next wave's announced demand before committing an investment.

The satisfaction loop is arrive → queue → release a platoon → complete trips → earn credits → improve the bottleneck. More cars alone are not progress: improved completed trips per minute and lower delay are.

## First playable board

One four-way intersection, four inbound single lanes and four outbound exits. Vehicles go straight only; north/south share a phase, east/west share the other. No turning, lane changes or pathfinding yet.

Inbound lanes have finite visible storage. Demand that cannot enter stays in an external backlog, still ages, and contributes to congestion. Never discard blocked demand to make performance or outcomes look better.

Every phase switch includes an all-red clearance period. Vehicles already crossing finish before the conflicting direction can enter. The player requests a phase; repeated input cannot bypass minimum green time or clearance. A simple automatic cycle keeps the road running without constant clicking.

## Run structure

Provisional values belong in a small balance object, not scattered literals:

| Setting | Starting value |
| --- | --- |
| Run length | 6 waves |
| Wave duration | 60 simulation seconds |
| Initial lane storage | 12 vehicles per approach |
| Minimum green | 3 seconds |
| Default cycle | 8 seconds NS, 8 seconds EW |
| Clearance minimum | 1 second, plus waiting for crossing occupancy to clear |
| Base departure headway | 0.8 seconds per eligible lane |
| Base trip reward | 1 credit on exit |
| Initial credits | 0 |
| Starting heat | 0 of 100 |

Wave phases: running → intermission/upgrade choice → running → victory or defeat. Simulation and demand stop during intermission, pause and results. Existing vehicles and heat carry between waves. Clear wave 6 to win unless already defeated on its final tick; evaluate defeat first.

Demand starts below combined capacity, rises each wave, and has seeded directional bias. Start tuning around 1.2 total arrivals/second, +0.15 each wave. This is an experimental starting point, not a balanced guarantee. Preserve fractional arrival budgets; never make demand depend on display FPS.

## Economy and pressure

Credits are awarded once when a vehicle reaches its exit; no income from spawning or entering the junction. Score is completed trips; credits are spendable and must not be confused with lifetime score.

Each tick, measure oldest wait including external demand. While it exceeds 20 seconds, heat rises at 2/second; otherwise heat recovers at 1/second. Clamp heat to 0–100; reaching 100 ends the run. Show the threshold and reason beside the gauge. These rates are starting hypotheses.

First paid upgrade: shorter departure headway, costing 12, 24, then 48 credits, reducing headway by 10% each level. Cap at 3 levels initially. Deduct credits atomically and reject unaffordable or capped purchases. No refunds or sell/rebuy loop in MVP.

The prototype must show at least one affordable purchase early. If the default policy cannot survive wave 1 without expert timing, fix demand/feedback before adding more content.

## Roguelike choices — add after the first loop is fun

Offer three distinct eligible cards at intermission using gameplay RNG. Draft at most one; no reroll in MVP. Implement explicit card IDs and simple rules before a generic modifier system.

| Card | Benefit | Cost / strategic consequence |
| --- | --- | --- |
| Express Corridor | NS headway ×0.8 | EW headway ×1.1 |
| Cross-Town Priority | EW headway ×0.8 | NS headway ×1.1 |
| Green Dividend | +1 credit per completed trip | Minimum green +1 second |
| Calm Commuters | Wait threshold +5 seconds | Headway ×1.1 |
| Rapid Dispatch | All headways ×0.9 | Heat recovery ×0.5 |

For the first draft system, each card can be selected once per run. Draw three without replacement from remaining cards; if fewer remain, offer all remaining. Stop drafts when empty. Apply effects in a documented order and show actual resulting timings. Do not allow headway below a named lower bound.

Later content: connected junctions and green-wave synchronization, constrained lane projects, announced demand events, alternate starting kits. Persistent unlocks should broaden choices before adding permanent power. Add these only after a six-wave run supports distinct viable strategies.

## First playtest questions

Can a new player identify the blocked direction within five seconds? Can they explain what their last purchase improved? Does an efficient policy visibly outperform frantic switching? Do losses explain the bottleneck? Does replaying the same seed support learning?
