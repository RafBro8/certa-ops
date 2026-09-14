import { useMemo, useState } from 'react';

type LeadStatus = 'New lead' | 'Needs quote' | 'Scheduled' | 'Follow-up';
type LeadPriority = 'High' | 'Medium' | 'Low';
type LeadSource = 'Website' | 'Phone' | 'Referral' | 'Repeat client';

type Lead = {
  age: string;
  area: string;
  contact: string;
  customer: string;
  due: string;
  id: number;
  nextAction: string;
  priority: LeadPriority;
  service: string;
  source: LeadSource;
  status: LeadStatus;
  value: number;
};

type Activity = {
  detail: string;
  time: string;
};

type PriorityFilter = 'All' | LeadPriority;
type SourceFilter = 'All' | LeadSource;

const pipelineStatuses: LeadStatus[] = ['New lead', 'Needs quote', 'Scheduled', 'Follow-up'];
const priorityOptions: PriorityFilter[] = ['All', 'High', 'Medium', 'Low'];
const sourceOptions: SourceFilter[] = ['All', 'Website', 'Phone', 'Referral', 'Repeat client'];

const leads: Lead[] = [
  {
    id: 1084,
    customer: 'Mason R.',
    contact: '(708) 555-0184',
    service: 'Garage door spring replacement',
    area: 'Mokena',
    status: 'New lead',
    priority: 'High',
    source: 'Website',
    due: 'Call by 10:30 AM',
    nextAction: 'Confirm door size and emergency timing.',
    age: '12 min old',
    value: 425,
  },
  {
    id: 1085,
    customer: 'Oak Hill Dental',
    contact: 'ops@oakhill.example',
    service: 'HVAC service request',
    area: 'New Lenox',
    status: 'Needs quote',
    priority: 'Medium',
    source: 'Phone',
    due: 'Quote today',
    nextAction: 'Send service quote before close of business.',
    age: '1 hr old',
    value: 1800,
  },
  {
    id: 1086,
    customer: 'Elena P.',
    contact: '(815) 555-0116',
    service: 'Deck repair walkthrough',
    area: 'Frankfort',
    status: 'Scheduled',
    priority: 'Low',
    source: 'Referral',
    due: 'Thu 2:00 PM',
    nextAction: 'Bring railing samples and repair checklist.',
    age: 'Yesterday',
    value: 3200,
  },
  {
    id: 1087,
    customer: 'South Trail Auto',
    contact: 'Miguel, facility manager',
    service: 'Monthly lot lighting check',
    area: 'Tinley Park',
    status: 'Follow-up',
    priority: 'Medium',
    source: 'Repeat client',
    due: 'Ask for review',
    nextAction: 'Send review request and maintenance renewal note.',
    age: '2 days old',
    value: 650,
  },
  {
    id: 1088,
    customer: 'Grant Family',
    contact: '(708) 555-0198',
    service: 'Basement water mitigation',
    area: 'Orland Park',
    status: 'Needs quote',
    priority: 'High',
    source: 'Website',
    due: 'Scope pending',
    nextAction: 'Add photos to quote and confirm start window.',
    age: '3 hr old',
    value: 4900,
  },
  {
    id: 1089,
    customer: 'Cornerstone Salon',
    contact: 'frontdesk@cornerstone.example',
    service: 'After-hours electrical inspection',
    area: 'Homer Glen',
    status: 'New lead',
    priority: 'Medium',
    source: 'Referral',
    due: 'Call this afternoon',
    nextAction: 'Check preferred after-hours access time.',
    age: '38 min old',
    value: 900,
  },
  {
    id: 1090,
    customer: 'Brennan K.',
    contact: '(708) 555-0172',
    service: 'Driveway pressure wash and seal',
    area: 'Mokena',
    status: 'Scheduled',
    priority: 'Medium',
    source: 'Website',
    due: 'Fri 8:00 AM',
    nextAction: 'Confirm weather window and crew arrival.',
    age: '2 days old',
    value: 780,
  },
  {
    id: 1091,
    customer: 'Linden Commons HOA',
    contact: 'board@linden.example',
    service: 'Landscape lighting quote',
    area: 'Frankfort',
    status: 'Follow-up',
    priority: 'High',
    source: 'Phone',
    due: 'Follow up by 3:00 PM',
    nextAction: 'Call board contact about approved fixture count.',
    age: '4 days old',
    value: 6200,
  },
];

