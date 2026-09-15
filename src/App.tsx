import { type FormEvent, useMemo, useState } from 'react';

type LeadStatus = 'New lead' | 'Needs quote' | 'Scheduled' | 'Follow-up';
type LeadPriority = 'High' | 'Medium' | 'Low';
type LeadSource = 'Website' | 'Phone' | 'Referral' | 'Repeat client';
type QuoteStatus = 'Not started' | 'Draft' | 'Sent' | 'Approved';
type ReviewStatus = 'Not ready' | 'Queued' | 'Sent' | 'Received';
type FollowUpStatus = 'None' | 'Due today' | 'Scheduled' | 'Sent';
type LostReason = 'None' | 'Price' | 'Timing' | 'No response' | 'Out of scope';

type Lead = {
  age: string;
  area: string;
  address: string;
  contact: string;
  customer: string;
  due: string;
  id: number;
  nextAction: string;
  priority: LeadPriority;
  followUpStatus: FollowUpStatus;
  lostReason: LostReason;
  quoteStatus: QuoteStatus;
  reviewStatus: ReviewStatus;
  scheduleWindow: string;
  service: string;
  source: LeadSource;
  status: LeadStatus;
  value: number;
  requestedDate: string;
  requestSummary: string;
};

type Activity = {
  detail: string;
  time: string;
};

type IntakeForm = {
  contact: string;
  location: string;
  name: string;
  notes: string;
  serviceType: string;
  urgency: 'Today' | 'This week' | 'Planning ahead';
};

type PriorityFilter = 'All' | LeadPriority;
type SourceFilter = 'All' | LeadSource;

const pipelineStatuses: LeadStatus[] = ['New lead', 'Needs quote', 'Scheduled', 'Follow-up'];
const priorityOptions: PriorityFilter[] = ['All', 'High', 'Medium', 'Low'];
const sourceOptions: SourceFilter[] = ['All', 'Website', 'Phone', 'Referral', 'Repeat client'];
const quoteStatuses: QuoteStatus[] = ['Not started', 'Draft', 'Sent', 'Approved'];
const lostReasons: LostReason[] = ['None', 'Price', 'Timing', 'No response', 'Out of scope'];
const serviceOptions = [
  'Emergency repair',
  'Estimate request',
  'Maintenance visit',
  'Walkthrough / consultation',
  'Project follow-up',
];
const initialIntakeForm: IntakeForm = {
  contact: '',
  location: '',
  name: '',
  notes: '',
  serviceType: serviceOptions[0],
  urgency: 'This week',
};

