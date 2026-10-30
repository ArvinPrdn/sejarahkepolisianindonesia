import { periods, artifacts, reformLenses, evidence, roadmap, frameStories } from './content.mjs';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea,select,summary,[tabindex]:not([tabindex="-1"])';
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior = () => reducedMotion() ? 'auto' : 'smooth';
const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const imageFor = (item, fallback) => typeof item.image === 'string' ? item.image : item.image?.src || item.src || fallback;
const linksFor = item => item.sourceLinks || (item.sourceHref ? [{href:item.sourceHref,label:'Sumber dan catatan'}] : []);
const linksHtml = item => linksFor(item).map(link => `<a href="${esc(link.href)}"${/^https?:/.test(link.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(link.label || 'Baca sumber')} <span aria-hidden="true">↗</span></a>`).join(' ');

function onMediaChange(query, callback) {
  if (query.addEventListener) query.addEventListener('change', callback);
  else if (query.addListener) query.addListener(callback);
}
function enhanceSection(id) {
  const section = document.getElementById(id);
  if (!section) return;
  $$('[data-enhanced-content]', section).forEach(element => { element.hidden = false; });
  $$('.static-fallback', section).forEach(element => { element.hidden = true; });
  section.classList.add('has-enhancement');
}
let liveRegion;
function announce(message) {
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('role','status');
    document.body.append(liveRegion);
  }
  liveRegion.textContent = message;
}
const routeSubscribers = [];
function notifyRoute() {
  routeSubscribers.forEach(callback => {
    try { callback(new URL(location.href)); }
    catch (error) { console.error('Gagal memperbarui tampilan ruang.',error); }
  });
}
function subscribeRoute(callback) {
  routeSubscribers.push(callback);
  callback(new URL(location.href));
}
function routeIndex(url, name, length) {
  const value = Number(url.searchParams.get(name));
  return Number.isInteger(value) && value >= 1 && value <= length ? value - 1 : null;
}
function writeRoute(patch, {replace = false, hash, modal = false} = {}) {
  const url = new URL(location.href);
  Object.entries(patch).forEach(([name,value]) => {
    if (value === null || value === undefined) url.searchParams.delete(name);
    else url.searchParams.set(name,String(value));
  });
  if (hash !== undefined) url.hash = hash;
  const state = {...history.state,archive:true};
  if (modal) state.archiveModalReturn = history.state?.archiveModalReturn || location.href;
  else delete state.archiveModalReturn;
  if (url.href === location.href) return;
  history[replace ? 'replaceState' : 'pushState'](state,'',url);
  notifyRoute();
}
function closeModalRoute(name) {
  if (history.state?.archiveModalReturn) history.back();
  else writeRoute({[name]:null},{replace:true});
}
window.addEventListener('popstate',notifyRoute);
function focusDestination(target, {scroll = true} = {}) {
  if (!target) return;
  const focusTarget = target.matches('h1,h2,h3,a,button,[tabindex]') ? target : $('h1,h2,h3',target) || target;
  if (!focusTarget.hasAttribute('tabindex') && !focusTarget.matches('a,button')) focusTarget.setAttribute('tabindex','-1');
  focusTarget.focus({preventScroll:true});
  if (scroll) target.scrollIntoView({behavior:scrollBehavior(),block:'start'});
}
function dialogController(dialog) {
  let returnFocus, background = [];
  document.addEventListener('keydown',event => {
    if (dialog.hidden) return;
    if (event.key === 'Escape') {event.preventDefault();dialog.__close?.();return;}
    if (event.key !== 'Tab') return;
    const items = $$(FOCUSABLE,dialog).filter(element => element.getClientRects().length && !element.closest('[hidden]'));
    const first = items[0], last = items[items.length - 1];
    if (!first) {event.preventDefault();return;}
    if (!dialog.contains(document.activeElement)) {event.preventDefault();first.focus();}
    else if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  });
  return {
    open(trigger) {
      if (!dialog.hidden) return;
      returnFocus = trigger || document.activeElement;
      dialog.hidden = false;
      background = [...document.body.children].filter(element => element !== dialog && !['SCRIPT','STYLE'].includes(element.tagName) && !element.inert);
      background.forEach(element => {element.inert = true;});
      document.body.classList.add('modal-open');
      requestAnimationFrame(() => $(FOCUSABLE,dialog)?.focus({preventScroll:true}));
    },
    close({restoreFocus = true} = {}) {
      if (dialog.hidden) return;
      dialog.hidden = true;
      background.forEach(element => {element.inert = false;});
      background = [];
      if (!$('[role="dialog"]:not([hidden])')) document.body.classList.remove('modal-open');
      if (restoreFocus && returnFocus && document.contains(returnFocus)) returnFocus.focus({preventScroll:true});
    }
  };
}
function initHeader() {
  const header = $('[data-header]'), toggle = $('.nav-toggle'), nav = $('#site-nav'), readout = $('#scroll-readout');
  if (!header || !toggle || !nav) return;
  const closeMenu = (restoreFocus = false) => {
    toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');
    if (restoreFocus) toggle.focus();
  };
  let scheduled = false;
  const update = () => {
    scheduled = false;
    header.classList.toggle('is-scrolled',scrollY > 36);
    const maximum = Math.max(document.documentElement.scrollHeight - innerHeight,1);
    if (readout) readout.textContent = `${String(Math.min(100,Math.max(0,Math.round(scrollY / maximum * 100)))).padStart(2,'0')}%`;
  };
  window.addEventListener('scroll',() => {if (!scheduled) {scheduled = true;requestAnimationFrame(update);}}, {passive:true});
  window.addEventListener('resize',update);
  toggle.addEventListener('click',() => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('is-open',!open);
  });
  $$('a',nav).forEach(link => link.addEventListener('click',() => closeMenu()));
  document.addEventListener('keydown',event => {if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true);});
  document.addEventListener('click',event => {if (!header.contains(event.target)) closeMenu();});
  header.addEventListener('focusout',() => requestAnimationFrame(() => {if (!header.contains(document.activeElement)) closeMenu();}));
  onMediaChange(matchMedia('(min-width:801px)'),() => closeMenu());
  update();
}
function initRoomNav() {
  const rooms = $$('[data-room-link]').map(link => ({link,section:document.getElementById(link.dataset.roomLink)})).filter(room => room.section);
  if (!rooms.length) return;
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const passed = rooms.filter(room => room.section.getBoundingClientRect().top <= innerHeight * .34);
    const current = passed[passed.length - 1] || rooms[0];
    rooms.forEach(({link}) => {
      const active = link === current.link;
      link.classList.toggle('is-active',active);
      if (active) link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    });
    const index = rooms.indexOf(current) + 1, brand = $('.brand-copy small');
    if (brand) brand.textContent = `MUSEUM DIGITAL · ${String(index).padStart(2,'0')}/${String(rooms.length).padStart(2,'0')}`;
    const label = $('#room-current-label');
    if (label) label.textContent = $('i',current.link)?.textContent || current.link.getAttribute('aria-label');
    $$('#site-nav a').forEach(link => {
      if (link.hash === current.link.hash) link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    });
  };
  const schedule = () => {if (!scheduled) {scheduled = true;requestAnimationFrame(update);}};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('load',update);
  update();
}
function initGallery() {
  const gallery = $('#opening-gallery');
  if (!gallery) return;
  const frames = $$('.museum-frame',gallery), previous = $('[data-gallery-prev]'), next = $('[data-gallery-next]'), label = $('#gallery-index');
  if (!frames.length || !previous || !next) return;
  let current = 0, scheduled = false;
  // Center targets allow the final card to be selected even when two cards fit.
  const targets = () => {
    const box = gallery.getBoundingClientRect(), maximum = Math.max(0,gallery.scrollWidth - gallery.clientWidth);
    return frames.map(frame => {
      const rect = frame.getBoundingClientRect();
      return Math.min(maximum,Math.max(0,rect.left - box.left + gallery.scrollLeft + rect.width / 2 - gallery.clientWidth / 2));
    });
  };
  const update = () => {
    scheduled = false;
    const maximum = Math.max(0,gallery.scrollWidth - gallery.clientWidth), positions = targets();
    if (maximum <= 2 || gallery.scrollLeft <= 2) current = 0;
    else if (gallery.scrollLeft >= maximum - 2) current = frames.length - 1;
    else current = positions.reduce((nearest,position,index) => Math.abs(position - gallery.scrollLeft) < Math.abs(positions[nearest] - gallery.scrollLeft) ? index : nearest,0);
    if (label) {label.textContent = `${String(current + 1).padStart(2,'0')} / ${String(frames.length).padStart(2,'0')}`;label.setAttribute('aria-live','polite');label.setAttribute('aria-atomic','true');}
    previous.disabled = maximum <= 2 || current === 0;next.disabled = maximum <= 2 || current === frames.length - 1;
  };
  const move = direction => {
    const destination = Math.min(frames.length - 1,Math.max(0,current + direction));
    gallery.scrollTo({left:targets()[destination],behavior:scrollBehavior()});
  };
  previous.addEventListener('click',() => move(-1));next.addEventListener('click',() => move(1));
  gallery.addEventListener('scroll',() => {if (!scheduled) {scheduled = true;requestAnimationFrame(update);}}, {passive:true});
  window.addEventListener('resize',update);update();
}
function initHero() {
  const title = $('.wall-title');
  if (title) requestAnimationFrame(() => title.classList.add('is-visible'));
}

