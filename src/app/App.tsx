import { ArrowRight, ChevronRight, Shield, FileText, Gavel, CheckCircle, Building2, Bookmark } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import PropertyDetail from './components/PropertyDetail';
import AboutPage from './components/AboutPage';
import { getAllProperties } from './data/properties';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

function HomePage() {
  const navigate = useNavigate();
  const [bookmarkedProperties, setBookmarkedProperties] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const properties = getAllProperties();

  return (
    <div className="min-h-screen bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0F3D2E] rounded-sm" />
            <span className="text-xl tracking-tight" style={{ fontFamily: "'Crimson Pro', serif", color: '#0F3D2E' }}>
              Headway Capital
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#opportunities" className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
              Opportunities
            </a>
            <a href="#process" className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
              How It Works
            </a>
            <button
              onClick={() => navigate('/about')}
              className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              About
            </button>
            <button className="px-5 py-2.5 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg text-sm hover:bg-[#0F3D2E]/90 transition-all">
              Get Access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 lg:px-12 overflow-hidden bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={staggerContainer}
            >
              {/* NEW badge */}
              <motion.div variants={fadeInUp} className="mb-5">
                <span className="inline-block border border-[#0F3D2E]/20 text-[#0F3D2E] text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-sm">New</span>
              </motion.div>

              {/* Location line */}
              <motion.p variants={fadeInUp} className="text-xs tracking-widest uppercase text-[#6B6B6B] mb-5 flex items-center gap-2">
                <span className="w-6 h-px bg-[#6B6B6B]/40 inline-block" />
                Mumbai · Bank Auction Specialists
              </motion.p>

              {/* Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-6xl leading-tight mb-6 text-[#0F3D2E]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                The private market for{' '}
                <em className="not-italic text-[#B8935E]">distressed property</em>{' '}
                acquisition
              </motion.h1>

              {/* Subtext */}
              <motion.p variants={fadeInUp} className="text-base text-[#6B6B6B] mb-8 leading-relaxed max-w-md">
                Institutional-grade analysis on Mumbai's bank-foreclosed properties — sourced before public listing, vetted for legal standing, and sized for ₹2Cr+ investments.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 mb-12">
                <button
                  onClick={() => document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group px-7 py-3.5 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg hover:bg-[#0F3D2E]/90 transition-all flex items-center gap-2 text-sm"
                >
                  See Live Opportunities
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="text-sm text-[#0F3D2E] underline underline-offset-4 hover:text-[#0F3D2E]/70 transition-colors">
                  How We Source Deals
                </button>
              </motion.div>

              {/* Trust bar */}
              <motion.div variants={fadeInUp} className="pt-6 border-t border-black/8">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6B6B6B]">
                  <span><span className="text-[#0F3D2E] font-medium">SBI · HDFC · Axis · Canara</span> sourced</span>
                  <span className="w-px h-3 bg-black/15 hidden sm:block" />
                  <span><span className="text-[#0F3D2E] font-medium">100%</span> physical possession deals</span>
                  <span className="w-px h-3 bg-black/15 hidden sm:block" />
                  <span><span className="text-[#0F3D2E] font-medium">SEBI</span>-compliant advisory</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Live Deal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-black/8 shadow-2xl">
                {/* Image area with dark green overlay */}
                <div className="relative bg-[#0F3D2E]">
                  {/* Top badges */}
                  <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-4">
                    <span className="px-2.5 py-1 bg-[#B8935E] text-white text-[10px] font-semibold uppercase tracking-widest rounded-sm">Active Auction</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] rounded-sm">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Live Now
                    </span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1710582308582-55cc0c461c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900"
                    alt="White Rose, Bandra West"
                    className="w-full h-52 object-cover opacity-60 mix-blend-luminosity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D2E] via-[#0F3D2E]/20 to-transparent" />
                </div>

                {/* Card body */}
                <div className="bg-white px-5 pt-5 pb-5">
                  <p className="text-[10px] tracking-widest uppercase text-[#6B6B6B] mb-1">Bandra West · 3 BHK</p>
                  <h3 className="text-xl text-[#0F3D2E] mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>White Rose, Perry Road</h3>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wide mb-0.5">Reserve</div>
                      <div className="text-lg text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>₹12.5Cr</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wide mb-0.5">Mkt Value</div>
                      <div className="text-lg text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>₹15Cr</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-700 uppercase tracking-wide mb-0.5">Upside</div>
                      <div className="text-lg text-emerald-700" style={{ fontFamily: "'Crimson Pro', serif" }}>+20%</div>
                    </div>
                  </div>

                  {/* Footer row */}
                  <div className="flex items-center justify-between pt-3.5 border-t border-black/5">
                    <div className="text-xs text-[#6B6B6B]">
                      Deal Score <span className="text-[#0F3D2E] font-semibold">9.5 / 10</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#6B6B6B]">Ends in <span className="text-[#0F3D2E] font-medium">15 days</span></span>
                      <button
                        onClick={() => navigate('/property/white-rose-bandra-1302')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#0F3D2E] text-[#FAF8F5] text-xs rounded-lg hover:bg-[#0F3D2E]/90 transition-colors"
                      >
                        View Deal <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section id="opportunities" className="py-20 px-6 lg:px-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeInUp}
            className="mb-12"
          >
            <h2
              className="text-4xl mb-4 text-[#0F3D2E]"
              style={{ fontFamily: "'Crimson Pro', serif" }}
            >
              Featured Opportunities
            </h2>
            <p className="text-[#6B6B6B]">Handpicked properties with verified legal standing and institutional backing</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {properties.map((property, index) => (
              <motion.div
                variants={fadeInUp}
                key={property.id}
                className="group bg-white border border-black/5 rounded-xl overflow-hidden hover:border-[#B8935E]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Property Photos */}
                <div className="relative h-40 bg-gradient-to-br from-[#FAF8F5] to-[#E8E6E0] overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.location}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Asset ID Badge */}
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-black/5">
                    <div className="text-xs text-[#0F3D2E] uppercase tracking-wider">{property.assetId}</div>
                  </div>
                  {/* Ends In Badge */}
                  {property.endsIn && (
                    <div className={`absolute bottom-2 left-2 backdrop-blur-sm rounded-lg px-2.5 py-1 ${
                      property.endsIn <= 3
                        ? 'bg-red-500/95 border-red-400/30'
                        : property.endsIn <= 9
                        ? 'bg-yellow-500/95 border-yellow-400/30'
                        : 'bg-emerald-500/95 border-emerald-400/30'
                    }`}>
                      <div className="text-xs text-white uppercase tracking-wider">Ends in {property.endsIn} days</div>
                    </div>
                  )}
                </div>

                {/* Header - Investment Amount */}
                <div className="px-3 py-3 border-b border-black/5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 text-left">
                      <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">Reserve Price</div>
                      <div className="text-3xl text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        {property.price}
                      </div>
                    </div>
                    <button
                      onClick={(e) => toggleBookmark(property.id, e)}
                      className="p-1.5 hover:bg-[#FAF8F5] rounded-lg transition-all"
                    >
                      <Bookmark
                        className={`w-5 h-5 transition-all ${
                          bookmarkedProperties.has(property.id)
                            ? 'fill-[#B8935E] text-[#B8935E]'
                            : 'text-[#6B6B6B] hover:text-[#B8935E]'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Investment Metrics */}
                <div className="p-4">
                  {/* Property Description */}
                  <div className="mb-3">
                    <h3 className="text-lg mb-0.5 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                      {property.location}
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mb-1">{property.type}</p>
                    <p className="text-xs text-[#6B6B6B]">{property.propertyName}</p>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2.5 mb-3">
                    <div className="bg-[#FAF8F5] rounded-lg p-2.5">
                      <div className="text-xs text-[#6B6B6B] mb-1">Possession</div>
                      <div className="text-sm text-emerald-700" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        Physical
                      </div>
                    </div>
                    <div className="bg-[#FAF8F5] rounded-lg p-2.5">
                      <div className="text-xs text-[#6B6B6B] mb-1">Area</div>
                      <div className="text-sm text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        {property.area}
                      </div>
                    </div>
                    <div className="bg-[#FAF8F5] rounded-lg p-2.5">
                      <div className="text-xs text-[#6B6B6B] mb-1">Deal Score</div>
                      <div className="text-sm text-[#B8935E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                        {property.score}/10
                      </div>
                    </div>
                  </div>

                  {/* Bank Owned Badge */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-xs text-blue-700 font-medium">Bank Owned</span>
                  </div>

                  <button
                    onClick={() => navigate(`/property/${property.id}`)}
                    className="w-full py-2.5 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg group-hover:bg-[#0F3D2E]/90 transition-all flex items-center justify-center gap-2 text-sm shadow-sm group-hover:shadow-md"
                  >
                    View Investment Details
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why SARFAESI Section */}
      <section className="py-20 px-6 lg:px-12 bg-[#FAF8F5] border-t border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="mb-10">
              <p className="text-xs tracking-widest uppercase text-[#6B6B6B] flex items-center gap-2 mb-4">
                <span className="w-6 h-px bg-[#6B6B6B]/40 inline-block" />
                The Case for Bank Auctions
              </p>
              <h2 className="text-4xl lg:text-5xl text-[#0F3D2E] mb-4 max-w-2xl leading-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Why serious investors prefer SARFAESI properties
              </h2>
              <p className="text-[#6B6B6B] max-w-xl leading-relaxed">
                Most HNIs have never participated in a bank auction. The table below answers every objection their CA will raise.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-10 items-start">
              {/* Comparison Table — 3 cols */}
              <motion.div variants={fadeInUp} className="lg:col-span-3">
                <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-3 bg-[#0F3D2E]/5 border-b border-black/5">
                    <div className="px-5 py-3 text-[10px] tracking-widest uppercase text-[#6B6B6B]">Factor</div>
                    <div className="px-5 py-3 text-[10px] tracking-widest uppercase text-[#0F3D2E] border-l border-black/5">Bank Auction</div>
                    <div className="px-5 py-3 text-[10px] tracking-widest uppercase text-[#6B6B6B] border-l border-black/5">Open Market</div>
                  </div>
                  {/* Rows */}
                  {[
                    { factor: 'Typical discount', auction: '15–35% below market', market: 'Negotiated, marginal' },
                    { factor: 'Legal standing', auction: 'Bank-verified title', market: 'Self-declared, variable' },
                    { factor: 'Possession', auction: 'Physical or symbolic', market: 'Delayed by builder' },
                    { factor: 'Bidding competition', auction: 'Low — info asymmetry', market: 'High, price discovery' },
                    { factor: 'Stamp duty advantage', auction: 'Reckoner rate often lower', market: 'Market value applied' },
                    { factor: 'Seller motivation', auction: 'Bank must liquidate', market: 'Owner can wait' },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-3 border-b border-black/5 last:border-0 hover:bg-[#FAF8F5] transition-colors">
                      <div className="px-5 py-3.5 text-sm text-[#1A1A1A] font-medium">{row.factor}</div>
                      <div className="px-5 py-3.5 text-sm text-[#0F3D2E] border-l border-black/5">{row.auction}</div>
                      <div className="px-5 py-3.5 text-sm text-[#6B6B6B] border-l border-black/5">{row.market}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right column — stat card + callout */}
              <motion.div variants={fadeInUp} className="lg:col-span-2 flex flex-col gap-4">
                {/* Market Signal card */}
                <div className="bg-[#0F3D2E] rounded-2xl px-6 py-7 text-[#FAF8F5]">
                  <p className="text-[10px] tracking-widest uppercase text-[#FAF8F5]/50 mb-4">Market Signal</p>
                  <div className="text-6xl text-[#B8935E] mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>23<span className="text-3xl">%</span></div>
                  <p className="text-sm text-[#FAF8F5]/80 leading-relaxed mb-4">
                    Average discount our investors secured below IGR-registered market value, across 40+ transactions in FY2024–25.
                  </p>
                  <p className="text-[10px] text-[#FAF8F5]/35 leading-relaxed italic">
                    Internal transaction data. Past performance is not indicative of future results.
                  </p>
                </div>

                {/* Why most miss out */}
                <div className="bg-white rounded-2xl border border-black/5 px-6 py-5">
                  <p className="text-[10px] tracking-widest uppercase text-[#B8935E] mb-3">Why Most Miss Out</p>
                  <p className="text-sm text-[#4B4B4B] leading-relaxed">
                    Bank auction notices are buried in regional newspapers and e-auction portals with 15–30 day windows. Without institutional sourcing, HNIs discover deals after the window has closed.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Headway Insight Section */}
      <section className="py-20 px-6 lg:px-12 bg-[#0F3D2E] overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <h2 className="text-4xl mb-4 text-[#FAF8F5]" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Institutional-Grade Due Diligence
            </h2>
            <p className="text-lg text-[#FAF8F5]/70 leading-relaxed max-w-2xl mx-auto">
              Each deal is vetted with legal diligence, valuation benchmarking, and return modeling
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                Icon: Shield,
                title: 'Legal Verification',
                desc: 'Title chain verification with property lawyers before we list any opportunity.',
                points: [
                  'Title chain search (30-year)',
                  'Encumbrance certificate review',
                  'SARFAESI notice authenticity',
                  'Litigation check via court records',
                  'Occupation certificate status',
                ],
              },
              {
                Icon: FileText,
                title: 'Market Valuation',
                desc: 'Independent pricing analysis against IGR data and comparable registered transactions.',
                points: [
                  'Ready Reckoner rate benchmarking',
                  'Comparable sales (last 12 months)',
                  'Rental yield estimate',
                  'Area micro-market trend analysis',
                  'Upside / IRR projection model',
                ],
              },
              {
                Icon: Gavel,
                title: 'Acquisition Support',
                desc: 'End-to-end guidance from bid registration to possession transfer.',
                points: [
                  'EMD registration & bid strategy',
                  'Bidding day representation',
                  'Sale certificate processing',
                  'Post-auction legal transfer',
                  'Mutation & possession handover',
                ],
              },
            ].map(({ Icon, title, desc, points }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#B8935E]" />
                </div>
                <h4 className="text-xl text-[#FAF8F5] mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>{title}</h4>
                <p className="text-sm text-[#FAF8F5]/55 leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2.5 mt-auto">
                  {points.map(pt => (
                    <li key={pt} className="flex items-start gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#B8935E] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#FAF8F5]/80">{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="process" className="py-20 px-6 lg:px-12 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2
              className="text-4xl mb-4 text-[#0F3D2E]"
              style={{ fontFamily: "'Crimson Pro', serif" }}
            >
              How It Works
            </h2>
            <p className="text-[#6B6B6B]">A streamlined process designed for discerning investors</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Discover',
                description: 'Browse curated opportunities from leading banks'
              },
              {
                step: '02',
                title: 'Analyze',
                description: 'Review our detailed reports and valuation models'
              },
              {
                step: '03',
                title: 'Bid',
                description: 'Participate in auctions with expert guidance'
              },
              {
                step: '04',
                title: 'Acquire',
                description: 'Complete acquisition with legal support'
              }
            ].map((item, index) => (
              <motion.div variants={fadeInUp} key={index} className="relative">
                <div className="text-6xl mb-6 opacity-20" style={{ fontFamily: "'Crimson Pro', serif", color: '#B8935E' }}>
                  {item.step}
                </div>
                <h4 className="text-xl mb-3 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  {item.title}
                </h4>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  {item.description}
                </p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-px bg-[#B8935E]/30" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-br from-[#0F3D2E] to-[#0F3D2E]/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#B8935E] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#B8935E] rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2
            className="text-5xl mb-6 text-[#FAF8F5]"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Get Exclusive Access
          </h2>
          <p className="text-xl text-[#FAF8F5]/80 mb-8 leading-relaxed">
            Join a select group of investors accessing Mumbai's most undervalued opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-[#FAF8F5] placeholder:text-[#FAF8F5]/50 w-full sm:w-80 focus:outline-none focus:border-[#B8935E]"
            />
            <button className="px-8 py-4 bg-[#B8935E] text-[#FAF8F5] rounded-lg hover:bg-[#B8935E]/90 transition-all w-full sm:w-auto">
              Request Access
            </button>
          </div>
          <p className="text-xs text-[#FAF8F5]/60 mt-6">
            Limited to qualified investors. Minimum investment: ₹2Cr
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 bg-[#FAF8F5] border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#0F3D2E] rounded-sm" />
                <span className="text-lg tracking-tight" style={{ fontFamily: "'Crimson Pro', serif", color: '#0F3D2E' }}>
                  Headway Capital
                </span>
              </div>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Institutional-grade real estate investment platform for HNIs
              </p>
            </div>
            <div>
              <h5 className="mb-4 text-sm text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Platform
              </h5>
              <ul className="space-y-2 text-sm text-[#6B6B6B]">
                <li><a href="#opportunities" className="hover:text-[#1A1A1A] transition-colors">Opportunities</a></li>
                <li><a href="#process" className="hover:text-[#1A1A1A] transition-colors">How It Works</a></li>
                <li></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 text-sm text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Company
              </h5>
              <ul className="space-y-2 text-sm text-[#6B6B6B]">
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 text-sm text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Legal
              </h5>
              <ul className="space-y-2 text-sm text-[#6B6B6B]">
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#1A1A1A] transition-colors">Disclosures</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#6B6B6B]">
              © 2026 Headway Capital. All rights reserved.
            </p>
            
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}