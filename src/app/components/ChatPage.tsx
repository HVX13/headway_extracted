import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, SquarePen, ArrowRight, Home, Building2, Landmark, FileText, Wallet, Scale, Square } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Knowledge base ────────────────────────────────────────────────────────────

const answers: Record<string, string> = {
  available:
    `Right now, there are 18 active bank auction listings across Mumbai — all verified and carrying full physical possession.\n\nHere's the breakdown by area:\n\n• South Mumbai (3 listings) — ₹8 Cr to ₹18 Cr. Prime pockets: Prabhadevi, Worli, Colaba.\n• Western Suburbs (5 listings) — ₹3.5 Cr to ₹12 Cr. Bandra West, Juhu, Andheri.\n• Central Mumbai (4 listings) — ₹4 Cr to ₹15 Cr. Dadar, Parel, Lower Parel.\n• Thane (4 listings) — ₹2.5 Cr to ₹6 Cr. Good value, newer buildings, solid rental demand.\n• Eastern Suburbs (2 listings) — ₹2.8 Cr to ₹5 Cr. Chembur, Ghatkopar.\n\nEvery listing has cleared our 47-point due diligence framework before going live. No noise — only verified deals.`,

  auction:
    `A bank auction under SARFAESI Act, 2002 happens when a borrower defaults on a property-backed loan. The bank is legally entitled to seize and sell the asset to recover its dues.\n\nHere's how the process works, step by step:\n\n1. The bank values the property and sets a Reserve Price.\n2. A public notice is published — usually buried in small-print newspaper columns and buried on government e-auction portals.\n3. Interested buyers pay an EMD (Earnest Money Deposit, typically 10%) to register as bidders.\n4. On auction day, the highest bidder above the reserve price wins.\n5. The winner pays 25% of the total within 24 hours.\n6. The remaining 75% is due within 15 days.\n7. The bank issues a Sale Certificate — your proof of ownership.\n\nThe critical insight: banks want to recover their loan amount, not maximize profit. That's why reserve prices are frequently 15–35% below registered market value.`,

  legal:
    `Legal due diligence on a bank auction property is non-negotiable. Here's what needs to be checked — and why:\n\n1. 30-Year Title Chain Search — confirms there are no broken ownership links or disputed transfers going back three decades.\n\n2. Encumbrance Certificate (EC) — verifies no outstanding loans, mortgages or charges on the property other than the one being auctioned.\n\n3. SARFAESI Notice Verification — confirms the bank actually has the legal authority to auction. Fake or procedurally defective notices exist.\n\n4. Litigation Check — court records search to ensure no injunctions, disputes or stay orders are in play.\n\n5. Possession Type — physical possession (vacant, ready to occupy) vs. symbolic possession (bank has paperwork but property may still be occupied). Physical is significantly safer.\n\n6. Society Dues & Pending Taxes — unpaid maintenance, property tax or electricity arrears can become your liability.\n\nEvery property on Headway has cleared all six checks before it appears on the platform.`,

  loan:
    `Getting a home loan for a bank-auctioned property is possible, but it comes with important caveats.\n\nYes, it's possible:\n• Sometimes the same bank conducting the auction will offer financing to the winning bidder.\n• A few private banks and NBFCs also lend against auction properties, particularly if the title is clean.\n\nBut the timelines are tight:\n• 25% of the purchase price is due within 24 hours of winning the auction.\n• The remaining 75% must be paid within 15 days.\n• Most institutional lenders take 2–4 weeks to process and disburse.\n\nThis mismatch is why most serious auction buyers come with funds largely arranged before bidding — either through liquid savings, LAP (loan against property), or bridge finance.\n\nHeadway advises on financing options case-by-case and can connect you with lenders who understand auction timelines.`,

  emd:
    `EMD stands for Earnest Money Deposit. It's a refundable security amount you pay to register as a bidder in a bank auction.\n\nThe key details:\n\n• Amount: Typically 10% of the reserve price (sometimes 5% for lower-value properties, up to 25% for certain commercial assets).\n• Purpose: Confirms you're a serious bidder. Without paying EMD, you cannot bid.\n• Refund: If you don't win the auction, your EMD is refunded — usually within 5–10 business days.\n• If you win: The EMD is adjusted against the total purchase price.\n• If you win but don't pay the balance: The EMD is forfeited, and the property goes back to auction.\n\nExample: On a ₹5 Cr property, the EMD would typically be ₹50 lakh. On a ₹12 Cr property, expect ₹1.2 Cr.\n\nHeadway handles the EMD submission process end-to-end, including the paperwork and bank coordination.`,

  default:
    `That's a good question — and the honest answer is that every auction situation has its own nuances.\n\nThe Headway advisory team handles exactly this kind of query. They've guided investors through hundreds of Mumbai bank auctions, from first-time buyers to seasoned portfolio investors.\n\nA 10-minute call typically cuts through months of confusion. You can reach out directly via the Express Interest form, or browse the live listings to see what matches your profile.\n\nIs there anything more specific I can help clarify — about the process, a particular locality, or the legal side?`,
};

