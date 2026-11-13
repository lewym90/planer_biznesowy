import { Store } from './store.js';
import * as C from './cal.js';
import { buildPages, SECTIONS } from './pages.js';
import { icon, esc, money } from './ui.js';

const S = new Store();
let pages = buildPages(S);
let idx = 0;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const scroller = $('#scroller'), book = $('#book'), sheetEl = $('#sheet'), toastEl = $('#toast');
const LS_THEME = 'am-planer-theme';

// ---------- motyw ----------
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(LS_THEME, t); } catch (e) { /* tryb prywatny */ }
  const m = $('meta[name=theme-color]'); if (m) m.content = '#0B0B0D';
}
try { setTheme(localStorage.getItem(LS_THEME) || 'paper'); } catch (e) { setTheme('paper'); }

// ---------- narzędzia ----------
// iOS ignoruje user-scalable=no: blokada powiększania gestem palców i dwukrotnym dotknięciem (jak w innych aplikacjach)
['gesturestart', 'gesturechange', 'gestureend'].forEach((t) => document.addEventListener(t, (e) => e.preventDefault(), { passive: false }));
document.addEventListener('touchmove', (e) => { if (e.touches.length > 1 || (e.scale && e.scale !== 1)) e.preventDefault(); }, { passive: false });
document.addEventListener('wheel', (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
const spreadMode = () => false;
const fitPages = () => document.documentElement.style.setProperty('--pgh', scroller.clientHeight + 'px');
window.addEventListener('resize', fitPages); window.addEventListener('orientationchange', () => setTimeout(fitPages, 200));
if (window.visualViewport) window.visualViewport.addEventListener('resize', () => setTimeout(fitPages, 50));

window.addEventListener('resize', fitPages); window.addEventListener('orientationchange', () => setTimeout(fitPages, 200));
const byId = (id) => pages.findIndex((p) => p.id === id);
function toast(msg, ms = 2600) {
  toastEl.textContent = msg; toastEl.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('on'), ms);
}
function autosize(t) {
  const base = Number(t.dataset.rows || 2), lh = parseFloat(getComputedStyle(t).lineHeight) || 26;
  t.style.height = 'auto';
  t.style.height = Math.max(base * lh + 4, t.scrollHeight) + 'px';
}
function fmtMoney(inp) {
  const raw = inp.value.trim();
  if (!raw) return;
  const n = parseFloat(raw.replace(/\s/g, '').replace(',', '.'));
  if (!isNaN(n)) { inp.value = money(n); S.set(inp.dataset.k, inp.value); }
}

// ---------- renderowanie ----------
function leftOf(i) { return i === 0 ? 0 : (i % 2 === 1 ? i : i - 1); } // w rozkładówce lewa strona ma indeks nieparzysty

function sheetHtml(i) {
  const p = pages[i];
  return `<section class="pg sec-${p.sec} ${p.id === 'cover' ? 'is-cover' : ''}" data-id="${esc(p.id)}" data-i="${i}" aria-label="${esc(p.name)}"><div class="pg-in">${p.html(S)}</div><span class="pnum">${i === 0 ? '' : i}</span></section>`;
}

const NAV = [['toc', 'Spis treści', 'book'], ['year', 'Rok 2027', 'calendar'], ['strategy', 'Strategia', 'chart'], ['dates', 'Ważne daty', 'calendar'], ['goals', 'Cele roczne', 'target'], ['smart:1', 'Cele SMART', 'flag'], ['income', 'Przychody', 'dollar'], ['mkt:1', 'Marketing', 'megaphone'], ['notes:1', 'Notatki', 'pen']];
function renderSide() {
  const side = $('#side'); if (!side) return;
  const cur = pages[idx], kind = cur.id.split(':')[0];
  const curMonth = kind === 'month' ? Number(cur.id.slice(11, 13)) - 1 : kind === 'week' ? C.weekMonth(C.parse(cur.id.slice(5))) : new Date().getFullYear() === 2027 ? new Date().getMonth() : 0;
  const weeks = C.weeksOfMonth(curMonth);
  side.innerHTML = `<div class="sd-brand"><img src="icons/icon-192.png" alt="" width="40" height="40"><div><b>PLANER AM</b><span>Biznesowy 2027</span></div></div>
  <nav class="sd-nav">${NAV.map(([id, t, ic]) => `<button class="${kind === id.split(':')[0] ? 'on' : ''}" data-go="${id}">${icon(ic)}<span>${t}</span></button>`).join('')}</nav>
  <span class="sd-h">Miesiące</span><div class="sd-mon">${C.MON3.map((m, i) => `<button class="${kind === 'month' && i === curMonth ? 'on' : ''}" data-go="month:2027-${C.pad(i + 1)}">${m}</button>`).join('')}</div>
  <span class="sd-h">Tygodnie · ${C.MONTHS[curMonth].toLowerCase()}</span><div class="sd-wk">${weeks.map((w) => { const iw = C.isoWeek(w); return `<button class="${cur.id === 'week:' + C.iso(w) ? 'on' : ''}" data-go="week:${C.iso(w)}"><b>${iw.week}</b><span>${esc(C.fmtRange(w).replace(/ 20\d\d$/, ''))}</span></button>`; }).join('')}</div>`;
}

function render(dir = 0, keepScroll = false) {
  const sp = spreadMode();
  idx = Math.max(0, Math.min(pages.length - 1, idx));
  fitPages();
  const y = scroller.scrollTop;
  let html;
  if (sp) {
    const l = leftOf(idx);
    const left = l === 0 ? '<div class="pg blank-in" aria-hidden="true"></div>' : sheetHtml(l);
    const right = l === 0 ? sheetHtml(0) : (l + 1 < pages.length ? sheetHtml(l + 1) : '<div class="pg blank-in" aria-hidden="true"></div>');
    html = left + right;
    idx = l === 0 ? 0 : l;
  } else html = sheetHtml(idx);
  book.className = `book ${sp ? 'spread' : 'single'} ${dir > 0 ? 'go-f' : dir < 0 ? 'go-b' : ''}`;
  book.innerHTML = html;
  $$('.pg[data-id]', book).forEach(initPage);
  const cur = pages[idx];
  renderSide();
  $('#dock-label').textContent = cur.name;
  $('#dock-sub').textContent = `${cur.name} · ${idx + 1}/${pages.length}`;
  $('#dock-prev').disabled = idx <= 0;
  $('#dock-next').disabled = (sp ? leftOf(idx) + (idx === 0 ? 1 : 2) : idx + 1) >= pages.length;
  document.title = `${cur.name} · Planer AM 2027`;
  try { history.replaceState(null, '', '#' + cur.id); } catch (e) { /* file:// */ }
  scroller.scrollTop = keepScroll ? y : 0;
}

function initPage(el) {
  $$('textarea.lines', el).forEach(autosize);
  const p = pages[Number(el.dataset.i)];
  if (p && p.recalc) p.recalc(el, S);
  requestAnimationFrame(() => $$('textarea.lines', el).forEach(autosize));
}

function go(id, dir) {
  const i = byId(id);
  if (i < 0) return;
  closeSheet();
  const d = dir ?? (i > idx ? 1 : -1);
  idx = i; render(d);
}
function step(n) {
  const sp = spreadMode();
  if (sp) { const l = leftOf(idx); idx = n > 0 ? (l === 0 ? 1 : l + 2) : (l <= 1 ? 0 : l - 2); }
  else idx += n;
  idx = Math.max(0, Math.min(pages.length - 1, idx));
  render(n);
}
function rebuild(goId) {
  const cur = goId || pages[idx].id;
  pages = buildPages(S);
  const i = byId(cur); idx = i < 0 ? 0 : i;
}

// dzisiejsza data -> strona
function today() {
  const t = C.todayIso();
  if (t.startsWith('2027-')) { go('week:' + C.weekStartOf(t)); return; }
  const first = pages.find((p) => p.id.startsWith('week:') && p.id >= 'week:2027-01-01');
  go(first ? first.id : 'toc');
  toast('Planer obejmuje rok 2027. Otwieram pierwszy tydzień.');
}

// ---------- obsługa pól ----------
function onInput(e) {
  const t = e.target;
  if (!t.dataset || !t.dataset.k) return;
  if (t.type === 'checkbox' || t.type === 'radio') return;
  S.set(t.dataset.k, t.value);
  if (t.tagName === 'TEXTAREA') autosize(t);
  afterEdit(t);
}
function onChange(e) {
  const t = e.target;
  if (!t.dataset || !t.dataset.k) return;
  if (t.type === 'checkbox') S.set(t.dataset.k, t.checked ? '1' : '');
  else if (t.type === 'radio') S.set(t.dataset.k, t.checked ? t.value : '');
  else S.set(t.dataset.k, t.value);
  if (t.dataset.fmt === 'money') fmtMoney(t);
  if (t.dataset.k === '_|name') { rebuildViewKeepFocus(); return; }
  afterEdit(t);
}
function afterEdit(t) {
  const pg = t.closest('.pg[data-id]');
  if (!pg) return;
  const p = pages[Number(pg.dataset.i)];
  if (p && p.recalc) p.recalc(pg, S);
}
function rebuildViewKeepFocus() { render(0, true); }
function onClickRadio(e) {
  const t = e.target;
  if (t.type === 'radio' && t.dataset.k && S.get(t.dataset.k) === t.value) {
    setTimeout(() => { t.checked = false; S.set(t.dataset.k, ''); afterEdit(t); }, 0);
  }
}
function bindInputs(root) {
  root.addEventListener('input', onInput);
  root.addEventListener('change', onChange);
  root.addEventListener('click', onClickRadio);
}
bindInputs(book); bindInputs(sheetEl);

// ---------- kliknięcia w stronach ----------
book.addEventListener('click', (e) => {
  const a = e.target.closest('[data-go],[data-day],[data-more],[data-add],[data-del],[data-clear]');
  if (!a || !book.contains(a)) return;
  if (a.dataset.go) { e.preventDefault(); go(a.dataset.go); return; }
  if (a.dataset.day) { openDay(a.dataset.day); return; }
  if (a.dataset.more) { S.set(a.dataset.more, S.num(a.dataset.more, a.dataset.more.startsWith('income') ? 16 : 14) + Number(a.dataset.step || 5)); render(0, true); return; }
  if (a.dataset.add) { const k = '_|n.' + a.dataset.add, n = S.num(k, a.dataset.add === 'notes' ? 3 : 1) + 1; S.set(k, n); rebuild(); go(`${a.dataset.add}:${n}`, 1); toast('Dodano nową stronę'); return; }
  if (a.dataset.del) {
    const t = a.dataset.del, k = '_|n.' + t, n = S.num(k, t === 'notes' ? 3 : 1);
    if (n > 1 && confirm('Usunąć tę stronę wraz z jej zawartością? Tej operacji nie można cofnąć.')) { S.del(`${t}:${n}|`); S.set(k, n - 1); rebuild(`${t}:${n - 1}`); render(-1); toast('Strona usunięta'); }
    return;
  }
  if (a.dataset.clear) { if (confirm('Wyczyścić wszystkie wpisy na tej stronie? Tej operacji nie można cofnąć.')) { S.del(a.dataset.clear + '|'); render(0, true); toast('Strona wyczyszczona'); } }
});

// ---------- arkusze (bottom sheet) ----------
let sheetClose = null;
function openSheet(html, { cls = '', onclose } = {}) {
  sheetEl.innerHTML = `<div class="sh-bg" data-close></div><div class="sh-p ${cls}" role="dialog" aria-modal="true">${html}</div>`;
  sheetEl.classList.add('on'); document.body.classList.add('noscroll');
  sheetClose = onclose || null;
  $$('textarea.lines', sheetEl).forEach(autosize);
}
function closeSheet() {
  if (!sheetEl.classList.contains('on')) return;
  sheetEl.classList.remove('on'); document.body.classList.remove('noscroll');
  const f = sheetClose; sheetClose = null; sheetEl.innerHTML = '';
  S.flush();
  if (f) f(); else render(0, true);
}
sheetEl.addEventListener('click', (e) => {
  const t = e.target.closest('[data-close],[data-go],[data-dshift],[data-action],[data-theme],[data-day]');
  if (!t) return;
  if (t.hasAttribute('data-close')) { closeSheet(); return; }
  if (t.dataset.go) { go(t.dataset.go); return; }
  if (t.dataset.dshift) { openDay(C.iso(C.addDays(C.parse(t.dataset.cur), Number(t.dataset.dshift)))); return; }
  if (t.dataset.theme) { setTheme(t.dataset.theme); $$('[data-theme]', sheetEl).forEach((b) => b.classList.toggle('on', b === t)); return; }
  if (t.dataset.action) actions[t.dataset.action] && actions[t.dataset.action](t);
});
document.addEventListener('keydown', (e) => {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement && document.activeElement.tagName);
  if (e.key === 'Escape') closeSheet();
  else if (!typing && !sheetEl.classList.contains('on')) {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) { e.preventDefault(); openSearch(); }
  }
});

