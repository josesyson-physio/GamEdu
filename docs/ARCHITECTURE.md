# Gamified Edu demo: architecture, features and testing

Demo date: 11 Nov 2026 · Scope: a functional vertical slice for investors, students and education partners.

## 1. Architecture
A static, dependency-free web app (HTML, CSS, vanilla JS), hosted on GitHub Pages on the **same site** as Anatomy Run.

```
index.html          shell: top nav, mobile tab bar, HUD, walkthrough, CSP
css/app.css         game UI design system + Assessment Lab's own look
js/data.js          catalogue: categories, games, 6 skill stages, 12 buildings, badges, Miller levels, competency areas
js/state.js         demo state (localStorage), Anatomy Run bridge (read-only), rewards, unlock rules
js/art.js           original isometric SVG art: worlds, 12 buildings x 3 levels, futuristic clinic, card covers, Jo sprite
js/views.js         screens
js/lab.js           Assessment Lab game (independent module)
js/app.js           hash router, HUD, toasts, sound, presenter walkthrough, anti-framing guard
content/assessment-lab.js   clinical content for the Lab (swap in reviewed questions here)
scripts/security-check.mjs  security gate (32 checks)
```

**How games plug in (adapter).** Each game contributes *learning evidence*. `state.evidence()` gathers it; stages turn evidence
into skills; skills unlock buildings; sparks pay for them. A new game adds: a catalogue entry in `data.js`, an evidence source in
`state.evidence()`, and (if it runs inside the platform) a module like `lab.js`. Games that run on their own, like Anatomy Run,
are linked top-level and report progress through their own saved data.

**Anatomy Run bridge.** Both apps live on `josesyson-physio.github.io`, so the platform can read Anatomy Run's save
(`physio-quest` in localStorage) and count solved levels. It never writes or deletes it (enforced by the security gate).
Each solved level pays the platform +20 sparks and +40 XP once. In a production version this becomes a signed progress API.

**Two currencies, never mixed.** Sparks (game currency) build and upgrade the clinic. XP (platform currency) drives player level.
Skills unlock only from learning evidence; sparks can never buy a skill or a stage.

## 2. A broader frame for the skill map
So the progression is not one person's view, stages are mapped to widely used education models:
- **Miller's pyramid** (knows, knows how, shows how, does). Games build the first three; "does" only happens in supervised clinical practice.
- **Competency areas** stressed by competency-based physiotherapy curricula: clinical knowledge, practical skills, clinical reasoning,
  communication, ethics and professionalism, teamwork, lifelong learning. India's NCAHP curricula, mandatory from 2026, aim to move
  "beyond the theoretical knowledge" and build communication, teamwork, ethical practice and lifelong learning.
- **Practical knowledge**: Assessment Lab includes a hands-on "shows how" task (virtual goniometry of elbow flexion), not only questions.

Sources: [World Physiotherapy, Physiotherapist education framework (2021)](https://world.physio/news/world-physiotherapy-publishes-framework-physiotherapist-education) ·
[NCAHP competency-based curricula rollout (Careers360)](https://news.careers360.com/allied-healthcare-profession-10-competency-based-curriculum-mohfw-ncahp-syllabus-physiotherapy-psychology-nutrition-medical-course/amp).
Recommended next step: map each stage to World Physiotherapy's entry-level competency domains with the review panel.

## 3. Functional features
- Landing page with isometric world, featured, continue playing, categories, popular, new, learning journey
- 6 categories with distinct art; only Physiotherapy playable
- Anatomy Run profile and top-level launch; real progress shown
- Skill map: 6 stages, 31 skills, evidence-based unlocks, progress rings
- Assessment Lab: mission intro, 3 challenges, feedback, goniometry practical (landmark choice + drag/slider/keyboard), results, Stage 2 unlock, next mission
- Jo's Clinic: 12 buildings, unlock conditions, required skills, costs, 3 upgrade levels with visible changes
- Futuristic Smart Clinic: 11 parts revealed by stage; labelled vision preview
- Profile: Jo (two looks), level, XP, sparks, skills, 7 badges, missions, upcoming unlocks, ledger, reset
- Presenter walkthrough (10 steps) and simulate-milestone control
- Responsive: desktop top nav, mobile bottom tabs; keyboard and screen-reader labels; reduced-motion support

## 4. Simulated vs real
| Real | Simulated (labelled in the UI) |
|---|---|
| Anatomy Run game and its saved progress | Starting balance of 300 sparks |
| Levels solved read from Anatomy Run | "Simulate milestone" (6 levels) presenter control |
| Assessment Lab gameplay and goniometry | Assessment Lab challenge content (placeholders until the panel's questions arrive) |
| Unlock and upgrade rules | All spark and XP transactions (demo ledger, this browser only) |
| | Future categories, Stages 3-6 and the futuristic clinic (vision) |

## 5. Known limitations
- Progress lives in one browser; no accounts or cross-device sync (by design for the demo).
- Anatomy Run progress is only visible when both apps are opened in the same browser.
- Assessment Lab questions are placeholders until supplied and reviewed by the clinical panel.
- Art is original and code-drawn; commissioned illustration can replace it later without code changes to the logic.
- GitHub Pages cannot set HTTP security headers; the CSP is a meta tag and framing is blocked in JavaScript.
- Fonts load from Google Fonts; offline play is not included in this demo.

## 6. Testing results (11 Nov 2026, Chrome, 1366x860 and 390x844)
All 17 acceptance tests from the brief passed: navigation; category cards; Anatomy Run launched top-level with no iframe;
Lab playable; XP updated (+490); sparks awarded (+450); badges unlocked; Lab building available; purchase deducted exactly 250;
building visibly changed at each level; locked buildings showed requirements; skill map reflected challenges; progress persisted
after refresh; reset restored the initial state (Anatomy Run save untouched); mobile layout with no sideways scroll; no dead links;
no payment, account or tracking code (network: this site + Google Fonts only). Extra checks: real Anatomy Run progress credited
once and never written; simulated milestone labelled; 10-step walkthrough completed; zero page errors. Security gate: 32/32.

## 7. Deployment
1. Repo Settings > Pages > Source: **GitHub Actions**.
2. Push to `main`. The workflow runs the security gate, then publishes only the public files.
3. Demo URL: `https://josesyson-physio.github.io/GamEdu/`.

## 8. Demo walkthrough (5 minutes)
Press **Demo walkthrough** (bottom right) and follow the 10 steps: Explore → Physiotherapy → Anatomy Run → simulate milestone →
sparks and XP → Assessment Lab → upgrade the clinic → future stages → futuristic clinic preview. Reset from Profile before each pitch.
