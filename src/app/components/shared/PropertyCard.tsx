import { ChevronRight, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Property } from '../../data/properties';
import { discountPct } from '../../data/helpers';
import { fadeInUp } from './animations';

interface Props {
  property: Property;
  bookmarked?: boolean;
  onToggleBookmark?: (id: string, e: React.MouseEvent) => void;
}

export default function PropertyCard({ property, bookmarked, onToggleBookmark }: Props) {
  const navigate = useNavigate();
  const discount = discountPct(property);

  return (
    <motion.div
      variants={fadeInUp}
      onClick={() => navigate(`/property/${property.id}`)}
      className="group bg-white border border-black/5 rounded-xl overflow-hidden hover:border-[#B8935E]/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Photo */}
      <div className="relative h-44 bg-gradient-to-br from-[#FAF8F5] to-[#E8E6E0] overflow-hidden">
        <img
          src={property.image}
          alt={property.location}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-black/5">
          <div className="text-xs text-[#0F3D2E] uppercase tracking-wider">{property.assetId}</div>
        </div>
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-[#B8935E] rounded-lg px-2.5 py-1">
            <div className="text-xs text-white tracking-wide">{discount}% below market</div>
          </div>
        )}
        {property.endsIn !== undefined && (
          <div
            className={`absolute bottom-2 left-2 backdrop-blur-sm rounded-lg px-2.5 py-1 ${
              property.endsIn <= 3
                ? 'bg-red-500/95'
                : property.endsIn <= 9
                ? 'bg-yellow-500/95'
                : 'bg-emerald-500/95'
            }`}
          >
            <div className="text-xs text-white uppercase tracking-wider">
              Ends in {property.endsIn} days
            </div>
          </div>
        )}
      </div>

      {/* Reserve price */}
      <div className="px-3 py-3 border-b border-black/5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 text-left">
            <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mb-1">
              Reserve Price
            </div>
            <div className="text-3xl text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
              {property.price}
            </div>
          </div>
          {onToggleBookmark && (
            <button
              onClick={(e) => onToggleBookmark(property.id, e)}
              className="p-1.5 hover:bg-[#FAF8F5] rounded-lg transition-all"
              aria-label="Bookmark property"
            >
              <Bookmark
                className={`w-5 h-5 transition-all ${
                  bookmarked
                    ? 'fill-[#B8935E] text-[#B8935E]'
                    : 'text-[#6B6B6B] hover:text-[#B8935E]'
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-lg mb-0.5 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
            {property.location}
          </h3>
          <p className="text-xs text-[#6B6B6B] mb-1">{property.type}</p>
          <p className="text-xs text-[#6B6B6B]">{property.propertyName}</p>
        </div>

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

        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full" />
          <span className="text-xs text-blue-700 font-medium">Bank Owned</span>
          <span className="mx-1 text-black/10">·</span>
          <span
            className={`text-xs font-medium ${
              property.risk === 'Low'
                ? 'text-emerald-700'
                : property.risk === 'Medium'
                ? 'text-yellow-700'
                : 'text-red-700'
            }`}
          >
            {property.risk} Risk
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/property/${property.id}`);
          }}
          className="mt-auto w-full py-2.5 bg-[#0F3D2E] text-[#FAF8F5] rounded-lg group-hover:bg-[#0F3D2E]/90 transition-all flex items-center justify-center gap-2 text-sm shadow-sm group-hover:shadow-md"
        >
          View Investment Details
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
