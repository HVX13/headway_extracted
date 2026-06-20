import { Property, getAllProperties } from './properties';

// Parse a price string like "₹2.55 Cr" or "₹16 Cr" into a number of crores.
export function parseCr(price: string): number {
  const match = price.replace(/,/g, '').match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

// Compute the discount-to-market percentage from reserve vs market value.
export function discountPct(p: Property): number {
  const reserve = parseCr(p.price);
  const market = parseCr(p.marketValue);
  if (!market) return 0;
  return Math.round(((market - reserve) / market) * 100);
}

// Distinct, sorted list of values for a given property key — used to build
// filter dropdowns without hardcoding options.
export function uniqueValues(key: 'location' | 'type' | 'risk'): string[] {
  const set = new Set(getAllProperties().map((p) => p[key]));
  return Array.from(set).sort();
}

// Broad asset class derived from the granular `type` field.
export function assetClass(p: Property): 'Residential' | 'Commercial' {
  return /commercial|office|shop|retail/i.test(p.type) ? 'Commercial' : 'Residential';
}
