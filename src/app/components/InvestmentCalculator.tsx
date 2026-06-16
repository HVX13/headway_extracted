import { useState } from 'react';
import { TrendingUp, Home, BarChart3, CheckCircle } from 'lucide-react';

type Strategy = 'flip' | 'rental' | 'hold';

export default function InvestmentCalculator() {
  const [activeStrategy, setActiveStrategy] = useState<Strategy>('flip');
  const [offerPrice, setOfferPrice] = useState(415);
  const [renovation, setRenovation] = useState(20);
  const [monthlyRental, setMonthlyRental] = useState(80);
  const [holdingPeriod, setHoldingPeriod] = useState(30);
  const [exitPrice, setExitPrice] = useState(535);

  const totalInvestment = offerPrice + renovation;
  const estimatedProfit = exitPrice - totalInvestment;
  const roi = ((estimatedProfit / totalInvestment) * 100).toFixed(1);
  const annualRentalIncome = monthlyRental * 12;
  const rentalYield = ((annualRentalIncome / totalInvestment) * 100).toFixed(2);
  const monthsHeld = holdingPeriod;
  const totalRentalIncome = (monthlyRental * monthsHeld) / 10;

  const strategies = [
    { id: 'flip' as Strategy, label: 'Flip Strategy', icon: TrendingUp },
    { id: 'rental' as Strategy, label: 'Rental Yield', icon: Home },
    { id: 'hold' as Strategy, label: 'Long-Term Hold', icon: BarChart3 },
  ];

  const sliderClass = "w-full h-1.5 bg-[#FAF8F5] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0F3D2E] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:bg-[#0F3D2E]/90 [&::-webkit-slider-thumb]:transition-all";
  const inputClass = "w-16 px-2 py-0.5 text-right text-sm border border-black/10 rounded-lg focus:outline-none focus:border-[#0F3D2E] text-[#0F3D2E]";

  return (
    <section className="py-8 px-6 lg:px-12 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl mb-4 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
          Investment Strategy & Returns
        </h2>

        {/* Strategy Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {strategies.map((strategy) => {
            const Icon = strategy.icon;
            const isActive = activeStrategy === strategy.id;
            return (
              <button
                key={strategy.id}
                onClick={() => setActiveStrategy(strategy.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0F3D2E] text-[#FAF8F5] shadow-md'
                    : 'bg-white border border-black/5 text-[#6B6B6B] hover:border-[#0F3D2E]/20 hover:text-[#0F3D2E]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-sm">{strategy.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* LEFT: Interactive Calculator */}
          <div className="bg-white border border-black/5 rounded-xl p-5">
            <h3 className="text-base font-medium mb-4 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Investment Parameters
            </h3>

            <div className="space-y-5">
              {/* Offer Price Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-[#6B6B6B]">Offer Price</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#6B6B6B]">₹</span>
                    <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(Number(e.target.value))} className={inputClass} style={{ fontFamily: "'Crimson Pro', serif" }} />
                    <span className="text-xs text-[#6B6B6B]">L</span>
                  </div>
                </div>
                <input type="range" min="300" max="600" step="5" value={offerPrice} onChange={(e) => setOfferPrice(Number(e.target.value))} className={sliderClass} />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-[#6B6B6B]">₹3 Cr</span>
                  <span className="text-xs text-[#6B6B6B]">₹6 Cr</span>
                </div>
              </div>

              {/* Renovation Cost Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-[#6B6B6B]">Renovation Cost</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#6B6B6B]">₹</span>
                    <input type="number" value={renovation} onChange={(e) => setRenovation(Number(e.target.value))} className={inputClass} style={{ fontFamily: "'Crimson Pro', serif" }} />
                    <span className="text-xs text-[#6B6B6B]">L</span>
                  </div>
                </div>
                <input type="range" min="0" max="100" step="5" value={renovation} onChange={(e) => setRenovation(Number(e.target.value))} className={sliderClass} />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-[#6B6B6B]">₹0</span>
                  <span className="text-xs text-[#6B6B6B]">₹1 Cr</span>
                </div>
              </div>

              {/* Monthly Rental Slider */}
              {(activeStrategy === 'rental' || activeStrategy === 'hold') && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-[#6B6B6B]">Expected Monthly Rental</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[#6B6B6B]">₹</span>
                      <input type="number" value={monthlyRental} onChange={(e) => setMonthlyRental(Number(e.target.value))} className={inputClass} style={{ fontFamily: "'Crimson Pro', serif" }} />
                      <span className="text-xs text-[#6B6B6B]">k</span>
                    </div>
                  </div>
                  <input type="range" min="40" max="150" step="5" value={monthlyRental} onChange={(e) => setMonthlyRental(Number(e.target.value))} className={sliderClass} />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-[#6B6B6B]">₹40k</span>
                    <span className="text-xs text-[#6B6B6B]">₹1.5L</span>
                  </div>
                </div>
              )}

              {/* Holding Period Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-[#6B6B6B]">Holding Period</label>
                  <div className="flex items-center gap-1.5">
                    <input type="number" value={holdingPeriod} onChange={(e) => setHoldingPeriod(Number(e.target.value))} className={inputClass} style={{ fontFamily: "'Crimson Pro', serif" }} />
                    <span className="text-xs text-[#6B6B6B]">months</span>
                  </div>
                </div>
                <input type="range" min="12" max="60" step="6" value={holdingPeriod} onChange={(e) => setHoldingPeriod(Number(e.target.value))} className={sliderClass} />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-[#6B6B6B]">12 months</span>
                  <span className="text-xs text-[#6B6B6B]">60 months</span>
                </div>
              </div>

              {/* Exit Price Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-[#6B6B6B]">Exit Price</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#6B6B6B]">₹</span>
                    <input type="number" value={exitPrice} onChange={(e) => setExitPrice(Number(e.target.value))} className={inputClass} style={{ fontFamily: "'Crimson Pro', serif" }} />
                    <span className="text-xs text-[#6B6B6B]">L</span>
                  </div>
                </div>
                <input type="range" min="400" max="700" step="5" value={exitPrice} onChange={(e) => setExitPrice(Number(e.target.value))} className={sliderClass} />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-[#6B6B6B]">₹4 Cr</span>
                  <span className="text-xs text-[#6B6B6B]">₹7 Cr</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Analytics */}
          <div className="space-y-4">
            {/* Main Analytics Card */}
            <div className="bg-white border border-black/5 rounded-xl p-5">
              <h3 className="text-base font-medium mb-3 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Investment Analysis
              </h3>

              <div className="divide-y divide-black/5">
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-[#6B6B6B]">Total Investment</span>
                  <span className="text-xl text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>₹{totalInvestment} L</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-[#6B6B6B]">Estimated Profit</span>
                  <span className="text-xl text-emerald-700" style={{ fontFamily: "'Crimson Pro', serif" }}>₹{estimatedProfit} L</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-[#6B6B6B]">Expected ROI</span>
                  <span className="text-2xl text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>{roi}%</span>
                </div>

                {(activeStrategy === 'rental' || activeStrategy === 'hold') && (
                  <>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-xs text-[#6B6B6B]">Monthly Rental Income</span>
                      <span className="text-lg text-blue-700" style={{ fontFamily: "'Crimson Pro', serif" }}>₹{monthlyRental}k</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-xs text-[#6B6B6B]">Annual Yield</span>
                      <span className="text-lg text-blue-700" style={{ fontFamily: "'Crimson Pro', serif" }}>{rentalYield}%</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-xs text-[#6B6B6B]">Total Rental Income</span>
                      <span className="text-lg text-blue-700" style={{ fontFamily: "'Crimson Pro', serif" }}>₹{totalRentalIncome.toFixed(1)} L</span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-[#6B6B6B]">Exit Value</span>
                  <span className="text-lg text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>₹{exitPrice} L</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-[#6B6B6B]">Hold Duration</span>
                  <span className="text-lg text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>{holdingPeriod} months</span>
                </div>
              </div>
            </div>

            {/* Investment Snapshot */}
            <div className="bg-gradient-to-br from-[#0F3D2E]/5 to-[#0F3D2E]/10 border border-[#0F3D2E]/10 rounded-xl p-5">
              <h3 className="text-base font-medium mb-3 text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Investment Snapshot
              </h3>

              <div className="space-y-3">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-xs text-[#6B6B6B] uppercase tracking-wide mb-1">Projected Appreciation</div>
                  <div className="text-xl text-emerald-700" style={{ fontFamily: "'Crimson Pro', serif" }}>
                    {(((exitPrice - offerPrice) / offerPrice) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs text-[#6B6B6B] mb-1">Conservative</div>
                    <div className="text-lg text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>{(Number(roi) * 0.7).toFixed(1)}%</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs text-[#6B6B6B] mb-1">Optimistic</div>
                    <div className="text-lg text-emerald-700" style={{ fontFamily: "'Crimson Pro', serif" }}>{(Number(roi) * 1.3).toFixed(1)}%</div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="text-xs text-emerald-800 uppercase tracking-wide mb-2">Key Assumptions</div>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-xs text-emerald-700">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>Market rate pricing at exit</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs text-emerald-700">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>Standard market appreciation</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs text-emerald-700">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span>90–180 day exit timeline</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg p-3">
                  <span className="text-xs text-[#6B6B6B] uppercase tracking-wide">Risk Level</span>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200">Moderate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
