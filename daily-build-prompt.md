# RoundsAI — Daily Build Prompt (30-Day Growth Plan)

Reusable prompt for each day of the 30-Day Growth Plan. Copy this into a fresh chat each day, replacing only `{DAY_NUMBER}`. Attach `30-day-growth-plan.md`, `future-scope.md`, and this project's `README.md` if the assistant doesn't already have context.

---

## Prompt Template
Day {DAY_NUMBER} of the RoundsAI 30-Day Growth Plan.

Read 30-day-growth-plan.md and use it as the source of truth. Complete only
the work scheduled for Day {DAY_NUMBER}. Do not redesign the project, do not
start a future day's work, and do not revisit architecture decisions already
made in the original 10-day capstone (see challenge-retrospective.md and
future-scope.md if you need that context).

Standing rules:

Use only free tools, APIs, SDKs, and hosting platforms already in use by
this project (React/Vite, Tailwind, Node/Express, MongoDB Atlas, Claude
API with deterministic fallback, pdf-lib, Vercel, Render) unless I
explicitly approve a new tool.
The AI summary feature must remain strictly summarization-only — never
diagnosis, never treatment suggestions. Do not loosen this constraint.
Whenever I need to perform a manual step (installing packages, configuring
a service, running a command, deploying), stop and give me exact
step-by-step instructions with real button/menu names and terminal
commands. Wait for my confirmation before continuing.
Prioritize implementation over explanation. Generate complete,
copy-pasteable files — no snippets, no placeholders, no "...existing
code...".
Build one milestone at a time. Pause after each milestone for me to test
and confirm before continuing.
If today's task depends on a previous day's incomplete work, tell me
clearly instead of guessing or skipping ahead.
If anything breaks, debug it completely before moving forward.

At the end of today's session:

Verify today's feature works correctly, and confirm nothing from previous
days broke (quick regression check).
Help me commit and push to GitHub with a clear commit message.
Give me a concise summary of what was completed and what tomorrow
(Day {DAY_NUMBER_PLUS_1}) will focus on, per the growth plan.

Begin with Day {DAY_NUMBER}'s milestone now.


## Usage Notes

- Replace `{DAY_NUMBER}` with the actual day (1–30).
- On weekly boundaries (Days 7, 14, 21, 30), the growth plan includes a deployment step — the prompt above already covers this since deployment instructions are handled the same way as any other manual step.
- If a day's work reveals a genuine gap in the plan (similar to Day 8's visit-creation discovery in the original capstone), it's fine to pause, document it, and adjust — the plan is a guide, not a rigid contract.