import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, CheckCircle } from 'lucide-react';
import L from 'leaflet';
import Navbar from './shared/Navbar';

// ─── Data ───────────────────────────────────────────────────────────────────

const areas = [
  { id: 'south',   label: 'South Mumbai',     sub: 'Colaba, Nariman Point, Malabar Hill', coords: [18.928, 72.832] as [number,number], zoom: 13, count: 3  },
  { id: 'central', label: 'Central Mumbai',    sub: 'Dadar, Parel, Lower Parel, Worli',    coords: [19.020, 72.845] as [number,number], zoom: 13, count: 4  },
  { id: 'western', label: 'Western Suburbs',   sub: 'Bandra, Juhu, Andheri, Borivali',     coords: [19.130, 72.840] as [number,number], zoom: 12, count: 5  },
  { id: 'eastern', label: 'Eastern Suburbs',   sub: 'Kurla, Chembur, Ghatkopar, Vikhroli', coords: [19.080, 72.910] as [number,number], zoom: 12, count: 2  },
  { id: 'thane',   label: 'Thane',             sub: 'Thane West, Ghodbunder Rd, Majiwada', coords: [19.218, 72.978] as [number,number], zoom: 13, count: 4  },
  { id: 'any',     label: 'Open to all areas', sub: 'Show me everything available',         coords: [19.076, 72.877] as [number,number], zoom: 11, count: 18 },
];

const propTypes = [
  { id: 'residential', label: 'Residential', sub: 'Apartments & homes'       },
  { id: 'office',      label: 'Office',       sub: 'Commercial workspace'     },
  { id: 'industrial',  label: 'Industrial',   sub: 'Warehouses & factories'   },
  { id: 'shops',       label: 'Shops',        sub: 'Retail & showrooms'       },
  { id: 'open-land',   label: 'Open Land',    sub: 'Plots & development land' },
];

const configs = [
  { id: '2bhk', label: '2 BHK',    sub: '≤ 1,200 sq.ft' },
  { id: '3bhk', label: '3 BHK',    sub: '~1,600 sq.ft'  },
  { id: '4bhk', label: '4 BHK',    sub: '≥ 2,400 sq.ft' },
  { id: 'any',  label: 'Any size', sub: 'Flexible'       },
];

const goals = [
  { id: 'enduse',   label: 'End-use',           sub: 'My own home or office',    recommended: false },
  { id: 'rental',   label: 'Rental income',     sub: 'Long-term investment',      recommended: false },
  { id: 'flip',     label: 'Resell for profit', sub: 'Short to mid-term exit',    recommended: false },
  { id: 'flexible', label: 'I\'m flexible',     sub: 'Open to all strategies',    recommended: true  },
];

const budgets = [
  { id: '2-5',    label: '₹2 Cr – ₹5 Cr',    sub: 'EMI starting ~₹1.4L' },
  { id: '5-10',   label: '₹5 Cr – ₹10 Cr',   sub: 'EMI starting ~₹2.8L' },
  { id: '10plus', label: 'More than ₹10 Cr',  sub: 'EMI starting ~₹5.5L' },
];

const TOTAL_STEPS = 4;

// ─── Map overlay ─────────────────────────────────────────────────────────────

function getMapOverlay(step: number, primaryAreaId: string) {
  const area = areas.find(a => a.id === primaryAreaId);
  if (!area) return { label: 'Mumbai', value: '18 active auctions' };
  if (step === 2) return { label: area.label, value: `${area.count} active auction${area.count !== 1 ? 's' : ''}` };
  if (step === 3) return { label: area.label, value: `${area.count} properties match` };
  if (step === 4) return { label: area.label, value: `${area.count} deals in profile` };
  const rates: Record<string, string> = { south: '₹22K–₹38K/sq.ft', central: '₹18K–₹28K/sq.ft', western: '₹14K–₹24K/sq.ft', eastern: '₹9K–₹15K/sq.ft', thane: '₹8K–₹14K/sq.ft', any: '₹8K–₹38K/sq.ft' };
  return { label: area.label, value: rates[primaryAreaId] || '₹8K–₹38K/sq.ft' };
}

// ─── Option card ─────────────────────────────────────────────────────────────

