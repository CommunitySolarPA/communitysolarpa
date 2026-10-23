// Utility data for /utilities pages and the ZIP lookup.
// Price to compare (cents per kWh, residential) as checked October 2026.
// Re-check regularly (several utilities change on June 1 and December 1) at https://www.papowerswitch.com/
import countyUtils from './county-utils.json';

export const ptcAsOf = 'October 2026';

export interface Utility {
  slug: string;
  code: string; // single-letter code used in public/data/pa-zips.json
  name: string;
  fullName: string;
  parent: string;
  region: string;
  ptc: number;
  cities: string[];
  note: string;
  website: string;
}

export const utilities: Utility[] = [
  {
    slug: 'peco',
    code: 'c',
    name: 'PECO',
    fullName: 'PECO Energy Company',
    parent: 'Exelon',
    region: 'Philadelphia and its suburbs in southeastern Pennsylvania',
    ptc: 11.76,
    cities: ['Philadelphia', 'Norristown', 'West Chester', 'Media', 'Chester', 'Doylestown', 'Phoenixville'],
    note: 'PECO serves the most densely populated part of the state, including Philadelphia, where many households rent and have no roof of their own to put panels on. That makes the PECO area one of the places community solar could reach the most people.',
    website: 'https://www.peco.com/',
  },
  {
    slug: 'ppl',
    code: 'l',
    name: 'PPL',
    fullName: 'PPL Electric Utilities',
    parent: 'PPL Corporation',
    region: 'Central and eastern Pennsylvania, from the Lehigh Valley to the Susquehanna Valley',
    ptc: 13.08,
    cities: ['Allentown', 'Bethlehem', 'Scranton', 'Wilkes-Barre', 'Harrisburg', 'Lancaster', 'Hazleton', 'Pottsville', 'Carlisle'],
    note: 'PPL covers a wide mix of cities, small towns, and farmland. Farmland and large rooftops in the region are the kinds of sites where community solar projects are often built.',
    website: 'https://www.pplelectric.com/',
  },
  {
    slug: 'duquesne-light',
    code: 'd',
    name: 'Duquesne Light',
    fullName: 'Duquesne Light Company',
    parent: 'Duquesne Light Holdings',
    region: 'Pittsburgh and most of Allegheny and Beaver counties',
    ptc: 14.14,
    cities: ['Pittsburgh', 'McKeesport', 'Monroeville', 'Coraopolis'],
    note: 'Duquesne Light has a compact, mostly urban and suburban territory. Former industrial sites and large rooftops around Pittsburgh are possible homes for community solar projects, and HB 504 allows bigger projects on brownfields and rooftops.',
    website: 'https://www.duquesnelight.com/',
  },
  {
    slug: 'met-ed',
    code: 'm',
    name: 'Met-Ed',
    fullName: 'Metropolitan Edison (Met-Ed)',
    parent: 'FirstEnergy Pennsylvania',
    region: 'South-central and eastern Pennsylvania, including Berks, York, and Lebanon counties',
    ptc: 13.95,
    cities: ['Reading', 'York', 'Easton', 'Lebanon', 'Gettysburg', 'Hanover', 'Stroudsburg'],
    note: 'Met-Ed is one of four FirstEnergy Pennsylvania service areas. Each one keeps its own price to compare, so Met-Ed customers compare against the Met-Ed price, not a statewide FirstEnergy price.',
    website: 'https://www.firstenergycorp.com/',
  },
  {
    slug: 'penelec',
    code: 'e',
    name: 'Penelec',
    fullName: 'Pennsylvania Electric Company (Penelec)',
    parent: 'FirstEnergy Pennsylvania',
    region: 'Northern and west-central Pennsylvania, from Erie to the Southern Tier',
    ptc: 13.14,
    cities: ['Erie', 'Altoona', 'Johnstown', 'Meadville', 'Warren', 'Bradford', 'Towanda'],
    note: 'Penelec covers a large, mostly rural territory. In rural areas, community solar can bring the benefits of solar to households whose homes are shaded or not suited for panels.',
    website: 'https://www.firstenergycorp.com/',
  },
  {
    slug: 'penn-power',
    code: 'p',
    name: 'Penn Power',
    fullName: 'Pennsylvania Power Company (Penn Power)',
    parent: 'FirstEnergy Pennsylvania',
    region: 'Western Pennsylvania along the Ohio border, mainly Lawrence, Mercer, and parts of Butler and Beaver counties',
    ptc: 13.48,
    cities: ['New Castle', 'Ellwood City', 'Sharon', 'Hermitage'],
    note: 'Penn Power is the smallest of the four FirstEnergy Pennsylvania service areas. Because a community solar project has to connect to the same utility as its subscribers, Penn Power customers would subscribe to projects built inside the Penn Power area.',
    website: 'https://www.firstenergycorp.com/',
  },
  {
    slug: 'west-penn-power',
    code: 'w',
    name: 'West Penn Power',
    fullName: 'West Penn Power',
    parent: 'FirstEnergy Pennsylvania',
    region: 'Southwestern and central Pennsylvania, from Washington and Greene counties to State College',
    ptc: 12.07,
    cities: ['Greensburg', 'Washington', 'Uniontown', 'Latrobe', 'Waynesburg', 'Kittanning', 'State College'],
    note: 'West Penn Power covers a long stretch of the state, from former coal country in the southwest to the State College area. Reclaimed mine land and other former industrial sites in the region are often discussed as places for solar.',
    website: 'https://www.firstenergycorp.com/',
  },
];

export const smallUtilities = [
  { code: 'u', name: 'UGI Electric', area: 'parts of Luzerne and Wyoming counties' },
  { code: 'z', name: "Citizens' Electric", area: 'the Lewisburg area in Union County' },
  { code: 'b', name: 'Wellsboro Electric', area: 'the Wellsboro area in Tioga County' },
  { code: 'k', name: 'Pike County Light & Power', area: 'the Milford area in Pike County' },
];

export const byCode: Record<string, Utility> = Object.fromEntries(utilities.map((u) => [u.code, u]));

const cu = countyUtils as Record<string, Record<string, number>>;

/** Counties a utility serves, split into mostly-served and partly-served. */
export function countiesFor(code: string) {
  const main: string[] = [];
  const part: string[] = [];
  for (const [county, shares] of Object.entries(cu)) {
    const s = shares[code];
    if (s === undefined) continue;
    (s >= 0.5 ? main : part).push(county);
  }
  return { main: main.sort(), part: part.sort() };
}
