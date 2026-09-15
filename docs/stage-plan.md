# CertaOps Stage Plan

## Stage 1: Product Foundation and Frontend Setup

Goal: create the frontend foundation, brand direction, and first operational dashboard preview.

Build:
- Vite, React, TypeScript, and Tailwind CSS.
- Brand direction for CertaOps.
- Initial marketing shell.
- Initial dashboard shell.
- Seeded demo lead data.
- README and stage plan.

Commit checkpoint:
- `chore: scaffold certaops demo`

## Stage 2: Lead Pipeline Dashboard

Goal: make the dashboard feel like a usable operational workspace.

Build:
- Dashboard overview.
- Lead status columns.
- Lead cards.
- Priority and follow-up indicators.
- Filtering and search.
- Demo metrics.
- Empty filtered-column states.

Commit checkpoint:
- `feat: add lead pipeline dashboard`

## Stage 3: Lead Detail and Status Workflow

Goal: make each lead feel actionable.

Build:
- Lead detail panel or page.
- Status update interactions.
- Notes and activity timeline.
- Customer/contact information.
- Requested service details.
- Frontend-only note entry.
- Selected lead state.

Commit checkpoint:
- `feat: add lead workflow`

## Stage 4: Quote and Job Scheduling Prototype

Goal: show how leads become scoped and scheduled work.

Build:
- Quote builder UI.
- Estimated value and quote status.
- Job schedule view.
- Upcoming jobs.
- Convert lead to scheduled job interaction.
- Frontend-only quote updates on the selected lead.
- Schedule summary metrics for approved work and pending quotes.

Commit checkpoint:
- `feat: add quote and scheduling workflow`

## Stage 5: Review and Follow-Up System

Goal: show post-job follow-up value.

Build:
- Completed job follow-up queue.
- Review request tracker.
- Follow-up reminders.
- Lost lead reason tracking.
- Follow-up sent interaction.
- Review request sent interaction.
- Dashboard metrics for reviews due, follow-ups due, and lost opportunities.

Commit checkpoint:
- `feat: add follow up tracker`

## Stage 6: Public Lead Intake Page

Goal: connect the public client request experience to the operational dashboard.

Build:
- Public-facing landing/intake page.
- Service request form.
- Add submitted request into demo pipeline.
- Confirmation state.

Commit checkpoint:
- `feat: add public lead intake`

## Stage 7: Portfolio Polish and Responsive QA

Goal: make the demo polished enough to show to clients and portfolio visitors.

Build:
- Premium UI polish.
- Mobile dashboard treatment.
- Empty/loading/error states.
- Accessibility pass.
- README case study.
- Screenshots.

Commit checkpoint:
- `style: polish certaops demo`

## Stage 8: Deployment

Goal: publish the frontend-only demo.

Build:
- Vercel deployment.
- Route refresh config if needed.
- Live demo URL.
- Optional domain setup.

Commit checkpoint:
- `chore: prepare deployment`