// dzień
function openDay(k) {
  const d = C.parse(k), h = C.holidaysOn(k), i = C.dow(d);
  const hours = Array.from({ length: 14 }, (_, n) => n + 7);
  const wk = C.weekStartOf(k), mo = `month:${k.slice(0, 7)}`;
  openSheet(`<div class="sh-h"><button class="ib" data-dshift="-1" data-cur="${k}" aria-label="Poprzedni dzień">${icon('left')}</button>
    <div class="sh-t"><small>${C.DOW[i]}${C.isoWeek(d).week ? ` · tydzień ${C.isoWeek(d).week}` : ''}</small><h3>${d.getUTCDate()} ${C.MONTHS_GEN[d.getUTCMonth()]} ${d.getUTCFullYear()}</h3></div>
    <button class="ib" data-dshift="1" data-cur="${k}" aria-label="Następny dzień">${icon('right')}</button><button class="ib x" data-close aria-label="Zamknij">${icon('x')}</button></div>
    <div class="sh-b">${h.map((x) => `<span class="tag ${x.off ? 'off' : ''}">${esc(x.n)}${x.off ? ' · wolne' : ''}</span>`).join('')}
    <span class="fl">Notatki dnia</span><textarea class="lines" data-k="ev:${k}|d" rows="4" data-rows="4" placeholder="Zadania, telefony, ustalenia…" aria-label="Notatki dnia">${esc(S.get(`ev:${k}|d`))}</textarea>
    <span class="fl">Harmonogram</span><div class="hrs">${hours.map((n) => `<label class="hr"><b>${n}:00</b><input class="ln" data-k="ev:${k}|h${C.pad(n)}" value="${esc(S.get(`ev:${k}|h${C.pad(n)}`))}" autocomplete="off" aria-label="${n}:00"></label>`).join('')}</div>
    <div class="sh-f"><button class="btn-s" data-go="week:${wk}">${icon('briefcase')}<span>Otwórz tydzień</span></button><button class="btn-s" data-go="${mo}">${icon('calendar')}<span>Otwórz miesiąc</span></button></div></div>`);
}

