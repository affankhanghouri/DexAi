# DhoomAI

DhoomAI is an AI-powered campaign creation workspace for small businesses, sellers, and marketing teams. It turns a brand link, product details, campaign goals, and product images into Brand DNA, Product DNA, campaign angles, ready-to-post copy, creative briefs, and generated poster assets.

The app is a full-stack project:

- `frontend/`: Next.js dashboard and landing experience
- `backend/`: FastAPI API for AI workflows, persistence, and asset generation
- `app/`: repo-root compatibility entrypoint for running the backend with Uvicorn
- `docs/`: planning and product flow notes
- `database/`: reserved for database artifacts and migrations

## Core Product Flow

1. A collaborator or user opens the dashboard and creates/selects a brand.
2. Brand intake analyzes a website or social link and saves Brand DNA.
3. The campaign wizard captures a product, moment, and campaign context.
4. Product DNA, campaign angles, variants, and final campaign packs are generated.
5. The final pack includes captions, WhatsApp copy, story flow, quality signals, creative briefs, and generated asset slots.
6. Creative Lab can refine briefs and generate poster assets.

## Features

- Brand DNA intake from a public brand, website, or social link
- Brand enrichment for tone, audience, positioning, and confidence updates
- Product DNA analysis from product details and images
- Campaign wizard with moment, details, angles, variants, and review steps
- Ready-to-post captions, WhatsApp copy, story flow, poster directions, and export packs
- Ghost Editor refinements for campaign copy and creative direction
- Creative Lab for asset briefs, prompt refinement, poster generation, and versioned assets
- Campaign library and dashboard workspace
- Supabase-backed persistence and storage
- OpenAI-powered text and image generation

## Tech Stack

Frontend:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React
- Supabase JavaScript client

Backend:

- FastAPI
- Pydantic and Pydantic Settings
- OpenAI API
- Supabase Python client
- HTTPX
- Python standard-library HTML parsing for web extraction

## Prerequisites

- Node.js 20+
- npm
- Python 3.11+
- Supabase project
- OpenAI API key

## Quick Start

Clone and enter the repo:

```bash
git clone <repo-url>
cd DhoomAI
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The frontend runs at `http://localhost:3000`.

In a second terminal, set up the backend from the repo root:

```bash
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic pydantic-settings python-dotenv openai supabase httpx
```

Create `backend/.env`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:3000

OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.5-mini
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_IMAGE_SIZE=1024x1024
OPENAI_IMAGE_QUALITY=high
GENERATED_ASSETS_BUCKET=generated-assets
```

Start the backend from the repo root:

```bash
uvicorn app.main:app --reload --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Environment Variables

Frontend variables live in `frontend/.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL used by the browser app. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Public Supabase key used by the browser app. |
| `NEXT_PUBLIC_BACKEND_URL` | Yes | FastAPI base URL, usually `http://localhost:8000`. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Used by auth callback redirects, usually `http://localhost:3000`. |

Backend variables live in `backend/.env`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Supabase project URL for server-side API calls. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key. Keep this private. |
| `FRONTEND_URL` | Recommended | Allowed CORS origin for the frontend. |
| `OPENAI_API_KEY` | Yes | OpenAI key for text and image generation. |
| `OPENAI_MODEL` | Recommended | Text model used by the LLM client. |
| `OPENAI_IMAGE_MODEL` | Recommended | Image generation model used for posters. |
| `OPENAI_IMAGE_SIZE` | Recommended | Poster image size. |
| `OPENAI_IMAGE_QUALITY` | Recommended | Poster image quality. |
| `GENERATED_ASSETS_BUCKET` | Recommended | Supabase Storage bucket for generated assets. |

Do not commit real `.env` files or service role keys.

## Project Structure

```text
DhoomAI/
├── app/
│   └── main.py                  # Compatibility wrapper for uvicorn app.main:app
├── backend/
│   ├── agents/                  # Older/experimental agent modules
│   ├── app/main.py              # FastAPI application and route registration
│   ├── core/                    # Settings and shared backend config
│   ├── db/                      # Database package placeholder
│   ├── prompts/                 # Prompt templates and structured output prompts
│   ├── routes/                  # FastAPI route handlers
│   ├── schemas/                 # Pydantic request/response and output schemas
│   ├── scripts/                 # Backend QA/smoke scripts
│   └── services/                # Business logic, LLM calls, Supabase, generation
├── database/                    # Reserved for database files
├── docs/                        # Planning docs and flow notes
└── frontend/
    ├── app/                     # Next.js App Router pages and API routes
    ├── components/              # UI, dashboard, campaign, product, landing modules
    ├── hooks/                   # React hooks
    ├── lib/                     # Frontend API clients, storage, view helpers
    ├── public/                  # Static images, logos, videos
    ├── types/                   # Shared frontend TypeScript types
    └── QA_FLOW.md               # Manual frontend QA checklist
```

