// County guide data. Census figures for every county live in county-acs.json
// (ACS 2020-2024 5-year, DP04 + DP05, pulled from data.census.gov). Utility coverage
// comes from public/data/pa-zips.json at build time. This file holds what's written
// per county: the local section, senators, and extra sources.
import acs from './county-acs.json';
// Local sections for counties without a hand-written entry, generated from the same
// Census and ZIP data shown on each page (standout housing figures, utility splits, co-ops).
import generated from './county-notes.json';

export const acsVintage = '2020-2024';

// Statewide comparison figures, same ACS release.
export const pennsylvania = { renterPct: 30.7, multiUnitPct: 21.0, attachedPct: 18.8, mobileHomePct: 3.5 };

export interface Senator {
  district: number;
  name: string;
  url: string;
  note?: string;
}

export interface Link { label: string; url: string }

interface CountyInput {
  slug: string;
  name: string; // as used in pa-zips.json and county-acs.json, e.g. 'Lancaster'
  farmFaq?: boolean; // ask about farmland in the FAQ instead of where projects go
  localNote?: { heading: string; body: string[]; source?: Link };
  senators?: Senator[]; // leave empty until the 2027-2028 Senate is seated (Dec 1, 2026)
  sources?: Link[];
}

export interface County extends CountyInput {
  fips: string;
  population: number;
  households: number;
  renterHouseholds: number;
  renterPct: number;
  multiUnitPct: number;
  attachedPct: number;
  bigBuildingPct: number;
  mobileHomePct: number;
}

const census = acs as unknown as Record<string, [string, number, number, number, number, number, number, number, number]>;

function withCensus(c: CountyInput): County {
  const r = census[c.name];
  if (!r) throw new Error(`No ACS data for ${c.name}`);
  const [fips, population, households, renterHouseholds, renterPct, multiUnitPct, attachedPct, bigBuildingPct, mobileHomePct] = r;
  return { ...c, fips, population, households, renterHouseholds, renterPct, multiUnitPct, attachedPct, bigBuildingPct, mobileHomePct };
}

const input: CountyInput[] = [
  {
    slug: 'philadelphia',
    name: 'Philadelphia',
    localNote: {
      heading: 'A city of renters and rowhomes',
      body: [
        'Philadelphia is a city and a county at once, with the same borders. Almost half of its households, about 327,500, rent their home. That is the highest share of any county in Pennsylvania.',
        'More than half of Philadelphia\'s homes (55.6%) are rowhomes and other attached houses, and another 15.1% are in buildings with 20 or more units. Rowhome roofs are small and often shared, and renters can\'t add panels to a building they don\'t own. Community solar was designed for exactly this kind of housing: the panels go somewhere else, and the credit shows up on your PECO bill.',
      ],
    },
  },
  {
    slug: 'allegheny',
    name: 'Allegheny',
    localNote: {
      heading: 'Two main utilities, two prices',
      body: [
        'Most of Allegheny County, including most of Pittsburgh, gets its power from Duquesne Light. West Penn Power serves communities around the edges of the county, such as Natrona Heights, Brackenridge, South Park and West Elizabeth, and shares many others with Duquesne Light, and Penn Power serves some areas in the north. A few areas in the north are served by a rural electric co-op.',
        'That matters because each utility has its own price to compare, and community solar credits would come through your own utility\'s bill. As of October 2026, Duquesne Light\'s price to compare was 14.14¢ per kWh and West Penn Power\'s was 12.07¢.',
        'More than a third of Allegheny County households, about 190,100, rent their home.',
      ],
    },
  },
  {
    slug: 'montgomery',
    name: 'Montgomery',
    localNote: {
      heading: 'Suburbs with a lot of apartments',
      body: [
        'Montgomery County has more apartment living than its suburban image suggests. One in eight homes (12.6%) is in a building with 20 or more units, well above the statewide share of 7.0%, and about 96,000 households rent.',
        'PECO serves almost all of the county. In the upper part of the county, around Pennsburg, Red Hill and Green Lane, some ZIP codes also list PPL or Met-Ed, so check your bill if you live there.',
      ],
    },
  },
  {
    slug: 'bucks',
    name: 'Bucks',
    localNote: {
      heading: 'Lower Bucks and Upper Bucks',
      body: [
        'PECO serves most of Bucks County, including the more populated lower and central parts. Upper Bucks is different: towns like Quakertown, Perkasie, Sellersville and Trumbauersville list PPL, and communities along the Delaware River like Upper Black Eddy, Erwinna and Point Pleasant list Met-Ed.',
        'Because community solar credits would come through your own utility, two neighbors a few miles apart in Bucks County could end up subscribing to different projects.',
        'Bucks has the lowest share of renters of Pennsylvania\'s five largest counties, 22.2%, but that is still about 55,300 households.',
      ],
    },
  },
  {
    slug: 'delaware',
    name: 'Delaware',
    localNote: {
      heading: 'Rowhome suburbs',
      body: [
        'Only Philadelphia has a higher share of rowhomes than Delaware County. About a third of its homes (32.0%) are rowhomes or other attached houses, compared with 18.8% statewide. About 65,900 households rent.',
        'Every ZIP code in Delaware County lists PECO, so community solar credits for residents here would come through PECO.',
      ],
    },
  },
  {
    slug: 'lancaster',
    name: 'Lancaster',
    farmFaq: true,
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
      { label: "WGAL: Tom Jones wins Pennsylvania's 36th Senate District (November 2026)", url: 'https://www.wgal.com/article/pennsylvania-state-senate-36-jones-wins-2026/74218062' },
      { label: "WGAL: Pa.'s 48th Senate District results (November 2026)", url: 'https://www.wgal.com/article/pennsylvania-state-senate-district-48-gebhard-wins-2026/74218083' },
    ],
  },
];

const hand = new Set(input.map((c) => c.name));
const fromData: CountyInput[] = Object.entries(generated as Record<string, Omit<CountyInput, 'name'>>)
  .filter(([name]) => !hand.has(name))
  .map(([name, c]) => ({ name, ...c }));

export const counties: County[] = [...input, ...fromData]
  .map(withCensus)
  .sort((a, b) => a.name.localeCompare(b.name));