// skok do strony
function openJump() {
  const ids = [['toc', 'Spis treści', 'book'], ['year', 'Rok 2027', 'calendar'], ['strategy', 'Strategia', 'chart'], ['dates', 'Ważne daty', 'calendar'], ['goals', 'Cele roczne', 'target'], ['smart:1', 'Cele SMART', 'flag'], ['income', 'Przychody', 'dollar'], ['mkt:1', 'Marketing', 'megaphone'], ['notes:1', 'Notatki', 'pen']];
  const cur = pages[idx];
  const curMonth = cur.id.startsWith('month:') ? Number(cur.id.slice(11, 13)) - 1 : cur.id.startsWith('week:') ? C.weekMonth(C.parse(cur.id.slice(5))) : new Date().getFullYear() === 2027 ? new Date().getMonth() : 0;
  const weeks = C.weeksOfMonth(curMonth);
  openSheet(`<div class="sh-h"><div class="sh-t"><small>Przejdź do</small><h3>Strony planera</h3></div><button class="ib x" data-close aria-label="Zamknij">${icon('x')}</button></div>
  <div class="sh-b"><div class="jump">${ids.map(([id, t, ic]) => `<button class="jb ${cur.id === id || cur.id.split(':')[0] === id.split(':')[0] && id.includes(':') ? 'on' : ''}" data-go="${id}">${icon(ic)}<span>${t}</span></button>`).join('')}</div>
  <span class="fl">Miesiąc</span><div class="chips">${C.MON3.map((m, i) => `<button class="chip ${i === curMonth ? 'on' : ''}" data-go="month:2027-${C.pad(i + 1)}">${m}</button>`).join('')}</div>
  <span class="fl">Tygodnie · ${C.MONTHS[curMonth].toLowerCase()}</span><div class="chips">${weeks.map((w) => { const iw = C.isoWeek(w); return `<button class="chip wide ${cur.id === 'week:' + C.iso(w) ? 'on' : ''}" data-go="week:${C.iso(w)}"><b>${iw.week}</b> ${esc(C.fmtRange(w).replace(/ 20\d\d$/, ''))}</button>`; }).join('')}</div>
  <div class="sh-f"><button class="btn-s gold" data-action="today">${icon('calendar')}<span>Dziś</span></button></div></div>`);
}