## Frontend Scripts

Run these inside `frontend/`:

```bash
npm run dev        # Start local Next.js development server
npm run build      # Build production app
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
npm run qa         # Run typecheck and production build
```

## Backend Commands

Run these from the repo root after activating the virtual environment:

```bash
uvicorn app.main:app --reload --port 8000
python backend/scripts/qa_smoke.py
```

`app/main.py` adds `backend/` to `sys.path` and imports the FastAPI app from `backend/app/main.py`, so collaborators can run the backend from the repository root.

## Main Backend API

The backend registers routes under `/api/v1`.

| Area | Endpoint |
| --- | --- |
| Brand DNA | `POST /api/v1/brand-dna/analyze` |
| Brand intake | `POST /api/v1/brand-dna/intake/start` |
| Brand intake status | `GET /api/v1/brand-dna/intake/{job_id}` |
| Brand enrichment | `POST /api/v1/brand-dna/enrich` |
| Product DNA | `POST /api/v1/product-dna/analyze` |
| Campaign angles | `POST /api/v1/campaign-angles/generate` |
| Campaign variants | `POST /api/v1/campaign-variants/generate` |
| Campaign variant refinement | `POST /api/v1/campaign-variants/refine` |
| Final campaign | `POST /api/v1/campaigns/generate-final` |
| Campaign asset brief refinement | `POST /api/v1/campaign-asset-briefs/refine` |
| Generated asset slots | `POST /api/v1/campaign-generated-assets/create-slots` |
| Generated asset versions | `GET /api/v1/campaign-generated-assets/{generated_asset_id}/versions` |
| Select generated asset version | `POST /api/v1/campaign-generated-assets/select-version` |
| Poster generation | `POST /api/v1/poster-generation/generate` |
| Ghost Editor | `POST /api/v1/ghost-editor/campaign/refine` |

FastAPI docs are available while the backend is running:

```text
http://localhost:8000/docs
```

## Supabase Notes

The app expects Supabase for auth/session-aware frontend features, persistent campaign data, and generated asset storage.

At minimum, collaborators need:

- A Supabase project URL
- A publishable key for `frontend/.env.local`
- A service role key for `backend/.env`
- A storage bucket matching `GENERATED_ASSETS_BUCKET`, usually `generated-assets`

Database table definitions are not currently committed as migrations. Review `docs/database-plan.md`, backend route/service code, and the Supabase queries in `frontend/lib/` and `backend/services/` when creating or updating tables.

## QA and Verification

Before opening a PR or handing off work, run:

```bash
cd frontend
npm run qa
```

For backend import coverage:

```bash
source venv/bin/activate
python backend/scripts/qa_smoke.py
```

Manual frontend QA is documented in:

```text
frontend/QA_FLOW.md
```

Focus manual QA on:

- Dashboard boot and navigation
- Brand DNA intake and enrichment
- Campaign wizard from upload through final review
- Campaign result pack
- Ghost Editor
- Creative Lab and poster generation
- Campaign library
- Mobile responsiveness

## Development Guidelines

- Keep secrets out of Git.
- Keep frontend API calls pointed at `NEXT_PUBLIC_BACKEND_URL`.
- Keep backend routes registered in `backend/app/main.py`.
- Put request/response contracts in `backend/schemas/`.
- Put business logic in `backend/services/`, not directly in route handlers when the logic grows.
- Update prompt files in `backend/prompts/` alongside schema changes for structured AI outputs.
- Prefer focused changes. Avoid broad refactors while working on product-flow fixes.
- Update this README when setup, scripts, environment variables, or workflow assumptions change.

## Troubleshooting

If the frontend throws missing Supabase errors, check `frontend/.env.local` and restart `npm run dev`.

If browser API calls fail, confirm:

- Backend is running on `http://localhost:8000`
- `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
- `FRONTEND_URL=http://localhost:3000`
- CORS origins in `backend/app/main.py` include your frontend URL

If backend startup fails with settings errors, confirm `backend/.env` exists and includes `OPENAI_API_KEY`.

If Supabase requests fail, confirm the service role key is only in `backend/.env`, the publishable key is in `frontend/.env.local`, and the required tables/buckets exist.

If poster generation succeeds but assets do not appear, check the `GENERATED_ASSETS_BUCKET` value and bucket permissions.

## Current Gaps

- Python dependencies are not yet committed in a `requirements.txt` or `pyproject.toml`.
- Database migrations are not yet committed.
- `frontend/QA_FLOW.md` and `frontend/QA_flow.md` currently contain duplicate checklist content.

## License

No license has been added yet. Add one before publishing the project for public reuse.
