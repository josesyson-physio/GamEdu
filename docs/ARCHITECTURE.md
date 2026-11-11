# Gamified Edu demo: architecture and rules (v2, 11 Nov 2026)

## Concept
Platform → categories → Physiotherapy (live) → **Anatomy Run** (the game) + **Jo's Clinic** (the rewards).
Categories coming: Basics of Rocket Science, AI in Remote Areas. More physiotherapy games will plug into the same rewards later.

## Rewards and skill limits
| Earned in Anatomy Run | Reward |
|---|---|
| Level solved | 40 sparks + 40 XP, and one case skill |
| Each star (max 3) | +20 sparks + 10 XP (a replay with more stars pays the difference) |
| World completed | +300 sparks + 150 XP, and unlocks that world's buildings |

| Building level | Skill limit |
|---|---|
| 1 | World complete (world buildings); first skill (Library); start (Reception) |
| 2 | Every case in the world at 2★ (Library: 11 skills; Reception: 6) |
| 3 | Every case in the world at 3★ (Library: 22 skills; Reception: 14) |
| Research Lab, Smart Clinic | All 4 worlds; Smart Clinic also needs every other building built |

Worlds → buildings: Upper Limb Hills → Assessment Room, Rehabilitation Gym · Sports Ground → Sports Performance Lab, Hydrotherapy ·
Spine Canyon → Diagnostic Wing, Spine & Posture Studio · Neuro Nights → Neuro Rehabilitation, Robotics & AI.
Economy check: solving all 22 cases at 2★ pays about 3,260 sparks; building every building at level 1 costs 3,000.

## Files
```
index.html        shell, nav, CSP          js/data.js    categories, cases, worlds, buildings, rewards
css/app.css       design system            js/state.js   state, Anatomy Run bridge (read-only), rewards, skill caps
js/art.js         original isometric SVG   js/views.js   screens
js/app.js         router, HUD, walkthrough, anti-framing guard
root-cause/        Root Raid: Body City (index.html, rc.css, cases.js, game.js)
scripts/security-check.mjs   42-check security gate run before every deploy
```
**Anatomy Run bridge.** Both apps are on `josesyson-physio.github.io`, so the platform reads Anatomy Run's save (`physio-quest`)
to see solved levels and stars. It never writes or deletes it. Progress is per browser until accounts and a cloud progress service exist.

## Root Raid: Body City (`root-cause/`)
A second Physiotherapy game, same site, same security rules (own CSP, no inline scripts, anti-framing guard).
- **Cases:** 10 common painful conditions from the Learn Anywhere library: tennis elbow, carpal tunnel, subacromial shoulder pain,
  frozen shoulder, cervical radiculopathy, non-specific low back pain, lumbar disc herniation, knee OA, lateral ankle sprain,
  plantar heel pain. Content in `cases.js` (CC BY-NC-SA 4.0, draft pending clinical review).
- **Open world (v2, 11 Nov 2026):** no question screens. The world is a 4000 x 8100 city inside a body silhouette (pixel mask for
  walls, grid buildings with collision, main streets along the "nerve highways" kept clear so every place is reachable). Camera
  follows Jo; whole-body radar and full map (M); waypoint arrow; scooter (Shift / RIDE); district names; blood-cell traffic.
- **A case:** walk to a patient (yellow blip) → short dialogue → **tests**: 4 street kiosks, running one shows positive or negative
  (find the 2 positives) → **triage**: 3 locals describe findings, call the ambulance for the red flag → **hunt**: 3 hideouts, raid the
  one that matches → **raid**: symptoms respawn from the boss; right tool damages, wrong tool "resists" with a hint, the dud tool
  explains why it fails; 10 symptoms break the shield; only the root-cause treatment defeats it → **case file** (chain, red flags,
  management, references).
- **Stars:** 1 for closing the case + 1 for no wrong test, referral or hideout + 1 for finishing with 3+ energy.
- **Names:** the game displays as "Root Raid: Body City"; folder and save key stay `root-cause`. Cases have quest names
  (Grip Glitch, Disc Drama, ...) and symptoms have nicknames shown beside the clinical term (Ouch · Pain).
- **Testing:** `?test` exposes a read-only state snapshot plus a teleport, used only by the automated play-through.
- **Save:** its own key `root-cause` `{done:{caseId:stars}}`. The platform reads it (never writes): 40 sparks + 40 XP per case,
  +20 sparks / +10 XP per star, replays pay the difference; badges "Root cause hunter" and "Body City hero".
  Treatment skills show on the skill map and profile. They do not yet cap clinic upgrades (Anatomy Run skills do).

## Simulated vs real
Real: Anatomy Run and its saved levels and stars; all unlock, cap and upgrade rules.
Simulated (labelled): the 300-spark starting balance; the presenter's "Simulate world" button (2★ per level); the demo ledger;
Rocket Science and AI in Remote Areas (coming soon); the Smart Clinic vision preview.

## Testing (11 Nov 2026, Chrome desktop 1366x860 and phone 390x844): 21/21 passed
Navigation without a top-level clinic; 3 categories; non-physio pages not playable; real progress paid exactly (800 sparks for
world 1 with mixed stars); upgrade blocked by a 1★ case; replay to 2★ paid +20 and allowed level 2; level 3 needs 3★; locked
buildings name their world; simulated worlds labelled; Smart Clinic locked until every building built, then built; full reveal;
persistence; reset without touching Anatomy Run's save; 10-step walkthrough; no dead links; no errors; network only this site +
Google Fonts; phone layout without sideways scroll. Security gate: 30/30.

## Deployment
Push to `main`; the workflow runs the security gate and publishes to https://josesyson-physio.github.io/GamEdu/.