// szukanie
function openSearch() {
  openSheet(`<div class="sh-h"><div class="srch">${icon('search')}<input id="q" type="search" placeholder="Szukaj w planerze…" autocomplete="off" autofocus aria-label="Szukaj"></div><button class="ib x" data-close aria-label="Zamknij">${icon('x')}</button></div><div class="sh-b" id="qres"><p class="muted">Wpisz co najmniej 2 znaki. Przeszukuję wszystkie Twoje wpisy i nazwy stron.</p></div>`, { cls: 'tall' });
  const q = $('#q', sheetEl);
  setTimeout(() => q.focus(), 60);
  q.addEventListener('input', () => runSearch(q.value));
}
function runSearch(text) {
  const out = $('#qres', sheetEl), t = text.trim().toLocaleLowerCase('pl');
  if (t.length < 2) { out.innerHTML = '<p class="muted">Wpisz co najmniej 2 znaki.</p>'; return; }
  const names = pages.filter((p) => p.name.toLocaleLowerCase('pl').includes(t)).slice(0, 8);
  const res = [];
  for (const [k, v] of S.entries()) {
    if (k.startsWith('_') || v.length < 2 || !v.toLocaleLowerCase('pl').includes(t)) continue;
    const [pre] = k.split('|');
    if (pre.startsWith('ev:')) { const d = pre.slice(3); res.push({ day: d, label: `${C.parse(d).getUTCDate()} ${C.MONTHS_GEN[C.parse(d).getUTCMonth()]} ${C.parse(d).getUTCFullYear()}`, v }); }
    else { const p = pages.find((x) => x.id === pre); if (p) res.push({ id: p.id, label: p.name, v }); }
    if (res.length >= 60) break;
  }
  const snip = (v) => { const i = v.toLocaleLowerCase('pl').indexOf(t), s = Math.max(0, i - 24), seg = v.slice(s, s + 90); const j = i - s; return `${s > 0 ? '…' : ''}${esc(seg.slice(0, j))}<mark>${esc(seg.slice(j, j + t.length))}</mark>${esc(seg.slice(j + t.length))}`; };
  out.innerHTML = (names.length ? `<span class="fl">Strony</span>${names.map((p) => `<button class="res" data-go="${esc(p.id)}"><strong>${esc(p.name)}</strong><small>${SECTIONS[p.sec]}</small></button>`).join('')}` : '') +
    (res.length ? `<span class="fl">Wpisy</span>${res.map((r) => `<button class="res" ${r.day ? `data-day="${r.day}"` : `data-go="${esc(r.id)}"`}><strong>${esc(r.label)}</strong><small>${snip(r.v)}</small></button>`).join('')}` : '') || '<p class="muted">Brak wyników.</p>';
}
sheetEl.addEventListener('click', (e) => { const b = e.target.closest('.res[data-day]'); if (b) { openDay(b.dataset.day); } });

