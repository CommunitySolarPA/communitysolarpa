// County guide data. Census figures: American Community Survey 2020-2024 5-year estimates
// (tables DP03, DP04, DP05), pulled from data.census.gov. Utility coverage comes from
// public/data/pa-zips.json at build time.

export const acsVintage = '2020-2024';

export interface Senator {
  district: number;
  name: string;
  url: string;
  note?: string;
}

export interface County {
  slug: string;
  name: string; // as used in pa-zips.json, e.g. 'Lancaster'
  fips: string;
  seat: string;
  population: number;
  households: number;
  renterHouseholds: number;
  renterPct: number;
  multiUnitPct: number; // housing units in buildings with 2 or more units
  mobileHomePct: number;
  localNote: { heading: string; body: string[]; source?: { label: string; url: string } };
  senators: Senator[];
  sources: { label: string; url: string }[];
}

// Statewide comparison figures, same ACS release.
export const pennsylvania = { renterPct: 30.7, multiUnitPct: 21.0, mobileHomePct: 3.5 };

export const counties: County[] = [
  {
    slug: 'lancaster',
    name: 'Lancaster',
    fips: '42071',
    seat: 'Lancaster',
    population: 557931,
    households: 212748,
    renterHouseholds: 64198,
    renterPct: 30.2,
    multiUnitPct: 19.9,
    mobileHomePct: 3.7,
    localNote: {
      heading: 'Farms, and where projects could go',
      body: [
        "Farming is central to Lancaster County. The county's Agricultural Preserve Board has preserved 90,867 acres on 1,109 family farms, as of the end of 2025.",
        'Under the House-passed bill, farms can subscribe to community solar alongside households, and at least half of every project has to go to those small subscribers or to farms. Projects on rooftops and former industrial land (brownfields) can be larger, up to 20 megawatts, than projects elsewhere, which are capped at 5 megawatts. Local zoning would still decide where projects can be built.',
      ],
      source: { label: 'Lancaster County Agricultural Preserve Board', url: 'https://lancastercountypa.gov/126/Agricultural-Preserve-Board' },
    },
    senators: [
      { district: 13, name: 'Scott Martin', url: 'https://www.palegis.us/senate/members/bio/1763/sen-martin' },
      {
        district: 36,
        name: 'James Andrew Malone',
        url: 'https://www.palegis.us/senate/members/bio/2061/sen-malone',
        note: 'Serves through November 30, 2026. Tom Jones won the seat in the November 2026 election and takes office December 1.',
      },
      {
        district: 48,
        name: 'Chris Gebhard',
        url: 'https://www.palegis.us/senate/members/bio/1928/sen-gebhard',
        note: 'Re-elected in November 2026.',
      },
    ],
    sources: [
      { label: 'WGAL: Tom Jones wins Pennsylvania\'s 36th Senate District (November 2026)', url: 'https://www.wgal.com/article/pennsylvania-state-senate-36-jones-wins-2026/74218062' },
      { label: 'WGAL: Pa.\'s 48th Senate District results (November 2026)', url: 'https://www.wgal.com/article/pennsylvania-state-senate-district-48-gebhard-wins-2026/74218083' },
    ],
  },
];
