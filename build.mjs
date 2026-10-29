import { cp, mkdir, readFile, realpath, rm, writeFile, lstat } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderStaticContent } from './render-content.mjs';

export const projectRoot = dirname(fileURLToPath(import.meta.url));
export const publicFiles = ['index.html', 'sources.html', '404.html', 'styles.css', 'script.js', 'content.mjs', 'robots.txt'];

export function parseSiteUrl(value) {
  if (!value) return null;
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('SITE_URL harus berupa alamat HTTP(S) tanpa akun, query, atau fragmen.');
  }
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url;
}

const escapeAttribute = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function renderPublicationMetadata(html, siteUrl, page = 'index.html') {
  // Remove obsolete runtime tags so a crawler sees exactly one authoritative value.
  const clean = html.replace(/<(?:meta|link)\b[^>]*(?:property|name|rel)\s*=\s*["'](?:og:url|og:image|twitter:image|canonical)["'][^>]*>\s*/gi, '');
  const base = parseSiteUrl(siteUrl instanceof URL ? siteUrl.href : siteUrl);
  const metadata = base && page !== '404.html' ? (() => {
    const canonical = escapeAttribute(new URL(page === 'index.html' ? './' : page, base).href);
    const image = escapeAttribute(new URL('assets/social-cover.png', base).href);
    return `<link rel="canonical" href="${canonical}" />\n    <meta property="og:url" content="${canonical}" />\n    <meta property="og:image" content="${image}" />\n    <meta name="twitter:image" content="${image}" />`;
  })() : '';
  const prepared = page === '404.html' && base
    ? clean.replace('href="/assets/fonts/fonts.css"', `href="${escapeAttribute(new URL('assets/fonts/fonts.css', base).href)}"`).replace('href="/"', `href="${escapeAttribute(base.href)}"`)
    : clean;
  return prepared.includes('<!-- PUBLICATION_METADATA -->')
    ? prepared.replace('<!-- PUBLICATION_METADATA -->', metadata)
    : prepared.replace('</head>', `    ${metadata}\n  </head>`);
}

export function createRobots(siteUrl) {
  const base = parseSiteUrl(siteUrl instanceof URL ? siteUrl.href : siteUrl);
  return `User-agent: *\nAllow: /\n${base ? `\nSitemap: ${new URL('sitemap.xml', base).href}\n` : ''}`;
}

export function createSitemap(siteUrl) {
  const base = parseSiteUrl(siteUrl instanceof URL ? siteUrl.href : siteUrl);
  if (!base) return null;
  const urls = ['./', 'sources.html'].map(page => `  <url><loc>${escapeAttribute(new URL(page, base).href)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export async function buildSite(siteUrl) {
  const base = parseSiteUrl(siteUrl);
  const source = await realpath(projectRoot);
  const destination = resolve(source, 'dist');
  // Recursive removal is confined to the fixed output directory inside this project.
  if (relative(source, destination) !== 'dist' || !destination.startsWith(`${source}${sep}`)) {
    throw new Error('Direktori hasil build tidak valid.');
  }
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  for (const name of publicFiles) {
    const sourcePath = join(source, name);
    if (name.endsWith('.html')) {
      const original = await readFile(sourcePath, 'utf8');
      const enhanced = name === 'index.html' ? renderStaticContent(original) : original;
      await writeFile(join(destination, name), renderPublicationMetadata(enhanced, base, name));
    } else if (name === 'robots.txt') {
      await writeFile(join(destination, name), createRobots(base));
    } else {
      await cp(sourcePath, join(destination, name));
    }
  }
  await cp(join(source, 'assets'), join(destination, 'assets'), {
    recursive: true,
    filter: async path => {
      const child = relative(source, path);
      if (isAbsolute(child) || child.startsWith(`..${sep}`) || child.split(sep).some(part => part.startsWith('.'))) return false;
      if (/^commons-.*\.json$/i.test(child.split(sep).at(-1))) return false;
      return !(await lstat(path)).isSymbolicLink();
    },
  });
  const sitemap = createSitemap(base);
  if (sitemap) await writeFile(join(destination, 'sitemap.xml'), sitemap);
  console.log(`Build selesai: ${destination}`);
  console.log(base ? `Metadata publikasi: ${base.href}` : 'Domain belum ditetapkan: canonical dan URL gambar sosial tidak diisi. Jalankan ulang build dengan --url saat alamat final tersedia.');
  return destination;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const index = args.indexOf('--url');
  if (index >= 0 && !args[index + 1]) throw new Error('Isi alamat situs setelah --url.');
  const unknown = args.filter((_, position) => position !== index && position !== index + 1);
  if (index < 0 && args.length || index >= 0 && unknown.length) throw new Error('Gunakan node build.mjs [--url ALAMAT_SITUS].');
  const productionUrl = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);
  await buildSite(index >= 0 ? args[index + 1] : productionUrl);
}
