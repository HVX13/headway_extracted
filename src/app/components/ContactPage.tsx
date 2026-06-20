import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, CheckCircle } from 'lucide-react';
import L from 'leaflet';
import Navbar from './shared/Navbar';

// ─── Data ───────────────────────────────────────────────────────────────────

const areas = [
  { id: 'south',   label: 'South Mumbai',      sub: 'Colaba, Nariman Point, Malabar Hill',  coords: [18.928, 72.832] as [number,number], zoom: 13, count: 3  },
  { id: 'central', label: 'Central Mumbai',     sub: 'Dadar, Parel, Lower Parel, Worli',     coords: [19.020, 72.845] as [number,number], zoom: 13, count: 4  },
  { id: 'western', label: 'Western Suburbs',    sub: 'Bandra, Juhu, Andheri, Borivali',      coords: [19.130, 72.840] as [number,number], zoom: 12, count: 5  },
  { id: 'eastern', label: 'Eastern Suburbs',    sub: 'Kurla, Chembur, Ghatkopar, Vikhroli',  coords: [19.080, 72.910] as [number,number], zoom: 12, count: 2  },
  { id: 'thane',   label: 'Thane',              sub: 'Thane West, Ghodbunder Rd, Majiwada',  coords: [19.218, 72.978] as [number,number], zoom: 13, count: 4  },
  { id: 'any',     label: 'Open to all areas',  sub: 'Show me everything available',          coords: [19.076, 72.877] as [number,number], zoom: 11, count: 18 },
];

const propTypes = [
  { id: 'residential', label: 'Residential', sub: 'Apartments & homes'      },
  { id: 'office',      label: 'Office',       sub: 'Commercial workspace'    },
  { id: 'industrial',  label: 'Industrial',   sub: 'Warehouses & factories'  },
  { id: 'shops',       label: 'Shops',        sub: 'Retail & showrooms'      },
  { id: 'open-land',   label: 'Open Land',    sub: 'Plots & development land'},
];

const configs = [
  { id: '2bhk', label: '2 BHK', sub: '≤ 1,200 sq.ft' },
  { id: '3bhk', label: '3 BHK', sub: '~1,600 sq.ft'  },
  { id: '4bhk', label: '4 BHK', sub: '≥ 2,400 sq.ft' },
  { id: 'any',  label: 'Any size', sub: 'Flexible'   },
];

const goals = [
  { id: 'enduse',    label: 'End-use',          sub: 'My own home or office',     recommended: false },
  { id: 'rental',    label: 'Rental income',    sub: 'Long-term investment',       recommended: false },
  { id: 'flip',      label: 'Resell for profit', sub: 'Short to mid-term exit',    recommended: false },
  { id: 'flexible',  label: 'I\'m flexible',    sub: 'Open to all strategies',     recommended: true  },
];

