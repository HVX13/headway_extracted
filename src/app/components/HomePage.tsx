import {
  ArrowRight,
  Shield,
  FileText,
  Gavel,
  CheckCircle,
  TrendingUp,
  GraduationCap,
  ArrowUp,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'motion/react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import PropertyCard from './shared/PropertyCard';
import { fadeInUp, staggerContainer } from './shared/animations';
import { getAllProperties } from '../data/properties';

// ─── AI Chatbot data ────────────────────────────────────────────────────────

const chatSuggestions = [
  'What properties are available right now?',
  'How does a bank auction work?',
  'What legal documents should I check?',
  'Can I get a home loan on an auctioned property?',
  'What is EMD and how much do I need?',
];

const chatAnswers: Record<string, string> = {
  available: 'We currently have 18 active bank auction listings across Mumbai — South Mumbai (₹8–18 Cr), Western Suburbs (₹3.5–12 Cr), Central Mumbai (₹4–15 Cr), and Thane (₹2.5–6 Cr). Every listing carries 100% physical possession and has passed our 47-point due diligence check. Browse them all on the Opportunities page.',
  auction: 'Under the SARFAESI Act 2002, when a borrower defaults the bank can seize and sell the property via public auction. The bank sets a reserve price, publishes a notice (often buried in small-print newspaper columns), and requires an Earnest Money Deposit (EMD — usually 10%) to register as a bidder. Win the bid → pay 25% within 24 hours → pay balance within 15 days → receive a Sale Certificate. Headway guides every step.',
  legal: 'Before bidding, you need: (1) 30-year title chain search, (2) Encumbrance Certificate confirming no prior loans, (3) Authentic SARFAESI notice from the lending bank, (4) Litigation check via court records, (5) Possession type — physical is safest, (6) Society dues and pending taxes. Every Headway listing has cleared all six before it goes live on our platform.',
  loan: 'Sometimes — often from the same bank conducting the auction. But timelines are tight: 25% due within 24 hours of winning, balance within 15 days. Most buyers arrange most of their financing before bidding. Headway advises on financing options on a deal-by-deal basis.',
  emd: 'EMD (Earnest Money Deposit) is a refundable security amount — typically 10% of the reserve price — you pay when registering to bid. If you win, it is adjusted against the total price. If you lose, it is refunded in full. On a ₹5 Cr property the EMD is usually ₹50 lakh. We help you register and submit the EMD correctly.',
  default: 'Great question — our advisory team can walk you through it in detail. Every deal is different, and a 10-minute call often saves months of confusion. Click "Express Interest" above to connect with an advisor, or browse live listings to get started.',
};

function getChatAnswer(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('available') || q.includes('listing') || q.includes('propert') || q.includes('right now')) return chatAnswers.available;
  if (q.includes('auction') || q.includes('sarfaesi') || q.includes('work') || q.includes('process') || q.includes('how do')) return chatAnswers.auction;
  if (q.includes('legal') || q.includes('document') || q.includes('title') || q.includes('encumbrance') || q.includes('check')) return chatAnswers.legal;
  if (q.includes('loan') || q.includes('finance') || q.includes('mortgage') || q.includes('emi')) return chatAnswers.loan;
  if (q.includes('emd') || q.includes('deposit') || q.includes('earnest') || q.includes('much')) return chatAnswers.emd;
  return chatAnswers.default;
}

// ────────────────────────────────────────────────────────────────────────────