const initialLeads: Lead[] = [
  {
    id: 1084,
    customer: 'Mason R.',
    contact: '(708) 555-0184',
    service: 'Garage door spring replacement',
    area: 'Mokena',
    address: '193rd St near Wolf Road',
    status: 'New lead',
    priority: 'High',
    source: 'Website',
    due: 'Call by 10:30 AM',
    nextAction: 'Confirm door size and emergency timing.',
    age: '12 min old',
    value: 425,
    followUpStatus: 'None',
    lostReason: 'None',
    quoteStatus: 'Not started',
    reviewStatus: 'Not ready',
    scheduleWindow: 'Unscheduled',
    requestedDate: 'Today',
    requestSummary:
      'Customer says the garage door will not lift and one spring appears broken. Needs same-day availability if possible.',
  },
  {
    id: 1085,
    customer: 'Oak Hill Dental',
    contact: 'ops@oakhill.example',
    service: 'HVAC service request',
    area: 'New Lenox',
    address: 'Lincoln Hwy office suite',
    status: 'Needs quote',
    priority: 'Medium',
    source: 'Phone',
    due: 'Quote today',
    nextAction: 'Send service quote before close of business.',
    age: '1 hr old',
    value: 1800,
    followUpStatus: 'Scheduled',
    lostReason: 'None',
    quoteStatus: 'Draft',
    reviewStatus: 'Not ready',
    scheduleWindow: 'Tentative: Wed morning',
    requestedDate: 'Today',
    requestSummary:
      'Office manager requested a quote for an intermittent rooftop unit issue before next week of patient appointments.',
  },
  {
    id: 1086,
    customer: 'Elena P.',
    contact: '(815) 555-0116',
    service: 'Deck repair walkthrough',
    area: 'Frankfort',
    address: 'Old Plank Trail neighborhood',
    status: 'Scheduled',
    priority: 'Low',
    source: 'Referral',
    due: 'Thu 2:00 PM',
    nextAction: 'Bring railing samples and repair checklist.',
    age: 'Yesterday',
    value: 3200,
    followUpStatus: 'Scheduled',
    lostReason: 'None',
    quoteStatus: 'Approved',
    reviewStatus: 'Not ready',
    scheduleWindow: 'Thu 2:00 PM',
    requestedDate: 'Yesterday',
    requestSummary:
      'Homeowner wants loose railing sections, stair movement, and board rot reviewed before hosting family in three weeks.',
  },
  {
    id: 1087,
    customer: 'South Trail Auto',
    contact: 'Miguel, facility manager',
    service: 'Monthly lot lighting check',
    area: 'Tinley Park',
    address: 'La Grange Road frontage',
    status: 'Follow-up',
    priority: 'Medium',
    source: 'Repeat client',
    due: 'Ask for review',
    nextAction: 'Send review request and maintenance renewal note.',
    age: '2 days old',
    value: 650,
    followUpStatus: 'Due today',
    lostReason: 'None',
    quoteStatus: 'Approved',
    reviewStatus: 'Queued',
    scheduleWindow: 'Completed',
    requestedDate: 'This week',
    requestSummary:
      'Recurring client completed a lighting check. Follow-up is ready for review request and renewal conversation.',
  },
  {
    id: 1088,
    customer: 'Grant Family',
    contact: '(708) 555-0198',
    service: 'Basement water mitigation',
    area: 'Orland Park',
    address: '143rd Street corridor',
    status: 'Needs quote',
    priority: 'High',
    source: 'Website',
    due: 'Scope pending',
    nextAction: 'Add photos to quote and confirm start window.',
    age: '3 hr old',
    value: 4900,
    followUpStatus: 'Scheduled',
    lostReason: 'None',
    quoteStatus: 'Draft',
    reviewStatus: 'Not ready',
    scheduleWindow: 'Tentative: Tomorrow AM',
    requestedDate: 'Today',
    requestSummary:
      'Homeowner reported water entry after storms and uploaded photos. Needs quote range and earliest assessment window.',
  },
  {
    id: 1089,
    customer: 'Cornerstone Salon',
    contact: 'frontdesk@cornerstone.example',
    service: 'After-hours electrical inspection',
    area: 'Homer Glen',
    address: 'Bell Road retail strip',
    status: 'New lead',
    priority: 'Medium',
    source: 'Referral',
    due: 'Call this afternoon',
    nextAction: 'Check preferred after-hours access time.',
    age: '38 min old',
    value: 900,
    followUpStatus: 'None',
    lostReason: 'None',
    quoteStatus: 'Not started',
    reviewStatus: 'Not ready',
    scheduleWindow: 'Unscheduled',
    requestedDate: 'Today',
    requestSummary:
      'Salon wants inspection after flickering lights near styling stations. Work must happen outside client hours.',
  },
  {
    id: 1090,
    customer: 'Brennan K.',
    contact: '(708) 555-0172',
    service: 'Driveway pressure wash and seal',
    area: 'Mokena',
    address: 'La Porte Road subdivision',
    status: 'Scheduled',
    priority: 'Medium',
    source: 'Website',
    due: 'Fri 8:00 AM',
    nextAction: 'Confirm weather window and crew arrival.',
    age: '2 days old',
    value: 780,
    followUpStatus: 'Scheduled',
    lostReason: 'None',
    quoteStatus: 'Approved',
    reviewStatus: 'Not ready',
    scheduleWindow: 'Fri 8:00 AM',
    requestedDate: 'Monday',
    requestSummary:
      'Customer approved driveway cleaning and sealing. Needs weather confirmation before crew dispatch.',
  },
  {
    id: 1091,
    customer: 'Linden Commons HOA',
    contact: 'board@linden.example',
    service: 'Landscape lighting quote',
    area: 'Frankfort',
    address: 'Linden Commons entrance',
    status: 'Follow-up',
    priority: 'High',
    source: 'Phone',
    due: 'Follow up by 3:00 PM',
    nextAction: 'Call board contact about approved fixture count.',
    age: '4 days old',
    value: 6200,
    followUpStatus: 'Due today',
    lostReason: 'None',
    quoteStatus: 'Sent',
    reviewStatus: 'Not ready',
    scheduleWindow: 'Pending board approval',
    requestedDate: 'Last week',
    requestSummary:
      'HOA board has fixture count questions before approving the landscape lighting package.',
  },
];

