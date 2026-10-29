import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { readFile, realpath, stat } from 'node:fs/promises';
import { brotliCompressSync, constants as zlibConstants, gzipSync } from 'node:zlib';
import { extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRobots, createSitemap, parseSiteUrl, publicFiles, renderPublicationMetadata } from './build.mjs';
import { renderStaticContent } from './render-content.mjs';

const defaultRoot = fileURLToPath(new URL('.', import.meta.url));
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
};
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'",
};

export async function createMuseumServer({ rootDirectory = defaultRoot, siteUrl = process.env.SITE_URL } = {}) {
  const root = await realpath(rootDirectory);
  const configuredUrl = parseSiteUrl(siteUrl);
  const isWithinRoot = path => {
    const child = relative(root, path);
    return child !== '..' && !child.startsWith(`..${sep}`) && !isAbsolute(child);
  };

  return createServer(async (req, res) => {
    const respond = (status, body, contentType = 'text/plain; charset=utf-8', extras = {}) => {
      const original = Buffer.isBuffer(body) ? body : Buffer.from(body);
      let payload = original;
      let encoding;
      if (original.length > 1024 && /^(text\/|application\/(?:json|xml)|image\/svg)/.test(contentType)) {
        const accepted = String(req.headers['accept-encoding'] || '').split(',').map(item => item.trim());
        const allows = name => accepted.some(item => item.split(';')[0] === name && !/;\s*q=0(?:\.0*)?$/.test(item));
        if (allows('br')) { encoding = 'br'; payload = brotliCompressSync(original, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 4 } }); }
        else if (allows('gzip')) { encoding = 'gzip'; payload = gzipSync(original); }
      }
      const etag = `"${createHash('sha256').update(payload).digest('hex').slice(0, 24)}"`;
      const headers = {
        ...securityHeaders, 'Content-Type': contentType,
        'Content-Length': payload.length, 'Cache-Control': 'no-cache',
        ETag: etag, Vary: 'Accept-Encoding', ...extras,
        ...(encoding ? { 'Content-Encoding': encoding } : {}),
      };
      const candidates = String(req.headers['if-none-match'] || '').split(',').map(value => value.trim().replace(/^W\//, ''));
      const unchanged = candidates.includes(etag) || candidates.includes('*');
      if (status === 200 && unchanged) {
        delete headers['Content-Length'];
        res.writeHead(304, headers);
        res.end();
        return;
      }
      res.writeHead(status, headers);
      res.end(req.method === 'HEAD' ? undefined : payload);
    };
    const fail = (status, message, extras) => respond(status, `${message}\n`, 'text/plain; charset=utf-8', { 'Cache-Control': 'no-store', ...extras });

    if (!['GET', 'HEAD'].includes(req.method)) {
      fail(405, 'Metode tidak diizinkan.', { Allow: 'GET, HEAD' });
      return;
    }

    let base;
    try {
      if (configuredUrl) base = configuredUrl;
      else {
        const host = String(req.headers.host || '');
        if (!/^[A-Za-z0-9.:[\]-]+$/.test(host)) throw new Error('Host tidak valid.');
        const origin = new URL(`http://${host}`);
        // Local development has a fixed host policy. Use SITE_URL for a public server.
        if (!['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) throw new Error('Host belum dikonfigurasi.');
        base = origin;
      }
    } catch {
      fail(400, 'Alamat host tidak valid.');
      return;
    }

    let requested;
    try { requested = decodeURIComponent((req.url || '/').split(/[?#]/, 1)[0]).replace(/\\/g, '/'); }
    catch { fail(400, 'Alamat tidak valid.'); return; }
    if (!requested.startsWith('/') || requested.includes('\0')) { fail(400, 'Alamat tidak valid.'); return; }
    if (requested.split('/').includes('..')) { fail(403, 'Akses tidak diizinkan.'); return; }
    const basePath = configuredUrl?.pathname || '/';
    if (basePath !== '/') {
      if (!requested.startsWith(basePath)) { fail(404, 'Halaman tidak ditemukan.'); return; }
      requested = `/${requested.slice(basePath.length)}`;
    }
    const publicName = requested === '/' ? 'index.html' : requested.slice(1);
    const publicAsset = publicName.startsWith('assets/') && !publicName.split('/').some(part => part.startsWith('.')) && !/^commons-.*\.json$/i.test(publicName.split('/').at(-1)) && !!mime[extname(publicName).toLowerCase()];
    const allowed = publicFiles.includes(publicName) || publicAsset || publicName === 'sitemap.xml';

    try {
      if (!allowed) {
        const body = renderPublicationMetadata(await readFile(join(root, '404.html'), 'utf8'), base, '404.html');
        respond(404, body, mime['.html'], { 'Cache-Control': 'no-store' });
        return;
      }
      if (publicName === 'robots.txt') { respond(200, createRobots(base), mime['.txt']); return; }
      if (publicName === 'sitemap.xml') { respond(200, createSitemap(base), mime['.xml']); return; }
      const path = await realpath(resolve(root, publicName));
      if (!isWithinRoot(path)) { fail(403, 'Akses tidak diizinkan.'); return; }
      const file = await stat(path);
      if (!file.isFile()) { fail(404, 'Halaman tidak ditemukan.'); return; }
      const extension = extname(path).toLowerCase();
      let body = await readFile(path);
      if (extension === '.html') {
        let html = body.toString('utf8');
        if (publicName === 'index.html') html = renderStaticContent(html);
        body = renderPublicationMetadata(html, base, publicName);
      }
      const longLived = /\.(?:woff2?|png|jpe?g|svg|webp|avif|gif|ico)$/.test(path);
      respond(200, body, mime[extension] || 'application/octet-stream', {
        'Cache-Control': longLived ? 'public, max-age=3600, must-revalidate' : 'no-cache',
        ...(extension !== '.html' ? { 'Last-Modified': file.mtime.toUTCString() } : {}),
      });
    } catch (error) {
      const forbidden = ['EACCES', 'EPERM'].includes(error.code);
      if (!forbidden && ['ENOENT', 'ENOTDIR'].includes(error.code)) {
        try {
          const body = renderPublicationMetadata(await readFile(join(root, '404.html'), 'utf8'), base, '404.html');
          respond(404, body, mime['.html'], { 'Cache-Control': 'no-store' });
        } catch { fail(404, 'Halaman tidak ditemukan.'); }
      } else {
        fail(forbidden ? 403 : 500, forbidden ? 'Akses tidak diizinkan.' : 'Halaman belum dapat dimuat.');
      }
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4173);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT harus berupa angka antara 0 dan 65535.');
  const server = await createMuseumServer();
  server.listen(port, '127.0.0.1', () => console.log(`The Living Archive berjalan di http://localhost:${server.address().port}`));
}
