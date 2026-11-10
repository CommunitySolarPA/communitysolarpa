// Generates dist/llms.txt and dist/llms-full.txt from the built HTML pages.
// Runs after `astro build`, so every new page (utility, county, update) is picked up automatically.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SITE = 'https://communitysolarpa.org';
const DIST = 'dist';
const SKIP = new Set(['/404']);

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });
}

const decode = (s) =>
  s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
   .replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&apos;/g, "'")
   .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
   .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

const meta = (html, re) => decode((html.match(re) || [])[1] || '').trim();

function toText(html) {
  let m = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [])[1] || '';
  m = m.replace(/<section id="notify"[^>]*>[\s\S]*?<\/section>/i, '')
       .replace(/<label[^>]*for="est-kwh"[\s\S]*?<\/dl>/gi, '(Interactive bill estimator on the page.)')
       .replace(/<(script|style|form|noscript|svg|button|select)[\s\S]*?<\/\1>/gi, '')
       .replace(/\s+/g, ' ');
  m = m.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n')
       .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n')
       .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n')
       .replace(/<li[^>]*>/gi, '\n- ')
       .replace(/<tr[^>]*>/gi, '\n- ')
       .replace(/<\/t[dh]>/gi, ' | ')
       .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, t) => {
         const url = href.startsWith('/') ? SITE + href : href;
         return href.startsWith('#') || href.startsWith('mailto:') ? t : `[${t}](${url})`;
       })
       .replace(/<\/(p|div|ul|ol|table|section|details|summary)>/gi, '\n\n')
       .replace(/<br\s*\/?>/gi, '\n')
       .replace(/<[^>]+>/g, '');
  return decode(m)
    .split('\n').map((l) => l.replace(/[ \t]+/g, ' ').replace(/ \| *$/, '').trim()).join('\n')
    .replace(/\n{3,}/g, '\n\n').trim();
}

const pages = walk(DIST).map((file) => {
  let route = '/' + relative(DIST, file).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '');
  route = route.replace(/\/$/, '') || '/';
  const html = readFileSync(file, 'utf8');
  return {
    route,
    url: SITE + (route === '/' ? '/' : route),
    title: meta(html, /<title>([\s\S]*?)<\/title>/i).replace(/ \| CommunitySolarPA$/, ''),
    description: meta(html, /<meta name="description" content="([^"]*)"/i),
    text: toText(html),
  };
}).filter((p) => !SKIP.has(p.route));

const groups = [
  ['Start here', (r) => ['/', '/what-is-community-solar', '/why-community-solar', '/pennsylvania'].includes(r)],
  ['Tools', (r) => r === '/zip-lookup'],
  ['Pennsylvania utility guides', (r) => r.startsWith('/utilities')],
  ['County guides', (r) => r.startsWith('/counties')],
  ['Updates', (r) => r.startsWith('/updates')],
  ['About', (r) => ['/about'].includes(r)],
  ['Optional', () => true],
];
const order = ['/', '/what-is-community-solar', '/why-community-solar', '/pennsylvania', '/utilities', '/updates'];
const rank = (p) => { const i = order.indexOf(p.route); return i < 0 ? 99 : i; };
pages.sort((a, b) => rank(a) - rank(b) || a.route.localeCompare(b.route));

const used = new Set();
let llms = `# CommunitySolarPA

> CommunitySolarPA.org is a Pennsylvania community solar information project: what it is, how it works, which utilities and areas it would cover, and the status of the state's community solar bill (HB 504). Pennsylvania does not have a community solar program yet.

Key facts:
- Community solar lets households subscribe to a share of a local solar project and receive credits on their electric bill, with no panels on their own roof. Renters and apartment residents can take part.
- Pennsylvania HB 504 passed the State House in May 2025 and is pending in the State Senate. Program details on this site describe the bill as passed by the House and may change.
- Utility pages cover PECO, PPL, Duquesne Light, Met-Ed, Penelec, Penn Power and West Penn Power. Savings figures on the site are illustrative, not guaranteed.
- Contact: hello@communitysolarpa.org. Full text of every page: ${SITE}/llms-full.txt
`;
for (const [name, test] of groups) {
  const items = pages.filter((p) => !used.has(p.route) && test(p.route));
  if (!items.length) continue;
  items.forEach((p) => used.add(p.route));
  llms += `\n## ${name}\n\n` + items.map((p) => `- [${p.title}](${p.url})${p.description ? `: ${p.description}` : ''}`).join('\n') + '\n';
}

const built = new Date().toISOString().slice(0, 10);
let full = `# CommunitySolarPA: full site text\n\nSource: ${SITE}. Generated ${built}. Index: ${SITE}/llms.txt\n`;
for (const p of pages) full += `\n\n---\n\nURL: ${p.url}\n\n${p.text}\n`;

writeFileSync(join(DIST, 'llms.txt'), llms);
writeFileSync(join(DIST, 'llms-full.txt'), full);
console.log(`llms.txt: ${pages.length} pages; llms-full.txt: ${(full.length / 1024).toFixed(0)} KB`);
