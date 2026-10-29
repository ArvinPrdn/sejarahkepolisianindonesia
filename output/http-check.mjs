import assert from 'node:assert/strict';
import { request } from 'node:http';
import { once } from 'node:events';
import { gunzipSync } from 'node:zlib';
import { createMuseumServer } from '../server.mjs';
import { createSitemap, parseSiteUrl, renderPublicationMetadata } from '../build.mjs';

const server = await createMuseumServer();
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const port = server.address().port;
const origin = `http://127.0.0.1:${port}`;
const get = (path, options = {}) => new Promise((resolve, reject) => {
  const req = request({ hostname: '127.0.0.1', port, path, ...options }, response => {
    const chunks = [];
    response.on('data', chunk => chunks.push(chunk));
    response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks) }));
  });
  req.on('error', reject);
  req.end();
});

try {
  const page = await get('/');
  assert.equal(page.status, 200);
  assert.match(page.headers['content-type'], /text\/html/);
  assert.match(page.body.toString(), new RegExp(`<link rel="canonical" href="${origin}/"`));
  assert.ok(page.body.toString().includes(`content="${origin}/assets/social-cover.png"`));
  assert.ok(!page.body.toString().includes('data-runtime-'));
  assert.ok(page.body.toString().includes('static-periods'), 'Timeline fallback must be present in delivered HTML.');
  assert.ok(page.body.toString().includes('static-roadmap'), 'Roadmap fallback must be present in delivered HTML.');
  assert.equal(page.headers['x-content-type-options'], 'nosniff');
  assert.match(page.headers['content-security-policy'], /object-src 'none'/);
  assert.equal((await get('/', { method: 'HEAD' })).body.length, 0);
  assert.equal((await get('/', { method: 'POST' })).status, 405);
  assert.equal((await get('/%zz')).status, 400);
  assert.equal((await get('/%2e%2e/package.json')).status, 403);
  assert.equal((await get('/..%5cpackage.json')).status, 403);
  for (const path of ['/README.md', '/package.json', '/server.mjs', '/source-ledger.md', '/output/verification.md', '/.git/config', '/assets/photos/commons-53764573.json']) {
    const blocked = await get(path);
    assert.equal(blocked.status, 404, path);
    assert.match(blocked.body.toString(), /Ruang ini belum ditemukan/);
  }
  const source = await get('/sources.html');
  assert.equal(source.status, 200);
  assert.ok(source.body.toString().includes(`href="${origin}/sources.html"`));
  // Every local link in the delivered pages must resolve through the public server.
  const publicPages = new Map([['/', page], ['/sources.html', source]]);
  const checked = new Map(publicPages);
  for (const [path, response] of publicPages) {
    const document = response.body.toString();
    for (const match of document.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const url = new URL(match[1].replaceAll('&amp;', '&'), `${origin}${path}`);
      if (url.origin !== origin) continue;
      let target = checked.get(url.pathname);
      if (!target) {
        target = await get(url.pathname);
        checked.set(url.pathname, target);
      }
      assert.equal(target.status, 200, `Broken public link: ${path} → ${match[1]}`);
      if (url.hash && /text\/html/.test(target.headers['content-type'])) {
        const fragment = decodeURIComponent(url.hash.slice(1));
        assert.ok(target.body.toString().includes(`id="${fragment}"`), `Missing destination: ${path} → ${match[1]}`);
      }
    }
  }
  const asset = await get('/assets/social-cover.png');
  assert.equal(asset.status, 200);
  assert.equal(asset.headers['content-type'], 'image/png');
  const module = await get('/content.mjs');
  assert.equal(module.status, 200);
  assert.match(module.headers['content-type'], /javascript/);
  assert.equal((await get('/', { headers: { 'If-None-Match': page.headers.etag } })).status, 304);
  const compressed = await get('/', { headers: { 'Accept-Encoding': 'gzip' } });
  assert.equal(compressed.headers['content-encoding'], 'gzip');
  assert.equal(gunzipSync(compressed.body).toString(), page.body.toString());
  assert.ok(compressed.body.length < page.body.length);
  assert.equal((await get('/', { headers: { Host: 'attacker.invalid' } })).status, 400);
  assert.equal((await get('/sitemap.xml')).status, 200);
  assert.ok((await get('/robots.txt')).body.toString().includes(`${origin}/sitemap.xml`));

  const sample = '<head><!-- PUBLICATION_METADATA --></head>';
  const final = renderPublicationMetadata(sample, 'https://archive.example.test/exhibit/', 'sources.html');
  assert.ok(final.includes('href="https://archive.example.test/exhibit/sources.html"'));
  assert.ok(final.includes('content="https://archive.example.test/exhibit/assets/social-cover.png"'));
  assert.ok(!renderPublicationMetadata(sample, null).includes('rel="canonical"'));
  assert.ok(createSitemap('https://archive.example.test/exhibit/').includes('https://archive.example.test/exhibit/sources.html'));
  assert.throws(() => parseSiteUrl('https://user:pass@example.test/'));
  assert.throws(() => parseSiteUrl('file:///tmp/archive'));
  assert.throws(() => parseSiteUrl('https://example.test/?tracking=1'));
  console.log('HTTP checks passed: public pages and local destinations, metadata, method/host/path guards, private-file denylist, MIME, conditional requests, compression, robots, sitemap, and publication URL validation.');
} finally {
  server.close();
  await once(server, 'close');
}
