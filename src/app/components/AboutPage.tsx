import { Building2, Target, Users, Award, TrendingUp, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';

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

function CountUpStat({ value, suffix = '', duration = 2000 }: { value: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          const numericValue = parseInt(value.replace(/[^\d]/g, ''));
          const increment = numericValue / (duration / 16);
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
              setCount(numericValue);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasStarted]);

  const displayValue = value.startsWith('₹') ? `₹${count}Cr${suffix}` : value.includes('%') ? `${count}%` : `${count}${suffix}`;

  return (
    <div
      ref={ref}
      className="text-4xl mb-2 text-[#0F3D2E]"
      style={{ fontFamily: "'Crimson Pro', serif" }}
    >
      {displayValue}
    </div>
  );
}

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8F5] scroll-smooth" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 lg:px-12 relative overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#FAF8F5]/85 z-10" />
          <div className="absolute inset-0 animate-[slideshow_24s_ease-in-out_infinite]">
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
              alt="Mumbai skyline"
              className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[fade_24s_ease-in-out_infinite]"
            />
            <img
              src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
              alt="Luxury apartment"
              className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[fade_24s_ease-in-out_6s_infinite]"
              style={{ animationDelay: '6s' }}
            />
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
              alt="Modern architecture"
              className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[fade_24s_ease-in-out_12s_infinite]"
              style={{ animationDelay: '12s' }}
            />
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
              alt="City buildings"
              className="absolute inset-0 w-full h-full object-cover opacity-0 animate-[fade_24s_ease-in-out_18s_infinite]"
              style={{ animationDelay: '18s' }}
            />
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center relative z-20"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0F3D2E]/5 backdrop-blur-sm rounded-full mb-6 border border-[#0F3D2E]/10">
            <Building2 className="w-3.5 h-3.5 text-[#0F3D2E]" />
            <span className="text-xs text-[#0F3D2E]">About Headway Capital</span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-5xl lg:text-6xl leading-tight mb-6 text-[#0F3D2E]"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Redefining Real Estate Investment in Mumbai
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-[#6B6B6B] leading-relaxed">
            We connect sophisticated investors with Mumbai's most compelling bank-auction opportunities through institutional-grade analysis and comprehensive support
          </motion.p>
        </motion.div>

        <style>{`
          @keyframes fade {
            0%, 20% { opacity: 1; }
            25%, 95% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}</style>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 lg:px-12 bg-white overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div variants={fadeInUp} className="group p-8 rounded-2xl hover:bg-[#FAF8F5] hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-[#0F3D2E] rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#B8935E]">
                <Target className="w-6 h-6 text-[#B8935E] transition-colors duration-300 group-hover:text-white" />
              </div>
              <h2
                className="text-3xl mb-4 text-[#0F3D2E] transition-colors duration-300 group-hover:text-[#B8935E]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Our Mission
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                To democratize access to institutional-quality real estate investments by providing HNI investors with curated opportunities, rigorous due diligence, and expert guidance through the complex landscape of bank auctions in Mumbai.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="group p-8 rounded-2xl hover:bg-[#FAF8F5] hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-[#0F3D2E] rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#B8935E]">
                <TrendingUp className="w-6 h-6 text-[#B8935E] transition-colors duration-300 group-hover:text-white" />
              </div>
              <h2
                className="text-3xl mb-4 text-[#0F3D2E] transition-colors duration-300 group-hover:text-[#B8935E]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Our Vision
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                To become India's most trusted platform for distressed asset acquisition, setting the standard for transparency, due diligence, and investor success in the alternative real estate market.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6 lg:px-12 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl mb-8 text-[#0F3D2E] text-center"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Our Story
          </motion.h2>
          <motion.div variants={fadeInUp} className="space-y-6 text-[#6B6B6B] leading-relaxed">
            <p>
              Founded in 2023, Headway Capital emerged from a simple observation: Mumbai's bank auction market was opaque, intimidating, and inaccessible to even sophisticated investors. While billions in prime real estate changed hands through these channels, the process remained shrouded in complexity and risk.
            </p>
            <p>
              Our founding team—veterans of private equity, real estate finance, and legal due diligence—recognized that the missing piece wasn't capital or opportunity, but trust and transparency. We built Headway Capital to bridge this gap, applying institutional-grade rigor to what had been a relationship-driven, information-asymmetric market.
            </p>
            <p>
              Today, we've facilitated over ₹150 crores in transactions for a select network of HNI investors, with a 100% success rate in legal clearance and possession transfer. Every property we present has been vetted through our comprehensive 47-point due diligence framework, ensuring our investors can bid with confidence.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 lg:px-12 bg-[#0F3D2E] overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl mb-12 text-[#FAF8F5] text-center"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Our Values
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-[#B8935E]/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-[#B8935E]/30 group-hover:scale-110">
                <Shield className="w-8 h-8 text-[#B8935E] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3
                className="text-xl mb-3 text-[#FAF8F5]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Transparency
              </h3>
              <p className="text-sm text-[#FAF8F5]/80 leading-relaxed">
                Complete disclosure of all known risks, legal encumbrances, and market assumptions in every deal
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-[#B8935E]/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-[#B8935E]/30 group-hover:scale-110">
                <Award className="w-8 h-8 text-[#B8935E] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3
                className="text-xl mb-3 text-[#FAF8F5]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Excellence
              </h3>
              <p className="text-sm text-[#FAF8F5]/80 leading-relaxed">
                Institutional-grade due diligence and analysis on every opportunity we present
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-[#B8935E]/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-[#B8935E]/30 group-hover:scale-110">
                <Users className="w-8 h-8 text-[#B8935E] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3
                className="text-xl mb-3 text-[#FAF8F5]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Partnership
              </h3>
              <p className="text-sm text-[#FAF8F5]/80 leading-relaxed">
                Long-term relationships built on aligned interests and mutual success
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 lg:px-12 bg-white overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl mb-4 text-[#0F3D2E] text-center"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Leadership Team
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[#6B6B6B] text-center mb-12">
            Decades of combined experience in real estate, finance, and law
          </motion.p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Yash Kanoongo',
                role: 'Founder & CEO',
                background: 'Ex-Management Consultant at ZS Associates',
                image: 'https://www.shutterstock.com/image-vector/illustration-smiling-young-man-brown-600nw-2575185307.jpg'
              },
              {
                name: 'Harshvardhan Verma',
                role: 'Co-Founder & CTO',
                background: "IITB Alum",
                image: 'https://www.shutterstock.com/image-vector/illustration-smiling-young-man-brown-600nw-2575185307.jpg'
              }
            ].map((member, index) => (
              <motion.div variants={fadeInUp} key={index} className="text-center group">
                <div className="w-32 h-32 bg-gradient-to-br from-[#0F3D2E] to-[#0F3D2E]/70 rounded-full mx-auto mb-4 overflow-hidden transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h4
                  className="text-lg mb-1 text-[#0F3D2E] transition-colors duration-300 group-hover:text-[#B8935E]"
                  style={{ fontFamily: "'Crimson Pro', serif" }}
                >
                  {member.name}
                </h4>
                <p className="text-sm text-[#B8935E] mb-2">{member.role}</p>
                <p className="text-xs text-[#6B6B6B]">{member.background}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-12 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div variants={fadeInUp}>
              <CountUpStat value="₹150" suffix="+" />
              <p className="text-sm text-[#6B6B6B]">Deals Facilitated</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <CountUpStat value="50" suffix="+" />
              <p className="text-sm text-[#6B6B6B]">HNI Investors</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <CountUpStat value="100%" />
              <p className="text-sm text-[#6B6B6B]">Legal Success Rate</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <CountUpStat value="28%" />
              <p className="text-sm text-[#6B6B6B]">Avg. Discount to Market</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-br from-[#0F3D2E] to-[#0F3D2E]/80 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2
            className="text-4xl mb-6 text-[#FAF8F5]"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Ready to Explore Opportunities?
          </h2>
          <p className="text-lg text-[#FAF8F5]/80 mb-8">
            Join our network of sophisticated investors accessing Mumbai's most undervalued properties
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="px-8 py-4 bg-[#B8935E] text-[#FAF8F5] rounded-lg hover:bg-[#B8935E]/90 transition-all"
          >
            View Current Opportunities
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