const initialLeadActivities: Record<number, Activity[]> = {
  1084: [
    { time: '8:12 AM', detail: 'Website request received and marked high priority.' },
    { time: '8:16 AM', detail: 'Auto-response sent with expected callback window.' },
  ],
  1085: [
    { time: '9:05 AM', detail: 'Quote reminder created for Oak Hill Dental.' },
    { time: '9:18 AM', detail: 'Service manager tagged as quote owner.' },
  ],
  1086: [
    { time: 'Yesterday', detail: 'Walkthrough scheduled for Thursday at 2:00 PM.' },
    { time: '10:20 AM', detail: 'Deck repair checklist added to the job notes.' },
  ],
  1087: [
    { time: '2 days ago', detail: 'Monthly lighting check marked complete.' },
    { time: '11:00 AM', detail: 'Review request queued for completed lighting check.' },
  ],
  1088: [
    { time: '9:44 AM', detail: 'Storm damage request received with photo note.' },
    { time: '10:02 AM', detail: 'Quote scope marked pending.' },
  ],
  1089: [
    { time: '10:38 AM', detail: 'Referral source recorded from previous salon project.' },
  ],
  1090: [
    { time: 'Monday', detail: 'Driveway seal job scheduled.' },
    { time: 'Today', detail: 'Weather confirmation still needed.' },
  ],
  1091: [
    { time: 'Last week', detail: 'HOA quote sent to board contact.' },
    { time: 'Today', detail: 'Follow-up due before 3:00 PM.' },
  ],
};

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
    <header className="sticky top-0 z-20 border-b border-slate/10 bg-cloud/95 backdrop-blur">
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

        <nav className="flex gap-2 overflow-x-auto pb-1 text-sm font-bold text-slate/70 sm:flex-wrap sm:overflow-visible sm:pb-0" aria-label="Primary">
          {[
            ['Platform', '#platform'],
            ['Request', '#intake'],
            ['Dashboard', '#dashboard'],
            ['Workflow', '#workflow'],
            ['Demo', '#demo'],
          ].map(([item, href]) => (
            <a
              className="shrink-0 border border-slate/10 bg-white px-4 py-2 transition hover:border-cert hover:text-cert"
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
    [String(initialLeads.length), 'open opportunities'],
    [formatCurrency(sumLeadValue(initialLeads)), 'estimated pipeline'],
    [String(initialLeads.filter((lead) => lead.status === 'Follow-up').length), 'follow-ups due'],
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
            <a className="bg-signal px-6 py-3 text-center text-sm font-extrabold text-night transition hover:bg-white" href="#intake">
              Try intake flow
            </a>
            <a className="border border-white/20 bg-white/10 px-6 py-3 text-center text-sm font-extrabold text-white transition hover:bg-white hover:text-night" href="#dashboard">
              View dashboard
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
  const [leadItems, setLeadItems] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('All');
  const [selectedLeadId, setSelectedLeadId] = useState(initialLeads[0].id);
  const [leadActivities, setLeadActivities] = useState(initialLeadActivities);
  const [noteDraft, setNoteDraft] = useState('');
  const [submittedLeadId, setSubmittedLeadId] = useState<number | null>(null);

  const filteredLeads = useMemo(
    () =>
      leadItems.filter((lead) => {
        const searchTarget = `${lead.customer} ${lead.service} ${lead.area} ${lead.contact}`.toLowerCase();
        const matchesSearch = searchTarget.includes(searchTerm.trim().toLowerCase());
        const matchesPriority = priorityFilter === 'All' || lead.priority === priorityFilter;
        const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

        return matchesSearch && matchesPriority && matchesSource;
      }),
    [leadItems, priorityFilter, searchTerm, sourceFilter],
  );

  const selectedLead =
    leadItems.find((lead) => lead.id === selectedLeadId) || filteredLeads[0] || leadItems[0];

  const dashboardMetrics = [
    { label: 'Visible leads', value: String(filteredLeads.length), tone: 'cert' },
    { label: 'Pipeline value', value: formatCurrency(sumLeadValue(filteredLeads)), tone: 'signal' },
    {
      label: 'Reviews due',
      value: String(filteredLeads.filter((lead) => lead.reviewStatus === 'Queued').length),
      tone: 'coral',
    },
    {
      label: 'Follow-ups',
      value: String(filteredLeads.filter((lead) => lead.followUpStatus === 'Due today').length),
      tone: 'amber',
    },
  ];

  function handleStatusChange(leadId: number, status: LeadStatus) {
    setLeadItems((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status,
              nextAction: getNextActionForStatus(status),
            }
          : lead,
      ),
    );
    setLeadActivities((current) => ({
      ...current,
      [leadId]: [
        { time: 'Now', detail: `Status moved to ${status}.` },
        ...(current[leadId] || []),
      ],
    }));
    setSelectedLeadId(leadId);
  }

  function handleQuoteChange(leadId: number, value: number, quoteStatus: QuoteStatus) {
    setLeadItems((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              quoteStatus,
              value,
              nextAction: getNextActionForQuoteStatus(quoteStatus),
            }
          : lead,
      ),
    );
    setLeadActivities((current) => ({
      ...current,
      [leadId]: [
        { time: 'Now', detail: `Quote updated to ${formatCurrency(value)} and marked ${quoteStatus}.` },
        ...(current[leadId] || []),
      ],
    }));
    setSelectedLeadId(leadId);
  }

  function handleScheduleLead(leadId: number) {
    setLeadItems((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              quoteStatus: 'Approved',
              scheduleWindow:
                lead.scheduleWindow === 'Unscheduled' || lead.scheduleWindow.startsWith('Tentative')
                  ? 'Next available crew window'
                  : lead.scheduleWindow,
              followUpStatus: 'Scheduled',
              status: 'Scheduled',
              nextAction: 'Confirm schedule, access notes, and crew readiness.',
            }
          : lead,
      ),
    );
    setLeadActivities((current) => ({
      ...current,
      [leadId]: [
        { time: 'Now', detail: 'Lead converted to a scheduled job.' },
        ...(current[leadId] || []),
      ],
    }));
    setSelectedLeadId(leadId);
  }

  function handleFollowUpSent(leadId: number) {
    setLeadItems((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              followUpStatus: 'Sent',
              status: 'Follow-up',
              nextAction: 'Follow-up sent. Watch for reply or next review opportunity.',
            }
          : lead,
      ),
    );
    setLeadActivities((current) => ({
      ...current,
      [leadId]: [
        { time: 'Now', detail: 'Follow-up marked as sent.' },
        ...(current[leadId] || []),
      ],
    }));
    setSelectedLeadId(leadId);
  }

  function handleReviewRequest(leadId: number) {
    setLeadItems((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              followUpStatus: 'Sent',
              reviewStatus: 'Sent',
              status: 'Follow-up',
              nextAction: 'Review request sent. Check back for response.',
            }
          : lead,
      ),
    );
    setLeadActivities((current) => ({
      ...current,
      [leadId]: [
        { time: 'Now', detail: 'Review request sent after completed work.' },
        ...(current[leadId] || []),
      ],
    }));
    setSelectedLeadId(leadId);
  }

  function handleLostReasonChange(leadId: number, lostReason: LostReason) {
    setLeadItems((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              lostReason,
              status: lostReason === 'None' ? lead.status : 'Follow-up',
              nextAction:
                lostReason === 'None'
                  ? getNextActionForStatus(lead.status)
                  : `Opportunity marked lost: ${lostReason}.`,
            }
          : lead,
      ),
    );
    setLeadActivities((current) => ({
      ...current,
      [leadId]: [
        {
          time: 'Now',
          detail:
            lostReason === 'None'
              ? 'Lost reason cleared.'
              : `Lost reason recorded as ${lostReason}.`,
        },
        ...(current[leadId] || []),
      ],
    }));
    setSelectedLeadId(leadId);
  }

  function handleAddNote() {
    const trimmedNote = noteDraft.trim();

    if (!trimmedNote) {
      return;
    }

    setLeadActivities((current) => ({
      ...current,
      [selectedLead.id]: [
        { time: 'Now', detail: trimmedNote },
        ...(current[selectedLead.id] || []),
      ],
    }));
    setNoteDraft('');
  }

  function handleIntakeSubmit(form: IntakeForm) {
    const nextId = Math.max(...leadItems.map((lead) => lead.id)) + 1;
    const priority = getPriorityForUrgency(form.urgency);
    const estimatedValue = getEstimatedValueForService(form.serviceType);
    const newLead: Lead = {
      id: nextId,
      customer: form.name,
      contact: form.contact,
      service: form.serviceType,
      area: form.location,
      address: form.location,
      status: 'New lead',
      priority,
      source: 'Website',
      due: getDueForUrgency(form.urgency),
      nextAction: 'Review intake request and call the customer.',
      age: 'Just now',
      value: estimatedValue,
      followUpStatus: 'None',
      lostReason: 'None',
      quoteStatus: 'Not started',
      reviewStatus: 'Not ready',
      scheduleWindow: 'Unscheduled',
      requestedDate: 'Today',
      requestSummary:
        form.notes.trim() ||
        `Customer submitted a ${form.serviceType.toLowerCase()} request with ${form.urgency.toLowerCase()} timing.`,
    };

    setLeadItems((current) => [newLead, ...current]);
    setLeadActivities((current) => ({
      ...current,
      [nextId]: [
        { time: 'Now', detail: 'Public intake request submitted from the demo form.' },
        { time: 'Now', detail: `Urgency captured as ${form.urgency}.` },
      ],
    }));
    setPriorityFilter('All');
    setSearchTerm('');
    setSourceFilter('All');
    setSelectedLeadId(nextId);
    setSubmittedLeadId(nextId);
  }

  return (
    <>
      <LeadIntakeSection
        onLeadCreate={handleIntakeSubmit}
        submittedLead={leadItems.find((lead) => lead.id === submittedLeadId) || null}
      />
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
            Stage 7 gives the demo a more polished portfolio finish with tighter states,
            responsive dashboard behavior, and clearer product storytelling.
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

          <section className="overflow-hidden border border-slate/10 bg-night text-white shadow-panel" id="workflow">
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

            <div className="grid gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-4">
              {pipelineStatuses.map((status) => (
                <PipelineColumn
                  key={status}
                  leads={filteredLeads.filter((lead) => lead.status === status)}
                  onLeadSelect={setSelectedLeadId}
                  selectedLeadId={selectedLead.id}
                  status={status}
                />
              ))}
            </div>
          </section>

          <LeadDetailPanel
            activities={leadActivities[selectedLead.id] || []}
            lead={selectedLead}
            noteDraft={noteDraft}
            onAddNote={handleAddNote}
            onFollowUpSent={handleFollowUpSent}
            onLostReasonChange={handleLostReasonChange}
            onNoteChange={setNoteDraft}
            onQuoteChange={handleQuoteChange}
            onReviewRequest={handleReviewRequest}
            onScheduleLead={handleScheduleLead}
            onStatusChange={handleStatusChange}
          />

          <ScheduleBoard leads={leadItems} />
          <FollowUpBoard
            leads={leadItems}
            onFollowUpSent={handleFollowUpSent}
            onLeadSelect={setSelectedLeadId}
            onReviewRequest={handleReviewRequest}
          />
          <DemoStatePanel />
        </div>
        </div>
      </section>
    </>
  );
}

