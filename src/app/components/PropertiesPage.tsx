import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import PropertyCard from './shared/PropertyCard';
import { fadeInUp, staggerFast } from './shared/animations';
import { getAllProperties } from '../data/properties';
import { parseCr, assetClass, uniqueValues } from '../data/helpers';

type SortKey = 'score' | 'price-asc' | 'price-desc' | 'ending';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'score', label: 'Deal Score' },
  { value: 'ending', label: 'Ending Soonest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export default function PropertiesPage() {
  const all = getAllProperties();
  const locations = uniqueValues('location');

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('All');
  const [asset, setAsset] = useState<'All' | 'Residential' | 'Commercial'>('All');
  const [risk, setRisk] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [maxPrice, setMaxPrice] = useState(20); // crores
  const [sort, setSort] = useState<SortKey>('score');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const result = all.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.location.toLowerCase().includes(q) ||
        p.propertyName.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q);
      const matchesLocation = location === 'All' || p.location === location;
      const matchesAsset = asset === 'All' || assetClass(p) === asset;
      const matchesRisk = risk === 'All' || p.risk === risk;
      const matchesPrice = parseCr(p.price) <= maxPrice;
      return matchesQuery && matchesLocation && matchesAsset && matchesRisk && matchesPrice;
    });

    result.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return parseCr(a.price) - parseCr(b.price);
        case 'price-desc':
          return parseCr(b.price) - parseCr(a.price);
        case 'ending':
          return (a.endsIn ?? 999) - (b.endsIn ?? 999);
        default:
          return b.score - a.score;
      }
    });
    return result;
  }, [all, query, location, asset, risk, maxPrice, sort]);

  const resetFilters = () => {
    setQuery('');
    setLocation('All');
    setAsset('All');
    setRisk('All');
    setMaxPrice(20);
    setSort('score');
  };

  const selectClass =
    'w-full px-3 py-2.5 text-sm bg-white border border-black/10 rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#0F3D2E] transition-colors';
  const labelClass = 'block text-[10px] tracking-widest uppercase text-[#6B6B6B] mb-2';

  const FilterFields = () => (
    <>
      <div>
        <label className={labelClass}>Location</label>
        <select className={selectClass} value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="All">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Asset Type</label>
        <select className={selectClass} value={asset} onChange={(e) => setAsset(e.target.value as any)}>
          <option value="All">All Types</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Risk Profile</label>
        <select className={selectClass} value={risk} onChange={(e) => setRisk(e.target.value as any)}>
          <option value="All">All Risk Levels</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Max Reserve · ₹{maxPrice} Cr</label>
        <input
          type="range"
          min={2}
          max={20}
          step={0.5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[#E8E6E0] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0F3D2E] [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-xs tracking-widest uppercase text-[#6B6B6B] mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-[#6B6B6B]/40 inline-block" />
              Live Opportunities
            </p>
            <h1
              className="text-4xl lg:text-5xl text-[#0F3D2E] mb-4 leading-tight"
              style={{ fontFamily: "'Crimson Pro', serif" }}
            >
              Browse Bank-Auction Properties
            </h1>
            <p className="text-[#6B6B6B] max-w-2xl leading-relaxed">
              Every listing is sourced from leading banks, vetted through our 47-point due
              diligence framework, and priced below registered market value. Filter to find
              opportunities that match your mandate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="px-6 lg:px-12 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar filters (desktop) */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-28 bg-white border border-black/5 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                    Filters
                  </h3>
                  <button
                    onClick={resetFilters}
                    className="text-xs text-[#B8935E] hover:text-[#0F3D2E] transition-colors"
                  >
                    Reset
                  </button>
                </div>
                <FilterFields />
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Search bar row */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by location, building, or type…"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-black/10 rounded-lg text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B]/70 focus:outline-none focus:border-[#0F3D2E] transition-colors"
                  />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="px-4 py-3 bg-white border border-black/10 rounded-lg text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0F3D2E]"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      Sort: {o.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
              </div>

              {/* Mobile filter panel */}
              {showFilters && (
                <div className="lg:hidden bg-white border border-black/5 rounded-2xl p-5 mb-6 grid grid-cols-2 gap-4 relative">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="absolute top-4 right-4 text-[#6B6B6B]"
                    aria-label="Close filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <FilterFields />
                  <button
                    onClick={resetFilters}
                    className="col-span-2 text-xs text-[#B8935E] text-left"
                  >
                    Reset filters
                  </button>
                </div>
              )}

              <p className="text-sm text-[#6B6B6B] mb-5">
                Showing <span className="text-[#0F3D2E] font-medium">{filtered.length}</span> of{' '}
                {all.length} opportunities
              </p>

              {filtered.length > 0 ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerFast}
                  className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filtered.map((p) => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      bookmarked={bookmarked.has(p.id)}
                      onToggleBookmark={toggleBookmark}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="bg-white border border-black/5 rounded-2xl py-20 text-center">
                  <p className="text-[#0F3D2E] mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
                    No properties match your filters
                  </p>
                  <p className="text-sm text-[#6B6B6B] mb-5">
                    Try widening your price range or clearing a filter.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg text-sm hover:bg-[#0F3D2E]/90 transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
