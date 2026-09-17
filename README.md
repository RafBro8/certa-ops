# CertaOps

Portfolio-ready operations dashboard concept for local service businesses to track leads, quotes, jobs, and follow-ups from first contact to completion.

## Current Stage

Stage 9.1: interaction feedback improvement.

## Brand Direction

Name:

```text
CertaOps
```

Tagline:

```text
From first lead to finished job.
```

Positioning:

- Premium operations dashboard for local service businesses.
- Built for contractors, HVAC, garage doors, cleaning, landscaping, detailing, and other service teams.
- Helps owners track leads, quote status, scheduled work, and follow-ups.
- Frontend-only demo first, with backend/auth/database deferred until the product direction is proven.
- Designed as both a portfolio project and a future sellable small-business software package.

## Release Includes

- Vite, React, TypeScript, and Tailwind CSS.
- CertaOps brand foundation.
- Marketing shell with value proposition.
- Dashboard shell with seeded service-business demo data.
- Lead pipeline dashboard with status columns.
- Search, priority filtering, and source filtering.
- Richer lead cards with contact, source, value, next action, and due timing.
- Dashboard metrics that respond to filtered demo data.
- Empty states for filtered pipeline columns.
- Selectable lead cards.
- Lead detail workspace with customer, contact, address, request summary, and next action.
- Status update controls that move leads between pipeline columns.
- Activity timeline and frontend-only note entry.
- Quote builder controls for estimate value and quote status.
- Frontend-only quote status workflow from not started to approved.
- Convert-to-scheduled-job interaction for selected leads.
- Upcoming jobs board with scheduled work and quote summary metrics.
- Completed job follow-up queue.
- Review request tracker with demo send action.
- Follow-up sent interaction on selected leads and queue cards.
- Lost lead reason tracking.
- Dashboard metrics for reviews due and follow-ups due.
- Public-facing lead intake section.
- Service request form with customer, contact, location, service type, urgency, and notes.
- Frontend-only form validation and confirmation state.
- Submitted requests become new selected dashboard leads.
- Intake submissions initialize local activity timeline entries.
- Responsive dashboard polish for mobile, tablet, and desktop.
- Stronger keyboard focus states and form accessibility treatment.
- Premium lead-card hover/selected states.
- Demo loading, empty, and error-state panel.
- Portfolio-ready case study notes and screenshot references.
- Production metadata, favicon, web manifest, and social preview card.
- Vercel refresh fallback config for future client-side routes.
- Refined operational palette with a warmer neutral workspace canvas.
- Clearer surface hierarchy, quieter shadows, and consistent control states.
- Improved mobile navigation, anchor positioning, and reduced-motion support.
- In-context status confirmations with current-status emphasis.
- Optional pipeline jump and focus after moving a lead.
- Protected active status and improved mobile filter touch targets.
- README and staged build plan.

## Case Study

### Problem

Local service businesses often manage leads, quotes, job scheduling, and review follow-ups across calls, texts, spreadsheets, and memory. That creates missed callbacks, unclear quote status, and lost review opportunities.

### Solution

CertaOps demonstrates a focused service-operations workspace where a business owner can capture a public request, review the lead, move it through quote and scheduling, and close the loop with follow-up and review actions.

### Demo Flow

1. Submit a customer request from the public intake section.
2. See the request appear as a new selected website lead.
3. Move the lead through pipeline status columns.
4. Update quote value and quote status.
5. Convert the lead into a scheduled job.
6. Mark follow-up and review actions from the closeout workflow.

### Feature Highlights

- Frontend-only public intake flow.
- Interactive lead pipeline with filters and selected lead state.
- Quote builder prototype.
- Upcoming jobs board.
- Review and follow-up tracker.
- Lost opportunity reason tracking.
- Demo loading, empty, and error states.
- Responsive layout QA across desktop and mobile.

### Screenshots

- `docs/screenshots/certaops-desktop.png`
- `docs/screenshots/certaops-mobile.png`

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## Live Demo

Deployment target:

```text
Vercel
```

Suggested project name:

```text
certaops-demo
```

Live demo:

```text
https://certa-ops-sigma.vercel.app/
```

Suggested custom domain, if used:

```text
certaps.com
```

## Local Development

```cmd
npm install
npm run dev
```

Quality checks:

```cmd
npm test
```

## Deployment Notes

Vercel settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

The project includes `vercel.json` with a fallback rewrite to `index.html`, which keeps future client-side routes safe on refresh.

## Portfolio Release Checklist

- Desktop and mobile screenshots are saved in `docs/screenshots`.
- README explains the problem, solution, stack, features, and demo flow.
- Public intake, pipeline, quote, schedule, follow-up, and demo states are interactive.
- The footer identifies this as a portfolio demo concept.
- `npm test` should pass before deploying.
