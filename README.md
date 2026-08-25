# RoundsAI

**An AI co-pilot for the doctor's day** — patient context, a live appointment queue, and digital prescriptions, in one focused workspace.

🔗 **Live App:** https://roundsai-tau.vercel.app
🔗 **API:** https://roundsai-api.onrender.com
📁 **Repo:** https://github.com/aloksing2005/roundsai

Built as a 10-day capstone for the **AB Talks 60-Day Claude AI Challenge**.

---

## What is RoundsAI?

RoundsAI is a doctor-only workflow platform — not a hospital management system, not patient-facing. It's built around a single persona (the doctor) and focuses on reducing the manual prep work of a clinic day:

- Reviewing a patient's history before a visit
- Tracking who's waiting, in progress, or done for the day
- Getting a fast, AI-generated pre-visit brief instead of re-reading an entire chart
- Writing and issuing a prescription without leaving the app

## Demo Login
Email: dr.mehta@roundsai.demo
Password: roundsai123


> Note: the backend runs on Render's free tier, which spins down after inactivity. The first request after a period of idle time may take 30–60 seconds to respond — this is expected, not a bug.

## Core Features

- **Authentication** — single seeded doctor account, JWT session via HTTP-only cookie
- **Patient Management** — view, add, and edit patients; full profile with allergies, chronic conditions, current medications, and past visit history
- **Live Appointment Queue** — doctor manually moves visits through Waiting → In Progress → Done
- **AI Pre-Visit Summary** — combines a patient's stored medical history with seeded pre-visit intake data, summarized via the **Claude API**. If the AI call fails or is unavailable, a clearly labeled deterministic fallback summary is shown instead — the source is always visibly marked, never blurred
- **Digital Prescriptions** — structured, multi-medication prescriptions, saved to the patient's record and exportable as a clean, downloadable PDF
- **Responsive UI** — dark-mode, glassmorphism design system; usable on desktop, tablet, and mobile (collapsible sidebar/hamburger menu on small screens)

### Explicitly out of scope for v1.0
No patient-facing accounts or self-service intake forms, no real-time multi-device sync, no multi-doctor support, no patient search/delete, no drug interaction database, and the AI is strictly limited to **summarization** — it never diagnoses or recommends treatment.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT (HTTP-only cookie) |
| AI | Anthropic Claude API, with deterministic fallback |
| PDF Generation | pdf-lib |
| Hosting | Vercel (frontend) · Render (backend) · MongoDB Atlas (database) |

## Project Structure
roundsai/
├── client/ React frontend (Vite + Tailwind)
│ └── src/
│ ├── pages/ Route-level pages (Login, Dashboard, Patients, etc.)
│ ├── components/ Shared UI components
│ ├── context/ AuthContext (session state)
│ └── config/ API client wrapper
├── server/ Express backend
│ ├── models/ Mongoose schemas (Doctor, Patient, Visit, Prescription, IntakeForm)
│ ├── routes/ API route handlers
│ ├── middleware/ Auth middleware
│ ├── services/ AI summary logic, PDF generation
│ └── seed.js Seeds one doctor + 3 demo patients with history
└── docs/ Architecture, schema, and API design documentation


## Running Locally

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (free tier) or local MongoDB instance
- An Anthropic API key (optional — the app works via the fallback summary path without one)

### 1. Clone the repo
```bash
git clone https://github.com/aloksing2005/roundsai.git
cd roundsai
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env` (see `server/.env.example`):

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
ANTHROPIC_API_KEY=your_claude_api_key # optional — fallback summary works without it
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173


Seed the database (creates the demo doctor + 3 patients):
```bash
node seed.js
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend setup
In a second terminal:
```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**.

## Environment Variables Reference

**Backend (`server/.env`)**

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Any long random string, used to sign session tokens |
| `ANTHROPIC_API_KEY` | No | Claude API key — without it, AI summaries fall back to a deterministic template |
| `PORT` | No | Defaults to `5000` |
| `NODE_ENV` | Yes in production | Set to `production` when deployed — controls cookie security settings |
| `CLIENT_URL` | Yes in production | Comma-separated list of allowed frontend origins for CORS |

**Frontend (`client/.env` or `.env.production`)**

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes in production | The deployed backend URL (e.g. `https://roundsai-api.onrender.com`) |

## Deployment

- **Backend** is deployed on [Render](https://render.com) as a free-tier Web Service, connected to this GitHub repo's `server` directory.
- **Frontend** is deployed on [Vercel](https://vercel.com), connected to this repo's `client` directory, with `VITE_API_BASE_URL` set as a project environment variable.
- **Database** runs on a free-tier MongoDB Atlas cluster.

## Documentation

Additional design and planning documentation is available in [`/docs`](./docs), including the product requirements document, system architecture, database schema, and API design.

## License

MIT — see [LICENSE](./LICENSE).

## Acknowledgments

Built with [Claude](https://claude.com) as part of the **AB Talks 60-Day Claude AI Challenge**.