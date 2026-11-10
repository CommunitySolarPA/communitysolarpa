import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

// Sitemap <lastmod>: the last git commit that touched the files a page is built from.
// Shared layout changes (header, footer, analytics) are left out on purpose, so a date
// only moves when the page's own content changes. If git history isn't available
// (for example a shallow clone in CI), lastmod is simply omitted.
function gitDate(files) {
  try {
    if (execSync('git rev-parse --is-shallow-repository').toString().trim() === 'true') return undefined;
    const paths = files.filter((f) => existsSync(f));
    if (!paths.length) return undefined;
    const out = execSync(`git log -1 --format=%cI -- ${paths.map((p) => `"${p}"`).join(' ')}`).toString().trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

const countyFiles = ['src/pages/counties/[slug].astro', 'src/data/counties.ts', 'src/data/county-notes.json', 'src/data/county-acs.json', 'public/data/pa-zips.json', 'src/data/utilities.ts'];
const utilityFiles = ['src/pages/utilities/[slug].astro', 'src/data/utilities.ts', 'src/data/county-utils.json'];

function sourcesFor(pathname) {
  const p = pathname.replace(/^\/|\/$/g, '');
  if (p === '') return ['src/pages/index.astro'];
  if (p === 'counties') return ['src/pages/counties/index.astro', 'src/data/county-utils.json'];
  if (p.startsWith('counties/')) return countyFiles;
  if (p === 'utilities') return ['src/pages/utilities/index.astro', 'src/data/utilities.ts'];
  if (p.startsWith('utilities/')) return utilityFiles;
  if (p === 'updates') return ['src/pages/updates/index.astro', 'src/content/updates'];
  if (p.startsWith('updates/')) return [`src/content/updates/${p.slice(8)}.md`];
  return [`src/pages/${p}.astro`];
}

export default defineConfig({
  site: 'https://communitysolarpa.org',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      serialize(item) {
        const lastmod = gitDate(sourcesFor(new URL(item.url).pathname));
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
});
