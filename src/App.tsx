type LeadStatus = 'New lead' | 'Needs quote' | 'Scheduled' | 'Follow-up';

type Lead = {
  area: string;
  customer: string;
  due: string;
  id: number;
  priority: 'High' | 'Medium' | 'Low';
  service: string;
  status: LeadStatus;
  value: string;
};

type Activity = {
  detail: string;
  time: string;
};

const pipelineStatuses: LeadStatus[] = ['New lead', 'Needs quote', 'Scheduled', 'Follow-up'];

const leads: Lead[] = [
  {
    id: 1084,
    customer: 'Mason R.',
    service: 'Garage door spring replacement',
    area: 'Mokena',
    status: 'New lead',
    priority: 'High',
    due: 'Call by 10:30 AM',
    value: '$425',
  },
  {
    id: 1085,
    customer: 'Oak Hill Dental',
    service: 'HVAC service request',
    area: 'New Lenox',
    status: 'Needs quote',
    priority: 'Medium',
    due: 'Quote today',
    value: '$1.8k',
  },
  {
    id: 1086,
    customer: 'Elena P.',
    service: 'Deck repair walkthrough',
    area: 'Frankfort',
    status: 'Scheduled',
    priority: 'Low',
    due: 'Thu 2:00 PM',
    value: '$3.2k',
  },
  {
    id: 1087,
    customer: 'South Trail Auto',
    service: 'Monthly lot lighting check',
    area: 'Tinley Park',
    status: 'Follow-up',
    priority: 'Medium',
    due: 'Ask for review',
    value: '$650',
  },
  {
    id: 1088,
    customer: 'Grant Family',
    service: 'Basement water mitigation',
    area: 'Orland Park',
    status: 'Needs quote',
    priority: 'High',
    due: 'Scope pending',
    value: '$4.9k',
  },
];

const activities: Activity[] = [
  { time: '8:12 AM', detail: 'New website request from Mokena marked high priority.' },
  { time: '9:05 AM', detail: 'Quote reminder created for Oak Hill Dental.' },
  { time: '10:20 AM', detail: 'Deck repair walkthrough moved to scheduled.' },
  { time: '11:00 AM', detail: 'Review request queued for completed lighting check.' },
];

const metrics = [
  ['18', 'open opportunities'],
  ['$24.8k', 'estimated pipeline'],
  ['7', 'follow-ups due'],
  ['91%', 'response target'],
];

const capabilities = [
  {
    title: 'Lead pipeline',
    text: 'Track every customer request by status, priority, service type, and next action.',
  },
  {
    title: 'Quote visibility',
    text: 'Keep estimate value, scope status, and follow-up timing visible before work is lost.',
  },
  {
    title: 'Job readiness',
    text: 'Surface scheduled jobs, customer details, and daily priorities for service teams.',
  },
];

