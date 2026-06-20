import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

const columns = [
  {
    heading: 'Platform',
    links: [
      { label: 'Browse Opportunities', to: '/properties' },
      { label: 'How It Works', to: '/how-it-works' },
      { label: 'Learn', to: '/learn' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Beginner Guide', to: '/learn' },
      { label: 'Auction Glossary', to: '/learn#glossary' },
      { label: 'FAQ', to: '/learn#faq' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Express Interest', to: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="py-14 px-6 lg:px-12 bg-[#FAF8F5] border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#0F3D2E] rounded-sm" />
              <span
                className="text-lg tracking-tight"
                style={{ fontFamily: "'Crimson Pro', serif", color: '#0F3D2E' }}
              >
                Headway Capital
              </span>
            </Link>
            <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-xs mb-5">
              The private market for Mumbai bank-auction property — institutional due
              diligence, sourced before public listing.
            </p>
            <div className="space-y-2 text-sm text-[#6B6B6B]">
              <a
                href="mailto:invest@headwaycapital.in"
                className="flex items-center gap-2 hover:text-[#1A1A1A] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#B8935E]" />
                invest@headwaycapital.in
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B8935E]" />
                Mumbai, Maharashtra
              </p>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h5
                className="mb-4 text-sm text-[#0F3D2E]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                {col.heading}
              </h5>
              <ul className="space-y-2.5 text-sm text-[#6B6B6B]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:text-[#1A1A1A] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-sm text-[#6B6B6B]">
            © 2026 Headway Capital. All rights reserved.
          </p>
          <p className="text-xs text-[#6B6B6B]/70 max-w-xl md:text-right leading-relaxed">
            Headway Capital provides advisory and information services only. Property
            details are indicative; investors must conduct independent due diligence. Past
            performance is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
