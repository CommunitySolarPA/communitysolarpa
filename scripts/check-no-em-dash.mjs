// Content rule: no em dashes anywhere in site content.
// Runs before every build; fails the build if one is found.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["src", "public"];
const EXTS = [".astro", ".md", ".mdx", ".ts", ".js", ".mjs", ".html", ".txt", ".json", ".svg"];
const BAD = [/—/g, /&mdash;/gi, /&#8212;/g, /&#x2014;/gi];

const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXTS.some((e) => p.endsWith(e))) {
      readFileSync(p, "utf8").split("\n").forEach((line, i) => {
        if (BAD.some((re) => line.match(re))) hits.push(`${p}:${i + 1}: ${line.trim()}`);
      });
    }
  }
}
ROOTS.forEach((r) => { try { walk(r); } catch {} });

if (hits.length) {
  console.error("\nBuild blocked: em dashes are not allowed in site content.\n");
  hits.forEach((h) => console.error("  " + h));
  console.error("\nRewrite with a period, comma, colon, or parentheses.\n");
  process.exit(1);
}
console.log("Content check passed: no em dashes.");