// ---------- ustawienia, kopie, eksport ----------
const actions = {
  today: () => today(),
  export: async () => {
    S.set('_|lastBackup', new Date().toISOString());
    const text = S.export(), name = `planer-am-2027-kopia-${C.todayIso()}.json`;
    await saveFile(name, text, 'application/json');
    S.flush(); toast('Kopia zapasowa gotowa');
  },
  import: () => $('#file-in').click(),
  ics: async () => {
    const { text, n } = buildIcs();
    if (!n) { toast('Brak wpisów z datami do wyeksportowania.'); return; }
    await saveFile('planer-am-2027-terminy.ics', text, 'text/calendar');
    toast(`Wyeksportowano ${n} wpisów`);
  },
  clear: () => {
    if (confirm('Usunąć WSZYSTKIE dane z planera na tym urządzeniu? Najpierw zrób kopię zapasową. Tej operacji nie można cofnąć.') && confirm('Na pewno? Wszystkie wpisy zostaną skasowane.')) { S.clear(); pages = buildPages(S); idx = 0; closeSheet(); render(); toast('Planer wyczyszczony'); }
  },
  install: async () => { if (deferredInstall) { deferredInstall.prompt(); deferredInstall = null; } },
  print: () => toast('Wersja do druku i bindowania jest w przygotowaniu.'),
};

