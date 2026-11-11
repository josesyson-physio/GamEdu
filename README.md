# Gamified Edu: interactive platform demo

**Learn it. Play it. Master it.** An educational gaming universe. Today it holds one live world, Physiotherapy,
with one game, **Anatomy Run**, and its reward space, **Jo's Clinic**. Two more worlds are coming: **Basics of Rocket Science**
and **AI in Remote Areas**.

- Live demo: https://josesyson-physio.github.io/GamEdu/
- Live game: [Anatomy Run](https://josesyson-physio.github.io/anatomy_run/) (unchanged, opened top-level, never embedded)

![Home](docs/screenshots/01-home.png)

## The concept
1. **Play** Anatomy Run. Every level solved earns sparks (more for more stars) and one case skill. Each of the 4 worlds completed pays a bonus.
2. **Skills set the limit.** Completing a world unlocks its clinic buildings. Every case in that world at 2★ allows level 2; 3★ (mastery) allows level 3.
3. **Build** in Jo's Clinic (inside Physiotherapy). Sparks pay; skills decide how far each building can grow.
4. **Goal:** complete all four worlds, build every building, then build the **Futuristic Smart Clinic**.

## Screens
| Screen | What works |
|---|---|
| Home | Isometric hero world, featured, continue playing (real Anatomy Run progress), categories, journey |
| Explore | Physiotherapy (live), Basics of Rocket Science and AI in Remote Areas (coming soon) |
| Physiotherapy | Anatomy Run, the reward loop, Jo's Clinic, skill map, Smart Clinic goal |
| Anatomy Run page | Launches the real game in its own tab; rewards explained; real progress shown |
| Skill map | 22 case skills in 4 worlds, with stars and what each world unlocks |
| Jo's Clinic | 12 isometric buildings; skill-capped upgrades with 3 visible levels each |
| Smart Clinic | Revealed world by world; full vision preview, clearly labelled |
| Profile | Jo, level, XP, sparks, skills, badges, ledger, reset |

## Security
Static site, no backend, no accounts, no payments, no tracking. Strict CSP (scripts from this site only, no network calls),
anti-framing guard, read-only access to Anatomy Run's save. `node scripts/security-check.mjs` runs 32 checks; CI blocks deploys that fail.

## Licence
Copyright (c) 2026 MotionPlus Physio Pvt. Ltd. All rights reserved. See `LICENSE`.