function LeadIntakeSection({
  onLeadCreate,
  submittedLead,
}: {
  onLeadCreate: (form: IntakeForm) => void;
  submittedLead: Lead | null;
}) {
  const [form, setForm] = useState<IntakeForm>(initialIntakeForm);
  const [formError, setFormError] = useState('');

  function updateField<K extends keyof IntakeForm>(field: K, value: IntakeForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.contact.trim() || !form.location.trim()) {
      setFormError('Name, contact, and location are required for the demo request.');
      return;
    }

    onLeadCreate({
      ...form,
      contact: form.contact.trim(),
      location: form.location.trim(),
      name: form.name.trim(),
      notes: form.notes.trim(),
    });
    setForm(initialIntakeForm);
  }

  return (
    <section className="border-b border-slate/10 bg-white py-16" id="intake">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cert">
              Public lead intake
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight text-night">
              A customer request should land where the work actually gets managed.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate/70">
              This frontend-only intake flow simulates the public request form a service business
              could place on its website. Submissions become live dashboard leads immediately.
            </p>

            <div className="mt-8 grid gap-px overflow-hidden border border-slate/10 bg-slate/10 sm:grid-cols-3 lg:grid-cols-1">
              <IntakeSignal label="Source" value="Website" />
              <IntakeSignal label="Default status" value="New lead" />
              <IntakeSignal label="Owner action" value="Call back" />
            </div>
          </div>

          <div className="grid gap-5">
            <form className="border border-slate/10 bg-cloud p-6 shadow-panel" noValidate onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-slate">
                  Name
                  <input
                    aria-invalid={Boolean(formError && !form.name.trim())}
                    className="h-12 border border-slate/10 bg-white px-3 text-sm font-semibold text-night outline-none transition focus:border-cert"
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Customer or business name"
                    required
                    value={form.name}
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate">
                  Contact
                  <input
                    aria-invalid={Boolean(formError && !form.contact.trim())}
                    className="h-12 border border-slate/10 bg-white px-3 text-sm font-semibold text-night outline-none transition focus:border-cert"
                    onChange={(event) => updateField('contact', event.target.value)}
                    placeholder="Phone or email"
                    required
                    value={form.contact}
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate">
                  Service type
                  <select
                    className="h-12 border border-slate/10 bg-white px-3 text-sm font-semibold text-night outline-none transition focus:border-cert"
                    onChange={(event) => updateField('serviceType', event.target.value)}
                    value={form.serviceType}
                  >
                    {serviceOptions.map((service) => (
                      <option key={service}>{service}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate">
                  Location
                  <input
                    aria-invalid={Boolean(formError && !form.location.trim())}
                    className="h-12 border border-slate/10 bg-white px-3 text-sm font-semibold text-night outline-none transition focus:border-cert"
                    onChange={(event) => updateField('location', event.target.value)}
                    placeholder="Town or neighborhood"
                    required
                    value={form.location}
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate md:col-span-2">
                  Timing
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(['Today', 'This week', 'Planning ahead'] as IntakeForm['urgency'][]).map(
                      (urgency) => (
                        <button
                          className={`min-h-12 border px-4 py-3 text-left text-sm font-extrabold transition ${
                            form.urgency === urgency
                              ? 'border-cert bg-cert text-white'
                              : 'border-slate/10 bg-white text-slate hover:border-cert hover:text-cert'
                          }`}
                          key={urgency}
                          onClick={() => updateField('urgency', urgency)}
                          type="button"
                        >
                          {urgency}
                        </button>
                      ),
                    )}
                  </div>
                </label>

                <label className="grid gap-2 text-sm font-bold text-slate md:col-span-2">
                  Request notes
                  <textarea
                    className="min-h-28 border border-slate/10 bg-white px-3 py-3 text-sm font-semibold text-night outline-none transition focus:border-cert"
                    onChange={(event) => updateField('notes', event.target.value)}
                    placeholder="Tell us what happened, what you need, and any timing constraints."
                    value={form.notes}
                  />
                </label>
              </div>

              {formError ? (
                <p className="mt-4 border border-coral/30 bg-coral/10 p-3 text-sm font-bold text-coral" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  className="bg-night px-6 py-3 text-sm font-extrabold text-white transition hover:bg-cert"
                  type="submit"
                >
                  Submit demo request
                </button>
                <p className="text-sm font-semibold text-slate/60">
                  No backend yet. This adds a local demo lead to the dashboard.
                </p>
              </div>
            </form>

            {submittedLead ? (
              <div className="border border-signal/30 bg-signal/10 p-5">
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-night">
                  Request added
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-night">
                  {submittedLead.customer} is now selected in the pipeline.
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate/70">
                  Lead #{submittedLead.id} was created as a {submittedLead.priority.toLowerCase()}
                  -priority website request.
                </p>
                <a
                  className="mt-4 inline-flex bg-night px-5 py-3 text-sm font-extrabold text-white transition hover:bg-cert"
                  href="#dashboard"
                >
                  View new lead
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function IntakeSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cloud p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-steel">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold text-night">{value}</p>
    </div>
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

function PipelineColumn({
  leads: columnLeads,
  onLeadSelect,
  selectedLeadId,
  status,
}: {
  leads: Lead[];
  onLeadSelect: (leadId: number) => void;
  selectedLeadId: number;
  status: LeadStatus;
}) {
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
          columnLeads.map((lead) => (
            <LeadCard
              active={lead.id === selectedLeadId}
              lead={lead}
              key={lead.id}
              onSelect={onLeadSelect}
            />
          ))
        ) : (
          <EmptyColumn status={status} />
        )}
      </div>
    </article>
  );
}

function LeadCard({
  active,
  lead,
  onSelect,
}: {
  active: boolean;
  lead: Lead;
  onSelect: (leadId: number) => void;
}) {
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
    <button
      aria-pressed={active}
      className={`group border p-4 text-left transition hover:-translate-y-0.5 hover:border-signal/50 hover:bg-white/10 ${
        active ? 'border-signal bg-white/10 shadow-glow' : 'border-white/10 bg-white/[0.06]'
      }`}
      onClick={() => onSelect(lead.id)}
      type="button"
    >
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
        <span className="border border-white/10 bg-white/[0.04] px-2 py-1 text-xs font-bold text-white/60">
          Quote: {lead.quoteStatus}
        </span>
      </div>
      <div className="mt-4 grid gap-2 border-t border-white/10 pt-3 text-xs font-bold text-white/50">
        <p>{lead.contact}</p>
        <p>{lead.due}</p>
        <p className="text-white/70">{lead.nextAction}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-white/40">
          {lead.age}
          {lead.followUpStatus !== 'None' ? ` / ${lead.followUpStatus}` : ''}
        </p>
        <p className="font-display text-lg font-bold text-white">{formatCurrency(lead.value)}</p>
      </div>
    </button>
  );
}

function LeadDetailPanel({
  activities: leadActivity,
  lead,
  noteDraft,
  onAddNote,
  onFollowUpSent,
  onLostReasonChange,
  onNoteChange,
  onQuoteChange,
  onReviewRequest,
  onScheduleLead,
  onStatusChange,
}: {
  activities: Activity[];
  lead: Lead;
  noteDraft: string;
  onAddNote: () => void;
  onFollowUpSent: (leadId: number) => void;
  onLostReasonChange: (leadId: number, lostReason: LostReason) => void;
  onNoteChange: (value: string) => void;
  onQuoteChange: (leadId: number, value: number, quoteStatus: QuoteStatus) => void;
  onReviewRequest: (leadId: number) => void;
  onScheduleLead: (leadId: number) => void;
  onStatusChange: (leadId: number, status: LeadStatus) => void;
}) {
  return (
    <section className="overflow-hidden border border-slate/10 bg-white shadow-panel lg:col-span-2">
      <div className="bg-night p-6 text-white">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-signal">
              Lead detail
            </p>
            <h3 className="mt-3 font-display text-4xl font-bold leading-tight">{lead.customer}</h3>
            <p className="mt-2 text-sm font-semibold text-white/60">
              #{lead.id} / {lead.source} / {lead.requestedDate}
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:min-w-72">
            <div className="border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/50">
                Current status
              </p>
              <p className="mt-2 text-lg font-bold text-white">{lead.status}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/50">
                Est. value
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-signal">
                {formatCurrency(lead.value)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="grid gap-px overflow-hidden border border-slate/10 bg-slate/10 sm:grid-cols-2 xl:grid-cols-4">
            <DetailItem label="Contact" value={lead.contact} />
            <DetailItem label="Area" value={lead.area} />
            <DetailItem label="Address" value={lead.address} />
            <DetailItem label="Due" value={lead.due} />
          </div>

          <div className="mt-6 border border-mist bg-cloud p-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-steel">
              Requested service
            </p>
            <h4 className="mt-3 font-display text-3xl font-bold leading-tight text-night">
              {lead.service}
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate/70">{lead.requestSummary}</p>
            <p className="mt-4 border-t border-slate/10 pt-4 text-sm font-bold text-slate">
              Next action: {lead.nextAction}
            </p>
          </div>

          <div className="mt-6 border border-slate/10 bg-night p-5 text-white">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-signal">
                  Quote builder
                </p>
                <h4 className="mt-3 font-display text-3xl font-bold leading-tight">
                  Scope, price, and schedule intent in one place.
                </h4>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Update the demo quote and mark it approved before converting the lead into
                  scheduled work.
                </p>
              </div>
              <div className="grid gap-3">
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/50">
                  Estimated quote
                  <input
                    className="mt-2 w-full border border-white/10 bg-white px-4 py-3 text-lg font-extrabold text-night outline-none transition focus:border-signal"
                    min="0"
                    onChange={(event) =>
                      onQuoteChange(lead.id, Number(event.target.value || 0), lead.quoteStatus)
                    }
                    type="number"
                    value={lead.value}
                  />
                </label>
                <div className="grid gap-2 sm:grid-cols-4">
                  {quoteStatuses.map((status) => (
                    <button
                      className={`min-h-12 border px-3 py-2 text-sm font-extrabold transition ${
                        lead.quoteStatus === status
                          ? 'border-signal bg-signal text-night'
                          : 'border-white/10 bg-white/[0.06] text-white/70 hover:border-signal hover:text-white'
                      }`}
                      key={status}
                      onClick={() => onQuoteChange(lead.id, lead.value, status)}
                      type="button"
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <button
                  className="bg-white px-5 py-3 text-sm font-extrabold text-night transition hover:bg-signal"
                  onClick={() => onScheduleLead(lead.id)}
                  type="button"
                >
                  Convert to scheduled job
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="border border-mist bg-cloud p-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-cert">
              Move status
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {pipelineStatuses.map((status) => (
                <button
                  className={`min-h-14 border px-4 py-3 text-left text-sm font-extrabold transition ${
                    lead.status === status
                      ? 'border-cert bg-cert text-white'
                      : 'border-slate/10 bg-white text-slate hover:border-cert hover:text-cert'
                  }`}
                  key={status}
                  onClick={() => onStatusChange(lead.id, status)}
                  type="button"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-mist bg-cloud p-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-cert">
              Closeout workflow
            </p>
            <div className="mt-4 grid gap-px overflow-hidden border border-slate/10 bg-slate/10 sm:grid-cols-3">
              <DetailItem label="Follow-up" value={lead.followUpStatus} />
              <DetailItem label="Review" value={lead.reviewStatus} />
              <DetailItem label="Lost reason" value={lead.lostReason} />
            </div>
            <div className="mt-4 grid gap-3">
              <button
                className="border border-slate/10 bg-white px-4 py-3 text-left text-sm font-extrabold text-slate transition hover:border-cert hover:text-cert"
                onClick={() => onFollowUpSent(lead.id)}
                type="button"
              >
                Mark follow-up sent
              </button>
              <button
                className="border border-slate/10 bg-white px-4 py-3 text-left text-sm font-extrabold text-slate transition hover:border-cert hover:text-cert"
                onClick={() => onReviewRequest(lead.id)}
                type="button"
              >
                Send review request
              </button>
              <label className="grid gap-2 text-sm font-bold text-slate">
                Lost reason
                <select
                  className="h-12 border border-slate/10 bg-white px-3 text-sm font-semibold text-night outline-none transition focus:border-cert"
                  onChange={(event) =>
                    onLostReasonChange(lead.id, event.target.value as LostReason)
                  }
                  value={lead.lostReason}
                >
                  {lostReasons.map((reason) => (
                    <option key={reason}>{reason}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="border border-mist bg-cloud p-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-cert">
              Add note
            </p>
            <textarea
              className="mt-4 min-h-24 w-full border border-slate/10 bg-white px-3 py-3 text-sm font-semibold text-night outline-none transition focus:border-cert"
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder="Log a call, quote update, scheduling note..."
              value={noteDraft}
            />
            <button
              className="mt-3 w-full bg-night px-5 py-3 text-sm font-extrabold text-white transition hover:bg-cert sm:w-auto"
              onClick={onAddNote}
              type="button"
            >
              Add activity note
            </button>
          </div>

          <div className="border border-mist bg-cloud p-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-cert">
              Activity timeline
            </p>
            <div className="mt-4 grid gap-3">
              {leadActivity.map((activity) => (
                <div className="border-l-4 border-signal bg-white p-4" key={`${activity.time}-${activity.detail}`}>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-steel">
                    {activity.time}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate">{activity.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-white p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-steel">{label}</p>
      <p className="mt-2 break-words text-sm font-bold leading-6 text-night">{value}</p>
    </div>
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

function ScheduleBoard({ leads }: { leads: Lead[] }) {
  const scheduledLeads = leads.filter((lead) => lead.status === 'Scheduled');
  const approvedQuotes = leads.filter((lead) => lead.quoteStatus === 'Approved');
  const pendingQuotes = leads.filter(
    (lead) => lead.quoteStatus === 'Draft' || lead.quoteStatus === 'Sent',
  );

  return (
    <section className="border border-slate/10 bg-white p-6 shadow-panel lg:col-span-2">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cert">
            Job schedule
          </p>
          <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-night">
            Approved work turns into visible crew-ready jobs.
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate/70">
            The schedule board gives the owner a quick view of upcoming jobs while keeping quote
            momentum visible.
          </p>
          <div className="mt-6 grid gap-px overflow-hidden border border-slate/10 bg-slate/10 sm:grid-cols-3">
            <ScheduleStat label="Scheduled jobs" value={String(scheduledLeads.length)} />
            <ScheduleStat label="Approved value" value={formatCurrency(sumLeadValue(approvedQuotes))} />
            <ScheduleStat label="Quotes pending" value={String(pendingQuotes.length)} />
          </div>
        </div>

        <div className="grid gap-3">
          {scheduledLeads.length > 0 ? (
            scheduledLeads.map((lead) => (
              <article
                className="grid gap-4 border border-slate/10 bg-cloud p-5 md:grid-cols-[1fr_auto] md:items-center"
                key={lead.id}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-cert">
                      {lead.scheduleWindow}
                    </p>
                    <span className="bg-signal/20 px-2 py-1 text-xs font-extrabold text-night">
                      {lead.quoteStatus}
                    </span>
                  </div>
                  <h4 className="mt-2 font-display text-2xl font-bold text-night">{lead.customer}</h4>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate/70">
                    {lead.service} / {lead.area}
                  </p>
                </div>
                <div className="border border-slate/10 bg-white px-4 py-3 text-left md:text-right">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-steel">
                    Job value
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-night">
                    {formatCurrency(lead.value)}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="border border-dashed border-slate/20 bg-cloud p-6 text-sm font-semibold leading-6 text-slate/60">
              No scheduled jobs yet. Approve a quote and convert the lead to see it here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ScheduleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cloud p-4">
      <p className="font-display text-3xl font-bold text-night">{value}</p>
      <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.12em] text-steel">{label}</p>
    </div>
  );
}

function FollowUpBoard({
  leads,
  onFollowUpSent,
  onLeadSelect,
  onReviewRequest,
}: {
  leads: Lead[];
  onFollowUpSent: (leadId: number) => void;
  onLeadSelect: (leadId: number) => void;
  onReviewRequest: (leadId: number) => void;
}) {
  const reviewQueue = leads.filter((lead) => lead.reviewStatus === 'Queued');
  const followUpsDue = leads.filter((lead) => lead.followUpStatus === 'Due today');
  const lostLeads = leads.filter((lead) => lead.lostReason !== 'None');
  const closeoutItems = [...followUpsDue, ...reviewQueue].filter(
    (lead, index, items) => items.findIndex((item) => item.id === lead.id) === index,
  );

  return (
    <section className="overflow-hidden border border-slate/10 bg-night text-white shadow-panel lg:col-span-2">
      <div className="grid gap-px bg-white/10 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="bg-night p-6">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-signal">
            Follow-up system
          </p>
          <h3 className="mt-3 font-display text-3xl font-bold leading-tight">
            Finished jobs should create reviews, referrals, and clean records.
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/60">
            This keeps post-job actions visible instead of relying on memory, sticky notes, or
            buried text threads.
          </p>
          <div className="mt-6 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-1">
            <FollowUpStat label="Follow-ups due" value={String(followUpsDue.length)} />
            <FollowUpStat label="Reviews queued" value={String(reviewQueue.length)} />
            <FollowUpStat label="Lost reasons" value={String(lostLeads.length)} />
          </div>
        </div>

        <div className="grid gap-4 bg-white p-6 text-night">
          {closeoutItems.length > 0 ? (
            closeoutItems.map((lead) => (
              <article
                className="grid gap-4 border border-slate/10 bg-cloud p-5 xl:grid-cols-[1fr_auto] xl:items-center"
                key={lead.id}
              >
                <button
                  className="text-left"
                  onClick={() => onLeadSelect(lead.id)}
                  type="button"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-amber/20 px-2 py-1 text-xs font-extrabold text-amber">
                      {lead.followUpStatus}
                    </span>
                    <span className="bg-cert/10 px-2 py-1 text-xs font-extrabold text-cert">
                      Review: {lead.reviewStatus}
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-2xl font-bold">{lead.customer}</h4>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate/70">
                    {lead.service} / {lead.area}
                  </p>
                </button>

                <div className="grid gap-2 sm:grid-cols-2 xl:min-w-72">
                  <button
                    className="bg-night px-4 py-3 text-sm font-extrabold text-white transition hover:bg-cert"
                    onClick={() => onFollowUpSent(lead.id)}
                    type="button"
                  >
                    Mark sent
                  </button>
                  <button
                    className="border border-slate/10 bg-white px-4 py-3 text-sm font-extrabold text-slate transition hover:border-cert hover:text-cert"
                    onClick={() => onReviewRequest(lead.id)}
                    type="button"
                  >
                    Send review
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="border border-dashed border-slate/20 bg-cloud p-6 text-sm font-semibold leading-6 text-slate/60">
              No follow-ups or review requests are waiting. New closeout work will appear here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FollowUpStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/[0.06] p-4">
      <p className="font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.12em] text-white/50">
        {label}
      </p>
    </div>
  );
}

function DemoStatePanel() {
  const states = [
    {
      label: 'Loading',
      title: 'Syncing lead activity',
      text: 'Soft loading copy keeps the interface calm while future API data refreshes.',
      accent: 'bg-cert',
    },
    {
      label: 'Empty',
      title: 'No work in this lane',
      text: 'Empty states explain what happened and what should appear next.',
      accent: 'bg-signal',
    },
    {
      label: 'Error',
      title: 'Connection needs attention',
      text: 'Error states leave room for retry actions once backend services are added.',
      accent: 'bg-coral',
    },
  ];

  return (
    <section className="border border-slate/10 bg-white p-6 shadow-panel lg:col-span-2" id="demo">
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cert">
            Demo states
          </p>
          <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-night">
            The product stays useful when data is quiet, delayed, or unavailable.
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate/70">
            These states are intentionally simple in the frontend demo and ready to connect to
            real API behavior later.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden border border-slate/10 bg-slate/10 md:grid-cols-3">
          {states.map((state) => (
            <article className="bg-cloud p-5" key={state.label}>
              <div className={`mb-5 h-1.5 w-12 ${state.accent}`} />
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-steel">
                {state.label}
              </p>
              <h4 className="mt-3 font-display text-xl font-bold leading-tight text-night">
                {state.title}
              </h4>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate/70">{state.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
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
        <p>Portfolio demo concept. Stage 7 polish and responsive QA.</p>
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

function getPriorityForUrgency(urgency: IntakeForm['urgency']): LeadPriority {
  const priorityByUrgency: Record<IntakeForm['urgency'], LeadPriority> = {
    'Planning ahead': 'Low',
    'This week': 'Medium',
    Today: 'High',
  };

  return priorityByUrgency[urgency];
}

function getDueForUrgency(urgency: IntakeForm['urgency']) {
  const dueByUrgency: Record<IntakeForm['urgency'], string> = {
    'Planning ahead': 'Review this week',
    'This week': 'Call within 24 hours',
    Today: 'Call as soon as possible',
  };

  return dueByUrgency[urgency];
}

function getEstimatedValueForService(serviceType: string) {
  const valueByService: Record<string, number> = {
    'Emergency repair': 850,
    'Estimate request': 2400,
    'Maintenance visit': 525,
    'Project follow-up': 650,
    'Walkthrough / consultation': 1200,
  };

  return valueByService[serviceType] || 900;
}

function getNextActionForStatus(status: LeadStatus) {
  const nextActionByStatus: Record<LeadStatus, string> = {
    'New lead': 'Call the customer and confirm request details.',
    'Needs quote': 'Prepare scope, price range, and send the quote.',
    Scheduled: 'Confirm schedule, access notes, and crew readiness.',
    'Follow-up': 'Send follow-up, review request, or closeout note.',
  };

  return nextActionByStatus[status];
}

function getNextActionForQuoteStatus(status: QuoteStatus) {
  const nextActionByStatus: Record<QuoteStatus, string> = {
    'Not started': 'Prepare first scope and quote range.',
    Draft: 'Review quote details before sending.',
    Sent: 'Follow up on the sent quote.',
    Approved: 'Confirm schedule, access notes, and crew readiness.',
  };

  return nextActionByStatus[status];
}

export default App;
