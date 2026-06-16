export interface Property {
  id: string;
  location: string;
  price: string;
  roi: string;
  risk: 'Low' | 'Medium' | 'High';
  area: string;
  type: string;
  score: number;
  discount: string;
  endsIn?: number;
  image: string;
  assetId: string;
  propertyName: string;
  fullAddress: string;
  pricePerSqFt: string;
  carpetArea: string;
  thesis: string;
  configuration: string;
  floor: string;
  furnishing: string;
  parking: string;
  age: string;
  ownershipType: string;
  lendingBank: string;
  marketValue: string;
  encumbrance?: string;
  propertyImages: string[];
  comparableProperties: {
    name: string;
    price: string;
    date: string;
    distance: string;
    bed: number;
    bath: number;
    sqft: number;
    built: number;
    position: [number, number];
  }[];
  mapCenter: [number, number];
}

export const properties: Record<string, Property> = {
  'siddhachal-thane-903': {
    id: 'siddhachal-thane-903',
    location: 'Thane West',
    price: '₹2.55 Cr',
    roi: '18',
    risk: 'Low',
    area: '1,047 sq.ft',
    type: '2 BHK Apartment',
    score: 8.5,
    discount: '18%',
    endsIn: 43,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    assetId: 'HC-001',
    propertyName: 'Siddhachal Phase VI/1',
    fullAddress: 'Flat No. 903, 9th Floor, A-Wing, Building No. 3, Siddhachal Phase VI/1 Co-operative Housing Society Ltd., Off Pokhran Road No. 2, Village Majiwade, Taluka and District Thane 400 610',
    pricePerSqFt: '₹24,355',
    carpetArea: '1,047 sq.ft (97.26 sq.m)',
    thesis: "Residential flat in the well-regarded Siddhachal Phase VI/1 society on Pokhran Road No. 2 — one of Thane's most sought-after corridors with excellent access to Thane station and Eastern Express Highway. The 9th floor unit includes dedicated stilt parking (No. 87) and carries a negligible encumbrance of just ₹7,000. At ₹24,355/sq.ft, this is a competitive entry into a supply-constrained society with strong rental demand from Thane's growing corporate workforce.",
    configuration: '2 BHK',
    floor: '9th Floor',
    furnishing: 'Unfurnished',
    parking: '1 Stilt (No. 87)',
    age: 'Placeholder',
    ownershipType: 'Co-operative Housing Society',
    lendingBank: 'Placeholder',
    marketValue: '₹3.1 Cr',
    encumbrance: '₹7,000',
    propertyImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    comparableProperties: [
      { name: 'Pokhran Road No. 2, Thane', price: '₹2.9 Cr', date: 'Mar 2026', distance: '0.3 km', bed: 2, bath: 2, sqft: 1050, built: 2012, position: [19.2195, 72.9785] },
      { name: 'Hiranandani Estate, Thane', price: '₹3.2 Cr', date: 'Feb 2026', distance: '1.2 km', bed: 2, bath: 2, sqft: 1100, built: 2015, position: [19.2250, 72.9850] },
      { name: 'Majiwade, Thane West', price: '₹2.75 Cr', date: 'Jan 2026', distance: '0.5 km', bed: 2, bath: 2, sqft: 1020, built: 2011, position: [19.2170, 72.9760] },
      { name: 'Ghodbunder Road, Thane', price: '₹3.0 Cr', date: 'Dec 2025', distance: '2.0 km', bed: 2, bath: 2, sqft: 1080, built: 2016, position: [19.2300, 72.9700] },
    ],
    mapCenter: [19.2183, 72.9781]
  },

  'siddhachal-thane-1003': {
    id: 'siddhachal-thane-1003',
    location: 'Thane West',
    price: '₹2.55 Cr',
    roi: '18',
    risk: 'Low',
    area: '1,047 sq.ft',
    type: '2 BHK Apartment',
    score: 8.3,
    discount: '18%',
    endsIn: 43,
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    assetId: 'HC-002',
    propertyName: 'Siddhachal Phase VI/1',
    fullAddress: 'Flat No. 1003, 10th Floor, A-Wing, Building No. 3, Siddhachal Phase VI/1 Co-operative Housing Society Ltd., Off Pokhran Road No. 2, Village Majiwade, Taluka and District Thane 400 610',
    pricePerSqFt: '₹24,355',
    carpetArea: '1,047 sq.ft (97.26 sq.m)',
    thesis: "A floor above its twin listing, Flat 1003 on the 10th floor of Siddhachal Phase VI/1 commands marginally better ventilation and views while sharing the same prized Pokhran Road No. 2 address. The unit comes with dedicated stilt parking (No. 88) and has a negligible encumbrance of ₹7,000. Identical pricing to Flat 903 makes this an equally strong entry with a slight view premium — both units represent rare back-to-back auction opportunities in the same sought-after society.",
    configuration: '2 BHK',
    floor: '10th Floor',
    furnishing: 'Unfurnished',
    parking: '1 Stilt (No. 88)',
    age: 'Placeholder',
    ownershipType: 'Co-operative Housing Society',
    lendingBank: 'Placeholder',
    marketValue: '₹3.1 Cr',
    encumbrance: '₹7,000',
    propertyImages: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    comparableProperties: [
      { name: 'Pokhran Road No. 2, Thane', price: '₹2.9 Cr', date: 'Mar 2026', distance: '0.3 km', bed: 2, bath: 2, sqft: 1050, built: 2012, position: [19.2195, 72.9785] },
      { name: 'Hiranandani Estate, Thane', price: '₹3.2 Cr', date: 'Feb 2026', distance: '1.2 km', bed: 2, bath: 2, sqft: 1100, built: 2015, position: [19.2250, 72.9850] },
      { name: 'Majiwade, Thane West', price: '₹2.75 Cr', date: 'Jan 2026', distance: '0.5 km', bed: 2, bath: 2, sqft: 1020, built: 2011, position: [19.2170, 72.9760] },
      { name: 'Ghodbunder Road, Thane', price: '₹3.0 Cr', date: 'Dec 2025', distance: '2.0 km', bed: 2, bath: 2, sqft: 1080, built: 2016, position: [19.2300, 72.9700] },
    ],
    mapCenter: [19.2183, 72.9781]
  },

  'anmol-goregaon-2001': {
    id: 'anmol-goregaon-2001',
    location: 'Goregaon West',
    price: '₹2.17 Cr',
    roi: '20',
    risk: 'Medium',
    area: '817 sq.ft',
    type: '2 BHK Apartment',
    score: 8.8,
    discount: '22%',
    endsIn: 40 ,
    image: 'https://images.unsplash.com/photo-1571214453696-8852eeb35bce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    assetId: 'HC-003',
    propertyName: 'Anmol CHSL',
    fullAddress: 'Flat No. A-2001, 20th Floor, Stilt Car Parking No. S-55, Anmol CHSL, CTS No. 309, Village Pahadi Goregaon, Opp. Patel Auto, Motilal Nagar, Off S.V. Road, Goregaon (West), Mumbai 400104',
    pricePerSqFt: '₹26,560',
    carpetArea: '817.02 sq.ft',
    thesis: "High-floor unit on the 20th floor of Anmol CHSL in Motilal Nagar — an established residential pocket off S.V. Road, Goregaon West, with excellent access to the Western Express Highway and Goregaon station. Key consideration: existing society dues of ₹12,98,917 (as of Dec 2025) and a pending City Civil Court case (C.C. 723/SA/2005) require legal scrutiny and due diligence. Notwithstanding, at ₹26,560/sq.ft the pricing remains compelling for Goregaon West where market rates for comparable high-rise units range ₹32,000–35,000/sq.ft.",
    configuration: '2 BHK',
    floor: '20th Floor',
    furnishing: 'Unfurnished',
    parking: '1 Stilt (No. S-55)',
    age: 'Placeholder',
    ownershipType: 'Co-operative Housing Society',
    lendingBank: 'Placeholder',
    marketValue: '₹2.8 Cr',
    encumbrance: 'Society Dues ₹12,98,917 (till 13.12.2025); C.C. 723/SA/2005 before City Civil Court, Mumbai',
    propertyImages: [
      'https://images.unsplash.com/photo-1571214453696-8852eeb35bce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    comparableProperties: [
      { name: 'Motilal Nagar, Goregaon West', price: '₹2.6 Cr', date: 'Mar 2026', distance: '0.2 km', bed: 2, bath: 2, sqft: 820, built: 2010, position: [19.1610, 72.8485] },
      { name: 'S.V. Road, Goregaon West', price: '₹2.75 Cr', date: 'Feb 2026', distance: '0.4 km', bed: 2, bath: 2, sqft: 850, built: 2013, position: [19.1580, 72.8500] },
      { name: 'New Link Road, Goregaon', price: '₹2.9 Cr', date: 'Jan 2026', distance: '1.0 km', bed: 2, bath: 2, sqft: 900, built: 2015, position: [19.1650, 72.8440] },
      { name: 'Aarey Colony, Goregaon', price: '₹2.5 Cr', date: 'Dec 2025', distance: '1.5 km', bed: 2, bath: 2, sqft: 800, built: 2009, position: [19.1700, 72.8550] },
    ],
    mapCenter: [19.1620, 72.8490]
  },

  'mbc-infotech-thane-d2': {
    id: 'mbc-infotech-thane-d2',
    location: 'Thane West',
    price: '₹16 Cr',
    roi: '22',
    risk: 'Medium',
    area: '11,040 sq.ft',
    type: 'Commercial Office',
    score: 8.5,
    discount: '20%',
    endsIn: 20,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    assetId: 'HC-004',
    propertyName: 'MBC Infotech Park',
    fullAddress: 'Entire 2nd Floor, D Wing, MBC Infotech Park, Sainath Nagar Bus Stop, Kasarwadavali, Thane (West), Taluka and District Thane 400615',
    pricePerSqFt: '₹14,493',
    carpetArea: '11,040 sq.ft',
    thesis: "Full commercial floor acquisition in MBC Infotech Park — a tech park in Kasarwadavali, Thane West, near Sainath Nagar Bus Stop with access to Eastern Express Highway and Thane's growing IT corridor. At 11,040 sq.ft, this is a substantial commercial block ideal for corporate occupiers, co-working operators, or multi-tenant configurations. Encumbrance of ₹1–1.5 Cr requires due diligence. At ₹14,493/sq.ft reserve, the pricing is well below prevailing Grade-A commercial rates in Thane, offering a potential 7–9% rental yield for a stabilised tenant profile.",
    configuration: 'Full Floor — Open Plan Commercial',
    floor: '2nd Floor, D Wing',
    furnishing: 'Bare Shell',
    parking: 'Placeholder',
    age: 'Placeholder',
    ownershipType: 'Freehold',
    lendingBank: 'Placeholder',
    marketValue: '₹20 Cr',
    encumbrance: '₹1–1.5 Cr',
    propertyImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1497366412874-3415097a27e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    comparableProperties: [
      { name: 'Kasarwadavali Commercial, Thane', price: '₹18 Cr', date: 'Mar 2026', distance: '0.5 km', bed: 0, bath: 4, sqft: 11000, built: 2014, position: [19.2295, 72.9785] },
      { name: 'Eastern Express Highway, Thane', price: '₹22 Cr', date: 'Feb 2026', distance: '1.5 km', bed: 0, bath: 5, sqft: 12000, built: 2016, position: [19.2350, 72.9850] },
      { name: 'Wagle Estate, Thane', price: '₹20 Cr', date: 'Jan 2026', distance: '2.0 km', bed: 0, bath: 4, sqft: 10500, built: 2013, position: [19.2150, 72.9900] },
      { name: 'Majiwade IT Park, Thane', price: '₹19.5 Cr', date: 'Dec 2025', distance: '1.8 km', bed: 0, bath: 4, sqft: 10800, built: 2015, position: [19.2180, 72.9750] },
    ],
    mapCenter: [19.2290, 72.9780]
  },

  'raheja-empress-prabhadevi-2003': {
    id: 'raheja-empress-prabhadevi-2003',
    location: 'Prabhadevi',
    price: '₹9 Cr',
    roi: '16',
    risk: 'Low',
    area: '1,288 sq.ft',
    type: '3 BHK Apartment',
    score: 9.0,
    discount: '18%',
    endsIn: 19,
    image: 'https://images.unsplash.com/photo-1594146032116-80033545b0b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    assetId: 'HC-005',
    propertyName: 'Raheja Empress',
    fullAddress: "Flat No. 2003, 20th Floor, Wing B, Raheja Empress, Veer Savarkar Marg (formerly Cadell Road), Mumbai 400025, together with 3 Car Parking spaces (Nos. B76, B/7 & B/9) in the Basement; Cadastral Survey No. 51 & 2A/49, Mahim Division, Prabhadevi, Mumbai",
    pricePerSqFt: '₹69,870',
    carpetArea: '1,288.11 sq.ft (Built-up)',
    thesis: "An iconic address on Veer Savarkar Marg, Prabhadevi — among Mumbai's most aspirational mid-island locations with panoramic views and immediate access to the Bandra-Worli Sea Link. The 20th floor unit in Raheja Empress Wing B is a rare offering that includes three dedicated basement parking spaces (B76, B/7, B/9) — a significant asset in this ultra-dense micro-market. At ₹69,870/sq.ft reserve, this is meaningfully below Prabhadevi's trophy-asset benchmarks where comparable units regularly transact at ₹80,000–90,000/sq.ft.",
    configuration: '3 BHK',
    floor: '20th Floor, Wing B',
    furnishing: 'Unfurnished',
    parking: '3 Basement (Nos. B76, B/7, B/9)',
    age: 'Placeholder',
    ownershipType: 'Freehold',
    lendingBank: 'Placeholder',
    marketValue: '₹11 Cr',
    propertyImages: [
      'https://images.unsplash.com/photo-1594146032116-80033545b0b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    comparableProperties: [
      { name: 'Veer Savarkar Marg, Prabhadevi', price: '₹10.5 Cr', date: 'Mar 2026', distance: '0.2 km', bed: 3, bath: 3, sqft: 1300, built: 2010, position: [19.0175, 72.8295] },
      { name: 'Cadell Road, Mahim', price: '₹9.8 Cr', date: 'Feb 2026', distance: '0.5 km', bed: 3, bath: 2, sqft: 1250, built: 2012, position: [19.0190, 72.8310] },
      { name: 'Worli Seaface Area', price: '₹12.5 Cr', date: 'Jan 2026', distance: '1.0 km', bed: 3, bath: 3, sqft: 1350, built: 2015, position: [19.0080, 72.8180] },
      { name: 'Dadar West, Mumbai', price: '₹9.2 Cr', date: 'Dec 2025', distance: '1.5 km', bed: 3, bath: 2, sqft: 1280, built: 2008, position: [19.0220, 72.8400] },
    ],
    mapCenter: [19.0169, 72.8290]
  },

  'white-rose-bandra-1302': {
    id: 'white-rose-bandra-1302',
    location: 'Bandra West',
    price: '₹12.5 Cr',
    roi: '20',
    risk: 'Low',
    area: '1,585 sq.ft',
    type: '3 BHK Apartment',
    score: 9.5,
    discount: '17%',
    endsIn: 15,
    image: 'https://images.unsplash.com/photo-1710582308582-55cc0c461c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    assetId: 'HC-006',
    propertyName: 'White Rose',
    fullAddress: 'Flat No. 1302, 13th Floor, White Rose Building (formerly White Rose Co-op. Housing Society Ltd.), 4-Perry Road, Bandra (West), Mumbai 400050, along with 2 car parking spaces; CTS No. C/550 S.N. 249 (Part), Village Bandra, Taluka Borivali, Mumbai Suburban',
    pricePerSqFt: '₹78,864',
    carpetArea: '1,585 sq.ft (RERA Carpet Area)',
    thesis: "A rare auction opportunity at 4-Perry Road, Bandra West — one of the most coveted residential addresses in Mumbai, favoured by Bollywood, business, and diplomatic families alike. The 13th floor unit in the White Rose building offers 1,585 sq.ft RERA carpet area with two car parking spaces — a scarce commodity in this densely built neighbourhood. At ₹78,864/sq.ft, this is a meaningful discount to Bandra West's prime market benchmarks where comparable addresses on Perry Road and Chapel Road routinely command ₹90,000–1,10,000/sq.ft. Strong rental demand from HNI tenants and consular staff underpins capital preservation.",
    configuration: '3 BHK',
    floor: '13th Floor',
    furnishing: 'Unfurnished',
    parking: '2 Car Parking',
    age: 'Placeholder',
    ownershipType: 'Co-operative Housing Society',
    lendingBank: 'Placeholder',
    marketValue: '₹15 Cr',
    propertyImages: [
      'https://images.unsplash.com/photo-1710582308582-55cc0c461c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ],
    comparableProperties: [
      { name: 'Perry Road, Bandra West', price: '₹14.2 Cr', date: 'Mar 2026', distance: '0.1 km', bed: 3, bath: 3, sqft: 1600, built: 2008, position: [19.0598, 72.8280] },
      { name: 'Chapel Road, Bandra West', price: '₹15.8 Cr', date: 'Feb 2026', distance: '0.3 km', bed: 3, bath: 3, sqft: 1650, built: 2012, position: [19.0610, 72.8300] },
      { name: 'St. Andrews Road, Bandra', price: '₹13.5 Cr', date: 'Jan 2026', distance: '0.5 km', bed: 3, bath: 2, sqft: 1500, built: 2010, position: [19.0580, 72.8260] },
      { name: 'Pali Hill, Bandra West', price: '₹16.5 Cr', date: 'Dec 2025', distance: '0.8 km', bed: 3, bath: 3, sqft: 1700, built: 2015, position: [19.0550, 72.8240] },
    ],
    mapCenter: [19.0600, 72.8295]
  }
};

export function getPropertyById(id: string): Property | undefined {
  return properties[id];
}

export function getAllProperties(): Property[] {
  return Object.values(properties);
}