function getAnswer(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('available') || q.includes('listing') || q.includes('propert') || q.includes('right now') || q.includes('how many')) return answers.available;
  if (q.includes('auction') || q.includes('sarfaesi') || q.includes('process') || q.includes('how does') || q.includes('work') || q.includes('step')) return answers.auction;
  if (q.includes('legal') || q.includes('document') || q.includes('title') || q.includes('encumbrance') || q.includes('check') || q.includes('safe') || q.includes('risk')) return answers.legal;
  if (q.includes('loan') || q.includes('finance') || q.includes('mortgage') || q.includes('borrow') || q.includes('lend')) return answers.loan;
  if (q.includes('emd') || q.includes('deposit') || q.includes('earnest') || q.includes('how much') || q.includes('money')) return answers.emd;
  return answers.default;
}

// ── Quick suggestions shown on empty state ────────────────────────────────────

const suggestions: { Icon: LucideIcon; label: string }[] = [
  { Icon: Home,      label: 'What properties are available right now?' },
  { Icon: Landmark,  label: 'How does a bank auction work?' },
  { Icon: FileText,  label: 'What legal documents should I check?' },
  { Icon: Wallet,    label: 'What is EMD and how much do I need?' },
  { Icon: Building2, label: 'Can I get a home loan on an auctioned property?' },
  { Icon: Scale,     label: 'Is it safe to buy a foreclosed property?' },
];

// ── Logo mark — two pillars + crossbar, evokes architecture + "H" ────────────

function HMark({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="1.5" width="3" height="13" rx="0.6" fill="currentColor" />
      <rect x="11.5" y="1.5" width="3" height="13" rx="0.6" fill="currentColor" />
      <rect x="1.5" y="6.25" width="13" height="3.5" rx="0.6" fill="currentColor" />
    </svg>
  );
}

function AiAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-7 h-7';
  const iconSize = size === 'sm' ? 11 : size === 'lg' ? 22 : 14;
  const radius = size === 'lg' ? 'rounded-xl' : 'rounded-[6px]';
  return (
    <div className={`${dim} ${radius} bg-[#0F3D2E] flex items-center justify-center flex-shrink-0`}>
      <HMark size={iconSize} className="text-[#B8935E]" />
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMessage = (location.state as { initialMessage?: string })?.initialMessage;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [nextId, setNextId] = useState(1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const didInit = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-resize textarea
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  };

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages(prev => [...prev, { id: nextId, role: 'user', text: trimmed }]);
    setNextId(n => n + 1);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    const delay = 400 + Math.random() * 300;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setMessages(prev => [...prev, { id: nextId + 1, role: 'ai', text: getAnswer(trimmed) }]);
      setNextId(n => n + 2);
      setIsTyping(false);
      timeoutRef.current = null;
    }, delay);
  }, [isTyping, nextId]);

  const stopGeneration = () => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    setIsTyping(false);
  };

  // Fire the initial message exactly once on mount
  useEffect(() => {
    if (initialMessage && !didInit.current) {
      didInit.current = true;
      send(initialMessage);
    }
  }, [initialMessage, send]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const conversationTitle = messages.find(m => m.role === 'user')?.text.slice(0, 42) || 'New conversation';

  return (
    <div className="flex h-dvh bg-white overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-[200px] bg-[#141414] flex-shrink-0">

        {/* Brand */}
        <div className="flex items-center gap-2 px-4 pt-5 pb-5">
          <AiAvatar size="sm" />
          <span className="text-white/90 text-[13px] font-medium tracking-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Headway AI
          </span>
        </div>

        {/* New chat */}
        <div className="px-3 border-t border-white/5 pt-3">
          <button
            onClick={() => { setMessages([]); setNextId(1); didInit.current = false; }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-white/55 hover:bg-white/6 hover:text-white/85 transition-all cursor-pointer"
          >
            <SquarePen className="w-3.5 h-3.5 flex-shrink-0" />
            New chat
          </button>
        </div>

        {/* Conversation list */}
        {messages.length > 0 && (
          <div className="px-3 mt-4">
            <p className="text-[11px] text-white/30 uppercase tracking-widest px-3 mb-1.5">Today</p>
            <button className="w-full text-left px-3 py-2 rounded-md bg-white/8 text-[13px] text-white/75 truncate">
              {conversationTitle}
            </button>
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-auto px-3 pb-4 space-y-0.5">
          <button
            onClick={() => navigate('/properties')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-white/65 hover:bg-white/6 hover:text-white/90 transition-all cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            Browse properties
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-white/65 hover:bg-white/6 hover:text-white/90 transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            Back to site
          </button>
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-black/6">
          <button onClick={() => navigate('/')} aria-label="Back to site" className="text-[#6B6B6B] hover:text-[#0F3D2E] transition-colors cursor-pointer p-1">
            <Home className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <AiAvatar size="sm" />
            <span className="text-sm font-medium text-[#0F3D2E]" style={{ fontFamily: "'Crimson Pro', serif" }}>Headway AI</span>
          </div>
          <button
            onClick={() => { setMessages([]); setNextId(1); didInit.current = false; }}
            aria-label="New conversation"
            className="text-[#6B6B6B] hover:text-[#0F3D2E] transition-colors cursor-pointer p-1"
          >
            <SquarePen className="w-4 h-4" />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">

          {/* Empty state */}
          {messages.length === 0 && !isTyping && (
            <div className="flex flex-col items-center justify-center h-full px-4 py-12">
              <div className="w-12 h-12 rounded-xl border border-[#0F3D2E]/12 bg-[#0F3D2E]/6 flex items-center justify-center mb-5">
                <HMark size={22} className="text-[#0F3D2E]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0F3D2E] mb-2 text-center" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Mumbai Property Intelligence
              </h2>
              <p className="text-[#6B6B6B] text-sm text-center mb-10 max-w-md leading-relaxed">
                Ask anything about Mumbai bank auction properties — listings, legal process, EMD, financing, or due diligence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map(s => (
                  <button
                    key={s.label}
                    onClick={() => send(s.label)}
                    className="flex items-start gap-3 p-4 rounded-xl border border-black/8 bg-white hover:bg-[#FAF8F5] hover:border-[#0F3D2E]/30 active:scale-[0.98] text-left transition-all duration-150 group cursor-pointer"
                  >
                    <s.Icon className="w-4 h-4 text-[#0F3D2E]/40 flex-shrink-0 mt-0.5 group-hover:text-[#0F3D2E]/70 transition-colors" />
                    <span className="text-sm text-[#1A1A1A] group-hover:text-[#0F3D2E] leading-snug transition-colors">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation */}
          {(messages.length > 0 || isTyping) && (
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* AI avatar */}
                    {msg.role === 'ai' && <AiAvatar />}

                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                      {msg.role === 'user' ? (
                        /* User bubble */
                        <div className="bg-[#F4F4F4] text-[#1A1A1A] px-5 py-3.5 rounded-3xl text-sm leading-relaxed">
                          {msg.text}
                        </div>
                      ) : (
                        /* AI response — no bubble, just text */
                        <div>
                          <div className="text-[#1A1A1A] text-sm leading-7">
                            {msg.text.split('\n\n').map((para, i) => (
                              <p key={i} className={i > 0 ? 'mt-4' : ''}>
                                {para.split('\n').map((line, j) => (
                                  <span key={j}>
                                    {line}
                                    {j < para.split('\n').length - 1 && <br />}
                                  </span>
                                ))}
                              </p>
                            ))}
                          </div>
                          {/* Action buttons on last AI message */}
                          {msg.id === messages[messages.length - 1]?.id && msg.role === 'ai' && !isTyping && (
                            <div className="flex flex-wrap gap-2 mt-5">
                              <button
                                onClick={() => navigate('/properties')}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/10 bg-white text-xs text-[#0F3D2E] font-medium hover:bg-[#FAF8F5] hover:border-[#0F3D2E]/30 transition-all"
                              >
                                Browse live listings <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => navigate('/contact')}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#B8935E]/30 bg-[#B8935E]/5 text-xs text-[#B8935E] font-medium hover:bg-[#B8935E]/10 transition-all"
                              >
                                Talk to an advisor <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-4 justify-start"
                  >
                    <AiAvatar />
                    <div className="flex items-center gap-1 pt-2.5">
                      <span className="w-2 h-2 bg-[#6B6B6B]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-[#6B6B6B]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-[#6B6B6B]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ── Input bar (fixed bottom) ─────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-black/6 bg-white px-4 pt-4 pb-5">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-3 bg-white border border-black/12 rounded-2xl px-4 py-3 shadow-sm focus-within:border-[#0F3D2E]/30 focus-within:ring-2 focus-within:ring-[#0F3D2E]/8 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => { setInput(e.target.value); resizeTextarea(); }}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Mumbai bank auctions…"
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#6B6B6B]/55 focus:outline-none leading-6 max-h-44 overflow-y-auto"
                style={{ minHeight: '24px' }}
              />
              {isTyping ? (
                <button
                  onClick={stopGeneration}
                  aria-label="Stop generating"
                  className="flex-shrink-0 w-11 h-11 border border-black/15 rounded-lg flex items-center justify-center hover:bg-black/5 transition-all self-end cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 text-[#1A1A1A] fill-[#1A1A1A]" />
                </button>
              ) : (
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="flex-shrink-0 w-11 h-11 bg-[#0F3D2E] rounded-lg flex items-center justify-center hover:bg-[#0F3D2E]/85 disabled:opacity-35 disabled:cursor-not-allowed transition-all self-end cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#6B6B6B]/50 text-center mt-2.5">
              Headway AI can make mistakes. Always verify legal documents independently.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
