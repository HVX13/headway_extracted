import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, SquarePen, ArrowRight, Home, Building2, Landmark, FileText, Wallet, Scale, Square } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
  const [isStreaming, setIsStreaming] = useState(false);
  const [awaitingFirstToken, setAwaitingFirstToken] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const didInit = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const idRef = useRef(1);
  const newId = () => idRef.current++;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, awaitingFirstToken]);

  // Auto-resize textarea
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  };

  // Stream a reply from the backend, appending tokens into a new AI message.
  const streamReply = useCallback(async (history: Message[]) => {
    const controller = new AbortController();
    abortRef.current = controller;
    const aiId = newId();
    let started = false;
    let acc = '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.text,
          })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        acc += chunk;
        if (!started) {
          started = true;
          setAwaitingFirstToken(false);
          setMessages(prev => [...prev, { id: aiId, role: 'ai', text: acc }]);
        } else {
          setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, text: acc } : m)));
        }
      }
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === 'AbortError';
      if (!aborted && !started) {
        setMessages(prev => [
          ...prev,
          {
            id: aiId,
            role: 'ai',
            text: "Sorry — I couldn't reach the assistant just now. Please try again in a moment, or reach the Headway team via the Express Interest form.",
          },
        ]);
      }
    } finally {
      setIsStreaming(false);
      setAwaitingFirstToken(false);
      abortRef.current = null;
    }
  }, []);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const history = [...messages, { id: newId(), role: 'user' as const, text: trimmed }];
    setMessages(history);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsStreaming(true);
    setAwaitingFirstToken(true);
    void streamReply(history);
  }, [isStreaming, messages, streamReply]);

  const stopGeneration = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setAwaitingFirstToken(false);
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
            onClick={() => { abortRef.current?.abort(); setMessages([]); idRef.current = 1; didInit.current = false; setIsStreaming(false); setAwaitingFirstToken(false); }}
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
            onClick={() => { abortRef.current?.abort(); setMessages([]); idRef.current = 1; didInit.current = false; setIsStreaming(false); setAwaitingFirstToken(false); }}
            aria-label="New conversation"
            className="text-[#6B6B6B] hover:text-[#0F3D2E] transition-colors cursor-pointer p-1"
          >
            <SquarePen className="w-4 h-4" />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">

          {/* Empty state */}
          {messages.length === 0 && !isStreaming && (
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
          {(messages.length > 0 || isStreaming) && (
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
                          {msg.id === messages[messages.length - 1]?.id && msg.role === 'ai' && !isStreaming && (
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
                {awaitingFirstToken && (
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
              {isStreaming ? (
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