const activities: Activity[] = [
  { time: '8:12 AM', detail: 'New website request from Mokena marked high priority.' },
  { time: '9:05 AM', detail: 'Quote reminder created for Oak Hill Dental.' },
  { time: '10:20 AM', detail: 'Deck repair walkthrough moved to scheduled.' },
  { time: '11:00 AM', detail: 'Review request queued for completed lighting check.' },
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
          {[
            ['Platform', '#platform'],
            ['Dashboard', '#dashboard'],
            ['Workflow', '#dashboard'],
            ['Demo', '#dashboard'],
          ].map(([item, href]) => (
            <a
              className="border border-slate/10 bg-white px-4 py-2 transition hover:border-cert hover:text-cert"
              href={href}
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
  const heroMetrics = [
    [String(leads.length), 'open opportunities'],
    [formatCurrency(sumLeadValue(leads)), 'estimated pipeline'],
    [String(leads.filter((lead) => lead.status === 'Follow-up').length), 'follow-ups due'],
    ['91%', 'response target'],
  ];

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
              View dashboard
            </a>
            <a className="border border-white/20 bg-white/10 px-6 py-3 text-center text-sm font-extrabold text-white transition hover:bg-white hover:text-night" href="#platform">
              See product direction
            </a>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 shadow-glow sm:grid-cols-2">
          {heroMetrics.map(([stat, label]) => (
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
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('All');

  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) => {
        const searchTarget = `${lead.customer} ${lead.service} ${lead.area} ${lead.contact}`.toLowerCase();
        const matchesSearch = searchTarget.includes(searchTerm.trim().toLowerCase());
        const matchesPriority = priorityFilter === 'All' || lead.priority === priorityFilter;
        const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

        return matchesSearch && matchesPriority && matchesSource;
      }),
    [priorityFilter, searchTerm, sourceFilter],
  );

  const dashboardMetrics = [
    { label: 'Visible leads', value: String(filteredLeads.length), tone: 'cert' },
    { label: 'Pipeline value', value: formatCurrency(sumLeadValue(filteredLeads)), tone: 'signal' },
    {
      label: 'High priority',
      value: String(filteredLeads.filter((lead) => lead.priority === 'High').length),
      tone: 'coral',
    },
    {
      label: 'Needs action',
      value: String(filteredLeads.filter((lead) => lead.status !== 'Scheduled').length),
      tone: 'amber',
    },
  ];

  return (
    <section className="py-16" id="dashboard">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cert">
              Lead pipeline dashboard
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-night">
              A usable command center for the next lead, quote, and follow-up.
            </h2>
          </div>
          <p className="max-w-xl leading-7 text-slate/70">
            Stage 2 turns the static shell into a working dashboard view with filters,
            search, richer cards, and the metrics a service owner would check every morning.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="grid gap-5">
            <FilterPanel
              priorityFilter={priorityFilter}
              searchTerm={searchTerm}
              setPriorityFilter={setPriorityFilter}
              setSearchTerm={setSearchTerm}
              setSourceFilter={setSourceFilter}
              sourceFilter={sourceFilter}
            />
            <TodayFocus />
          </aside>

          <section className="overflow-hidden border border-slate/10 bg-night text-white shadow-panel">
            <div className="border-b border-white/10 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-signal">
                    Live workspace
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold">Lead pipeline</h2>
                </div>
                <div className="grid gap-2 sm:grid-cols-4 xl:min-w-[34rem]">
                  {dashboardMetrics.map((metric) => (
                    <MetricTile metric={metric} key={metric.label} />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-px bg-white/10 xl:grid-cols-4">
              {pipelineStatuses.map((status) => (
                <PipelineColumn
                  key={status}
                  leads={filteredLeads.filter((lead) => lead.status === status)}
                  status={status}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function FilterPanel({
  priorityFilter,
  searchTerm,
  setPriorityFilter,
  setSearchTerm,
  setSourceFilter,
  sourceFilter,
}: {
  priorityFilter: PriorityFilter;
  searchTerm: string;
  setPriorityFilter: (value: PriorityFilter) => void;
  setSearchTerm: (value: string) => void;
  setSourceFilter: (value: SourceFilter) => void;
  sourceFilter: SourceFilter;
}) {
  return (
    <section className="border border-slate/10 bg-white p-6 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cert">
            Controls
          </p>
          <h3 className="mt-3 font-display text-2xl font-bold text-night">Find the next move.</h3>
        </div>
        <button
          className="border border-slate/10 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate transition hover:border-cert hover:text-cert"
          onClick={() => {
            setSearchTerm('');
            setPriorityFilter('All');
            setSourceFilter('All');
          }}
          type="button"
        >
          Reset
        </button>
      </div>

      <label className="mt-6 grid gap-2 text-sm font-bold text-slate">
        Search leads
        <input
          className="h-12 border border-slate/10 bg-cloud px-3 text-sm font-semibold text-night outline-none transition focus:border-cert"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Customer, service, town..."
          value={searchTerm}
        />
      </label>

      <div className="mt-6">
        <p className="text-sm font-bold text-slate">Priority</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {priorityOptions.map((option) => (
            <FilterButton
              active={priorityFilter === option}
              key={option}
              label={option}
              onClick={() => setPriorityFilter(option)}
            />
          ))}
        </div>
      </div>

      <label className="mt-6 grid gap-2 text-sm font-bold text-slate">
        Lead source
        <select
          className="h-12 border border-slate/10 bg-cloud px-3 text-sm font-semibold text-night outline-none transition focus:border-cert"
          onChange={(event) => setSourceFilter(event.target.value as SourceFilter)}
          value={sourceFilter}
        >
          {sourceOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    </section>
  );
}

function TodayFocus() {
  return (
    <aside className="border border-slate/10 bg-white p-6 shadow-panel">
      <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cert">
        Today focus
      </p>
      <h3 className="mt-3 font-display text-2xl font-bold text-night">
        The work that should not slip.
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate/70">
        A service owner can scan the queue, follow up faster, and protect revenue that
        would otherwise get buried in texts, calls, or spreadsheets.
      </p>

      <div className="mt-6 grid gap-3">
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
  );
}

function MetricTile({ metric }: { metric: { label: string; tone: string; value: string } }) {
  const toneClass = {
    amber: 'text-amber',
    cert: 'text-cert',
    coral: 'text-coral',
    signal: 'text-signal',
  }[metric.tone];

  return (
    <div className="border border-white/10 bg-white/[0.06] p-3">
      <p className={`font-display text-2xl font-bold ${toneClass}`}>{metric.value}</p>
      <p className="mt-1 text-xs font-bold text-white/50">{metric.label}</p>
    </div>
  );
}

function PipelineColumn({ leads: columnLeads, status }: { leads: Lead[]; status: LeadStatus }) {
  const statusValue = sumLeadValue(columnLeads);

  return (
    <article className="min-h-96 bg-night p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/70">
            {status}
          </h3>
          <p className="mt-1 text-xs font-bold text-white/50">{formatCurrency(statusValue)}</p>
        </div>
        <span className="bg-white/10 px-2 py-1 text-xs font-bold text-white/60">
          {columnLeads.length}
        </span>
      </div>

      <div className="grid gap-3">
        {columnLeads.length > 0 ? (
          columnLeads.map((lead) => <LeadCard lead={lead} key={lead.id} />)
        ) : (
          <EmptyColumn status={status} />
        )}
      </div>
    </article>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const priorityClass = {
    High: 'bg-coral/20 text-coral',
    Medium: 'bg-amber/20 text-amber',
    Low: 'bg-signal/20 text-signal',
  }[lead.priority];

  const sourceClass = {
    Phone: 'border-amber/30 text-amber',
    Referral: 'border-violet/30 text-violet',
    'Repeat client': 'border-signal/30 text-signal',
    Website: 'border-cert/30 text-cert',
  }[lead.source];

  return (
    <button className="group border border-white/10 bg-white/[0.06] p-4 text-left transition hover:border-signal/50 hover:bg-white/10" type="button">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-white/50">#{lead.id}</p>
          <h4 className="mt-1 text-base font-bold text-white">{lead.customer}</h4>
        </div>
        <span className={`px-2 py-1 text-xs font-extrabold ${priorityClass}`}>{lead.priority}</span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-white/70">{lead.service}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`border px-2 py-1 text-xs font-extrabold ${sourceClass}`}>{lead.source}</span>
        <span className="border border-white/10 px-2 py-1 text-xs font-bold text-white/60">
          {lead.area}
        </span>
      </div>
      <div className="mt-4 grid gap-2 border-t border-white/10 pt-3 text-xs font-bold text-white/50">
        <p>{lead.contact}</p>
        <p>{lead.due}</p>
        <p className="text-white/70">{lead.nextAction}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-white/40">{lead.age}</p>
        <p className="font-display text-lg font-bold text-white">{formatCurrency(lead.value)}</p>
      </div>
    </button>
  );
}

function EmptyColumn({ status }: { status: LeadStatus }) {
  return (
    <div className="border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/50">
      No {status.toLowerCase()} cards match the current filters.
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`border px-3 py-2 text-sm font-extrabold transition ${
        active
          ? 'border-cert bg-cert text-white'
          : 'border-slate/10 bg-cloud text-slate hover:border-cert hover:text-cert'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
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
            This demo is intentionally frontend-only in the early stages. It lets a client
            understand the product quickly, while giving us a clear path toward real CRM,
            scheduling, quote, and notification features later.
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
        <p>Portfolio demo concept. Stage 2 pipeline dashboard.</p>
      </div>
    </footer>
  );
}

function formatCurrency(value: number) {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }

  return `$${value}`;
}

function sumLeadValue(items: Lead[]) {
  return items.reduce((total, lead) => total + lead.value, 0);
}

export default App;
