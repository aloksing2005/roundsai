Table of Contents

RoundsAI — Project Log
Running log of progress across the 10-day capstone. One entry added per day.
________________________________________
Day 1 — Requirements
Focus: Product discovery, scope definition, PRD, Implementation Blueprint, Pitch Deck. Outcome: RoundsAI defined as a doctor-only AI healthcare workflow platform. Core v1.0 scope locked: single-doctor auth, patient management, manual appointment queue, Claude-powered pre-visit AI summary with fallback, structured prescriptions with PDF export. Explicit non-goals recorded (no patient accounts, no real-time sync, no multi-doctor support).
Day 2 — Design
Focus: System architecture, database schema, API design, UI/UX flow, project structure. Outcome: Tech stack finalized (React/Vite/Tailwind, Node/Express, MongoDB Atlas, JWT auth, Claude API, pdf-lib, Vercel/Render hosting). Full component diagrams, data flow, and AI interaction flow documented. 5-collection MongoDB schema designed and validated against all 12 PRD user stories. 12 API endpoints specified. 9 screens wireframed with complete user flow. Project folder structure defined. One clarification made: visitId required on the AI summary endpoint — synced into the Blueprint’s Day 6 section.
Day 3 — Setup
Focus: Development environment, project scaffolding, database connection, basic routing. Outcome: Node.js/npm/Git verified, VS Code extensions installed. React + Vite + Tailwind frontend scaffolded and running on localhost:5173. Express backend scaffolded and running on localhost:5000, connected live to MongoDB Atlas (RoundsAI project, Cluster0). Frontend confirmed successfully calling backend /api/health endpoint — full stack connectivity verified. React Router configured with 3 working placeholder routes (/, /login, /patients). Git repository confirmed connected and .env correctly excluded. No design changes required — Day 2 architecture held up exactly as planned during implementation. Commit: Day 3: Project foundation — frontend/backend scaffolded, MongoDB connected, routing working
________________________________________
Next entry: Day 4 — Implementation: Authentication + Patient Management