const budgets = [
  { id: '2-5',   label: '₹2 Cr – ₹5 Cr',    sub: 'EMI starting ~₹1.4L' },
  { id: '5-10',  label: '₹5 Cr – ₹10 Cr',   sub: 'EMI starting ~₹2.8L' },
  { id: '10plus', label: 'More than ₹10 Cr', sub: 'EMI starting ~₹5.5L' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const STEP_LABELS = ['Area', 'Property', 'Goal', 'Budget'];
const TOTAL_STEPS = 4;

function getMapOverlay(step: number, areaId: string, propTypeId: string, budgetId: string) {
  const areaData = areas.find(a => a.id === areaId);
  if (!areaData) return { label: 'Mumbai', value: '18 active auctions' };

  if (step === 2) return { label: areaData.label, value: `${areaData.count} active auction${areaData.count !== 1 ? 's' : ''}` };
  if (step === 3) {
    const typeLabel = propTypeId === 'residential' ? 'residential' : propTypeId !== '' ? propTypeId : '';
    return { label: areaData.label, value: `${areaData.count} ${typeLabel} propert${areaData.count !== 1 ? 'ies' : 'y'}` };
  }
  if (step === 4) return { label: areaData.label, value: `${areaData.count} deals match your profile` };
  if (step === 5) {
    const rates: Record<string, string> = { south: '₹22K–₹38K/sq.ft', central: '₹18K–₹28K/sq.ft', western: '₹14K–₹24K/sq.ft', eastern: '₹9K–₹15K/sq.ft', thane: '₹8K–₹14K/sq.ft', any: '₹8K–₹38K/sq.ft' };
    return { label: areaData.label, value: rates[areaId] || '₹8K–₹38K/sq.ft' };
  }
  return { label: areaData.label, value: `${areaData.count} opportunities` };
}

// ─── Reusable option card ────────────────────────────────────────────────────

function OptionCard({
  label, sub, selected, recommended, onClick, fullWidth = false,
}: {
  label: string; sub?: string; selected: boolean; recommended?: boolean;
  onClick: () => void; fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative text-left w-full px-4 py-3.5 rounded-xl border transition-all duration-200 ${
        selected
          ? 'bg-[#0F3D2E]/5 border-[#0F3D2E] shadow-sm'
          : 'bg-white border-black/8 hover:border-[#0F3D2E]/40 hover:shadow-sm'
      } ${fullWidth ? 'col-span-2' : ''}`}
    >
      {recommended && (
        <span className="absolute top-3 right-3 text-[9px] font-semibold uppercase tracking-widest text-[#0F3D2E] bg-[#0F3D2E]/10 px-2 py-0.5 rounded-full">
          Recommended
        </span>
      )}
      {selected && (
        <span className="absolute top-3 right-3 w-5 h-5 bg-[#0F3D2E] rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )}
      <div className={`font-medium text-sm ${selected ? 'text-[#0F3D2E]' : 'text-[#1A1A1A]'}`}>{label}</div>
      {sub && <div className="text-xs text-[#6B6B6B] mt-0.5">{sub}</div>}
    </button>
  );
}

// ─── Slide wrapper ───────────────────────────────────────────────────────────

function StepSlide({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ContactPage() {
  const navigate = useNavigate();

  const [step, setStep]           = useState(1);
  const [areaId, setAreaId]       = useState('');
  const [propTypeId, setPropType] = useState('');
  const [configId, setConfig]     = useState('');
  const [goalId, setGoal]         = useState('');
  const [budgetId, setBudget]     = useState('');
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  // Init Leaflet
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [19.076, 72.877],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      touchZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'map-tiles-light',
    }).addTo(map);

    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  // Fly when area changes
  useEffect(() => {
    if (!mapInstance.current || !areaId) return;
    const a = areas.find(x => x.id === areaId);
    if (a) mapInstance.current.flyTo(a.coords, a.zoom, { duration: 1.1, easeLinearity: 0.5 });
  }, [areaId]);

  const advance = useCallback((toStep: number) => {
    setTimeout(() => setStep(toStep), 360);
  }, []);

  // Step handlers
  const handleArea = (id: string) => { setAreaId(id); advance(3); };

  const handlePropType = (id: string) => {
    setPropType(id);
    if (id !== 'residential') { setConfig('any'); advance(2); }
  };
  const handleConfig = (id: string) => { setConfig(id); advance(2); };

  const handleGoal = (id: string) => { setGoal(id); advance(4); };

  const handleBudget = (id: string) => {
    setBudget(id);
    advance(5);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitted(true);
  };

  const overlay = getMapOverlay(step, areaId, propTypeId, budgetId);
  const currentStep = Math.min(step, TOTAL_STEPS);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .map-tiles-light { filter: saturate(0.85) brightness(1.05); }
        .leaflet-container { background: #f0ede8; }
      `}</style>
      <Navbar />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>

        {/* ── Left panel ─────────────────────────────────────────────────────── */}
        <div className="w-full lg:w-[52%] flex flex-col px-8 lg:px-14 py-8 overflow-y-auto">

          {/* Progress header */}
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

            {/* ── Step 1: Property type + config ───────────────────────────── */}
            {step === 1 && (
              <StepSlide key="s1">
                <h2 className="text-3xl lg:text-4xl text-[#0F3D2E] mb-6 leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  What type of property are you looking for?
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-7">
                  {propTypes.slice(0, 4).map(p => (
                    <OptionCard key={p.id} label={p.label} sub={p.sub} selected={propTypeId === p.id} onClick={() => handlePropType(p.id)} />
                  ))}
                  <OptionCard label={propTypes[4].label} sub={propTypes[4].sub} selected={propTypeId === propTypes[4].id} onClick={() => handlePropType(propTypes[4].id)} fullWidth />
                </div>

                <AnimatePresence>
                  {propTypeId === 'residential' && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <h3 className="text-xl text-[#0F3D2E] mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        How many bedrooms?
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {configs.map(c => (
                          <OptionCard key={c.id} label={c.label} sub={c.sub} selected={configId === c.id} onClick={() => handleConfig(c.id)} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-8 text-xs text-[#6B6B6B]/60">
                  By proceeding, you agree to our{' '}
                  <span className="underline cursor-pointer">terms</span> &{' '}
                  <span className="underline cursor-pointer">privacy policy</span>
                </p>
              </StepSlide>
            )}

            {/* ── Step 2: Area ─────────────────────────────────────────────── */}
            {step === 2 && (
              <StepSlide key="s2">
                <h2 className="text-3xl lg:text-4xl text-[#0F3D2E] mb-7 leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  Which part of Mumbai interests you?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {areas.slice(0, 4).map(a => (
                    <OptionCard key={a.id} label={a.label} sub={a.sub} selected={areaId === a.id} onClick={() => handleArea(a.id)} />
                  ))}
                  <OptionCard label={areas[4].label} sub={areas[4].sub} selected={areaId === areas[4].id} onClick={() => handleArea(areas[4].id)} />
                  <OptionCard label={areas[5].label} sub={areas[5].sub} selected={areaId === areas[5].id} onClick={() => handleArea(areas[5].id)} />
                </div>
                <p className="mt-8 text-xs text-[#6B6B6B]/60">
                  By proceeding, you agree to our{' '}
                  <span className="underline cursor-pointer">terms</span> &{' '}
                  <span className="underline cursor-pointer">privacy policy</span>
                </p>
              </StepSlide>
            )}

            {/* ── Step 3: Goal ─────────────────────────────────────────────── */}
            {step === 3 && (
              <StepSlide key="s3">
                <h2 className="text-3xl lg:text-4xl text-[#0F3D2E] mb-7 leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  What's your goal with this property?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map(g => (
                    <OptionCard
                      key={g.id} label={g.label} sub={g.sub}
                      selected={goalId === g.id} recommended={g.recommended}
                      onClick={() => handleGoal(g.id)}
                    />
                  ))}
                </div>
                <p className="mt-8 text-xs text-[#6B6B6B]/60">
                  By proceeding, you agree to our{' '}
                  <span className="underline cursor-pointer">terms</span> &{' '}
                  <span className="underline cursor-pointer">privacy policy</span>
                </p>
              </StepSlide>
            )}

            {/* ── Step 4: Budget ───────────────────────────────────────────── */}
            {step === 4 && (
              <StepSlide key="s4">
                <h2 className="text-3xl lg:text-4xl text-[#0F3D2E] mb-7 leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  What's your budget range?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <OptionCard label={budgets[0].label} sub={budgets[0].sub} selected={budgetId === budgets[0].id} onClick={() => handleBudget(budgets[0].id)} />
                  <OptionCard label={budgets[1].label} sub={budgets[1].sub} selected={budgetId === budgets[1].id} onClick={() => handleBudget(budgets[1].id)} />
                  <OptionCard label={budgets[2].label} sub={budgets[2].sub} selected={budgetId === budgets[2].id} onClick={() => handleBudget(budgets[2].id)} />
                </div>
                <p className="mt-8 text-xs text-[#6B6B6B]/60">
                  By proceeding, you agree to our{' '}
                  <span className="underline cursor-pointer">terms</span> &{' '}
                  <span className="underline cursor-pointer">privacy policy</span>
                </p>
              </StepSlide>
            )}

            {/* ── Step 5: Contact ──────────────────────────────────────────── */}
            {step === 5 && !submitted && (
              <StepSlide key="s5">
                <h2 className="text-3xl lg:text-4xl text-[#0F3D2E] mb-2 leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  Last step — how should we reach you?
                </h2>
                <p className="text-[#6B6B6B] text-sm mb-8 leading-relaxed">
                  Our advisory team will reach out within one business day with matched opportunities.
                </p>

                {/* Summary pill */}
                <div className="flex flex-wrap gap-2 mb-7">
                  {[
                    areas.find(a => a.id === areaId)?.label,
                    propTypes.find(p => p.id === propTypeId)?.label,
                    configs.find(c => c.id === configId)?.label !== 'Any size' ? configs.find(c => c.id === configId)?.label : null,
                    goals.find(g => g.id === goalId)?.label,
                    budgets.find(b => b.id === budgetId)?.label,
                  ].filter(Boolean).map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-[#0F3D2E]/8 text-[#0F3D2E] text-xs rounded-full font-medium">{tag}</span>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#6B6B6B] mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B]/50 focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#6B6B6B] mb-2">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full px-4 py-3 bg-white border border-black/10 rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B]/50 focus:outline-none focus:border-[#0F3D2E] focus:ring-2 focus:ring-[#0F3D2E]/10 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg hover:bg-[#0F3D2E]/90 transition-all flex items-center justify-center gap-2 text-sm font-medium mt-2"
                  >
                    Connect me with an advisor
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="mt-5 text-xs text-[#6B6B6B]/60">
                  By proceeding, you agree to our{' '}
                  <span className="underline cursor-pointer">terms</span> &{' '}
                  <span className="underline cursor-pointer">privacy policy</span>
                </p>
              </StepSlide>
            )}

            {/* ── Success ──────────────────────────────────────────────────── */}
            {submitted && (
              <StepSlide key="success">
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
                    <button
                      onClick={() => navigate('/properties')}
                      className="px-6 py-3 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg text-sm hover:bg-[#0F3D2E]/90 transition-all flex items-center gap-2"
                    >
                      Browse live opportunities
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="px-6 py-3 border border-black/10 text-[#1A1A1A] rounded-lg text-sm hover:border-[#0F3D2E] hover:text-[#0F3D2E] transition-all"
                    >
                      Home
                    </button>
                  </div>
                </div>
              </StepSlide>
            )}

          </AnimatePresence>
        </div>

        {/* ── Right panel: Map ───────────────────────────────────────────────── */}
        <div className="hidden lg:block lg:w-[48%] relative bg-[#E8E6E0]">
          <div ref={mapRef} className="w-full h-full" />

          {/* Overlay info card */}
          <AnimatePresence>
            {areaId && (
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
