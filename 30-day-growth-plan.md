# RoundsAI — 30-Day Growth Plan

A realistic, one-milestone-per-day roadmap taking RoundsAI from its current v1.0.0 state toward the "Next 3 Months" items in `future-scope.md`. Each day assumes ~1-3 hours and builds directly on the previous day's work — no day requires re-deciding architecture already locked in this capstone.

## Week 1 — Real Patient Intake (replacing seeded data)

- **Day 1:** Design the public intake form's data flow — confirm it reuses the existing `IntakeForm` schema unchanged. Draft the new endpoint spec: `POST /api/intake/:patientId` (no auth required, rate-limited).
- **Day 2:** Build the backend endpoint with strict validation (reuse `isNonEmptyString` from `utils/validators.js`) and rate limiting (reuse the `express-rate-limit` pattern from `auth.js`).
- **Day 3:** Build a minimal, unauthenticated public form page (`client/src/pages/PublicIntake.jsx`) at a route like `/intake/:patientId`.
- **Day 4:** Generate a unique, unguessable link per patient (e.g. a random token field on `Patient`) instead of exposing raw MongoDB IDs publicly.
- **Day 5:** Wire the "Start Today's Visit" flow to check for a fresh intake submission and pre-fill `reasonForVisit` from it automatically.
- **Day 6:** Add a "Copy Intake Link" button to the Patient Profile page for the doctor to share.
- **Day 7:** End-to-end test: submit a real intake as a "patient" in an incognito window, confirm it appears correctly in the AI summary generation. Deploy to production.

## Week 2 — Multi-Doctor Support

- **Day 8:** Add `doctorId` field to `Patient`, `Visit`, and `Prescription` schemas (non-breaking, optional at first).
- **Day 9:** Write a one-time migration script to backfill `doctorId` on existing seeded data.
- **Day 10:** Update `patients.js` routes to scope all queries by `req.doctor.id`.
- **Day 11:** Update `visits.js` and `prescriptions.js` routes with the same scoping.
- **Day 12:** Build a real signup flow (currently only a single seeded account exists) — reuse the existing bcrypt hashing pattern from `seed.js`.
- **Day 13:** Test with two doctor accounts to confirm data isolation — Doctor A must never see Doctor B's patients.
- **Day 14:** Deploy and verify multi-doctor isolation in production.

## Week 3 — Real-Time Queue Sync

- **Day 15:** Install and configure Socket.io on the Express backend alongside the existing HTTP routes.
- **Day 16:** Emit a `visit-updated` event whenever `PATCH /api/visits/:id/status` succeeds.
- **Day 17:** Add the Socket.io client to the React frontend, scoped to the logged-in doctor.
- **Day 18:** Update `Dashboard.jsx` to merge incoming socket events into the existing `visits` state instead of requiring a manual refresh.
- **Day 19:** Test with two browser tabs open simultaneously — confirm a status change in one reflects instantly in the other.
- **Day 20:** Handle reconnection gracefully (socket drops on Render free-tier cold starts) — fall back to the existing polling-free refresh pattern if the socket is down.
- **Day 21:** Deploy and verify real-time sync in production across two devices.

## Week 4 — Patient Search/Filter + Polish

- **Day 22:** Add a MongoDB text index on `Patient.name` and chronic conditions.
- **Day 23:** Build `GET /api/patients?search=` query param support on the backend, reusing existing validation patterns.
- **Day 24:** Add a search input to `Patients.jsx`, debounced to avoid excessive requests.
- **Day 25:** Add basic filter chips (e.g. filter by chronic condition) to the same page.
- **Day 26:** Revisit the AI summary prompt (`aiSummary.js`) with real intake data collected from Week 1 — refine wording based on actual (fictional) patient submissions rather than only the original 3 seed patients.
- **Day 27:** Full regression test across all features built this month (intake, multi-doctor, real-time queue, search).
- **Day 28:** Update `README.md`, `future-scope.md`, and API documentation to reflect everything built this month.
- **Day 29:** Security review pass on all new endpoints (intake form, search) using the same checklist rigor as the original Day 8.
- **Day 30:** Deploy final state, tag a `v1.1.0` release, and write a short retrospective on what changed since `v1.0.0`.

## Ground Rules for This Plan

- **No day should require redesigning something already decided** — if a day feels like it needs a new architecture decision, stop and design it as its own mini-planning step before continuing.
- **Every week ends with a production deployment and verification**, not just local testing — this mirrors the discipline from Days 8-9 of the original capstone.
- **The AI safety boundary (summarization only, never diagnosis) is never revisited or loosened** at any point in this roadmap.