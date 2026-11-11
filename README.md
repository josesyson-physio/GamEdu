# Gamified Edu: interactive platform demo

**Learn it. Play it. Master it.** A working vertical slice of an educational gaming universe.
A learner plays **Anatomy Run**, builds knowledge, unlocks a second game (**Assessment Lab**), earns resources
and grows **Jo's Clinic** from one room into a futuristic smart rehabilitation centre.

- Live demo (after Pages is on): `https://josesyson-physio.github.io/GamEdu/`
- Live game it connects to: [Anatomy Run](https://josesyson-physio.github.io/anatomy_run/) (unchanged, opened top-level, never embedded)

![Home](docs/screenshots/01-home.png)

## What's in the demo
| Screen | What works |
|---|---|
| Home | Isometric hero world, featured games, continue playing (real Anatomy Run progress), categories, learning journey |
| Explore | 6 categories; Physiotherapy playable, others clearly "Coming soon" / "Future expansion" |
| Physiotherapy | 8 skill areas, games, Miller's pyramid learning ladder |
| Anatomy Run profile | Launches the real game in its own tab; shows real progress read from this browser |
| Skill map | 6 stages, skills unlocked by learning evidence only, competency areas per stage |
| Assessment Lab | Second game: mission, 3 challenges, hands-on goniometer task, results, Stage 2 unlock |
| Jo's Clinic | 12 clickable isometric buildings, unlock rules, costs, 3 visible upgrade levels each |
| Futuristic clinic | Revealed stage by stage, plus a clearly labelled vision preview |
| Profile | Jo, rank, XP, sparks, skills, badges, missions, upcoming unlocks, simulated ledger, reset |
| Walkthrough | 10-step presenter guide with a "simulate milestone" control |

Full details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) (architecture, simulated vs real, limitations, test results, deployment).

## Adding the clinical questions
Edit `content/assessment-lab.js`: replace each placeholder challenge, set `reviewed: true`, the `reviewer` and `reference`,
then set `status: 'reviewed'`. The "demonstration content" banner disappears automatically.

## Security
Static site, no backend, no accounts, no payments, no tracking. Strict CSP (scripts from this site only, no network calls),
anti-framing guard, read-only access to Anatomy Run's save. `node scripts/security-check.mjs` runs 32 checks; CI blocks deploys that fail.

## Licence
Copyright (c) 2026 MotionPlus Physio Pvt. Ltd. All rights reserved. See `LICENSE`.