function App() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <DashboardPreview />
      <CapabilitySection />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate/10 bg-cloud/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <a className="flex items-center gap-3" href="#top" aria-label="CertaOps home">
          <span className="grid h-10 w-10 place-items-center bg-night text-sm font-black text-white">
            CO
          </span>
          <span>
            <span className="block font-display text-xl font-bold text-night">CertaOps</span>
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-steel">
              Service operations
            </span>
          </span>
        </a>

        <nav className="flex flex-wrap gap-2 text-sm font-bold text-slate/70" aria-label="Primary">
          {['Platform', 'Dashboard', 'Workflow', 'Demo'].map((item) => (
            <a
              className="border border-slate/10 bg-white px-4 py-2 transition hover:border-cert hover:text-cert"
              href={item === 'Dashboard' ? '#dashboard' : '#platform'}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-night" id="top">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(20,184,166,0.18),transparent_26rem),radial-gradient(circle_at_82%_22%,rgba(37,99,235,0.2),transparent_30rem)]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:py-20">
        <div className="text-white">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-signal">
            CertaOps
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-tight sm:text-7xl">
            From first lead to finished job.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            A premium operations dashboard concept for local service businesses that need
            one place to manage leads, quotes, scheduled work, and follow-ups.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="bg-signal px-6 py-3 text-center text-sm font-extrabold text-night transition hover:bg-white" href="#dashboard">
              View dashboard shell
            </a>
            <a className="border border-white/20 bg-white/10 px-6 py-3 text-center text-sm font-extrabold text-white transition hover:bg-white hover:text-night" href="#platform">
              See product direction
            </a>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 shadow-glow">
          {metrics.map(([stat, label]) => (
            <div className="bg-night p-6 text-white" key={label}>
              <p className="font-display text-4xl font-bold text-white">{stat}</p>
              <p className="mt-1 text-sm font-semibold text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="py-16" id="dashboard">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
          <aside className="border border-slate/10 bg-white p-6 shadow-panel">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cert">
              Today focus
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-night">
              A working shell for leads, quotes, jobs, and follow-up.
            </h2>
            <p className="mt-4 leading-7 text-slate/70">
              Stage 1 starts with seeded demo data and a polished dashboard preview. Later
              stages will add status updates, lead detail views, quote building, scheduling,
              and public intake.
            </p>

            <div className="mt-8 grid gap-3">
              {activities.map((activity) => (
                <div className="border border-mist bg-cloud p-4" key={`${activity.time}-${activity.detail}`}>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-steel">
                    {activity.time}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate">{activity.detail}</p>
                </div>
              ))}
            </div>
          </aside>

          <section className="overflow-hidden border border-slate/10 bg-night text-white shadow-panel">
            <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-signal">
                  Live workspace
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold">Lead pipeline</h2>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/60">
                <span className="border border-white/10 px-3 py-2">Mokena demo</span>
                <span className="border border-white/10 px-3 py-2">Frontend only</span>
              </div>
            </div>

            <div className="grid gap-px bg-white/10 md:grid-cols-4">
              {pipelineStatuses.map((status) => (
                <PipelineColumn
                  key={status}
                  status={status}
                  leads={leads.filter((lead) => lead.status === status)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function PipelineColumn({ leads: columnLeads, status }: { leads: Lead[]; status: LeadStatus }) {
  return (
    <article className="min-h-80 bg-night p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/70">
          {status}
        </h3>
        <span className="bg-white/10 px-2 py-1 text-xs font-bold text-white/60">
          {columnLeads.length}
        </span>
      </div>

      <div className="grid gap-3">
        {columnLeads.map((lead) => (
          <LeadCard lead={lead} key={lead.id} />
        ))}
      </div>
    </article>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const priorityClass = {
    High: 'bg-coral/18 text-coral',
    Medium: 'bg-amber/18 text-amber',
    Low: 'bg-signal/16 text-signal',
  }[lead.priority];

  return (
    <div className="border border-white/10 bg-white/[0.06] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-white/50">#{lead.id}</p>
          <h4 className="mt-1 text-base font-bold text-white">{lead.customer}</h4>
        </div>
        <span className={`px-2 py-1 text-xs font-extrabold ${priorityClass}`}>{lead.priority}</span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-white/70">{lead.service}</p>
      <div className="mt-4 grid gap-2 border-t border-white/10 pt-3 text-xs font-bold text-white/50">
        <p>{lead.area}</p>
        <p>{lead.due}</p>
        <p className="text-white/80">{lead.value}</p>
      </div>
    </div>
  );
}

function CapabilitySection() {
  return (
    <section className="border-y border-slate/10 bg-white py-16" id="platform">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cert">
              Product foundation
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-night">
              Built to demo the business value before a backend exists.
            </h2>
          </div>
          <p className="max-w-xl leading-7 text-slate/70">
            This first stage is intentionally frontend-only. It lets a client understand
            the product quickly, while giving us a clear path toward real CRM, scheduling,
            quote, and notification features later.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden border border-slate/10 bg-slate/10 md:grid-cols-3">
          {capabilities.map((item) => (
            <article className="bg-cloud p-7" key={item.title}>
              <div className="mb-7 h-2 w-16 bg-cert" />
              <h3 className="font-display text-2xl font-bold text-night">{item.title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate/70">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-night py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-sm text-white/50 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl font-bold text-white">CertaOps</p>
          <p className="mt-1">Clear operations for local service businesses.</p>
        </div>
        <p>Portfolio demo concept. Stage 1 foundation.</p>
      </div>
    </footer>
  );
}

export default App;
