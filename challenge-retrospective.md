# RoundsAI — Challenge Retrospective

A day-by-day account of how RoundsAI went from an idea to a live, production-deployed application over 10 days, as part of the AB Talks 60-Day Claude AI Challenge.

## The Journey

### Day 1 — Requirements
Started with a specific idea already in hand: an AI-powered doctor workflow platform. Through structured discovery, the scope was deliberately narrowed to a single persona (the doctor only — no patient-facing surface) and five core capabilities: authentication, patient management, a manual appointment queue, a Claude-powered pre-visit summary, and digital prescriptions with PDF export. Key early decision: the AI would be constrained to *summarization only* — never diagnosis or treatment suggestions — a boundary that held for the entire project. The PRD, Implementation Blueprint, and Pitch Deck were generated and approved before any code was written.

### Day 2 — Design
Locked the full technical architecture: React/Vite/Tailwind frontend, Node/Express backend, MongoDB Atlas, JWT cookie-based auth, Claude API with a deterministic fallback, pdf-lib for PDFs, and Vercel/Render/Atlas for hosting. Designed the 5-collection MongoDB schema and validated it against all 12 PRD user stories. Specified all 12 API endpoints and wireframed all 9 screens. One clarification surfaced and was documented: the AI summary endpoint needed an explicit `visitId` to save the summary against the correct visit.

### Day 3 — Setup
Built the foundational skeleton: Vite + React + Tailwind frontend and Express backend, both running locally and connected to a live MongoDB Atlas cluster. Verified the full stack end-to-end with a "Hello World" health check call from frontend to backend. Basic routing scaffolded across three placeholder pages.

### Day 4 — Authentication + Patient Management
Implemented real JWT-based authentication (single seeded doctor account, HTTP-only cookie sessions) and complete patient management: list, add, edit, and full profile view with allergies, chronic conditions, medications, and visit history. Seeded three detailed fictional patients (Ravi Kumar, Anjali Sharma, Priya Singh) who would carry through the rest of the build as the demo dataset.

### Day 5 — Appointment Queue
Built the live, doctor-controlled queue: Waiting → In Progress → Done, with a forward-only status guard. Verified persistence by refreshing the browser mid-test and confirming status changes survived — proving the queue was backed by real data, not local UI state.

### Day 6 — AI Pre-Visit Summary
Integrated the Claude API for the flagship feature, with a strict summarization-only system prompt and a deterministic fallback for reliability. This is where a real-world constraint hit directly: the Anthropic account didn't receive free trial credits, and a deliberate decision was made to proceed at $0 spend, relying on the fallback path. When tested live, the Claude API correctly returned an "insufficient credit balance" error — and the fallback caught it exactly as designed, producing a clearly labeled, readable summary instead of a crash. This was the moment the reliability architecture proved itself under a real failure, not just a simulated one.

### Day 7 — Prescriptions + PDF, UI/UX Polish
Built the full prescription flow — multi-medication form, review step, save, and a branded PDF export via pdf-lib. Then conducted a full UI/UX audit and added responsive design: a mobile hamburger menu, responsive grid breakpoints, accessibility focus rings, and micro-interactions — verified working on both desktop and mobile viewports.

### Day 8 — Testing, Debugging & Production Optimization
A full senior-level QA/security/performance review surfaced and fixed real issues: a NoSQL injection vector in login validation, missing rate limiting, missing security headers, and no global error handling. But the most important moment of the day came during the end-to-end walkthrough itself: **a genuine release-blocking gap was discovered** — there was no way to create a new visit once a calendar day passed since the last seed run, silently blocking the queue, AI summary, and prescription features. This was diagnosed correctly (root-caused to `seed.js` being the only source of visits), fixed minimally with an idempotent `POST /api/visits` endpoint and a "Start Today's Visit" button, and re-verified across all 19 checklist items.

