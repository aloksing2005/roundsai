# RoundsAI — Future Scope

This document outlines how RoundsAI could realistically evolve beyond the v1.0.0 capstone, building directly on the architecture and decisions already in place. Every item below builds on real, existing code — not a rewrite.

## Next 3 Months

**Real patient intake (replacing seeded data)**
Currently, `IntakeForm` records are only created via `seed.js`. The next real step is a lightweight, no-login shareable intake link per patient — the `IntakeForm` schema and the AI summary's data-fetching logic (`server/services/aiSummary.js`) already consume this exact shape, so this is a frontend + one new public endpoint, not a redesign.

**Multi-doctor support**
The `Doctor` model and `requireAuth` middleware already isolate a doctor's identity in the JWT payload. Extending `Patient`, `Visit`, and `Prescription` with a `doctorId` field and scoping every query to `req.doctor.id` is the direct path here — the hardest architectural decision (single vs. multi-tenant auth) is already resolved in the JWT design.

**Real-time queue sync (WebSockets)**
The queue currently updates only within the doctor's own browser session (Day 5's deliberate scope cut). Adding Socket.io on top of the existing `PATCH /api/visits/:id/status` endpoint would let a second device/tab reflect status changes live — additive, not a rewrite of the queue logic.

**Claude API cost/reliability tuning**
Now that the fallback path (Day 6) has been proven live in production, the next step is adding response caching for repeated summary requests on an unchanged patient record, plus surfacing token usage/cost estimates in a lightweight admin view.

## Next 6 Months

**Patient search and filtering**
Deliberately excluded from v1.0 to protect the 10-day timeline. With the patient list now proven at small scale, adding MongoDB text indexes on `Patient.name` and basic filter query params to `GET /api/patients` is a contained addition.

**Drug interaction awareness**
The `Prescription.medications` array already stores structured medication names — integrating a free/open drug-interaction reference (e.g. RxNorm or a similar open dataset) to flag (not block) potential interactions during prescription review would extend `NewPrescription.jsx`'s review step without changing the schema.

**Audit logging**
Given this is healthcare-adjacent data, a dedicated `AuditLog` collection recording who viewed/edited what and when would be a natural, low-risk addition — the existing `requireAuth` middleware already has doctor identity available on every request to hook into.

**Mobile-first redesign**
Day 7's responsive pass made the app usable on mobile, but a dedicated mobile-first flow (e.g. a simplified queue-only view for a doctor checking their phone between rooms) would be the next real mobile investment.

## Next 12 Months

**Structured clinical templates**
Move beyond free-text `diagnosisNotes` toward structured, specialty-specific visit templates — while keeping the AI summary's "summarize only, never diagnose" constraint as a hard architectural rule, not just a prompt instruction.

**Multi-clinic / organization support**
Building on the multi-doctor foundation above, group doctors under a `Clinic` or `Organization` entity, enabling shared patient rosters within a practice while still respecting per-doctor data boundaries.

**Deeper AI-assisted workflows**
With the summarization-only Claude integration proven reliable in production, a natural extension is AI-assisted prescription documentation (e.g. drafting structured notes from a doctor's shorthand) — still strictly assistive, never autonomous, consistent with the safety posture established in Day 6.

## What Stays Constant

Regardless of which of the above gets built first, two architectural principles established in this capstone should remain non-negotiable: **the AI never diagnoses or prescribes** (summarization only, exactly as built), and **every AI output is honestly labeled by source** (Claude vs. fallback), exactly as verified working in production on Day 9.