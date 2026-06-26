// Headway AI — real chatbot backend (Vercel serverless function).
//
// Replaces the old hardcoded keyword matcher with a Claude-backed assistant that
// is grounded in Headway's domain knowledge AND the live listings. Streams the
// reply token-by-token back to the chat UI. The API key never reaches the client.
//
// Required env var (set in the Vercel dashboard, or .env for `vercel dev`):
//   ANTHROPIC_API_KEY=sk-ant-...

import Anthropic from '@anthropic-ai/sdk';
import { getAllProperties } from '../src/app/data/properties';

// claude-opus-4-8 is the most capable model. For lower cost at high chat volume,
// switch this single constant to 'claude-sonnet-4-6' (same API, ~40% the price).
const MODEL = 'claude-opus-4-8';

// ── Grounding: curated domain knowledge ───────────────────────────────────────

const KNOWLEDGE = `# How Headway works
Headway is a Mumbai-focused advisory for bank-auction (distressed) property. Every
listing clears a strict due-diligence framework (a 47-point screen, including the
6 legal checks below) before it goes live. Headway advises buyers end-to-end:
shortlisting, legal diligence, EMD submission, financing introductions, and bidding.

# Bank auctions under the SARFAESI Act, 2002
When a borrower defaults on a property-backed loan, the bank can seize and auction
the asset to recover dues. Process:
1. Bank values the property and sets a Reserve Price.
2. A public notice is published (newspapers + government e-auction portals).
3. Bidders pay an EMD (Earnest Money Deposit, typically 10%) to register.
4. On auction day, the highest bid above the reserve price wins.
5. Winner pays 25% of the total within 24 hours.
6. Remaining 75% is due within 15 days.
7. The bank issues a Sale Certificate — proof of ownership.
Key insight: banks aim to recover the loan, not maximise profit, so reserve prices
are frequently 15–35% below registered market value.

# EMD (Earnest Money Deposit)
A refundable security amount paid to register as a bidder. Typically 10% of the
reserve price (sometimes 5% for low-value assets, up to 25% for some commercial).
Refunded within ~5–10 business days if you don't win; adjusted against the price if
you do; forfeited if you win but fail to pay the balance. Example: ~₹50 lakh on a
₹5 Cr property, ~₹1.2 Cr on a ₹12 Cr property. Headway handles EMD submission and
bank coordination end-to-end.

# Legal due diligence — the 6 non-negotiable checks
1. 30-Year Title Chain Search — no broken ownership links or disputed transfers.
2. Encumbrance Certificate (EC) — no outstanding loans/charges beyond the one auctioned.
3. SARFAESI Notice Verification — the bank actually has authority to auction.
4. Litigation Check — no injunctions, disputes, or stay orders.
5. Possession Type — physical (vacant, ready) vs symbolic (paperwork only, may be
   occupied). Physical is significantly safer.
6. Society Dues & Pending Taxes — unpaid maintenance / property tax / electricity
   arrears can become the buyer's liability.
Every Headway listing has cleared all six before appearing on the platform.

# Financing an auctioned property
Possible but timelines are tight: 25% due in 24 hours, 75% in 15 days, while most
lenders take 2–4 weeks to disburse. Sometimes the auctioning bank itself, or NBFCs
and private banks, will lend against a clean-title auction property. Most serious
bidders arrive with funds largely pre-arranged (liquid savings, loan-against-
property, or bridge finance). Headway advises case-by-case and can introduce
lenders who understand auction timelines.`;

// ── Grounding: live listings rendered from the real data ──────────────────────

function buildListings(): string {
  return getAllProperties()
    .map((p) => {
      const lines = [
        `- ${p.propertyName} (${p.assetId}) — ${p.type} in ${p.location}`,
        `  Reserve: ${p.price} | Market value: ${p.marketValue} | Discount: ${p.discount} | ${p.pricePerSqFt}/sq.ft`,
        `  Config: ${p.configuration}, ${p.floor}, carpet ${p.carpetArea}, ${p.furnishing}; Parking: ${p.parking}; Ownership: ${p.ownershipType}`,
        `  Headway score: ${p.score}/10 | Risk: ${p.risk} | ~${p.endsIn ?? '—'} days left`,
        p.encumbrance
          ? `  Encumbrance / notes: ${p.encumbrance}`
          : `  Encumbrance: none noted`,
        `  Address: ${p.fullAddress}`,
        `  Thesis: ${p.thesis}`,
        `  Link: /property/${p.id}`,
      ];
      return lines.join('\n');
    })
    .join('\n\n');
}