function initFrameWall() {
  const wall = $('[data-frame-wall]'), viewer = $('#frame-viewer');
  if (!wall || !viewer) return;
  const frames = $$('.museum-frame',wall);
  if (!frames.length) return;
  const dialog = dialogController(viewer), photo = $('#viewer-photo');
  const inspectorTitle = $('#wall-inspector-title'), inspectorStatus = $('#wall-inspector-status');
  let activeIndex = null;
  const statusCopy = {rekonstruksi:'ILUSTRASI EDITORIAL','perlu verifikasi':'ILUSTRASI EDITORIAL',diagram:'DIAGRAM KONSEPTUAL',interpretasi:'CATATAN KURATORIAL',pertanyaan:'PERTANYAAN TERBUKA','foto-arsip':'FOTO ARSIP - LIHAT KREDIT','foto-dokumenter':'FOTO DOKUMENTER - LIHAT KREDIT'};
  const highlight = (index,selected = false) => {
    const story = frameStories[index];
    if (!story) return;
    frames.forEach((frame,position) => frame.classList.toggle('is-selected',selected && position === index));
    wall.classList.add('has-focus');
    if (inspectorTitle) inspectorTitle.textContent = story.title;
    if (inspectorStatus) inspectorStatus.textContent = statusCopy[frames[index].dataset.source] || story.meta;
  };
  const clearHighlight = () => {
    if (!viewer.hidden) return;
    wall.classList.remove('has-focus');frames.forEach(frame => frame.classList.remove('is-selected'));
    if (inspectorTitle) inspectorTitle.textContent = 'Pilih satu bingkai untuk membaca konteksnya';
    if (inspectorStatus) inspectorStatus.textContent = 'Lima objek · sejarah, struktur, dan pengalaman warga';
  };
  const open = index => {
    const story = frameStories[index];
    if (!story) return;
    const newlyOpened = viewer.hidden;
    activeIndex = index;highlight(index,true);
    $('#frame-viewer-meta').textContent = story.meta;$('#frame-viewer-title').textContent = story.title;
    $('#frame-viewer-copy').textContent = story.copy;$('#frame-viewer-source').textContent = story.credit;
    const frameNumber = `${String(index + 1).padStart(2,'0')} / ${String(frames.length).padStart(2,'0')}`;
    $('#viewer-photo-index').textContent = `ARSIP / ${String(index + 1).padStart(2,'0')}`;
    const dockIndex = $('#viewer-dock-index');
    if (dockIndex) dockIndex.textContent = frameNumber;
    const sourceLink = $('#frame-viewer-source-link');
    if (sourceLink) {sourceLink.href = story.sourceHref || linksFor(story)[0]?.href || 'sources.html#visuals';sourceLink.textContent = 'Sumber dan kredit visual ↗';}
    photo.className = `viewer-photo ${story.className || ''}`;
    photo.style.backgroundImage = `url("${imageFor(story,`assets/${['archive-origin','archive-revolution','archive-command','archive-public','archive-reform'][index]}.svg`)}")`;
    photo.setAttribute('role','img');photo.setAttribute('aria-label',story.alt || `${story.title}. ${story.credit}`);
    viewer.scrollTo({top:0,behavior:'auto'});
    if (newlyOpened) dialog.open(frames[index]);
    else {focusDestination($('#frame-viewer-title'),{scroll:false});announce(`Objek ${index + 1} dari ${frames.length}: ${story.title}`);}
  };
  const close = () => {dialog.close();activeIndex = null;clearHighlight();};
  viewer.__close = () => closeModalRoute('frame');
  frames.forEach((frame,index) => {
    frame.addEventListener('click',event => {event.preventDefault();writeRoute({frame:index + 1,artifact:null},{modal:true});});
    frame.addEventListener('pointerenter',() => highlight(index));frame.addEventListener('focus',() => highlight(index));
    frame.addEventListener('pointerleave',clearHighlight);frame.addEventListener('blur',clearHighlight);
  });
  const move = delta => writeRoute({frame:((activeIndex ?? 0) + delta + frames.length) % frames.length + 1,artifact:null},{replace:true,modal:true});
  $('[data-frame-prev]',viewer)?.addEventListener('click',() => move(-1));$('[data-frame-next]',viewer)?.addEventListener('click',() => move(1));
  $$('[data-close-frame]',viewer).forEach(element => element.addEventListener('click',() => {if (!element.hasAttribute('data-scroll-to')) closeModalRoute('frame');}));
  document.addEventListener('keydown',event => {
    if (viewer.hidden || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();move(event.key === 'ArrowRight' ? 1 : -1);
  });
  subscribeRoute(url => {
    const index = routeIndex(url,'artifact',artifacts.length) !== null ? null : routeIndex(url,'frame',frames.length);
    if (index === null) close();else if (index !== activeIndex || viewer.hidden) open(index);
  });
  if (!matchMedia('(pointer:coarse)').matches && !reducedMotion()) {
    let point, scheduled = false;
    wall.addEventListener('pointermove',event => {
      point = {x:event.clientX,y:event.clientY};
      if (scheduled) return;scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;if (!point || reducedMotion()) return;
        const rect = wall.getBoundingClientRect(), x = (point.x - rect.left) / rect.width - .5, y = (point.y - rect.top) / rect.height - .5;
        frames.forEach((frame,index) => {frame.style.setProperty('--tx',`${x * (index + 1) * 3}px`);frame.style.setProperty('--ty',`${y * (index + 1) * 3}px`);});
      });
    });
    wall.addEventListener('pointerleave',() => {point = null;frames.forEach(frame => {frame.style.setProperty('--tx','0px');frame.style.setProperty('--ty','0px');});});
  }
}
function initReveal() {
  if (!('IntersectionObserver' in window) || reducedMotion()) {$$('.reveal,[data-reveal-section]').forEach(element => element.classList.add('is-visible'));return;}
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
  $$('.reveal,[data-reveal-section]').forEach(element => observer.observe(element));
}
function initTabKeyboard(container, selector, dataName, length, choose) {
  container.addEventListener('keydown',event => {
    const current = event.target.closest(selector);
    if (!current || !['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key)) return;
    const horizontal = container.getAttribute('aria-orientation') === 'horizontal' || container.closest('[role="tablist"]')?.getAttribute('aria-orientation') === 'horizontal';
    if (horizontal && ['ArrowUp','ArrowDown'].includes(event.key) || !horizontal && ['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    let index = Number(current.dataset[dataName]);
    if (event.key === 'Home') index = 0;else if (event.key === 'End') index = length - 1;
    else index = (index + (['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1) + length) % length;
    choose(index);
    const next = $(`${selector}[data-${dataName}="${index}"]`,container);
    next?.focus({preventScroll:true});next?.scrollIntoView({behavior:scrollBehavior(),block:'nearest',inline:'nearest'});
  });
}
function renderTimeline() {
  const tabs = $('#timeline-tabs'), panel = $('#timeline-detail-panel'), visual = $('#timeline-object');
  if (!tabs || !panel || !visual || !periods.length) return;
  const assets = ['archive-origin','archive-revolution','archive-command','archive-public','archive-reform'];
  const compact = matchMedia('(max-width:800px)'), tablist = tabs.closest('[role="tablist"]') || tabs;
  const updateOrientation = () => tablist.setAttribute('aria-orientation',compact.matches ? 'horizontal' : 'vertical');
  updateOrientation();onMediaChange(compact,updateOrientation);panel.removeAttribute('aria-live');
  tabs.innerHTML = periods.map((period,index) => `<button type="button" id="period-tab-${index}" class="timeline-tab" role="tab" aria-selected="false" aria-controls="timeline-detail-panel" tabindex="-1" data-period="${index}"><span class="timeline-tab-year">${esc(period.year)}</span><span class="timeline-tab-title">${esc(period.title)}</span></button>`).join('');
  let activeIndex = null;
  const paint = index => {
    if (activeIndex === index) return;const period = periods[index];if (!period) return;activeIndex = index;
    $$('.timeline-tab',tabs).forEach((tab,position) => {const selected = position === index;tab.classList.toggle('is-active',selected);tab.setAttribute('aria-selected',String(selected));tab.tabIndex = selected ? 0 : -1;});
    panel.setAttribute('aria-labelledby',`period-tab-${index}`);
    $('#period-label').textContent = period.label;$('#period-year').textContent = period.year;
    $('#period-title').textContent = period.title;$('#period-summary').textContent = period.summary;
    $('#period-facts').innerHTML = period.facts.map(fact => `<span class="fact-chip">${esc(fact)}</span>`).join('');
    $('#period-source').innerHTML = `<strong>CATATAN SUMBER</strong>${esc(period.source)}`;
    if ($('#period-source-links')) $('#period-source-links').innerHTML = linksHtml(period);
    $('#object-stamp').textContent = period.stamp;
    const progress = $('#timeline-progress');if (progress) progress.style.height = `${(index + 1) / periods.length * 100}%`;
    visual.style.backgroundImage = `url("${imageFor(period,`assets/${assets[index]}.svg`)}")`;
    visual.setAttribute('role','img');visual.setAttribute('aria-label',period.alt || `Ilustrasi editorial periode ${period.year}: ${period.title}`);
    const number = $('.object-number',visual);if (number) number.textContent = `PERIODE / ${String(index + 1).padStart(2,'0')}`;
  };
  const choose = index => writeRoute({period:index + 1},{hash:'timeline'});
  tabs.addEventListener('click',event => {const tab = event.target.closest('[data-period]');if (tab) choose(Number(tab.dataset.period));});
  initTabKeyboard(tabs,'.timeline-tab','period',periods.length,choose);
  subscribeRoute(url => paint(routeIndex(url,'period',periods.length) ?? 0));enhanceSection('timeline');
}
function renderArtifacts() {
  const grid = $('#artifact-grid'), modal = $('#artifact-modal');
  if (!grid || !modal || !artifacts.length) return;
  const dialog = dialogController(modal);let activeIndex = null;
  grid.innerHTML = artifacts.map((item,index) => `<button class="artifact-card" type="button" data-artifact="${index}" aria-haspopup="dialog"><div class="artifact-visual artifact-visual--${esc(item.type)}"${item.image || item.src ? ` style="background-image:url('${esc(imageFor(item,''))}')"` : ''} aria-hidden="true"></div><div class="artifact-card-body"><div><p>${esc(item.date)}</p><h3>${esc(item.title)}</h3></div><span class="artifact-arrow" aria-hidden="true">↗</span></div></button>`).join('');
  const open = index => {
    const item = artifacts[index];activeIndex = index;
    $('#modal-meta').textContent = item.date;$('#modal-title').textContent = item.title;$('#modal-copy').textContent = item.copy;
    $('#modal-source').innerHTML = `<strong>SUMBER DAN ASAL KOLEKSI</strong>${esc(item.source)}`;
    if ($('#modal-source-links')) $('#modal-source-links').innerHTML = linksHtml(item);
    const visual = $('#modal-visual');visual.className = `modal-visual modal-visual--${item.type}`;
    visual.style.backgroundImage = item.image || item.src ? `url("${imageFor(item,'')}")` : '';
    visual.setAttribute('role','img');visual.setAttribute('aria-label',item.alt || `${item.title}. ${item.source}`);
    const card = $('.modal-card',modal);if (card) card.scrollTop = 0;
    dialog.open($(`[data-artifact="${index}"]`,grid));
  };
  modal.__close = () => closeModalRoute('artifact');
  grid.addEventListener('click',event => {const card = event.target.closest('[data-artifact]');if (card) writeRoute({artifact:Number(card.dataset.artifact) + 1,frame:null},{modal:true});});
  $$('[data-close-modal]',modal).forEach(element => element.addEventListener('click',() => closeModalRoute('artifact')));
  subscribeRoute(url => {const index = routeIndex(url,'artifact',artifacts.length);if (index === null) {dialog.close();activeIndex = null;}else if (activeIndex !== index || modal.hidden) open(index);});
  enhanceSection('artifacts');
}
function renderReform() {
  const tabs = $('#reform-tabs'), panel = $('#reform-panel');if (!tabs || !panel || !reformLenses.length) return;
  const compact = matchMedia('(max-width:800px)'), updateOrientation = () => tabs.setAttribute('aria-orientation',compact.matches ? 'horizontal' : 'vertical');
  updateOrientation();onMediaChange(compact,updateOrientation);panel.removeAttribute('aria-live');
  tabs.innerHTML = reformLenses.map((item,index) => `<button type="button" id="lens-tab-${index}" role="tab" aria-selected="false" aria-controls="reform-panel" tabindex="-1" class="reform-tab" data-lens="${index}"><span>${String(index + 1).padStart(2,'0')}</span>${esc(item.title)}</button>`).join('');
  let activeIndex = null;
  const paint = index => {
    if (activeIndex === index) return;const item = reformLenses[index];if (!item) return;activeIndex = index;
    $$('.reform-tab',tabs).forEach((tab,position) => {tab.classList.toggle('is-active',position === index);tab.setAttribute('aria-selected',String(position === index));tab.tabIndex = position === index ? 0 : -1;});
    panel.setAttribute('aria-labelledby',`lens-tab-${index}`);
    $('#reform-index').textContent = `${String(index + 1).padStart(2,'0')} / ${String(reformLenses.length).padStart(2,'0')}`;
    $('#reform-panel-title').textContent = item.title;$('#reform-panel-copy').textContent = item.copy;$('#reform-panel-evidence').textContent = item.evidence;
    const meter = $('#reform-meter-fill');if (meter) meter.style.width = `${(index + 1) / reformLenses.length * 100}%`;
  };
  const choose = index => writeRoute({lens:index + 1},{hash:'reform'});
  tabs.addEventListener('click',event => {const tab = event.target.closest('[data-lens]');if (tab) choose(Number(tab.dataset.lens));});
  initTabKeyboard(tabs,'.reform-tab','lens',reformLenses.length,choose);
  subscribeRoute(url => paint(routeIndex(url,'lens',reformLenses.length) ?? 0));enhanceSection('reform');
}
function renderEvidence() {
  const list = $('#evidence-list');if (!list) return;
  list.innerHTML = evidence.map(item => `<article class="evidence-row"><span class="evidence-date">${esc(item.date)}</span><div>${item.status ? `<p class="evidence-status">${esc(item.status)}</p>` : ''}<h3>${esc(item.title)}</h3><p>${esc(item.copy)}</p>${item.indicator || item.needs ? `<dl class="evidence-fields">${item.indicator ? `<div><dt>Ukuran yang diperiksa</dt><dd>${esc(item.indicator)}</dd></div>` : ''}${item.needs ? `<div><dt>Bukti yang dibutuhkan</dt><dd>${esc(item.needs)}</dd></div>` : ''}</dl>` : ''}${linksFor(item).length ? `<div class="evidence-source-links">${linksHtml(item)}</div>` : ''}</div><span class="evidence-type" aria-hidden="true"></span></article>`).join('');
  enhanceSection('evidence');
}
function renderRoadmap() {
  const grid = $('#roadmap-grid');if (!grid) return;
  grid.innerHTML = roadmap.map(item => {
    const fields = item.target ? [['Target',item.target],['Kondisi awal',item.baseline],['Indikator',item.measure],['Penanggung jawab usulan',item.owner],['Tonggak',item.milestone],['Anggaran',item.budget]] : item.items.map(value => {const split = value.indexOf(':');return split >= 0 ? [value.slice(0,split),value.slice(split + 1).trim()] : ['Langkah',value];});
    return `<article class="roadmap-card"><div><span class="roadmap-year">${esc(item.year)}</span><h3>${esc(item.title)}</h3></div><dl class="roadmap-fields">${fields.filter(([,value]) => value).map(([name,value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>${linksFor(item).length ? `<div class="roadmap-source-links">${linksHtml(item)}</div>` : ''}</article>`;
  }).join('');
  enhanceSection('roadmap');
}

function initDemo() {
  const stage = $('#demo-stage'), fill = $('#demo-progress-fill'), label = $('#demo-step-label');
  if (!stage || !fill || !label) return;
  const criteria = [
    {name:'Perlakuan adil',description:'Apakah aturan dan urutan layanan diterapkan sama tanpa hubungan pribadi?',low:'Perlakuan berbeda tanpa alasan.',high:'Aturan sama; pengecualian dijelaskan.'},
    {name:'Kejelasan informasi',description:'Apakah syarat, biaya, waktu, dan hasil dijelaskan sebelum layanan?',low:'Informasi penting tidak dijelaskan.',high:'Semua informasi jelas sejak awal.'},
    {name:'Interaksi hormat',description:'Apakah petugas mendengarkan dan menjaga martabat warga?',low:'Warga diabaikan atau direndahkan.',high:'Warga didengar dan dihormati.'},
    {name:'Jejak layanan',description:'Apakah warga menerima nomor layanan, bukti, dan catatan proses?',low:'Tidak ada bukti yang bisa dirujuk.',high:'Jejak lengkap dapat diperiksa.'},
    {name:'Tindak lanjut',description:'Apakah hasil, penundaan, serta jalur keberatan dapat ditelusuri?',low:'Status dan jalur keberatan tidak tersedia.',high:'Status, alasan, dan keberatan jelas.'}
  ];
  const scenarios = [
    {
      name:'Pembuatan laporan',code:'LPR',teaser:'Maya kehilangan dokumen dan meminta bukti laporan.',
      story:'Maya datang pukul 09.00. Petugas menerima keterangannya dengan sopan, tetapi tidak menjelaskan keterlambatan penerbitan bukti layanan.',
      facts:[['Petugas contoh','Meja layanan A'],['Target waktu contoh','30 menit'],['Biaya dalam kasus','Rp0'],['Hak yang diuji','Penjelasan proses, bukti penerimaan, dan alasan penundaan']],
      events:['09.00 — Maya mendapat nomor antrean dan penjelasan bahwa layanan tidak dipungut biaya.','09.15 — Petugas mendengarkan dan mencatat keterangan; antrean dipanggil sesuai urutan.','09.45 — Bukti penerimaan diberikan, 15 menit melewati target contoh. Alasan keterlambatan dan kanal keberatan belum dijelaskan.'],
      output:'Bukti penerimaan tersedia; alasan keterlambatan dan jalur keberatan masih perlu diminta.',
      lesson:'Bukti penerimaan membantu penelusuran. Layanan yang sopan tetap perlu menjelaskan penundaan dan cara mengajukan keberatan.'
    },
    {
      name:'Penerbitan surat',code:'SRT',teaser:'Raka mengajukan surat dalam alur layanan fiktif.',
      story:'Raka membawa berkas sesuai daftar. Syarat dan biaya dijelaskan, tetapi pemohon lain dilayani mendahului antrean tanpa alasan yang dijelaskan.',
      facts:[['Petugas contoh','Meja layanan B'],['Target waktu contoh','60 menit setelah berkas lengkap'],['Biaya dalam kasus','Rp0'],['Hak yang diuji','Persyaratan terbuka, perlakuan setara, dan bukti hasil']],
      events:['10.00 — Raka memeriksa persyaratan dan memperoleh nomor layanan.','10.20 — Pemohon lain dipanggil dahulu; tidak ada penjelasan mengenai prioritas layanan.','10.50 — Surat dan bukti penyerahan diberikan. Petugas menyampaikan kanal keberatan pada bukti layanan.'],
      output:'Surat selesai sesuai target contoh; dasar pengecualian antrean belum dijelaskan.',
      lesson:'Selesai tepat waktu belum menjawab seluruh pengalaman warga. Pengecualian antrean harus mempunyai alasan yang dapat dipahami.'
    },
    {
      name:'Permintaan informasi',code:'INF',teaser:'Nadia meminta informasi prosedur layanan publik.',
      story:'Nadia meminta salinan prosedur yang dapat diakses publik. Ia memperoleh tanda terima dan jadwal jawaban, tetapi pembaruan status sulit ditemukan.',
      facts:[['Petugas contoh','Meja informasi C'],['Target jawaban contoh','5 hari kerja'],['Biaya dalam kasus','Rp0 untuk salinan digital'],['Hak yang diuji','Tanda terima, jadwal jawaban, alasan penolakan, dan keberatan']],
      events:['Hari 1 — Permintaan dicatat, nomor diberikan, dan jadwal jawaban dijelaskan.','Hari 3 — Nadia ingin memeriksa perkembangan; tiket belum mencantumkan lokasi pemeriksaan status.','Hari 5 — Salinan digital diterima sesuai target contoh. Surat jawaban menjelaskan kanal keberatan.'],
      output:'Informasi diterima; akses pemeriksaan status selama proses masih perlu diperjelas.',
      lesson:'Jawaban tepat waktu perlu didukung informasi status yang mudah dijangkau selama proses berlangsung.'
    }
  ];
  let step = 1, scenario = null, ratings = {}, ticket = '', acknowledged = false;
  const number = value => new Intl.NumberFormat('id-ID',{maximumFractionDigits:1}).format(value);
  const makeTicket = code => {
    const suffix = globalThis.crypto?.randomUUID ? crypto.randomUUID().slice(0,8).toUpperCase() : `${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`.toUpperCase();
    return `SIM-${code}-${suffix}`;
  };
  const average = () => criteria.reduce((total,_,index) => total + Number(ratings[index] || 0),0) / criteria.length;
  const caseHtml = () => `<div class="demo-case"><p class="demo-case-notice">KASUS FIKTIF · WAKTU DAN BIAYA ADALAH CONTOH PEMBELAJARAN</p><p>${esc(scenario.story)}</p><dl class="demo-case-facts">${scenario.facts.map(([name,value]) => `<div><dt>${esc(name)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><ol class="demo-case-events">${scenario.events.map(event => `<li>${esc(event)}</li>`).join('')}</ol><p><strong>Hasil kasus:</strong> ${esc(scenario.output)}</p></div>`;
  const acknowledgementHtml = () => `<p><strong>Contoh keberatan: ${ticket}-K</strong></p><p>Status latihan: dicatat lokal. Penanggung jawab contoh: pengelola layanan. Tahap berikutnya: periksa kejadian, beri jawaban beralasan, dan sediakan peninjauan oleh pengawas. Tidak ada pengaduan yang dikirim.</p>`;
  const summaryText = () => [
    'THE LIVING ARCHIVE — RINGKASAN SIMULASI EDUKATIF',`ID latihan: ${ticket}`,`Skenario fiktif: ${scenario.name}`,'',
    'KASUS FIKTIF; WAKTU DAN BIAYA ADALAH CONTOH, BUKAN STANDAR RESMI.',scenario.story,
    ...scenario.facts.map(([name,value]) => `${name}: ${value}`),...scenario.events,`Hasil kasus: ${scenario.output}`,'',
    ...criteria.map((criterion,index) => `${criterion.name}: ${ratings[index]}/5`),`Rata-rata latihan: ${number(average())}/5`,
    `Pelajaran: ${scenario.lesson}`,`Simulasi keberatan: ${acknowledged ? 'Dibuat secara lokal; tidak dikirim.' : 'Belum dicoba.'}`,'',
    'Nilai latihan tidak mengukur kinerja institusi atau pengalaman layanan nyata.','Tidak ada data pribadi atau pengaduan yang dikirim.',
    'Jawaban berada di memori halaman; salinan ini disimpan hanya melalui unduhan.'
  ].join('\n');
  const render = (moveFocus = false) => {
    label.textContent = `${String(step).padStart(2,'0')} / 04`;fill.style.width = `${step * 25}%`;
    const progress = fill.parentElement;
    progress.setAttribute('role','progressbar');progress.setAttribute('aria-label','Langkah simulasi');
    progress.setAttribute('aria-valuemin','1');progress.setAttribute('aria-valuemax','4');progress.setAttribute('aria-valuenow',String(step));
    const back = '<button class="demo-button demo-button--ghost" type="button" data-back>← Kembali</button>';
    if (step === 1) {
      stage.innerHTML = `<p class="eyebrow">LANGKAH 01 · PILIH KASUS</p><h3 tabindex="-1">Lihat layanan dari sisi warga.</h3><p>Pilih cerita fiktif. Baca peristiwa, periksa standar contoh, lalu nilai lima unsur layanan. Seluruh latihan berjalan di halaman ini.</p><div class="demo-options" role="group" aria-label="Pilih kasus latihan">${scenarios.map(item => `<button type="button" class="demo-option${scenario === item ? ' is-selected' : ''}" data-scenario="${esc(item.name)}" aria-pressed="${scenario === item}"><strong>${esc(item.name)}</strong><span>${esc(item.teaser)}</span></button>`).join('')}</div><div class="demo-actions"><button class="demo-button" type="button" data-next ${scenario ? '' : 'disabled'}>Baca kasus dan tiket →</button></div>`;
    } else if (step === 2) {
      stage.innerHTML = `<p class="eyebrow">LANGKAH 02 · BACA PROSES</p><h3 tabindex="-1">Satu kasus, jejak yang dapat diperiksa.</h3><p>Gunakan kejadian berikut sebagai dasar penilaian. Waktu dan biaya adalah asumsi latihan; standar layanan nyata harus diperiksa pada penyelenggara.</p><div class="demo-ticket"><span class="demo-ticket-label">IDENTITAS LATIHAN LOKAL</span><strong class="demo-ticket-id">${ticket}</strong><span>${esc(scenario.name)}</span><p>Tiket ini tidak berlaku untuk layanan resmi.</p></div>${caseHtml()}<div class="demo-actions">${back}<button class="demo-button" type="button" data-next>Nilai pengalaman dalam kasus →</button></div>`;
    } else if (step === 3) {
      stage.innerHTML = `<p class="eyebrow">LANGKAH 03 · NILAI PENGALAMAN</p><h3 tabindex="-1">Apa yang sudah baik, apa yang kurang?</h3><p>Nilai kejadian dalam kasus, bukan pengalaman pribadimu. Gunakan 1 untuk sangat kurang, 3 untuk sebagian terpenuhi, dan 5 untuk sangat baik. Nilai 2 dan 4 berada di antaranya.</p><details class="demo-case-recap"><summary>Baca kembali kasus ${esc(scenario.name)}</summary>${caseHtml()}</details><div class="rating-list">${criteria.map((criterion,index) => `<div class="rating-row"><div class="rating-description"><strong id="criterion-${index}">${esc(criterion.name)}</strong><p id="criterion-help-${index}">${esc(criterion.description)}</p><small class="rating-anchor">1: ${esc(criterion.low)}<br>5: ${esc(criterion.high)}</small></div><div class="rating-controls" role="radiogroup" aria-labelledby="criterion-${index}" aria-describedby="criterion-help-${index}">${[1,2,3,4,5].map(value => `<button type="button" role="radio" class="rating-dot${ratings[index] === value ? ' is-selected' : ''}" data-rating="${index}" data-value="${value}" aria-checked="${ratings[index] === value}" tabindex="${ratings[index] === value || !ratings[index] && value === 1 ? 0 : -1}" aria-label="${esc(criterion.name)}: ${value} dari 5">${value}</button>`).join('')}</div></div>`).join('')}</div><p class="demo-rating-status" role="status">${Object.keys(ratings).length} dari 5 kriteria dinilai</p><div class="demo-actions">${back}<button class="demo-button" type="button" data-next ${Object.keys(ratings).length < criteria.length ? 'disabled' : ''}>Lihat pelajaran dan tindak lanjut →</button></div>`;
    } else {
      const concerns = criteria.filter((_,index) => ratings[index] <= 3);
      stage.innerHTML = `<p class="eyebrow">LANGKAH 04 · HASIL DAN TINDAK LANJUT</p><h3 tabindex="-1">Lima unsur, satu pelajaran.</h3><div class="demo-result"><div class="result-score">${number(average())}<small>/5</small></div><div><p>Rata-rata penilaianmu atas kasus fiktif <strong>${esc(scenario.name)}</strong>.</p><div class="demo-summary"><span>ID LATIHAN</span><strong>${ticket}</strong></div></div></div><p class="demo-footnote">NILAI LATIHAN · TIDAK MENGUKUR KINERJA POLRI</p><dl class="demo-result-details">${criteria.map((criterion,index) => `<div><dt>${esc(criterion.name)}</dt><dd>${ratings[index]}<span>/5</span></dd></div>`).join('')}</dl><div class="demo-recommendations"><h4>Pelajaran dari kasus ini</h4><p>${esc(scenario.lesson)}</p><p>${concerns.length ? `Menurut penilaianmu, bagian yang perlu diperjelas: <strong>${concerns.map(item => esc(item.name)).join(', ')}</strong>. Warga perlu dapat meminta penjelasan dan menggunakan jalur keberatan pada standar layanan.` : 'Menurut penilaianmu, kelima unsur telah terpenuhi dengan baik. Bukti layanan dan akses keberatan tetap perlu tersedia.'}</p></div><div class="demo-track"><h4>Jejak latihan</h4><ol><li>Kasus dipilih dan nomor latihan dibuat</li><li>Proses serta hasil dibaca</li><li>Lima unsur layanan dinilai</li></ol></div><div class="demo-complaint"><h4>Coba tindak lanjut</h4><p>Buat contoh tanda terima keberatan tanpa memasukkan data pribadi. Ini memperlihatkan informasi minimum yang seharusnya bisa dirujuk warga.</p><button class="demo-button demo-button--ghost" type="button" data-complaint ${acknowledged ? 'disabled' : ''}>${acknowledged ? 'Contoh tanda terima sudah dibuat' : 'Buat contoh tanda terima keberatan'}</button><div class="demo-status-message" role="status">${acknowledged ? acknowledgementHtml() : ''}</div></div><p>Pilihan hilang saat halaman dimuat ulang. Simpan ringkasan untuk membaca kembali kasus dan penilaianmu.</p><div class="demo-actions">${back}<button class="demo-button demo-button--ghost" type="button" data-reset>Mulai kasus lain</button><button class="demo-button" type="button" data-download>Unduh ringkasan ↑</button><a class="demo-button demo-button--ghost" href="sources.html#service">Dasar layanan dan batas simulasi ↗</a></div>`;
    }
    if (moveFocus) requestAnimationFrame(() => focusDestination($('h3',stage)));
  };
  const setRating = button => {
    const index = Number(button.dataset.rating);ratings[index] = Number(button.dataset.value);
    $$('[data-rating]',stage).filter(item => Number(item.dataset.rating) === index).forEach(item => {
      const selected = item === button;item.classList.toggle('is-selected',selected);item.setAttribute('aria-checked',String(selected));item.tabIndex = selected ? 0 : -1;
    });
    $('.demo-rating-status',stage).textContent = `${Object.keys(ratings).length} dari 5 kriteria dinilai`;
    $('[data-next]',stage).disabled = Object.keys(ratings).length < criteria.length;
  };
  stage.addEventListener('click',event => {
    const scenarioButton = event.target.closest('[data-scenario]');
    if (scenarioButton) {
      const selected = scenarios.find(item => item.name === scenarioButton.dataset.scenario);
      if (scenario !== selected) {scenario = selected;ratings = {};acknowledged = false;ticket = makeTicket(scenario.code);}
      $$('[data-scenario]',stage).forEach(button => {button.classList.toggle('is-selected',button === scenarioButton);button.setAttribute('aria-pressed',String(button === scenarioButton));});
      $('[data-next]',stage).disabled = false;return;
    }
    const ratingButton = event.target.closest('[data-rating]');
    if (ratingButton) {setRating(ratingButton);return;}
    if (event.target.closest('[data-next]')) {
      if (step === 1 && !scenario || step === 3 && Object.keys(ratings).length < criteria.length) return;
      step = Math.min(4,step + 1);render(true);return;
    }
    if (event.target.closest('[data-back]')) {step = Math.max(1,step - 1);render(true);return;}
    if (event.target.closest('[data-reset]')) {step = 1;scenario = null;ratings = {};ticket = '';acknowledged = false;render(true);return;}
    if (event.target.closest('[data-complaint]')) {
      acknowledged = true;$('.demo-status-message',stage).innerHTML = acknowledgementHtml();
      const button = $('[data-complaint]',stage);button.textContent = 'Contoh tanda terima sudah dibuat';button.disabled = true;return;
    }
    if (event.target.closest('[data-download]')) {
      const url = URL.createObjectURL(new Blob([summaryText()],{type:'text/plain;charset=utf-8'})), download = document.createElement('a');
      download.href = url;download.download = `living-archive-${ticket.toLowerCase()}.txt`;document.body.append(download);download.click();download.remove();
      setTimeout(() => URL.revokeObjectURL(url),3000);announce('Ringkasan latihan diunduh ke perangkat.');
    }
  });
  stage.addEventListener('keydown',event => {
    const current = event.target.closest('[data-rating]');
    if (!current || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    event.preventDefault();let value = Number(current.dataset.value);
    if (event.key === 'Home') value = 1;else if (event.key === 'End') value = 5;
    else value = (value - 1 + (['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1) + 5) % 5 + 1;
    const next = $(`[data-rating="${current.dataset.rating}"][data-value="${value}"]`,stage);setRating(next);next.focus({preventScroll:true});
  });
  render();enhanceSection('code');
}
function initScrollLinks() {
  document.addEventListener('click',event => {
    const trigger = event.target.closest('[data-scroll-to],a[href^="#"]');
    if (!trigger || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = trigger.dataset.scrollTo || trigger.getAttribute('href'), id = hash?.slice(1);
    if (!id) return;let target;
    try {target = document.getElementById(decodeURIComponent(id));} catch {return;}
    if (!target) return;event.preventDefault();
    const modalOpen = Boolean($('[role="dialog"]:not([hidden])'));
    writeRoute({frame:null,artifact:null},{replace:modalOpen,hash:id});focusDestination(target);
  });
}
function runInitializer(callback) {
  try {callback();}
  catch (error) {document.documentElement.dataset.interactionStatus = 'partial';console.error(`Ruang tetap tersedia dalam mode baca: ${callback.name}`,error);}
}
document.documentElement.classList.add('js-enabled');
[
  initHeader,initRoomNav,initHero,initFrameWall,initGallery,initReveal,
  renderTimeline,renderArtifacts,renderReform,renderEvidence,renderRoadmap,
  initDemo,initScrollLinks
].forEach(runInitializer);