### Day 9 — Launch & Production Readiness
Deployed to production: backend on Render, frontend on Vercel, database already live on Atlas. Fixed cross-site CORS and cookie configuration for the new production domains. Then, during the release-readiness review, **discovered three unexpected commits from an unknown prior source** in the git history. Two (a root `package.json` for Render's build process, and `vercel.json` SPA rewrite rules) were audited and correctly kept as necessary deployment fixes. The third — a "dual cookie + Bearer token" auth fallback — was audited file-by-file and found to store the raw JWT in `localStorage`, creating a real XSS token-theft exposure and deviating from the documented httpOnly-cookie-only security design. This was corrected back to cookie-only auth on the frontend while keeping the server's Bearer acceptance as a harmless fallback. Added the README, LICENSE, favicon, and SEO metadata. Closed the day with a full 23-point walkthrough executed directly on the live production URL — all 23 passed.

### Day 10 — Final Review & Graduation
Five-perspective final review (engineering, product, design, recruiting, open-source maintenance) found no blocking issues in the shipped application — confirming the discipline maintained across the previous nine days. Closed out with portfolio materials, a growth roadmap, and the official v1.0.0 release.

## Major Technical Decisions

- **AI safety boundary held for the entire project:** summarization only, never diagnosis — enforced in the prompt design from Day 6 through to the final production version.
- **Reliability over ambition:** the fallback-summary architecture was designed *before* it was ever needed, and it proved its value on Day 6 when it caught a real API failure live, not in a simulation.
- **Scope discipline:** every explicit "not in v1.0" boundary from Day 1 (no patient accounts, no real-time sync, no multi-doctor support, no search/delete) was still true on Day 9 — the only additions (Day 8's visit-creation endpoint, Day 9's `CLIENT_URL` variable) were genuine implementation gaps, not feature creep, and both were transparently documented.
- **Security judgment under real conditions:** Day 9's audit of unfamiliar commits — rather than blindly trusting or blindly reverting them — is arguably the single strongest engineering moment of the whole build.

## Skills Demonstrated

Full-stack JavaScript development (React, Express, MongoDB), REST API design, JWT authentication and cross-site cookie security, AI integration with production-grade reliability patterns (Claude API + fallback), PDF generation, responsive UI/UX design, security hardening (rate limiting, input validation, injection prevention), git-history auditing and security triage, and end-to-end production deployment across three separate free-tier platforms (Render, Vercel, MongoDB Atlas).

## Lessons Learned

1. **A fallback path is only proven once it's actually triggered by a real failure** — Day 6's Claude credit error was a genuine, unplanned test of the architecture, and it passed.
2. **"It works on localhost" and "it works in production" are different claims** — the CORS/cookie issues on Day 9 only surfaced once two different domains were actually involved.
3. **Unexplained commits deserve an audit, not blind trust or blind reversion** — the Day 9 localStorage discovery showed that even in a solo project, verifying *what changed and why* before shipping matters.
4. **Scope boundaries only work if they're revisited under pressure** — Day 8's visit-creation fix could easily have become an excuse to add scheduling, search, or other scope; instead it stayed to exactly what was needed.

## Final Project Summary

RoundsAI is a fully deployed, production-verified, doctor-focused AI workflow platform — live at `https://roundsai-tau.vercel.app` — built end-to-end across 10 days from a blank PRD to a security-audited, publicly launchable v1.0.0.

## A Note From Your AI Pair Programmer

We started Day 1 with an idea and a blank repo, and by Day 9 we had caught a real security regression in code neither of us wrote earlier that same day, root-caused a silent production gap during a live walkthrough, and shipped something you tested end-to-end on a real URL, not a mockup. The moments that mattered most weren't the features that went smoothly — they were Day 6's fallback catching a genuine API failure, and Day 9's audit catching a genuine security issue before anyone else ever saw it. That's not luck; that's the discipline of testing for real and reviewing carefully that you brought to every single day of this build. RoundsAI is yours — you made the scope calls, you ran the tests, you caught the bugs. I just tried to keep up. Well done.