function OptionCard({ label, sub, selected, recommended, onClick, fullWidth = false }: {
  label: string; sub?: string; selected: boolean; recommended?: boolean;
  onClick: () => void; fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative text-left w-full px-4 py-3.5 rounded-xl border transition-all duration-150 cursor-pointer active:scale-[0.98] ${
        selected
          ? 'bg-[#0F3D2E]/5 border-[#0F3D2E] shadow-sm'
          : 'bg-white border-black/8 hover:border-[#0F3D2E]/40 hover:shadow-sm'
      } ${fullWidth ? 'col-span-2' : ''}`}
    >
      {recommended && !selected && (
        <span className="absolute top-3 right-3 text-[9px] font-semibold uppercase tracking-widest text-[#0F3D2E] bg-[#0F3D2E]/10 px-2 py-0.5 rounded-full">
          Recommended
        </span>
      )}
      {selected && (
        <span className="absolute top-3 right-3 w-5 h-5 bg-[#0F3D2E] rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )}
      <div className={`font-medium text-sm pr-6 ${selected ? 'text-[#0F3D2E]' : 'text-[#1A1A1A]'}`}>{label}</div>
      {sub && <div className="text-xs text-[#6B6B6B] mt-0.5">{sub}</div>}
    </button>
  );
}

// ─── Step slide ───────────────────────────────────────────────────────────────

function StepSlide({ children, dir }: { children: React.ReactNode; dir: 1 | -1 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: dir * 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: dir * -28 }}
      transition={{ duration: 0.26, ease: 'easeOut' }}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}

// ─── Shared footer elements ───────────────────────────────────────────────────

function Terms() {
  return (
    <p className="mt-6 text-xs text-[#6B6B6B]/55">
      By proceeding you agree to our{' '}
      <span className="underline cursor-pointer hover:text-[#6B6B6B] transition-colors">terms</span>{' '}&{' '}
      <span className="underline cursor-pointer hover:text-[#6B6B6B] transition-colors">privacy policy</span>
    </p>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const navigate = useNavigate();

  const [step, setStep]               = useState(1);
  const [dir,  setDir]                = useState<1 | -1>(1);
  const [propTypeIds, setPropTypeIds] = useState<Set<string>>(new Set());
  const [configIds, setConfigIds]     = useState<Set<string>>(new Set());
  const [areaIds, setAreaIds]         = useState<Set<string>>(new Set());
  const [goalIds, setGoalIds]         = useState<Set<string>>(new Set());
  const [budgetId, setBudget]         = useState('');
  const [name, setName]               = useState('');
  const [phone, setPhone]             = useState('');
  const [submitted, setSubmitted]     = useState(false);

  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  // ── Navigation ──────────────────────────────────────────────────────────────

  const goTo = (n: number) => { setDir(n > step ? 1 : -1); setStep(n); };
  const goBack = () => goTo(step - 1);
  const next   = () => goTo(step + 1);

  // ── Toggle handlers ─────────────────────────────────────────────────────────

  const togglePropType = (id: string) => {
    setPropTypeIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (id === 'residential') setConfigIds(new Set());
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // "any" is exclusive for config
  const toggleConfig = (id: string) => {
    setConfigIds(prev => {
      if (id === 'any') return prev.has('any') ? new Set<string>() : new Set(['any']);
      const next = new Set(prev);
      next.delete('any');
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // "any" is exclusive for area
  const toggleArea = (id: string) => {
    setAreaIds(prev => {
      if (id === 'any') return prev.has('any') ? new Set<string>() : new Set(['any']);
      const next = new Set(prev);
      next.delete('any');
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleGoal = (id: string) => {
    setGoalIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Budget stays single-select and auto-advances
  const handleBudget = (id: string) => {
    setBudget(id);
    setTimeout(() => goTo(5), 320);
  };

  // ── Can continue ────────────────────────────────────────────────────────────

  const needsConfig = propTypeIds.has('residential');
  const canContinue =
    step === 1 ? propTypeIds.size > 0 && (!needsConfig || configIds.size > 0) :
    step === 2 ? areaIds.size > 0 :
    step === 3 ? goalIds.size > 0 :
    step === 4 ? budgetId !== '' :
    false;

  // ── Map ─────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, {
      center: [19.076, 72.877], zoom: 11,
      zoomControl: false, attributionControl: false,
      scrollWheelZoom: false, dragging: false,
      doubleClickZoom: false, touchZoom: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, className: 'map-tiles-light' }).addTo(map);
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  const primaryAreaId = areaIds.has('any') ? 'any' : [...areaIds][0] || '';

  useEffect(() => {
    if (!mapInstance.current || !primaryAreaId) return;
    const a = areas.find(x => x.id === primaryAreaId);
    if (a) mapInstance.current.flyTo(a.coords, a.zoom, { duration: 1.1, easeLinearity: 0.5 });
  }, [primaryAreaId]);

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitted(true);
  };

  const overlay = getMapOverlay(step, primaryAreaId);
  const currentStep = Math.min(step, TOTAL_STEPS);

  // ── Shared back button ───────────────────────────────────────────────────────

  const BackBtn = () => (
    <button
      onClick={goBack}
      className="flex items-center gap-1.5 text-[#6B6B6B] hover:text-[#0F3D2E] text-sm mb-5 transition-colors cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );

  const ContinueBtn = ({ label = 'Continue' }: { label?: string }) => (
    <button
      onClick={next}
      disabled={!canContinue}
      className="mt-7 flex items-center gap-2 px-6 py-3 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg text-sm font-medium disabled:opacity-30 hover:bg-[#0F3D2E]/90 active:scale-[0.98] transition-all cursor-pointer disabled:cursor-not-allowed"
    >
      {label} <ArrowRight className="w-4 h-4" />
    </button>
  );

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .map-tiles-light { filter: saturate(0.85) brightness(1.05); }
        .leaflet-container { background: #f0ede8; }
      `}</style>
      <Navbar />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>

        {/* ── Left panel ────────────────────────────────────────────────────── */}
        <div className="w-full lg:w-[52%] flex flex-col px-8 lg:px-14 py-8 overflow-y-auto">

          {/* Progress */}
          {!submitted && (
            <div className="flex items-center justify-between mb-8 flex-shrink-0">
              <p className="text-sm text-[#6B6B6B]">Tell us about your goals.</p>
              {step <= TOTAL_STEPS && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#0F3D2E]/8 text-[#0F3D2E]">
                  {currentStep}/{TOTAL_STEPS}
                </span>
              )}
            </div>
          )}

          <AnimatePresence mode="wait">

            {/* ── Step 1: Property type ──────────────────────────────────────── */}
            {step === 1 && (
              <StepSlide key="s1" dir={dir}>
                <h2 className="text-3xl lg:text-4xl text-[#0F3D2E] mb-1.5 leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  What type of property are you looking for?
                </h2>
                <p className="text-xs text-[#6B6B6B] mb-6">Select all that apply</p>
                <div className="grid grid-cols-2 gap-3 mb-7">
                  {propTypes.slice(0, 4).map(p => (
                    <OptionCard key={p.id} label={p.label} sub={p.sub} selected={propTypeIds.has(p.id)} onClick={() => togglePropType(p.id)} />
                  ))}
                  <OptionCard label={propTypes[4].label} sub={propTypes[4].sub} selected={propTypeIds.has(propTypes[4].id)} onClick={() => togglePropType(propTypes[4].id)} fullWidth />
                </div>

                <AnimatePresence>
                  {needsConfig && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="mb-2"
                    >
                      <h3 className="text-xl text-[#0F3D2E] mb-1" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        Preferred configuration?
                      </h3>
                      <p className="text-xs text-[#6B6B6B] mb-4">Select all that apply</p>
                      <div className="grid grid-cols-2 gap-3">
                        {configs.map(c => (
                          <OptionCard key={c.id} label={c.label} sub={c.sub} selected={configIds.has(c.id)} onClick={() => toggleConfig(c.id)} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <ContinueBtn />
                <Terms />
              </StepSlide>
            )}

            {/* ── Step 2: Area ──────────────────────────────────────────────── */}
            {step === 2 && (
              <StepSlide key="s2" dir={dir}>
                <BackBtn />
                <h2 className="text-3xl lg:text-4xl text-[#0F3D2E] mb-1.5 leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  Which part of Mumbai interests you?
                </h2>
                <p className="text-xs text-[#6B6B6B] mb-6">Select one or more areas</p>
                <div className="grid grid-cols-2 gap-3">
                  {areas.slice(0, 4).map(a => (
                    <OptionCard key={a.id} label={a.label} sub={a.sub} selected={areaIds.has(a.id)} onClick={() => toggleArea(a.id)} />
                  ))}
                  <OptionCard label={areas[4].label} sub={areas[4].sub} selected={areaIds.has(areas[4].id)} onClick={() => toggleArea(areas[4].id)} />
                  <OptionCard label={areas[5].label} sub={areas[5].sub} selected={areaIds.has(areas[5].id)} onClick={() => toggleArea(areas[5].id)} />
                </div>
                <ContinueBtn />
                <Terms />
              </StepSlide>
            )}

            {/* ── Step 3: Goal ──────────────────────────────────────────────── */}
            {step === 3 && (
              <StepSlide key="s3" dir={dir}>
                <BackBtn />
                <h2 className="text-3xl lg:text-4xl text-[#0F3D2E] mb-1.5 leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  What's your goal with this property?
                </h2>
                <p className="text-xs text-[#6B6B6B] mb-6">Select all that apply</p>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map(g => (
                    <OptionCard key={g.id} label={g.label} sub={g.sub}
                      selected={goalIds.has(g.id)} recommended={g.recommended}
                      onClick={() => toggleGoal(g.id)}
                    />
                  ))}
                </div>
                <ContinueBtn />
                <Terms />
              </StepSlide>
            )}

            {/* ── Step 4: Budget ────────────────────────────────────────────── */}
            {step === 4 && (
              <StepSlide key="s4" dir={dir}>
                <BackBtn />
                <h2 className="text-3xl lg:text-4xl text-[#0F3D2E] mb-1.5 leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  What's your budget range?
                </h2>
                <p className="text-xs text-[#6B6B6B] mb-6">Select one</p>
                <div className="grid grid-cols-2 gap-3">
                  {budgets.map(b => (
                    <OptionCard key={b.id} label={b.label} sub={b.sub} selected={budgetId === b.id} onClick={() => handleBudget(b.id)} />
                  ))}
                </div>
                <Terms />
              </StepSlide>
            )}

            {/* ── Step 5: Contact ───────────────────────────────────────────── */}
            {step === 5 && !submitted && (
              <StepSlide key="s5" dir={dir}>
                <BackBtn />
                <h2 className="text-3xl lg:text-4xl text-[#0F3D2E] mb-2 leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  Last step — how should we reach you?
                </h2>
                <p className="text-[#6B6B6B] text-sm mb-6 leading-relaxed">
                  Our advisory team will reach out within one business day with matched opportunities.
                </p>

                {/* Selection summary */}
                <div className="flex flex-wrap gap-2 mb-7">
                  {[
                    ...[...propTypeIds].map(id => propTypes.find(p => p.id === id)?.label),
                    ...[...configIds].filter(id => id !== 'any').map(id => configs.find(c => c.id === id)?.label),
                    ...[...areaIds].map(id => areas.find(a => a.id === id)?.label),
                    ...[...goalIds].map(id => goals.find(g => g.id === id)?.label),
                    budgets.find(b => b.id === budgetId)?.label,
                  ].filter(Boolean).map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-[#0F3D2E]/8 text-[#0F3D2E] text-xs rounded-full font-medium">{tag}</span>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#6B6B6B] mb-2">Full Name *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Your name" required
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B]/50 focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#6B6B6B] mb-2">Phone / WhatsApp *</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210" required
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B]/50 focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition-colors"
                    />
                  </div>
                  <button type="submit"
                    className="w-full py-3.5 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg hover:bg-[#0F3D2E]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm font-medium mt-2 cursor-pointer"
                  >
                    Connect me with an advisor
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <Terms />
              </StepSlide>
            )}

            {/* ── Success ───────────────────────────────────────────────────── */}
            {submitted && (
              <StepSlide key="success" dir={1}>
                <div className="flex flex-col items-start pt-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                    <CheckCircle className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl text-[#0F3D2E] mb-3 leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                    Thank you, {name.split(' ')[0]}.
                  </h2>
                  <p className="text-[#6B6B6B] leading-relaxed mb-8 max-w-sm">
                    Your profile has been received. Our advisory team will reach out within one business day with matched opportunities.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => navigate('/properties')}
                      className="px-6 py-3 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg text-sm hover:bg-[#0F3D2E]/90 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      Browse live opportunities <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => navigate('/')}
                      className="px-6 py-3 border border-black/10 text-[#1A1A1A] rounded-lg text-sm hover:border-[#0F3D2E] hover:text-[#0F3D2E] transition-all cursor-pointer"
                    >
                      Home
                    </button>
                  </div>
                </div>
              </StepSlide>
            )}

          </AnimatePresence>
        </div>

        {/* ── Right panel: Map ──────────────────────────────────────────────── */}
        <div className="hidden lg:block lg:w-[48%] relative bg-[#E8E6E0]">
          <div ref={mapRef} className="w-full h-full" />
          <AnimatePresence>
            {primaryAreaId && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/96 backdrop-blur-sm rounded-xl px-6 py-3.5 shadow-lg border border-black/6 text-center min-w-[200px]"
                style={{ isolation: 'isolate' }}
              >
                <div className="text-xs text-[#6B6B6B] mb-0.5">{overlay.label}</div>
                <div className="text-base text-[#0F3D2E] font-semibold" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  {overlay.value}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
