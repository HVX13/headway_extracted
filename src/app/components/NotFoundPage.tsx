import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Home } from 'lucide-react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-xl text-center"
        >
          <div
            className="text-[9rem] leading-none mb-6 text-[#0F3D2E]/10 select-none"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            404
          </div>
          <h1
            className="text-4xl lg:text-5xl text-[#0F3D2E] mb-4 leading-tight"
            style={{ fontFamily: "'Crimson Pro', serif" }}
          >
            Page not found
          </h1>
          <p className="text-[#6B6B6B] leading-relaxed mb-10 max-w-sm mx-auto">
            This page doesn't exist — or it may have moved. Head back to browse current opportunities.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg text-sm hover:bg-[#0F3D2E]/90 transition-all flex items-center gap-2"
            >
              Browse Opportunities
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-black/10 text-[#1A1A1A] rounded-lg text-sm hover:border-[#0F3D2E] hover:text-[#0F3D2E] transition-all flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
