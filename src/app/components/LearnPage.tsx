import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronDown, ArrowRight, GraduationCap, ScrollText } from 'lucide-react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { fadeInUp, staggerContainer } from './shared/animations';

const guideSteps = [
  {
    n: '01',
    title: 'What is a bank auction?',
    body: 'When a borrower defaults on a loan secured against property, the lender can take possession and sell it to recover dues. In India this happens under the SARFAESI Act, 2002. These sales are public auctions, and the bank is a highly motivated seller — which is why reserve prices often sit below market value.',
  },
  {
    n: '02',
    title: 'Why prices are lower',
    body: "Banks want to recover their loan, not maximise profit. Auction notices are also poorly publicised — buried in regional newspapers and government e-auction portals — so competition is thin. Less competition plus a motivated seller equals genuine discounts, typically 15–35% below registered market value.",
  },
  {
    n: '03',
    title: 'What "possession" really means',
    body: 'Symbolic possession means the bank holds the paperwork but the property may still be occupied. Physical possession means it is vacant and ready. We prioritise physical-possession deals so you are not left fighting an eviction after you win.',
  },
  {
    n: '04',
    title: 'The money you need ready',
    body: 'You pay an Earnest Money Deposit (EMD) — usually 10% of the reserve price — to register for the auction. Win, and you typically pay 25% within 24 hours and the balance within 15 days. Budget for stamp duty, registration, and any pending society dues on top.',
  },
  {
    n: '05',
    title: 'How Headway fits in',
    body: 'We do the sourcing, legal verification, and valuation before you ever look at a deal — then guide your bid and handle the post-auction transfer. You bring the capital and the decision; we remove the risk and the legwork.',
  },
];

const glossary = [
  { term: 'SARFAESI Act', def: 'The 2002 law that lets banks seize and sell secured assets when a borrower defaults — the legal backbone of every property on this platform.' },
  { term: 'Reserve Price', def: 'The minimum price the bank will accept. Bidding starts here. Set by the bank based on a valuation, it is often below open-market value.' },
  { term: 'EMD', def: 'Earnest Money Deposit — a refundable deposit (usually 10% of reserve) you pay to be eligible to bid. Refunded if you do not win.' },
  { term: 'Encumbrance', def: 'Any legal or financial claim on a property — unpaid dues, a pending case, a second loan. We disclose every known encumbrance on each listing.' },
  { term: 'Symbolic vs Physical Possession', def: 'Symbolic = the bank holds rights but the unit may be occupied. Physical = vacant and ready to take over. Physical is lower-risk for buyers.' },
  { term: 'Sale Certificate', def: 'The document the bank issues to the winning bidder confirming the sale — your proof of ownership, used for registration and mutation.' },
  { term: 'Ready Reckoner Rate', def: 'Government-published minimum property rates (IGR) used to calculate stamp duty. A useful floor for benchmarking whether a deal is genuinely cheap.' },
  { term: 'Mutation', def: 'Updating municipal and society records to reflect you as the new owner — the final administrative step after possession.' },
];

