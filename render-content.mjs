import { periods, artifacts, reformLenses, evidence, roadmap } from './content.mjs';

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const sourceLink = (href, label = 'Baca sumber') => `<a class="text-link" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;

function renderPeriodFallback() {
  return `<div class="static-fallback static-periods">${periods.map((p, i) => `<details${i === 0 ? ' open' : ''}><summary><span>${escapeHtml(p.year)}</span> ${escapeHtml(p.title)}</summary><p>${escapeHtml(p.summary)}</p><p class="source-note">${escapeHtml(p.source)}</p>${sourceLink(p.sourceHref)}</details>`).join('')}</div>`;
}

function renderArtifactFallback() {
  return `<div class="static-fallback static-collection">${artifacts.map(a => `<article><p class="eyebrow">${escapeHtml(a.date)}</p><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.copy)}</p><p class="source-note">${escapeHtml(a.source)}</p>${sourceLink(a.sourceHref)}</article>`).join('')}</div>`;
}

function renderReformFallback() {
  return `<div class="static-fallback static-lenses">${reformLenses.map(l => `<article><h3>${escapeHtml(l.title)}</h3><p>${escapeHtml(l.copy)}</p><p class="source-note">${escapeHtml(l.evidence)}</p></article>`).join('')}</div>`;
}

function renderEvidenceFallback() {
  return `<div class="static-fallback static-evidence">${evidence.map(e => `<article><p class="eyebrow">${escapeHtml(e.date)}</p><span class="evidence-status">${escapeHtml(e.status)}</span><h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(e.copy)}</p><dl><div><dt>Indikator</dt><dd>${escapeHtml(e.indicator)}</dd></div><div><dt>Bukti minimum</dt><dd>${escapeHtml(e.needs)}</dd></div></dl>${sourceLink(e.sourceHref)}</article>`).join('')}</div>`;
}

function renderRoadmapFallback() {
  const fields = [['target','Target usulan'],['baseline','Titik awal'],['measure','Ukuran'],['milestone','Tahapan'],['owner','Pelaksana usulan'],['budget','Kebutuhan biaya']];
  return `<div class="static-fallback static-roadmap">${roadmap.map(r => `<article><p class="eyebrow">${escapeHtml(r.year)}</p><h3>${escapeHtml(r.title)}</h3><dl>${fields.map(([key,label]) => `<div><dt>${label}</dt><dd>${escapeHtml(r[key])}</dd></div>`).join('')}</dl></article>`).join('')}</div>`;
}

const renderers = {TIMELINE: renderPeriodFallback, ARTIFACTS: renderArtifactFallback, REFORM: renderReformFallback, EVIDENCE: renderEvidenceFallback, ROADMAP: renderRoadmapFallback};

export function renderStaticContent(html) {
  let result = html;
  for (const [name, render] of Object.entries(renderers)) {
    const start = `<!-- STATIC_${name} -->`;
    const end = `<!-- /STATIC_${name} -->`;
    const startAt = result.indexOf(start);
    const endAt = result.indexOf(end);
    if (startAt !== -1 && endAt > startAt) result = result.slice(0, startAt + start.length) + '\n' + render() + '\n' + result.slice(endAt);
  }
  return result;
}