function buildSystemPrompt(): string {
  return `You are Headway AI — the assistant on Headway's website, advising buyers on Mumbai bank-auction (SARFAESI) property.

${KNOWLEDGE}

# Live listings (the only properties currently on the platform)
${buildListings()}

# How to behave
- Answer ONLY from the knowledge and listings above plus general, well-established facts about the SARFAESI auction process. Do not invent listings, prices, banks, dates, or legal specifics.
- When a listing field contains the literal word "Placeholder", treat it as unknown — never show it. Offer to connect the user with a Headway advisor for those specifics.
- When the user asks what's available, or about an area/budget/type, cite the relevant real listings by name, area and reserve price, and mention you can open the full listing.
- You are not a lawyer or financial adviser. Remind users to verify legal documents independently before bidding. Keep it light, not a wall of disclaimers.
- If a question is outside Mumbai bank auctions / Headway, gently steer back, or suggest the Express Interest form for bespoke help.
- Tone: concise, warm, professional — like a sharp advisor, not a brochure. Lead with the answer.

# Navigation you can point users to
- Browse all listings: /properties
- A specific listing: /property/<id> (ids are in the listings above)
- Talk to an advisor / Express Interest: /contact
- How it works: /how-it-works | Learn: /learn

# Formatting (the chat UI renders plain text, not markdown)
- No markdown: no #, no **bold**, no [links](). Write URLs as plain paths like /properties.
- Separate paragraphs with a blank line. For lists, start each line with "• ".
- Respond only with your final answer to the user — no notes about your own reasoning or process.`;
}

// ── Best-effort in-memory rate limiting (per warm instance) ────────────────────
// For production-grade limits across instances, back this with Upstash/Redis/KV.

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

// ── Handler ───────────────────────────────────────────────────────────────────

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';
  if (rateLimited(ip)) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: 'Invalid JSON body.' });
      return;
    }
  }

  const incoming: ChatMessage[] = Array.isArray(body?.messages)
    ? body.messages
        .filter(
          (m: any) =>
            m &&
            (m.role === 'user' || m.role === 'assistant') &&
            typeof m.content === 'string' &&
            m.content.trim().length > 0,
        )
        .slice(-20) // cap history
        .map((m: any) => ({
          role: m.role,
          content: m.content.slice(0, 4000), // cap per-message length
        }))
    : [];

  if (incoming.length === 0 || incoming[incoming.length - 1].role !== 'user') {
    res.status(400).json({ error: 'Expected a non-empty conversation ending in a user message.' });
    return;
  }

  const anthropic = new Anthropic();

  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'X-Accel-Buffering': 'no',
  });

  // Build params loosely so we don't depend on a specific SDK version's types.
  const params: any = {
    model: MODEL,
    max_tokens: 2048,
    output_config: { effort: 'low' }, // fast, terse, no over-thinking for chat
    system: [
      {
        type: 'text',
        text: buildSystemPrompt(),
        cache_control: { type: 'ephemeral' }, // cache the static grounding prefix
      },
    ],
    messages: incoming,
  };

  const stream = anthropic.messages.stream(params);

  // If the user hits "stop" / navigates away, abort the upstream request.
  req.on('close', () => stream.abort());

  try {
    stream.on('text', (text: string) => {
      res.write(text);
    });
    await stream.finalMessage();
    res.end();
  } catch (err: any) {
    // Aborts are expected when the client stops generation.
    if (err?.name !== 'AbortError') {
      console.error('chat stream error:', err);
      try {
        res.write(
          '\n\nSorry — I hit a problem just now. Please try again, or reach the Headway team via the Express Interest form.',
        );
      } catch {
        /* response may already be torn down */
      }
    }
    try {
      res.end();
    } catch {
      /* already ended */
    }
  }
}
