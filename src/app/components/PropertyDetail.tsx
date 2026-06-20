import { ArrowLeft, Download, FileText, Shield, MapPin, TrendingUp, CheckCircle, AlertCircle, Building2, Scale, Home, ChevronRight, ChevronLeft, ExternalLink, X, Target, DollarSign, BarChart3, ArrowUp, ArrowDown, Minus, Bus, GraduationCap, HeartPulse, Briefcase, Train, Search, CreditCard, ClipboardList, Users, Gavel, Clock, Award, Landmark, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PremiumMap from './PremiumMap';
import Slider from 'react-slick';
import { useRef, useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getPropertyById } from '../data/properties';

function GaugeMeter({ value, label, sublabel }: { value: number; label: string; sublabel: string }) {
  const id = `gauge-${sublabel.replace(/[\s/]+/g, '-').toLowerCase()}`;
  const cx = 60, cy = 65;
  const needleAngle = Math.PI - value * Math.PI;
  const needleLen = 36;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy - needleLen * Math.sin(needleAngle);
  return (
    <div className="flex flex-col items-center">
      <svg width="130" height="75" viewBox="0 0 130 75">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="130" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E8D5B4" />
            <stop offset="100%" stopColor="#B8935E" />
          </linearGradient>
        </defs>
        <path d="M 12 65 A 50 50 0 0 1 118 65" fill="none" stroke="#F0EDE8" strokeWidth="12" strokeLinecap="round" />
        <path d="M 12 65 A 50 50 0 0 1 118 65" fill="none" stroke={`url(#${id})`} strokeWidth="12" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#7A5C35" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={4} fill="#7A5C35" />
      </svg>
      <div className="text-lg text-[#0F3D2E] -mt-1" style={{ fontFamily: "'Crimson Pro', serif" }}>{label}</div>
      <div className="text-xs text-[#6B6B6B] mt-0.5">{sublabel}</div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-4 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex items-start justify-between gap-4">
        <span className={`text-sm leading-snug transition-colors ${open ? 'text-[#0F3D2E]' : 'text-[#1A1A1A]'}`}>
          {question}
        </span>
        <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-0.5 text-[#6B6B6B] transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </div>
      {open && (
        <p className="mt-3 text-sm text-[#6B6B6B] leading-relaxed pr-8">
          {answer}
        </p>
      )}
    </div>
  );
}

function InfoTooltip({ text, light = false, align = 'center', dir = 'up' }: { text: string; light?: boolean; align?: 'center' | 'right'; dir?: 'up' | 'down' }) {
  const tipPosition = align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const caretPosition = align === 'right' ? 'right-3' : 'left-1/2 -translate-x-1/2';
  const isUp = dir === 'up';
  return (
    <span className="relative group inline-flex items-center">
      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center cursor-default text-[8px] font-bold leading-none select-none transition-colors normal-case tracking-normal
        ${light
          ? 'border-white/40 text-white/60 group-hover:border-white/80 group-hover:text-white/90'
          : 'border-[#0F3D2E]/30 text-[#0F3D2E]/50 group-hover:border-[#0F3D2E]/60 group-hover:text-[#0F3D2E]'
        }`}
      >i</span>
      <span className={`pointer-events-none absolute w-56 bg-white border border-black/10 text-[#1A1A1A] text-xs normal-case tracking-normal font-normal leading-relaxed rounded-lg px-3 py-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[300] ${tipPosition} ${isUp ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
        {text}
        {isUp
          ? <span className={`absolute top-full border-4 border-transparent border-t-white ${caretPosition}`} />
          : <span className={`absolute bottom-full border-4 border-transparent border-b-white ${caretPosition}`} />
        }
      </span>
    </span>
  );
}

const localityCategories = [
  { id: 'transit', label: 'Transit', Icon: Bus },
  { id: 'schools', label: 'Schools', Icon: GraduationCap },
  { id: 'hospitals', label: 'Hospitals', Icon: HeartPulse },
  { id: 'offices', label: 'Offices', Icon: Briefcase },
  { id: 'metro', label: 'Metro', Icon: Train },
];

const localityPOIs: Record<string, { name: string; distance: string; time: string }[]> = {
  transit: [
    { name: 'Thane Railway Station', distance: '1.2 Km', time: '4 mins' },
    { name: 'Pokhran Road Bus Stop', distance: '0.3 Km', time: '1 min' },
    { name: 'Eastern Express Highway', distance: '2.1 Km', time: '6 mins' },
    { name: 'Ghodbunder Road Junction', distance: '3.4 Km', time: '9 mins' },
  ],
  schools: [
    { name: 'DAV Public School', distance: '0.8 Km', time: '3 mins' },
    { name: 'Orchid International School', distance: '1.5 Km', time: '5 mins' },
    { name: 'St. John The Baptist High School', distance: '2.2 Km', time: '7 mins' },
    { name: 'Hiranandani Foundation School', distance: '3.0 Km', time: '9 mins' },
  ],
  hospitals: [
    { name: 'Jupiter Hospital', distance: '1.8 Km', time: '6 mins' },
    { name: 'Bethany Hospital', distance: '2.4 Km', time: '8 mins' },
    { name: 'Horizon Prime Hospital', distance: '3.1 Km', time: '10 mins' },
    { name: 'Kaushalya Medical Foundation', distance: '4.0 Km', time: '13 mins' },
  ],
  offices: [
    { name: 'Thane IT Park', distance: '2.5 Km', time: '8 mins' },
    { name: 'Hiranandani Business Park', distance: '5.2 Km', time: '15 mins' },
    { name: 'Wagle Estate Industrial Area', distance: '3.8 Km', time: '12 mins' },
    { name: 'Mindspace Airoli', distance: '7.0 Km', time: '20 mins' },
  ],
  metro: [
    { name: 'Kapurbawdi Metro Station', distance: '1.1 Km', time: '4 mins' },
    { name: 'Tikuji-ni-Wadi Metro Station', distance: '2.3 Km', time: '7 mins' },
    { name: 'Cadbury Junction Metro Station', distance: '3.5 Km', time: '10 mins' },
    { name: 'Gaimukh Metro Station', distance: '4.8 Km', time: '14 mins' },
  ],
};

const legalDocs = [
  { id: 'title-deed', name: 'Title Deed', desc: "Primary ownership document establishing the seller's legal title to the property.", price: '₹599' },
  { id: 'e-ferfar', name: 'e-Ferfar', desc: 'Digital mutation register showing ownership changes recorded with the revenue authority.', price: '₹399' },
  { id: 'index-2', name: 'Index 2', desc: 'Government-issued record of all registered transactions linked to this property.', price: '₹499' },
  { id: 'satbara', name: '7/12 Satbara', desc: 'Land record extract showing ownership, cultivation rights, and encumbrances on agricultural land.', price: '₹399' },
  { id: 'village-map', name: 'Village Map', desc: 'Survey map demarcating the plot boundaries within the revenue village.', price: '₹349' },
  { id: 'property-card', name: 'Property Card', desc: 'Urban land record (City Survey) confirming ownership of the plot in municipal areas.', price: '₹449' },
  { id: '8a-extract', name: '8A Extract', desc: 'Revenue record listing all land holdings of the owner in a given taluka.', price: '₹349' },
  { id: 'title-check', name: 'Title Check Document', desc: 'Legal opinion by an advocate verifying the chain of title and ownership history.', price: '₹1,499' },
  { id: 'encumbrance', name: 'Encumbrance Check Report', desc: 'Report confirming the property is free from outstanding mortgages, liens, or charges.', price: '₹799' },
];

export default function PropertyDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const sliderRef = useRef<Slider>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeMarketTab, setActiveMarketTab] = useState('local-comps');
  const [hoveredCompIndex, setHoveredCompIndex] = useState<number | null>(null);
  const [activeLocalityFilter, setActiveLocalityFilter] = useState('transit');
  const [selectedPlan, setSelectedPlan] = useState<string | null>('post-auction');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [eoiOpen, setEoiOpen] = useState(false);
  const [eoiForm, setEoiForm] = useState({ name: '', contact: '', email: '', referral: '', message: '', agreed: false });
  const [eoiKycFile, setEoiKycFile] = useState<File | null>(null);
  const [eoiDragOver, setEoiDragOver] = useState(false);
  const [docCart, setDocCart] = useState<string[]>([]);
  const [processTab, setProcessTab] = useState<'diligence' | 'steps'>('diligence');
  const [showStickyBar, setShowStickyBar] = useState(false);

  const property = id ? getPropertyById(id) : undefined;

  if (!property) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl mb-4 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Property Not Found
          </h1>
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-3 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg hover:bg-[#0F3D2E]/90"
          >
            Back to Opportunities
          </button>
        </div>
      </div>
    );
  }

  const comparableProperties = property.comparableProperties;

  const docTotal = docCart.reduce((sum, docId) => {
    const doc = legalDocs.find(d => d.id === docId);
    return doc ? sum + parseInt(doc.price.replace(/[₹,]/g, '')) : sum;
  }, 0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? propertyImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === propertyImages.length - 1 ? 0 : prev + 1));
  };

  const propertyImages = property.propertyImages;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
      }
    };

    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 420);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/properties')}
              className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#0F3D2E] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Opportunities</span>
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0F3D2E] rounded-sm" />
              <span className="text-xl tracking-tight" style={{ fontFamily: "'Crimson Pro', serif", color: '#0F3D2E' }}>
                Headway Capital
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm text-[#6B6B6B] hover:text-[#0F3D2E] transition-colors">
              Share
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg text-sm hover:bg-[#0F3D2E]/90 transition-all"
            >
              Contact Advisory
            </button>
          </div>
        </div>
      </nav>

      {/* Sticky property summary bar */}
      <div className={`fixed top-20 left-0 right-0 z-40 bg-[#0F3D2E]/96 backdrop-blur-sm border-b border-white/10 shadow-lg transition-all duration-300 ${showStickyBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-sm text-[#FAF8F5] font-medium truncate" style={{ fontFamily: "'Crimson Pro', serif" }}>
              {property.propertyName}
            </span>
            <span className="hidden sm:block text-[#FAF8F5]/70 text-sm">{property.price}</span>
            <span className="hidden sm:block text-emerald-400 text-xs font-semibold">{property.discount} below market</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {property.endsIn && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{property.endsIn}d left</span>
              </div>
            )}
            <button
              onClick={() => setEoiOpen(true)}
              className="px-4 py-1.5 bg-[#B8935E] text-[#FAF8F5] rounded-lg text-xs font-medium hover:bg-[#B8935E]/90 transition-all"
            >
              Express Interest
            </button>
          </div>
        </div>
      </div>

      {/* Investment Hero Section */}
      <section className="pt-24 pb-6 px-6 lg:px-12 bg-[#0F3D2E] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#B8935E] rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Badges + Title — full width */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1.5 bg-[#B8935E]/20 border border-[#B8935E]/30 text-[#B8935E] text-xs rounded-full flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#B8935E] rounded-full animate-pulse" />
                Bank Owned
                <InfoTooltip light align="right" dir="down" text="The property is held by the bank after loan default and foreclosure under SARFAESI. The bank is the legal seller." />
              </span>
              <span className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs rounded-full flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Physical Possession
                <InfoTooltip light align="right" dir="down" text="The bank has taken actual physical control of the property. Buyers can expect a vacant, occupiable handover after a successful auction." />
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl mb-1 text-[#FAF8F5]" style={{ fontFamily: "'Crimson Pro', serif" }}>
              {(property.type.toLowerCase().includes('commercial') || property.type.toLowerCase().includes('office'))
                ? `Commercial Property in ${property.location}`
                : `Residential Property in ${property.location}`}
            </h1>
            <p className="text-sm text-[#FAF8F5]/55 tracking-wide">
              {property.propertyName}, {property.location}, Mumbai
            </p>
            {property.endsIn && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/15 border border-amber-400/25 rounded-full">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-xs text-amber-300 font-medium">Auction closes in {property.endsIn} days</span>
              </div>
            )}
          </div>

          {/* Slideshow + Details */}
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Left: Slideshow — wider */}
            <div className="lg:col-span-3">
              <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                <Slider ref={sliderRef} {...sliderSettings}>
                  {propertyImages.map((image, index) => (
                    <div key={index}>
                      <div className="h-[290px] cursor-pointer" onClick={() => openLightbox(index)}>
                        <div className="relative w-full h-full">
                          <img
                            src={image}
                            alt={`Property view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.propertyName}, ${property.location}, Mumbai`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[#1a73e8] text-[10px] font-semibold px-2 py-1 rounded shadow-md hover:bg-white transition-colors z-10"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            Maps
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-black/50 transition-all z-10"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-black/50 transition-all z-10"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-2 space-y-4">
              {/* Stats Row */}
              <div className="flex items-center gap-0 border-y border-white/10 py-4">
                <div className="flex-1 text-center">
                  <div className="text-xl text-[#FAF8F5]" style={{ fontFamily: "'Crimson Pro', serif" }}>{property.configuration}</div>
                  <div className="text-xs text-[#FAF8F5]/50 mt-0.5 uppercase tracking-wide">Configuration</div>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div className="flex-1 text-center">
                  <div className="text-xl text-[#FAF8F5]" style={{ fontFamily: "'Crimson Pro', serif" }}>{property.area}</div>
                  <div className="text-xs text-[#FAF8F5]/50 mt-0.5 uppercase tracking-wide">Carpet Area</div>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div className="flex-1 text-center">
                  <div className="text-xl text-emerald-400" style={{ fontFamily: "'Crimson Pro', serif" }}>{property.score}/10</div>
                  <div className="text-xs text-[#FAF8F5]/50 mt-0.5 uppercase tracking-wide">Deal Score</div>
                </div>
              </div>

              {/* Price Insights */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                <h3 className="text-base text-[#FAF8F5]/60 uppercase tracking-widest mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Price Insights
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-[#FAF8F5]/50 mb-1.5">Reserve Price</div>
                    <div className="text-2xl text-[#FAF8F5]" style={{ fontFamily: "'Crimson Pro', serif" }}>{property.price}</div>
                    <div className="text-xs text-[#FAF8F5]/40 mt-0.5">{property.pricePerSqFt}/sq.ft</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#FAF8F5]/50 mb-1.5">Est. Market Price</div>
                    <div className="text-2xl text-[#FAF8F5]" style={{ fontFamily: "'Crimson Pro', serif" }}>{property.marketValue}</div>
                    <div className="text-xs text-[#FAF8F5]/40 mt-0.5">As per comparables</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#FAF8F5]/50 mb-1.5">Discount Rate</div>
                    <div className="text-2xl text-emerald-400" style={{ fontFamily: "'Crimson Pro', serif" }}>{property.discount}</div>
                    <div className="text-xs text-[#FAF8F5]/40 mt-0.5">Below market</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex">
                <button className="w-full justify-center py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-[#FAF8F5] rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Download Memo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Price Analysis */}
      <section className="py-8 px-6 lg:px-12 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl mb-5 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Institutional Price Analysis & Property Details
          </h2>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Property Details */}
            <div className="bg-white border border-black/5 rounded-xl p-5">
              <h3 className="text-base font-medium mb-4 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Property Details
              </h3>

              <div className="space-y-0 divide-y divide-black/5">
                <div className="py-3 flex justify-between items-start gap-4">
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wide shrink-0 pt-0.5">Address</div>
                  <div className="text-sm text-[#0F3D2E] text-right leading-snug">{property.fullAddress}</div>
                </div>
                <div className="py-3 flex justify-between items-center gap-4">
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wide shrink-0">Area (sq.ft)</div>
                  <div className="text-sm text-[#0F3D2E]">{property.carpetArea}</div>
                </div>
                <div className="py-3 flex justify-between items-center gap-4">
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wide shrink-0">Property Type</div>
                  <div className="text-sm text-[#0F3D2E]">{property.type}</div>
                </div>
                <div className="py-3 flex justify-between items-center gap-4">
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wide shrink-0">Parking</div>
                  <div className="text-sm text-[#0F3D2E]">{property.parking}</div>
                </div>
              </div>
            </div>

            {/* Auction Details */}
            <div className="bg-white border border-black/5 rounded-xl p-5">
              <h3 className="text-base font-medium mb-4 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Auction Details
              </h3>

              <div className="space-y-0 divide-y divide-black/5">
                <div className="py-3 flex justify-between items-center gap-4">
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wide shrink-0">Bank Name</div>
                  <div className="text-sm text-[#0F3D2E]">{property.lendingBank}</div>
                </div>
                <div className="py-3 flex justify-between items-center gap-4">
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wide shrink-0">Borrower</div>
                  <div className="text-sm text-[#0F3D2E]">—</div>
                </div>
                <div className="py-3 flex justify-between items-center gap-4">
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wide shrink-0 flex items-center gap-1">EMD <InfoTooltip text="Earnest Money Deposit — a refundable security amount (typically 10% of the reserve price) paid upfront to register as a bidder. Refunded if you don't win." /></div>
                  <div className="text-sm text-[#0F3D2E]">—</div>
                </div>
                <div className="py-3 flex justify-between items-center gap-4">
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wide shrink-0">Auction Date</div>
                  <div className="text-sm text-[#0F3D2E]">—</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Market Analysis */}
      <div className="relative" style={{ isolation: 'isolate' }}>
      {!isLoggedIn && (
        <div className="absolute inset-0 z-[900] flex items-start justify-center pt-[28vh] px-4 py-8" style={{ backdropFilter: 'blur(6px)', background: 'rgba(250,248,245,0.72)' }}>
          <div className="bg-white rounded-2xl shadow-2xl border border-black/8 px-10 py-10 flex flex-col items-center text-center max-w-sm w-full">
            <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-black/8 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-[#0F3D2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="text-xl text-[#0F3D2E] mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>Unlock Market Analysis</h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
              Sign in to access local comparables, locality insights, and expert market intelligence for this property.
            </p>
            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-3 bg-[#0F3D2E] text-[#FAF8F5] rounded-xl text-sm font-semibold hover:bg-[#0F3D2E]/90 transition-all shadow-md mb-3"
            >
              Log In
            </button>
            <p className="text-xs text-[#6B6B6B]">
              Don't have an account?{' '}
              <span className="text-[#B8935E] underline cursor-pointer hover:text-[#B8935E]/80 transition-colors">Sign up now</span>
            </p>
          </div>
        </div>
      )}
      <section className="py-16 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl mb-8 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Market Analysis
          </h2>

          {/* Tab Navigation */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setActiveMarketTab('local-comps')}
              className={`${
                activeMarketTab === 'local-comps'
                  ? 'bg-[#0F3D2E] text-[#FAF8F5]'
                  : 'bg-[#FAF8F5] text-[#0F3D2E] hover:bg-[#0F3D2E]/10'
              } rounded-xl p-6 transition-all text-left border border-black/5`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-5 h-5" />
                <h3 className="text-sm font-medium">Local Comps</h3>
              </div>
              <p className={`text-xs ${activeMarketTab === 'local-comps' ? 'text-[#FAF8F5]/80' : 'text-[#6B6B6B]'}`}>
                Compare the value of this property to similar properties in this area
              </p>
            </button>

            <button
              onClick={() => setActiveMarketTab('locality')}
              className={`${
                activeMarketTab === 'locality'
                  ? 'bg-[#0F3D2E] text-[#FAF8F5]'
                  : 'bg-[#FAF8F5] text-[#0F3D2E] hover:bg-[#0F3D2E]/10'
              } rounded-xl p-6 transition-all text-left border border-black/5`}
            >
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5" />
                <h3 className="text-sm font-medium">Locality</h3>
              </div>
              <p className={`text-xs ${activeMarketTab === 'locality' ? 'text-[#FAF8F5]/80' : 'text-[#6B6B6B]'}`}>
                Explore the surrounding area, connectivity and micro-market context
              </p>
            </button>

            <button
              onClick={() => setActiveMarketTab('insights')}
              className={`${
                activeMarketTab === 'insights'
                  ? 'bg-[#0F3D2E] text-[#FAF8F5]'
                  : 'bg-[#FAF8F5] text-[#0F3D2E] hover:bg-[#0F3D2E]/10'
              } rounded-xl p-6 transition-all text-left border border-black/5`}
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-sm font-medium">Insights</h3>
              </div>
              <p className={`text-xs ${activeMarketTab === 'insights' ? 'text-[#FAF8F5]/80' : 'text-[#6B6B6B]'}`}>
                Auction history, price trends and government valuation benchmarks
              </p>
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-black/5 rounded-2xl overflow-hidden">
            {/* Local Comps */}
            {activeMarketTab === 'local-comps' && (
              <div>
                <div className="p-6 border-b border-black/5">
                  <h3 className="text-xl text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                    Local Comps
                  </h3>
                </div>
                <div className="h-[400px] bg-gradient-to-br from-[#FAF8F5] to-[#E8E6E0]">
                  <PremiumMap
                    comparableProperties={comparableProperties}
                    hoveredCompIndex={hoveredCompIndex}
                    centerPosition={property.mapCenter}
                  />
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-black/10">
                        <tr className="text-left text-[#6B6B6B]">
                          <th className="pb-3 font-medium">Address</th>
                          <th className="pb-3 font-medium">Sale Price</th>
                          <th className="pb-3 font-medium">Sale Date</th>
                          <th className="pb-3 font-medium">Distance</th>
                          <th className="pb-3 font-medium">Bed</th>
                          <th className="pb-3 font-medium">Bath</th>
                          <th className="pb-3 font-medium">Sq. ft</th>
                          <th className="pb-3 font-medium">Built</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#0F3D2E]">
                        {comparableProperties.map((comp, index) => (
                          <tr
                            key={index}
                            className={`border-b border-black/5 transition-all cursor-pointer ${
                              hoveredCompIndex === index ? 'bg-[#B8935E]/10' : 'hover:bg-[#FAF8F5]'
                            }`}
                            onMouseEnter={() => setHoveredCompIndex(index)}
                            onMouseLeave={() => setHoveredCompIndex(null)}
                          >
                            <td className="py-3">{comp.name}</td>
                            <td className="py-3">{comp.price}</td>
                            <td className="py-3">{comp.date}</td>
                            <td className="py-3">{comp.distance}</td>
                            <td className="py-3">{comp.bed}</td>
                            <td className="py-3">{comp.bath}</td>
                            <td className="py-3">{comp.sqft}</td>
                            <td className="py-3">{comp.built}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Locality */}
            {activeMarketTab === 'locality' && (
              <div>
                {/* Filter Bar */}
                <div className="px-5 py-3 border-b border-black/5 flex items-center gap-2 overflow-x-auto">
                  {localityCategories.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveLocalityFilter(id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border ${
                        activeLocalityFilter === id
                          ? 'bg-[#0F3D2E] text-[#FAF8F5] border-[#0F3D2E]'
                          : 'bg-[#FAF8F5] text-[#0F3D2E] border-black/5 hover:bg-[#0F3D2E]/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                  <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-[#FAF8F5] text-[#6B6B6B] border border-black/5 hover:bg-[#0F3D2E]/10 whitespace-nowrap transition-all">
                    <Search className="w-3.5 h-3.5" />
                    Search
                  </button>
                </div>

                {/* Map + POI List */}
                <div className="flex h-[400px]">
                  <div className="flex-1 min-w-0">
                    <PremiumMap centerPosition={property.mapCenter} />
                  </div>
                  <div className="w-72 shrink-0 border-l border-black/5 overflow-y-auto">
                    {localityPOIs[activeLocalityFilter]?.map((poi, i) => (
                      <div
                        key={i}
                        className="px-4 py-3.5 border-b border-black/5 hover:bg-[#FAF8F5] cursor-pointer transition-all"
                      >
                        <div className="text-sm text-[#0F3D2E] mb-0.5">{poi.name}</div>
                        <div className="text-xs text-[#6B6B6B]">{poi.distance} · {poi.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Insights */}
            {activeMarketTab === 'insights' && (() => {
              const riskValue = property.risk === 'Low' ? 0.18 : property.risk === 'Medium' ? 0.5 : 0.82;
              const roiNum = parseFloat(property.roi);
              const investmentValue = Math.min(roiNum / 30, 1);
              const discountNum = parseFloat(property.discount);
              const priceCompValue = Math.min(discountNum / 30, 1);
              return (
                <div className="p-8">
                  <h3 className="text-2xl mb-1 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>Insights</h3>
                  <p className="text-sm text-[#6B6B6B] mb-8">Qualitative assessment based on auction data and market benchmarks</p>

                  {/* Gauge Meters */}

                  {/* Stat Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-[#FAF8F5] rounded-xl p-5 border border-black/5">
                      <div className="text-xs text-[#6B6B6B] uppercase tracking-wide mb-2">Auction Count</div>
                      <div className="text-3xl text-[#0F3D2E] mb-1" style={{ fontFamily: "'Crimson Pro', serif" }}>—</div>
                      <div className="text-xs text-[#6B6B6B]">Number of times listed for auction</div>
                    </div>
                    <div className="bg-[#FAF8F5] rounded-xl p-5 border border-black/5">
                      <div className="text-xs text-[#6B6B6B] uppercase tracking-wide mb-2">Price Drop</div>
                      <div className="text-3xl text-orange-600 mb-1" style={{ fontFamily: "'Crimson Pro', serif" }}>—</div>
                      <div className="text-xs text-[#6B6B6B]">Since first auction listing</div>
                    </div>
                    <div className="bg-[#FAF8F5] rounded-xl p-5 border border-black/5">
                      <div className="text-xs text-[#6B6B6B] uppercase tracking-wide mb-2 flex items-center gap-1">Ready Reckoner Rate <InfoTooltip text="The government-mandated minimum property valuation set annually by the state. Stamp duty is calculated on this or the actual sale price, whichever is higher." /></div>
                      <div className="text-3xl text-[#0F3D2E] mb-1" style={{ fontFamily: "'Crimson Pro', serif" }}>—</div>
                      <div className="text-xs text-[#6B6B6B]">Government circle rate per sq.ft</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>
      </div>

      {/* Legal Documents — E-Commerce Cart */}
      <section className="py-14 px-6 lg:px-12 bg-[#0F3D2E] border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#B8935E] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-96 h-64 bg-[#B8935E] rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">

          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B8935E]/20 border border-[#B8935E]/40 rounded-full mb-3">
                <span className="w-2 h-2 bg-[#B8935E] rounded-full animate-pulse" />
                <span className="text-xs text-[#B8935E] uppercase tracking-wide font-medium">Don't skip this · Critical before bidding</span>
              </div>
              <h2 className="text-3xl text-[#FAF8F5]" style={{ fontFamily: "'Crimson Pro', serif" }}>Build Your Legal Bundle</h2>
              <p className="text-sm text-[#FAF8F5]/60 mt-1 max-w-lg">
                Select the documents you need. We procure, verify, and deliver them before your bid.
              </p>
            </div>

            {/* Cart indicator */}
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 flex-shrink-0 ${
              docCart.length > 0 ? 'bg-[#B8935E] shadow-xl' : 'bg-white/10 border border-white/20'
            }`}>
              <div className="relative">
                <FileText className="w-5 h-5 text-[#FAF8F5]" />
                {docCart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full text-[10px] text-[#B8935E] font-bold flex items-center justify-center">
                    {docCart.length}
                  </span>
                )}
              </div>
              <div>
                <div className="text-sm text-[#FAF8F5] font-semibold">
                  {docCart.length === 0 ? 'None selected' : `${docCart.length} doc${docCart.length !== 1 ? 's' : ''} in bundle`}
                </div>
                <div className="text-xs text-[#FAF8F5]/70">
                  {docCart.length === 0 ? `of ${legalDocs.length} available` : `₹${docTotal.toLocaleString('en-IN')} total`}
                </div>
              </div>
              {docCart.length > 0 && (
                <button className="ml-1 bg-white/20 hover:bg-white/30 transition-all text-[#FAF8F5] text-xs px-3 py-1.5 rounded-lg font-medium">
                  Request →
                </button>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <button
              onClick={() => setDocCart(legalDocs.map(d => d.id))}
              className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#FAF8F5] rounded-lg transition-all border border-white/10"
            >
              Select All
            </button>
            <button
              onClick={() => setDocCart(['title-deed', 'title-check', 'encumbrance', 'index-2'])}
              className="text-xs px-3 py-1.5 bg-[#B8935E]/20 hover:bg-[#B8935E]/30 text-[#B8935E] rounded-lg transition-all border border-[#B8935E]/30 font-medium"
            >
              Most Popular Bundle
            </button>
            {docCart.length > 0 && (
              <button
                onClick={() => setDocCart([])}
                className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#FAF8F5]/60 rounded-lg transition-all border border-white/10"
              >
                Clear
              </button>
            )}
            <span className="text-xs text-[#FAF8F5]/40 ml-1">Tap any card to add or remove</span>
          </div>

          {/* Document cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {legalDocs.map((doc) => {
              const inCart = docCart.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  onClick={() => setDocCart(prev =>
                    prev.includes(doc.id) ? prev.filter(d => d !== doc.id) : [...prev, doc.id]
                  )}
                  className={`rounded-xl border p-4 flex items-start gap-3 transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${
                    inCart
                      ? 'bg-[#B8935E]/15 border-[#B8935E]/50 shadow-md'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    inCart ? 'bg-[#B8935E]' : 'bg-white/10'
                  }`}>
                    {inCart
                      ? <CheckCircle className="w-4 h-4 text-white" />
                      : <Plus className="w-4 h-4 text-[#FAF8F5]/60" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`text-sm font-medium leading-snug transition-colors ${inCart ? 'text-[#B8935E]' : 'text-[#FAF8F5]'}`}>
                        {doc.name}
                      </div>
                      <span className={`text-xs font-semibold flex-shrink-0 transition-colors ${inCart ? 'text-[#B8935E]' : 'text-[#FAF8F5]/50'}`}>
                        {doc.price}
                      </span>
                    </div>
                    <div className="text-xs text-[#FAF8F5]/50 mt-0.5 leading-relaxed">{doc.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart CTA strip — appears when items selected */}
          {docCart.length > 0 && (
            <div className="bg-[#B8935E] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
              <div>
                <div className="text-[#FAF8F5] font-semibold text-base">
                  {docCart.length} document{docCart.length !== 1 ? 's' : ''} · ₹{docTotal.toLocaleString('en-IN')}
                </div>
                <div className="text-[#FAF8F5]/80 text-xs mt-0.5">We'll verify and deliver before your auction date</div>
              </div>
              <button className="bg-white text-[#B8935E] px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/90 transition-all flex-shrink-0 shadow-md active:scale-[0.97]">
                Request Bundle →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Due Diligence + Buying Process — merged horizontal */}
      <section className="py-10 px-6 lg:px-12 bg-[#FAF8F5] border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>Before You Bid</h2>
              <p className="text-sm text-[#6B6B6B] mt-0.5">Everything you need to do and know.</p>
            </div>
            <div className="flex gap-1 bg-[#0F3D2E]/5 rounded-xl p-1 self-start sm:self-auto">
              <button
                onClick={() => setProcessTab('diligence')}
                className={`px-4 py-2 rounded-lg text-sm transition-all font-medium ${
                  processTab === 'diligence' ? 'bg-[#0F3D2E] text-[#FAF8F5] shadow-sm' : 'text-[#6B6B6B] hover:text-[#0F3D2E]'
                }`}
              >
                Due Diligence
              </button>
              <button
                onClick={() => setProcessTab('steps')}
                className={`px-4 py-2 rounded-lg text-sm transition-all font-medium ${
                  processTab === 'steps' ? 'bg-[#0F3D2E] text-[#FAF8F5] shadow-sm' : 'text-[#6B6B6B] hover:text-[#0F3D2E]'
                }`}
              >
                Buying Steps
              </button>
            </div>
          </div>

          {processTab === 'diligence' && (
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { Icon: FileText, title: '1. Auction Notice', desc: 'The official bank-published notice contains the reserve price, auction date, EMD, and terms of sale. Review carefully — all bidding is subject to its conditions.' },
                { Icon: Shield, title: '2. Encumbrance / Dues', desc: 'Check outstanding charges, society dues, property tax arrears, or other encumbrances. Buyers are typically liable for dues post-auction.' },
                { Icon: Scale, title: '3. Litigation', desc: 'SARFAESI auctions may have borrower challenges in DRT or High Court. Verify whether any stay orders or objections exist before bidding.' },
                { Icon: MapPin, title: '4. Site Visit', desc: 'Physical inspection is strongly recommended. Assess condition, verify possession status, and check for occupancy or structural concerns.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 bg-white border border-black/5 rounded-xl p-4 hover:border-[#0F3D2E]/15 transition-all">
                  <div className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.Icon className="w-4 h-4 text-[#6B6B6B]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F3D2E] mb-1" style={{ fontFamily: "'Crimson Pro', serif" }}>{item.title}</div>
                    <div className="text-xs text-[#6B6B6B] leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {processTab === 'steps' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { n: '01', title: 'Choose a Property', desc: 'Explore listings and find a property that meets your investment requirements.', Icon: Home },
                { n: '02', title: 'Pay the EMD', desc: 'Submit 10% of the reserve price as Earnest Money Deposit via Demand Draft to the bank.', Icon: CreditCard },
                { n: '03', title: 'Submit Application', desc: 'Fill the Common Application Form (CAF) with KYC documents before the auction.', Icon: ClipboardList },
                { n: '04', title: 'Participate in Auction', desc: 'Attend the e-auction on the scheduled date and place bids against other registered bidders.', Icon: Users },
                { n: '05', title: 'Auction Outcome', desc: 'Win: pay 15% immediately. Lose: full EMD refunded within days.', Icon: Gavel },
                { n: '06', title: 'Pay Balance in 15 Days', desc: 'Pay the remaining 75% of the total bid amount within 15 days to initiate the sale process.', Icon: Clock },
                { n: '07', title: 'Obtain Sale Certificate', desc: 'The bank issues a Sale Certificate confirming transfer of ownership upon full payment.', Icon: Award },
                { n: '08', title: 'Register the Property', desc: 'Complete registration at the Sub-Registrar Office with the Sale Certificate to get clear title.', Icon: Landmark },
              ].map((step, i) => (
                <div key={i} className="bg-white border border-black/5 rounded-xl p-4 hover:border-[#0F3D2E]/15 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-[#0F3D2E] rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-semibold text-[#FAF8F5]">{step.n}</span>
                    </div>
                    <step.Icon className="w-4 h-4 text-[#B8935E]" />
                  </div>
                  <div className="text-sm font-medium text-[#0F3D2E] mb-1">{step.title}</div>
                  <div className="text-xs text-[#6B6B6B] leading-relaxed">{step.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Optional Value Added Services */}
      <section className="py-12 px-6 lg:px-12 bg-[#FAF8F5] border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl mb-1 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Optional Value Added Services
          </h2>
          <p className="text-sm text-[#6B6B6B] mb-8">Professional assistance at every stage of the auction process.</p>

          {(() => {
            const plans = [
              {
                id: 'free',
                label: 'Free Plan',
                price: '₹0',
                subtitle: null,
                description: null,
                items: [
                  "Understanding the Buying Process",
                  "Schedule Paper Verification at Seller Branch",
                  "Assist in Completing the Bid Form",
                  "Pick EMD (Demand Draft) for Submission",
                  "Share Encumbrances Mentioned in Auction Notice",
                ],
                popular: false,
              },
              {
                id: 'pre-auction',
                label: 'Pre-Auction Plan',
                price: '₹10,000',
                subtitle: null,
                description: 'Everything in Free Plan + below',
                items: [
                  "Auction Notice",
                  "Visit Assistance",
                  "Encumbrance Certificate",
                  "Seller Bank's Rights",
                  "Borrower Litigation(s) Filed in Respective DRT",
                  "Electricity Dues",
                  "Water Dues",
                  "Property Tax",
                  "Estimate of City Authority / Association Tax",
                  "Obtain Bid Form",
                ],
                popular: false,
              },
              {
                id: 'post-auction',
                label: 'Post-Auction Plan',
                price: '₹25,000',
                subtitle: 'Starts from',
                description: 'Everything in Free Plan, Pre Auction Plan + below',
                items: [
                  "Coordination with Seller Institution for Payment & TDS Deduction",
                  "Assistance in Collecting the Original Documents",
                ],
                popular: true,
              },
              {
                id: 'post-auction-premium',
                label: 'Post-Auction Premium',
                price: '₹50,000',
                subtitle: 'Starts from',
                description: 'Everything in Free Plan, Pre Auction Plan, Post Auction Plan + below',
                items: [
                  "Lending Application Assistance",
                  "Stamp Duty Waiver Request & Coordination",
                ],
                popular: false,
              },
            ];

            return (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => {
                  const active = selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`rounded-2xl p-6 flex flex-col relative overflow-hidden cursor-pointer transition-all duration-200 ${
                        active
                          ? 'bg-[#0F3D2E] border border-[#0F3D2E] shadow-lg'
                          : 'bg-white border border-black/5 hover:border-[#0F3D2E]/20 hover:shadow-md'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#B8935E]/20 border border-[#B8935E]/30 rounded-full">
                          <span className="text-xs text-[#B8935E]">Popular</span>
                        </div>
                      )}
                      <div className="mb-4">
                        <div className={`text-xs uppercase tracking-wide mb-1 ${active ? 'text-[#FAF8F5]/60' : 'text-[#6B6B6B]'}`}>
                          {plan.label}
                        </div>
                        {plan.subtitle && (
                          <div className={`text-xs mb-0.5 ${active ? 'text-[#FAF8F5]/50' : 'text-[#6B6B6B]'}`}>
                            {plan.subtitle}
                          </div>
                        )}
                        <div className={`text-3xl ${active ? 'text-[#FAF8F5]' : 'text-[#0F3D2E]'}`} style={{ fontFamily: "'Crimson Pro', serif" }}>
                          {plan.price}
                        </div>
                      </div>
                      {plan.description && (
                        <p className={`text-xs mb-3 ${active ? 'text-[#FAF8F5]/60' : 'text-[#6B6B6B]'}`}>
                          {plan.description}
                        </p>
                      )}
                      <ul className="space-y-2.5 flex-1">
                        {plan.items.map((item) => (
                          <li key={item} className={`flex items-start gap-2.5 text-xs ${active ? 'text-[#FAF8F5]/80' : 'text-[#4B4B4B]'}`}>
                            <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${active ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <button className={`mt-6 w-full py-2.5 rounded-lg text-sm transition-all ${
                        active
                          ? 'bg-[#B8935E] text-[#FAF8F5] hover:bg-[#B8935E]/90'
                          : 'border border-[#0F3D2E]/20 text-[#0F3D2E] hover:bg-[#0F3D2E]/5'
                      }`}>
                        Get Started
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* FAQ Section */}
      {(() => {
        const faqs = [
          {
            q: "How does a bank auction under SARFAESI work?",
            a: "Under the SARFAESI Act, banks can take possession of a secured asset and sell it without court intervention when a borrower defaults. The bank issues a demand notice, takes symbolic or physical possession, and then publishes an auction notice in newspapers. Interested buyers submit EMD and bid on the property on the specified date.",
          },
          {
            q: "Can I visit the property before placing a bid?",
            a: "Yes, in most cases you can request a site visit through the bank or their authorised representative. Physical inspection is strongly recommended — you should verify the actual condition of the property, confirm possession status, and check for any encroachments or structural issues not mentioned in the auction notice.",
          },
          {
            q: "What is EMD and how much do I need to pay?",
            a: "EMD (Earnest Money Deposit) is a refundable security deposit paid upfront to participate in the auction, typically 10% of the reserve price. It is submitted as a Demand Draft in favour of the bank before the auction date. If you win, it is adjusted against the sale price. If you lose, it is refunded.",
          },
          {
            q: "Can I use a home loan to finance a bank auction property?",
            a: "Yes, home loans are available for bank auction properties, though the process is more involved. Some banks are hesitant to lend on properties with pending litigation. It is advisable to get a loan pre-approval before bidding, as the balance payment window after winning is typically 15–30 days — too short to arrange financing from scratch.",
          },
          {
            q: "Who is liable for outstanding society dues and property tax?",
            a: "Generally, the buyer is liable for all dues that arise after the auction sale date. However, any arrears from before the sale — society maintenance, property tax, electricity dues — are technically the seller's (bank's) liability, though this is often disputed. Always verify outstanding dues before bidding and factor them into your total cost.",
          },
          {
            q: "What happens if the borrower challenges the auction in court?",
            a: "Borrowers can challenge a SARFAESI auction in the Debt Recovery Tribunal (DRT) or High Court. If a stay is granted, the auction or possession transfer may be delayed. Before bidding, check whether any DRT proceedings or stay orders are active against the property. Properties with clean legal records and no pending challenges are significantly lower risk.",
          },
        ];
        return (
          <section className="py-12 px-6 lg:px-12 bg-white border-t border-black/5">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl mb-1 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Top FAQs
              </h2>
              <p className="text-sm text-[#6B6B6B] mb-8">Common questions about buying bank auction properties in India.</p>

              <div className="divide-y divide-black/5 max-w-3xl">
                {faqs.map((faq, i) => (
                  <FaqItem key={i} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Exclusive CTA Section */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-br from-[#0F3D2E] via-[#0F3D2E]/95 to-[#0F3D2E]/85 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#B8935E] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#B8935E] rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8935E]/20 border border-[#B8935E]/30 rounded-full mb-6">
            <Shield className="w-4 h-4 text-[#B8935E]" />
            <span className="text-xs text-[#B8935E] uppercase tracking-wider">Qualified Investors Only</span>
          </div>

          <h2 className="text-5xl mb-6 text-[#FAF8F5]" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Request Access To Full Deal Room
          </h2>
          <p className="text-xl text-[#FAF8F5]/80 mb-10 leading-relaxed max-w-2xl mx-auto">
            This opportunity is shared selectively with qualified investors and advisory partners. Access complete due diligence reports, valuation models, and acquisition support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="px-10 py-5 bg-[#B8935E] text-[#FAF8F5] rounded-lg hover:bg-[#B8935E]/90 transition-all shadow-2xl flex items-center gap-3">
              <span className="text-lg">Request Deal Room Access</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-[#FAF8F5] rounded-lg hover:bg-white/20 transition-all flex items-center gap-3">
              <Download className="w-5 h-5" />
              <span className="text-lg">Download Summary</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-[#FAF8F5]/60">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#B8935E]" />
              <span>Legal verification complete</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-[#FAF8F5]/30 rounded-full" />
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#B8935E]" />
              <span>Bank sourced opportunity</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-[#FAF8F5]/30 rounded-full" />
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#B8935E]" />
              <span>Advisory support included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 bg-[#FAF8F5] border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0F3D2E] rounded-sm" />
              <span className="text-lg tracking-tight" style={{ fontFamily: "'Crimson Pro', serif", color: '#0F3D2E' }}>
                Headway Capital
              </span>
            </div>
            <p className="text-sm text-[#6B6B6B]">
              © 2026 Headway Capital. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Express Interest Floating Button */}
      <button
        onClick={() => setEoiOpen(true)}
        className="fixed bottom-6 right-6 z-[140] flex items-center gap-2 bg-[#0F3D2E] text-[#FAF8F5] px-5 py-3 rounded-full shadow-2xl hover:bg-[#0F3D2E]/90 transition-all"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        <span className="text-sm font-medium">Express Interest</span>
      </button>

      {/* EOI Slide-in Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md z-[150] flex flex-col bg-white shadow-2xl border-l border-black/8 transition-transform duration-300 ease-in-out ${eoiOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Drawer Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5 bg-[#0F3D2E] flex-shrink-0">
          <div>
            <h2 className="text-2xl text-[#FAF8F5]" style={{ fontFamily: "'Crimson Pro', serif" }}>Expression of Interest</h2>
            <p className="text-xs text-[#FAF8F5]/60 mt-0.5">Register your intent to acquire this property</p>
          </div>
          <button onClick={() => setEoiOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors mt-1 flex-shrink-0">
            <X className="w-4 h-4 text-[#FAF8F5]" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm text-[#0F3D2E] font-medium mb-1.5">Name<span className="text-[#B8935E]">*</span></label>
            <input type="text" placeholder="Name" value={eoiForm.name}
              onChange={(e) => setEoiForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#9B9B9B] outline-none focus:ring-2 focus:ring-[#B8935E]/30" />
          </div>
          <div>
            <label className="block text-sm text-[#0F3D2E] font-medium mb-1.5">Contact Number<span className="text-[#B8935E]">*</span></label>
            <input type="tel" placeholder="Contact Number" value={eoiForm.contact}
              onChange={(e) => setEoiForm(f => ({ ...f, contact: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#9B9B9B] outline-none focus:ring-2 focus:ring-[#B8935E]/30" />
          </div>
          <div>
            <label className="block text-sm text-[#0F3D2E] font-medium mb-1.5">Email Address<span className="text-[#B8935E]">*</span></label>
            <input type="email" placeholder="Email Address" value={eoiForm.email}
              onChange={(e) => setEoiForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#9B9B9B] outline-none focus:ring-2 focus:ring-[#B8935E]/30" />
          </div>
          <div>
            <label className="block text-sm text-[#0F3D2E] font-medium mb-1.5">KYC Document</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setEoiDragOver(true); }}
              onDragLeave={() => setEoiDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setEoiDragOver(false); const f = e.dataTransfer.files[0]; if (f) setEoiKycFile(f); }}
              className={`w-full bg-[#FAF8F5] rounded-lg px-3 py-3 border-2 border-dashed text-center transition-colors ${eoiDragOver ? 'border-[#B8935E] bg-[#B8935E]/5' : 'border-black/15'}`}
            >
              {eoiKycFile ? (
                <span className="text-sm text-[#0F3D2E]">{eoiKycFile.name}</span>
              ) : (
                <label className="cursor-pointer">
                  <span className="text-sm text-[#6B6B6B]">Drag & Drop or </span>
                  <span className="text-sm text-[#B8935E] font-semibold underline">Upload KYC</span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) setEoiKycFile(f); }} />
                </label>
              )}
            </div>
            <p className="mt-1.5 text-xs text-[#6B6B6B] italic">Banks & FIs require KYC (PAN, Aadhar, Voter ID, Passport etc.) to schedule property visits.</p>
          </div>
          <div>
            <label className="block text-sm text-[#0F3D2E] font-medium mb-1.5">Referral Contact Number</label>
            <input type="tel" placeholder="Referral Contact Number" value={eoiForm.referral}
              onChange={(e) => setEoiForm(f => ({ ...f, referral: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#9B9B9B] outline-none focus:ring-2 focus:ring-[#B8935E]/30" />
          </div>
          <div>
            <button className="text-sm text-[#0F3D2E] font-semibold underline hover:text-[#0F3D2E]/70 transition-colors">Register as CP</button>
          </div>
          <div>
            <label className="block text-sm text-[#0F3D2E] font-medium mb-1.5">Message</label>
            <textarea rows={4} placeholder="Request for property visit, additional property information, similar properties, auction process, etc."
              value={eoiForm.message} onChange={(e) => setEoiForm(f => ({ ...f, message: e.target.value }))}
              className="w-full bg-[#FAF8F5] border border-black/10 rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#9B9B9B] outline-none focus:ring-2 focus:ring-[#B8935E]/30 resize-none" />
          </div>
          <div className="flex items-start gap-3">
            <input type="checkbox" id="eoi-agree" checked={eoiForm.agreed}
              onChange={(e) => setEoiForm(f => ({ ...f, agreed: e.target.checked }))}
              className="mt-0.5 w-4 h-4 accent-[#B8935E] flex-shrink-0" />
            <label htmlFor="eoi-agree" className="text-xs text-[#6B6B6B] leading-relaxed cursor-pointer">
              I express interest to purchase the aforementioned property. I authorize Hecta to share these details with the seller institution and intermediaries. I agree with the{' '}
              <span className="text-[#0F3D2E] underline cursor-pointer">Terms & Conditions</span> and{' '}
              <span className="text-[#0F3D2E] underline cursor-pointer">Privacy Policy</span>.
            </label>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-black/5 flex-shrink-0">
          <button
            disabled={!eoiForm.agreed || !eoiForm.name || !eoiForm.contact || !eoiForm.email}
            className="w-full py-3 bg-[#0F3D2E] text-[#FAF8F5] rounded-xl text-sm font-semibold hover:bg-[#0F3D2E]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            Submit Expression of Interest
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Previous Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-6 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          {/* Image */}
          <div className="max-w-6xl max-h-[90vh] px-20" onClick={(e) => e.stopPropagation()}>
            <img
              src={propertyImages[currentImageIndex]}
              alt={`Property view ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {/* Next Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-6 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
            <span className="text-sm text-white">
              {currentImageIndex + 1} / {propertyImages.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