const marqueeItems = [
  { name: 'State Bank of India', abbr: 'SBI', color: '#2B6CB0' },
  { name: 'HDFC Bank', abbr: 'H', color: '#E31837' },
  { name: 'ICICI Bank', abbr: 'IC', color: '#F58220' },
  { name: 'Axis Bank', abbr: 'AX', color: '#97144D' },
  { name: 'Canara Bank', abbr: 'CB', color: '#1B5E20' },
  { name: 'Punjab National Bank', abbr: 'PNB', color: '#003399' },
  { name: 'Bank of Baroda', abbr: 'BOB', color: '#E65100' },
  { name: 'Union Bank of India', abbr: 'UB', color: '#1A237E' },
  { name: 'Kotak Mahindra Bank', abbr: 'KM', color: '#C62828' },
  { name: 'IndusInd Bank', abbr: 'IB', color: '#0277BD' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const [chatInput, setChatInput] = useState('');

  const sendChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    navigate('/chat', { state: { initialMessage: trimmed } });
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Show the three highest-scoring deals on the home page; the rest live on /properties.
  const featured = [...getAllProperties()].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* AI Chatbot Hero */}
      <section className="pt-28 pb-14 px-6 lg:px-12 bg-[#FAF8F5]">
        <div className="max-w-3xl mx-auto">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-widest uppercase text-[#6B6B6B] mb-5 flex items-center gap-2"
          >
            <span className="w-6 h-px bg-[#6B6B6B]/40 inline-block" />
            Mumbai · Bank Auction AI
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl lg:text-6xl leading-tight mb-4 text-[#0F3D2E]"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Every question about Mumbai bank auctions —{' '}
            <em className="not-italic text-[#B8935E]">answered instantly.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-base text-[#6B6B6B] mb-8 leading-relaxed"
          >
            Ask about any listing, legal risk, EMD requirements, title documents or how the
            auction process works. Our AI knows every property on this platform.
          </motion.p>

          {/* Input bar */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            onSubmit={e => { e.preventDefault(); sendChat(chatInput); }}
            className="relative mb-4"
          >
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Show me everything I should know before buying"
              className="w-full pl-6 pr-14 py-4 bg-white border border-black/10 rounded-full text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B]/55 placeholder:italic focus:outline-none focus:border-[#0F3D2E]/30 focus:ring-2 focus:ring-[#0F3D2E]/8 shadow-md transition-all"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#0F3D2E] rounded-full flex items-center justify-center hover:bg-[#0F3D2E]/85 disabled:opacity-40 transition-all"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </motion.form>

          {/* Suggestion chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {chatSuggestions.map(tag => (
              <button
                key={tag}
                onClick={() => sendChat(tag)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/10 bg-white text-xs text-[#1A1A1A] hover:border-[#0F3D2E]/30 hover:bg-[#FAF8F5] hover:text-[#0F3D2E] transition-all shadow-sm"
              >
                {tag}
                <ArrowUpRight className="w-3 h-3 text-[#6B6B6B]" />
              </button>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Bank Marquee Strip */}
      <section className="border-y border-black/5 bg-[#FAF8F5] py-5 overflow-hidden select-none">
        <style>{`
          @keyframes marquee-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
        <div className="flex items-center">
          <div className="flex-shrink-0 px-6 lg:px-10 text-[10px] text-[#6B6B6B] uppercase tracking-[0.15em] whitespace-nowrap border-r border-black/8 mr-6">
            Sourced from
          </div>
          <div
            className="overflow-hidden flex-1"
            onMouseEnter={() => setMarqueePaused(true)}
            onMouseLeave={() => setMarqueePaused(false)}
          >
            <div
              className="flex items-center gap-6"
              style={{
                width: 'max-content',
                animation: 'marquee-scroll 28s linear infinite',
                animationPlayState: marqueePaused ? 'paused' : 'running',
              }}
            >
              {[...marqueeItems, ...marqueeItems].map((bank, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-black/6 shadow-sm flex-shrink-0 cursor-default"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 leading-none"
                    style={{ backgroundColor: bank.color }}
                  >
                    {bank.abbr}
                  </div>
                  <span className="text-sm text-[#1A1A1A] font-medium whitespace-nowrap">{bank.name}</span>
                </div>
              ))}
            </div>
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
            className="flex flex-wrap items-end justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="text-4xl mb-4 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Featured Opportunities
              </h2>
              <p className="text-[#6B6B6B]">
                Handpicked properties with verified legal standing and institutional backing
              </p>
            </div>
            <button
              onClick={() => navigate('/properties')}
              className="group flex items-center gap-2 text-sm text-[#0F3D2E] hover:text-[#B8935E] transition-colors"
            >
              View all opportunities
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featured.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                bookmarked={bookmarked.has(property.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who we work with — audience split */}
      <section className="py-20 px-6 lg:px-12 bg-[#FAF8F5] border-t border-black/5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-4xl text-[#0F3D2E] mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Built for both sides of the table
            </h2>
            <p className="text-[#6B6B6B] max-w-2xl mx-auto">
              Whether you've closed a dozen auctions or you're just exploring, there's a clear
              path in.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-white border border-black/5 rounded-2xl p-8 hover:shadow-xl hover:border-[#B8935E]/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-[#0F3D2E] flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-[#B8935E]" />
              </div>
              <h3 className="text-2xl text-[#0F3D2E] mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Seasoned investors
              </h3>
              <p className="text-[#6B6B6B] leading-relaxed mb-6">
                Skip the newspaper-scanning and portal-trawling. Get pre-vetted, title-clear
                deals with valuation models and deal scores — and a team that handles bidding
                and transfer so you can move on volume.
              </p>
              <ul className="space-y-2.5 mb-6">
                {['Deal flow before public listing', 'Full diligence pack per asset', 'Bid representation & transfer'].map(
                  (t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-[#4B4B4B]">
                      <CheckCircle className="w-4 h-4 text-[#B8935E] flex-shrink-0 mt-0.5" />
                      {t}
                    </li>
                  )
                )}
              </ul>
              <button
                onClick={() => navigate('/properties')}
                className="group flex items-center gap-2 text-sm text-[#0F3D2E] hover:text-[#B8935E] transition-colors"
              >
                Browse live deals
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-white border border-black/5 rounded-2xl p-8 hover:shadow-xl hover:border-[#B8935E]/30 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-[#0F3D2E] flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6 text-[#B8935E]" />
              </div>
              <h3 className="text-2xl text-[#0F3D2E] mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>
                New to auctions
              </h3>
              <p className="text-[#6B6B6B] leading-relaxed mb-6">
                Bank auctions sound intimidating — they don't have to be. Learn how the
                process works in plain English, understand every term, and lean on us to keep
                you clear of the common traps.
              </p>
              <ul className="space-y-2.5 mb-6">
                {['Plain-English beginner guide', 'Glossary of every auction term', 'A team that de-risks your first bid'].map(
                  (t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-[#4B4B4B]">
                      <CheckCircle className="w-4 h-4 text-[#B8935E] flex-shrink-0 mt-0.5" />
                      {t}
                    </li>
                  )
                )}
              </ul>
              <button
                onClick={() => navigate('/learn')}
                className="group flex items-center gap-2 text-sm text-[#0F3D2E] hover:text-[#B8935E] transition-colors"
              >
                Start learning
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why SARFAESI */}
      <section className="py-20 px-6 lg:px-12 bg-white border-t border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-10">
              <p className="text-xs tracking-widest uppercase text-[#6B6B6B] flex items-center gap-2 mb-4">
                <span className="w-6 h-px bg-[#6B6B6B]/40 inline-block" />
                The Case for Bank Auctions
              </p>
              <h2
                className="text-4xl lg:text-5xl text-[#0F3D2E] mb-4 max-w-2xl leading-tight"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Why serious investors prefer SARFAESI properties
              </h2>
              <p className="text-[#6B6B6B] max-w-xl leading-relaxed">
                Most buyers have never participated in a bank auction. The table below answers
                every objection their CA will raise.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-10 items-start">
              <motion.div variants={fadeInUp} className="lg:col-span-3">
                <div className="bg-[#FAF8F5] rounded-2xl border border-black/5 overflow-hidden">
                  <div className="grid grid-cols-3 bg-[#0F3D2E]/5 border-b border-black/5">
                    <div className="px-5 py-3 text-[10px] tracking-widest uppercase text-[#6B6B6B]">Factor</div>
                    <div className="px-5 py-3 text-[10px] tracking-widest uppercase text-[#0F3D2E] border-l border-black/5">Bank Auction</div>
                    <div className="px-5 py-3 text-[10px] tracking-widest uppercase text-[#6B6B6B] border-l border-black/5">Open Market</div>
                  </div>
                  {[
                    { factor: 'Typical discount', auction: '15–35% below market', market: 'Negotiated, marginal' },
                    { factor: 'Legal standing', auction: 'Bank-verified title', market: 'Self-declared, variable' },
                    { factor: 'Possession', auction: 'Physical or symbolic', market: 'Delayed by builder' },
                    { factor: 'Bidding competition', auction: 'Low — info asymmetry', market: 'High, price discovery' },
                    { factor: 'Stamp duty advantage', auction: 'Reckoner rate often lower', market: 'Market value applied' },
                    { factor: 'Seller motivation', auction: 'Bank must liquidate', market: 'Owner can wait' },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 border-b border-black/5 last:border-0 hover:bg-white transition-colors"
                    >
                      <div className="px-5 py-3.5 text-sm text-[#1A1A1A] font-medium">{row.factor}</div>
                      <div className="px-5 py-3.5 text-sm text-[#0F3D2E] border-l border-black/5">{row.auction}</div>
                      <div className="px-5 py-3.5 text-sm text-[#6B6B6B] border-l border-black/5">{row.market}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="lg:col-span-2 flex flex-col gap-4">
                <div className="bg-[#0F3D2E] rounded-2xl px-6 py-7 text-[#FAF8F5]">
                  <p className="text-[10px] tracking-widest uppercase text-[#FAF8F5]/50 mb-4">Market Signal</p>
                  <div className="text-6xl text-[#B8935E] mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>
                    23<span className="text-3xl">%</span>
                  </div>
                  <p className="text-sm text-[#FAF8F5]/80 leading-relaxed mb-4">
                    Average discount our investors secured below IGR-registered market value,
                    across 40+ transactions in FY2024–25.
                  </p>
                  <p className="text-[10px] text-[#FAF8F5]/35 leading-relaxed italic">
                    Internal transaction data. Past performance is not indicative of future results.
                  </p>
                </div>
                <div className="bg-[#FAF8F5] rounded-2xl border border-black/5 px-6 py-5">
                  <p className="text-[10px] tracking-widest uppercase text-[#B8935E] mb-3">Why Most Miss Out</p>
                  <p className="text-sm text-[#4B4B4B] leading-relaxed">
                    Bank auction notices are buried in regional newspapers and e-auction portals
                    with 15–30 day windows. Without institutional sourcing, buyers discover deals
                    after the window has closed.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Due diligence */}
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
                <h4 className="text-xl text-[#FAF8F5] mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  {title}
                </h4>
                <p className="text-sm text-[#FAF8F5]/55 leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2.5 mt-auto">
                  {points.map((pt) => (
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

      {/* Final CTA */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-br from-[#0F3D2E] to-[#0F3D2E]/80 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#B8935E] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#B8935E] rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl mb-6 text-[#FAF8F5]" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Get Exclusive Access
          </h2>
          <p className="text-xl text-[#FAF8F5]/80 mb-8 leading-relaxed">
            Join a select group of investors accessing Mumbai's most undervalued opportunities
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-4 bg-[#B8935E] text-[#FAF8F5] rounded-lg hover:bg-[#B8935E]/90 transition-all inline-flex items-center gap-2"
          >
            Express Interest
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-[#FAF8F5]/60 mt-6">
            Limited to qualified investors. Minimum investment: ₹2Cr
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