async function saveFile(name, text, type) {
  const file = new File([text], name, { type });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] }) && /iPhone|iPad|Android/i.test(navigator.userAgent)) { await navigator.share({ files: [file], title: name }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const url = URL.createObjectURL(file), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

$('#file-in').addEventListener('change', async (e) => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try {
    const text = await f.text();
    if (!S.isEmpty() && !confirm('Import zastąpi wszystkie obecne wpisy danymi z kopii. Kontynuować?')) return;
    S.import(text); pages = buildPages(S); idx = Math.min(idx, pages.length - 1); closeSheet(); render(); toast('Kopia przywrócona');
  } catch (err) { toast(err.message || 'Nie udało się wczytać pliku.', 4000); }
});

function icsEsc(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); }
function fold(l) { const out = []; while (l.length > 73) { out.push(l.slice(0, 73)); l = ' ' + l.slice(73); } out.push(l); return out.join('\r\n'); }
function buildIcs() {
  const ev = []; const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const ymd = (k) => k.replace(/-/g, '');
  const nextDay = (k) => ymd(C.iso(C.addDays(C.parse(k), 1)));
  const push = (uid, lines) => ev.push(['BEGIN:VEVENT', `UID:${uid}@am-planer-2027`, `DTSTAMP:${stamp}`, ...lines, 'END:VEVENT']);
  const n = Number(S.get('dates|_n', 14)) + 200;
  for (let i = 0; i < n; i++) {
    const d = S.get(`dates|r${i}.d`), t = S.get(`dates|r${i}.e`);
    if (!d || !t) continue;
    push(`dates-${i}`, [`DTSTART;VALUE=DATE:${ymd(d)}`, `DTEND;VALUE=DATE:${nextDay(d)}`, `SUMMARY:${icsEsc(t)}`, `DESCRIPTION:${icsEsc([S.get(`dates|r${i}.c`), S.get(`dates|r${i}.p`) && 'Priorytet: ' + S.get(`dates|r${i}.p`), S.get(`dates|r${i}.n`)].filter(Boolean).join(' · '))}`]);
  }
  for (const [k, v] of S.entries()) {
    if (!k.startsWith('ev:') || !v.trim()) continue;
    const [pre, f] = k.split('|'), d = pre.slice(3);
    if (f === 'd') push(`ev-${d}-d`, [`DTSTART;VALUE=DATE:${ymd(d)}`, `DTEND;VALUE=DATE:${nextDay(d)}`, `SUMMARY:${icsEsc(v.split('\n')[0])}`, `DESCRIPTION:${icsEsc(v)}`]);
    else if (/^h\d\d$/.test(f)) push(`ev-${d}-${f}`, [`DTSTART:${ymd(d)}T${f.slice(1)}0000`, `DTEND:${ymd(d)}T${C.pad(Number(f.slice(1)) + 1)}0000`, `SUMMARY:${icsEsc(v)}`]);
  }
  const text = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AM Nieruchomosci//Planer 2027//PL', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Planer AM 2027', ...ev.flat()].map(fold).join('\r\n') + '\r\n';
  return { text, n: ev.length };
}

let deferredInstall = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; });