const faqs = [
  {
    q: 'Do I need prior experience to invest through Headway?',
    a: 'No. Many of our investors are buying their first auctioned property. We handle the technical and legal complexity and explain every step in plain language. Our Learn section and team calls are designed to bring first-timers up to speed quickly.',
  },
  {
    q: 'What is the minimum investment?',
    a: 'Our current listings start around ₹2 Cr. Bank auctions are capital-intensive because payment timelines are short and financing options are limited compared to a normal purchase.',
  },
  {
    q: 'Are these properties legally safe to buy?',
    a: 'Every property is put through a 30-year title search, encumbrance verification, SARFAESI notice authentication, and litigation check before it is listed. We disclose all known risks openly — but you should always conduct your own independent due diligence too.',
  },
  {
    q: 'Can I get a home loan for an auctioned property?',
    a: 'Sometimes — often from the same bank conducting the auction. However, timelines are tight (frequently 15 days for full payment), so most investors come with funds largely arranged. We can advise on financing options deal by deal.',
  },
  {
    q: 'What does Headway charge?',
    a: 'We charge an advisory fee per transaction, disclosed upfront before you commit to any deal. There are no hidden costs — reserve price, EMD, stamp duty, dues, and our fee are laid out in full.',
  },
  {
    q: 'What happens if I bid and lose?',
    a: 'Your EMD is fully refunded. You only commit real capital once you have won. We help you set a disciplined bid ceiling so you never overpay to win.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[#1A1A1A] font-medium">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#B8935E] flex-shrink-0 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="text-[#6B6B6B] leading-relaxed pb-5 pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LearnPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-14 px-6 lg:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0F3D2E]/5 rounded-full mb-6 border border-[#0F3D2E]/10"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#0F3D2E]" />
            <span className="text-xs text-[#0F3D2E]">For first-time & seasoned investors</span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl lg:text-6xl text-[#0F3D2E] mb-6 leading-tight"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Learn the bank-auction game
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-[#6B6B6B] leading-relaxed max-w-2xl mx-auto">
            Everything you need to go from curious to confident — a plain-English guide, a
            glossary of every term you'll meet, and answers to the questions investors ask
            us most.
          </motion.p>
        </motion.div>
      </section>

      {/* Beginner guide */}
      <section className="py-14 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="flex items-center gap-3 mb-10"
          >
            <BookOpen className="w-6 h-6 text-[#B8935E]" />
            <h2 className="text-3xl text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
              The Beginner's Guide
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={staggerContainer}
            className="space-y-5"
          >
            {guideSteps.map((s) => (
              <motion.div
                key={s.n}
                variants={fadeInUp}
                className="grid sm:grid-cols-[auto_1fr] gap-5 items-start bg-[#FAF8F5] rounded-2xl p-6 border border-black/5"
              >
                <span
                  className="text-3xl text-[#B8935E] opacity-30"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                >
                  {s.n}
                </span>
                <div>
                  <h3
                    className="text-xl text-[#0F3D2E] mb-2"
                    style={{ fontFamily: "'Crimson Pro', serif" }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-[#6B6B6B] leading-relaxed">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Glossary */}
      <section id="glossary" className="py-16 px-6 lg:px-12 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="flex items-center gap-3 mb-3"
          >
            <ScrollText className="w-6 h-6 text-[#B8935E]" />
            <h2 className="text-3xl text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Auction Glossary
            </h2>
          </motion.div>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-[#6B6B6B] mb-10"
          >
            The eight terms that show up in every deal.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-5"
          >
            {glossary.map((g) => (
              <motion.div
                key={g.term}
                variants={fadeInUp}
                className="bg-white border border-black/5 rounded-2xl p-6 hover:border-[#B8935E]/40 transition-colors"
              >
                <h3
                  className="text-lg text-[#0F3D2E] mb-2"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                >
                  {g.term}
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{g.def}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-6 lg:px-12 bg-white scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-3xl text-[#0F3D2E] mb-3 text-center"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-[#6B6B6B] text-center mb-10"
          >
            Still unsure about something? These cover the essentials.
          </motion.p>
          <div>
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-br from-[#0F3D2E] to-[#0F3D2E]/80">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl lg:text-4xl text-[#FAF8F5] mb-5"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Ready to see real deals?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[#FAF8F5]/80 mb-8 leading-relaxed">
            Browse live opportunities, or talk to our team about what you're looking for.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/properties')}
              className="px-7 py-3.5 bg-[#B8935E] text-[#FAF8F5] rounded-lg hover:bg-[#B8935E]/90 transition-all flex items-center gap-2 text-sm"
            >
              Browse Opportunities
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-7 py-3.5 bg-white/10 border border-white/20 text-[#FAF8F5] rounded-lg hover:bg-white/20 transition-all text-sm"
            >
              Talk to the Team
            </button>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
