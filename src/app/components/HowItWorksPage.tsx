import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search,
  FileSearch,
  Calculator,
  Gavel,
  KeyRound,
  ArrowRight,
  Shield,
  Clock,
  Wallet,
} from 'lucide-react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { fadeInUp, staggerContainer } from './shared/animations';

const steps = [
  {
    Icon: Search,
    step: '01',
    title: 'We source the deal',
    desc: 'Our team monitors SARFAESI auction notices across SBI, HDFC, Axis, Canara and other lenders — including listings buried in regional newspapers and e-auction portals before they reach the wider market.',
    detail: 'You see vetted opportunities, not noise.',
  },
  {
    Icon: FileSearch,
    step: '02',
    title: 'Legal diligence is done',
    desc: 'Before a property appears on Headway, we run a 30-year title chain search, verify the encumbrance certificate, confirm SARFAESI notice authenticity, and check for pending litigation.',
    detail: '47-point due-diligence framework on every listing.',
  },
  {
    Icon: Calculator,
    step: '03',
    title: 'You analyse the numbers',
    desc: 'Each listing carries an independent valuation against IGR data and comparable registered sales, a deal score, and projected upside. Model flip, rental, or long-term-hold returns with the built-in calculator.',
    detail: 'Institutional analysis, in plain language.',
  },
  {
    Icon: Gavel,
    step: '04',
    title: 'We guide the bid',
    desc: 'We handle EMD registration, advise on a bid ceiling, and represent you on auction day. No guesswork on process, deadlines, or paperwork.',
    detail: 'Bidding strategy from people who do it weekly.',
  },
  {
    Icon: KeyRound,
    step: '05',
    title: 'You take possession',
    desc: 'After a winning bid, we process the sale certificate, manage the legal transfer, and see the property through mutation and possession handover.',
    detail: 'End-to-end, from gavel to keys.',
  },
];

const reassurances = [
  {
    Icon: Shield,
    title: 'Title-verified before you ever see it',
    desc: 'The single biggest fear in auctions is a bad title. We clear that risk before a property is ever listed.',
  },
  {
    Icon: Clock,
    title: 'No missed windows',
    desc: 'Auction windows are short — often 15 to 30 days. We surface deals early so you have time to decide.',
  },
  {
    Icon: Wallet,
    title: 'Know the all-in cost upfront',
    desc: 'Reserve price, EMD, stamp duty, dues and our fee — laid out before you commit a rupee.',
  },
];

export default function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs tracking-widest uppercase text-[#6B6B6B] mb-5 flex items-center justify-center gap-2"
          >
            <span className="w-6 h-px bg-[#6B6B6B]/40 inline-block" />
            How It Works
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl lg:text-6xl text-[#0F3D2E] mb-6 leading-tight"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            From auction notice to{' '}
            <em className="not-italic text-[#B8935E]">your keys</em> — handled
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-[#6B6B6B] leading-relaxed max-w-2xl mx-auto">
            Buying a bank-auctioned property in Mumbai usually means navigating legal
            jargon, tight deadlines, and real risk. We turn it into five clear steps — and
            stand beside you on every one.
          </motion.p>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="py-12 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="space-y-6"
          >
            {steps.map(({ Icon, step, title, desc, detail }) => (
              <motion.div
                key={step}
                variants={fadeInUp}
                className="group grid md:grid-cols-[auto_1fr] gap-6 items-start bg-[#FAF8F5] border border-black/5 rounded-2xl p-6 lg:p-8 hover:border-[#B8935E]/40 transition-colors"
              >
                <div className="flex items-center gap-4 md:flex-col md:items-start">
                  <div className="w-12 h-12 rounded-lg bg-[#0F3D2E] flex items-center justify-center group-hover:bg-[#B8935E] transition-colors">
                    <Icon className="w-6 h-6 text-[#B8935E] group-hover:text-white transition-colors" />
                  </div>
                  <span
                    className="text-4xl opacity-20"
                    style={{ fontFamily: "'Crimson Pro', serif", color: '#B8935E' }}
                  >
                    {step}
                  </span>
                </div>
                <div>
                  <h3
                    className="text-2xl text-[#0F3D2E] mb-2"
                    style={{ fontFamily: "'Crimson Pro', serif" }}
                  >
                    {title}
                  </h3>
                  <p className="text-[#6B6B6B] leading-relaxed mb-3">{desc}</p>
                  <p className="text-sm text-[#B8935E]">{detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reassurances */}
      <section className="py-20 px-6 lg:px-12 bg-[#0F3D2E]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-4xl text-[#FAF8F5] mb-4 text-center"
              style={{ fontFamily: "'Crimson Pro', serif" }}
            >
              The risks you're worried about — already covered
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-[#FAF8F5]/70 text-center max-w-2xl mx-auto mb-12"
            >
              First-time auction buyers tend to fear the same three things. Here's how we
              de-risk each.
            </motion.p>
            <div className="grid md:grid-cols-3 gap-6">
              {reassurances.map(({ Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={fadeInUp}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#B8935E]" />
                  </div>
                  <h3
                    className="text-xl text-[#FAF8F5] mb-2"
                    style={{ fontFamily: "'Crimson Pro', serif" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-[#FAF8F5]/60 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl lg:text-4xl text-[#0F3D2E] mb-5"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            New to bank auctions? Start here.
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[#6B6B6B] mb-8 leading-relaxed">
            Read our beginner's guide and glossary, or browse live opportunities to see how
            real deals are priced.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/learn')}
              className="px-7 py-3.5 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg hover:bg-[#0F3D2E]/90 transition-all flex items-center gap-2 text-sm"
            >
              Read the Beginner Guide
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/properties')}
              className="px-7 py-3.5 bg-white border border-black/10 text-[#0F3D2E] rounded-lg hover:border-[#0F3D2E]/30 transition-all text-sm"
            >
              Browse Opportunities
            </button>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