function openSettings() {
  const th = document.documentElement.dataset.theme;
  const last = S.get('_|lastBackup');
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  openSheet(`<div class="sh-h"><div class="sh-t"><small>Planer AM 2027</small><h3>Ustawienia</h3></div><button class="ib x" data-close aria-label="Zamknij">${icon('x')}</button></div>
  <div class="sh-b">
   <span class="fl">Wygląd</span><div class="seg"><button data-theme="paper" class="${th === 'paper' ? 'on' : ''}">${icon('sun')}<span>Papier</span></button><button data-theme="night" class="${th === 'night' ? 'on' : ''}">${icon('moon')}<span>Noc</span></button></div>
   <span class="fl">Moje dane</span>
   <p class="muted">Wpisy są zapisywane tylko na tym urządzeniu, bez konta i bez wysyłania na serwer. ${last ? `Ostatnia kopia: ${new Date(last).toLocaleDateString('pl-PL')}.` : 'Nie zrobiono jeszcze kopii zapasowej.'}</p>
   <div class="list"><button class="li" data-action="export">${icon('download')}<span><strong>Eksportuj kopię zapasową</strong><small>Plik .json z całym planerem</small></span></button>
   <button class="li" data-action="import">${icon('upload')}<span><strong>Przywróć z kopii</strong><small>Wczytaj wcześniej zapisany plik .json</small></span></button>
   <button class="li" data-action="ics">${icon('calendar')}<span><strong>Eksportuj terminy do kalendarza</strong><small>Plik .ics dla Apple/Google/Outlook: ważne daty, wpisy dni i godziny</small></span></button>
   <button class="li" data-action="print">${icon('print')}<span><strong>Wersja do druku</strong><small>Wkrótce</small></span></button></div>
   ${standalone ? '' : `<span class="fl">Instalacja</span><div class="note-s">${icon('home')}<span>${ios ? 'W Safari dotknij <b>Udostępnij</b>, potem <b>Do ekranu początkowego</b>. Planer otworzy się jak aplikacja.' : 'Dodaj planer do ekranu startowego z menu przeglądarki.'}</span></div>${deferredInstall ? `<button class="btn-s gold" data-action="install">${icon('plus')}<span>Zainstaluj aplikację</span></button>` : ''}`}
   <span class="fl">Strefa ostrożności</span><button class="li danger" data-action="clear">${icon('trash')}<span><strong>Wyczyść cały planer</strong><small>Nieodwracalne. Najpierw zrób kopię.</small></span></button>
   <p class="muted ctr">Planer AM 2027 · wersja 1.0</p></div>`, { cls: 'tall' });
}

// ---------- dock ----------
$('#dock-prev').addEventListener('click', () => step(-1));
$('#dock-next').addEventListener('click', () => step(1));
$('#dock-jump').addEventListener('click', openJump);
$('#dock-label-btn').addEventListener('click', openJump);
$('#dock-today').addEventListener('click', today);
$('#dock-search').addEventListener('click', openSearch);
$('#dock-set').addEventListener('click', openSettings);

// ---------- gesty przewracania ----------
let tx = 0, ty = 0, tt = 0, tracking = false;
scroller.addEventListener('touchstart', (e) => {
  const ae = document.activeElement, typing = ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && ae.type !== 'checkbox' && ae.type !== 'radio';
  const sx = e.target.closest('.scrollx');
  tracking = e.touches.length === 1 && !typing && !(sx && sx.scrollWidth > sx.clientWidth + 2) && !sheetEl.classList.contains('on');
  if (tracking) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; tt = Date.now(); }
}, { passive: true });
scroller.addEventListener('touchend', (e) => {
  if (!tracking || sheetEl.classList.contains('on')) return;
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3 && Date.now() - tt < 900) step(dx < 0 ? 1 : -1);
  tracking = false;
}, { passive: true });

// ---------- start ----------
function routeFromHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h) return false;
  if (h === 'today') { today(); return true; }
  let i = byId(h);
  if (i < 0) i = pages.findIndex((p) => p.id.startsWith(h));
  if (i >= 0) { idx = i; return true; }
  return false;
}
window.addEventListener('hashchange', () => { const h = decodeURIComponent(location.hash.slice(1)); if (h && h !== pages[idx].id && routeFromHash()) render(); });
let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => render(0, true), 150); });
window.addEventListener('pagehide', () => S.flush());
document.addEventListener('visibilitychange', () => { if (document.hidden) S.flush(); });
S.onError = () => toast('Nie można zapisać danych. Pamięć przeglądarki jest pełna lub zablokowana. Zrób kopię zapasową.', 6000);

if (!routeFromHash()) idx = 0;
render();
if (!S.ok) toast('Zapis lokalny jest wyłączony w tej przeglądarce (tryb prywatny?). Dane nie zostaną zachowane.', 7000);

// service worker
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  const had = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (had) { S.flush(); toast('Zaktualizowano planer. Odświeżam…', 1500); setTimeout(() => location.reload(), 900); } });
}
window.__planer = { S, go, get idx() { return idx; }, get pages() { return pages; } };
