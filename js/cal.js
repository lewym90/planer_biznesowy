// Kalendarz 2027 – polskie dni tygodnia, święta, tygodnie ISO. Wszystko w UTC, żeby uniknąć problemów ze zmianą czasu.
export const YEAR = 2027;

export const DOW = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
export const DOW3 = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'];
export const DOW1 = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];
export const MONTHS = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
export const MONTHS_GEN = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
export const MON3 = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];

export const pad = (n) => String(n).padStart(2, '0');
export const utc = (y, m, d) => new Date(Date.UTC(y, m, d));
export const iso = (d) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
export const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return utc(y, m - 1, d); };
export const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
// 0 = poniedziałek … 6 = niedziela
export const dow = (d) => (d.getUTCDay() + 6) % 7;

export function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return utc(y, month - 1, day);
}

export function isoWeek(d) {
  const t = new Date(d.getTime());
  t.setUTCDate(t.getUTCDate() + 3 - dow(t));
  const y = t.getUTCFullYear();
  const w1 = utc(y, 0, 4);
  return { week: 1 + Math.round(((t - w1) / 86400000 - 3 + dow(w1)) / 7), year: y };
}

function lastSunday(y, m) { const d = utc(y, m + 1, 0); return addDays(d, -((d.getUTCDay() + 7) % 7)); }

// Mapa: iso -> [{n: nazwa, off: bool, kind: 'swieto'|'obch'}]
export function buildHolidays(y = YEAR) {
  const H = {};
  const add = (d, n, off, kind) => { const k = iso(d); (H[k] = H[k] || []).push({ n, off, kind }); };
  const E = easter(y);
  // Święta ustawowo wolne od pracy
  add(utc(y, 0, 1), 'Nowy Rok', true, 'swieto');
  add(utc(y, 0, 6), 'Trzech Króli', true, 'swieto');
  add(E, 'Wielkanoc', true, 'swieto');
  add(addDays(E, 1), 'Poniedziałek Wielkanocny', true, 'swieto');
  add(utc(y, 4, 1), 'Święto Pracy', true, 'swieto');
  add(utc(y, 4, 3), 'Święto Konstytucji 3 Maja', true, 'swieto');
  add(addDays(E, 49), 'Zielone Świątki', true, 'swieto');
  add(addDays(E, 60), 'Boże Ciało', true, 'swieto');
  add(utc(y, 7, 15), 'Wniebowzięcie NMP', true, 'swieto');
  add(utc(y, 10, 1), 'Wszystkich Świętych', true, 'swieto');
  add(utc(y, 10, 11), 'Święto Niepodległości', true, 'swieto');
  add(utc(y, 11, 24), 'Wigilia (dzień wolny)', true, 'swieto');
  add(utc(y, 11, 25), 'Boże Narodzenie', true, 'swieto');
  add(utc(y, 11, 26), 'Drugi dzień Świąt', true, 'swieto');
  // Okolicznościowe
  add(utc(y, 0, 21), 'Dzień Babci', false, 'obch');
  add(utc(y, 0, 22), 'Dzień Dziadka', false, 'obch');
  add(addDays(E, -52), 'Tłusty Czwartek', false, 'obch');
  add(utc(y, 1, 14), 'Walentynki', false, 'obch');
  add(addDays(E, -46), 'Środa Popielcowa', false, 'obch');
  add(utc(y, 2, 8), 'Dzień Kobiet', false, 'obch');
  add(addDays(E, -7), 'Niedziela Palmowa', false, 'obch');
  add(lastSunday(y, 2), 'Zmiana czasu na letni', false, 'obch');
  add(utc(y, 4, 26), 'Dzień Matki', false, 'obch');
  add(utc(y, 5, 1), 'Dzień Dziecka', false, 'obch');
  add(utc(y, 5, 23), 'Dzień Ojca', false, 'obch');
  add(lastSunday(y, 9), 'Zmiana czasu na zimowy', false, 'obch');
  add(utc(y, 10, 29), 'Andrzejki', false, 'obch');
  add(utc(y, 11, 6), 'Mikołajki', false, 'obch');
  return H;
}

export const HOL = buildHolidays();
export const holidaysOn = (isoStr) => HOL[isoStr] || [];
export const isOff = (d) => dow(d) >= 5 || holidaysOn(iso(d)).some((h) => h.off);
export const isHolidayOff = (isoStr) => holidaysOn(isoStr).some((h) => h.off);
export const holName = (isoStr) => holidaysOn(isoStr).map((h) => h.n).join(' · ');

// Święto wypadające w sobotę – pracownikowi przysługuje inny dzień wolny
export function saturdayHolidays(y = YEAR) {
  return Object.entries(HOL).filter(([k, v]) => v.some((h) => h.off) && dow(parse(k)) === 5).map(([k, v]) => ({ date: k, name: v.filter((h) => h.off).map((h) => h.n).join(', ') }));
}

export function monthStats(y, m) {
  const n = utc(y, m + 1, 0).getUTCDate();
  let work = 0, off = 0;
  for (let d = 1; d <= n; d++) (isOff(utc(y, m, d)) ? off++ : work++);
  return { days: n, work, off };
}

// Siatka miesiąca: tablica tygodni po 7 komórek (null = pusto lub dzień poza miesiącem)
export function monthGrid(y, m) {
  const first = utc(y, m, 1), n = utc(y, m + 1, 0).getUTCDate();
  const lead = dow(first), cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= n; d++) cells.push(utc(y, m, d));
  while (cells.length % 7) cells.push(null);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

// Poniedziałki: od 28.12.2026 (tydz. 53/2026 z dniami 2027) do 27.12.2027
export function weekStarts(y = YEAR) {
  const first = utc(y, 0, 1);
  let m = addDays(first, -dow(first));
  const out = [];
  const end = utc(y, 11, 31);
  while (m <= end) { out.push(m); m = addDays(m, 7); }
  return out;
}

// Do którego miesiąca należy tydzień (po pierwszym dniu roku 2027 w tygodniu)
// miesiąc, do którego należy tydzień (jak w ISO: decyduje czwartek); pierwszy tydzień, który zaczyna się w grudniu 2026, należy do stycznia
export function weekMonth(mon, y = YEAR) {
  const thu = addDays(mon, 3);
  if (thu.getUTCFullYear() < y) return 0;
  if (thu.getUTCFullYear() > y) return 11;
  return thu.getUTCMonth();
}
// wszystkie tygodnie, które mają choć jeden dzień w danym miesiącu (do skrótów w kalendarzu miesiąca)
export function weeksOfMonth(m, y = YEAR) {
  return weekStarts(y).filter((w) => { for (let i = 0; i < 7; i++) { const d = addDays(w, i); if (d.getUTCFullYear() === y && d.getUTCMonth() === m) return true; } return false; });
}

export function fmtShort(d) { return `${d.getUTCDate()} ${MON3[d.getUTCMonth()]}`; }
export function fmtLong(d) { return `${d.getUTCDate()} ${MONTHS_GEN[d.getUTCMonth()]} ${d.getUTCFullYear()}`; }
export function fmtRange(a) { const b = addDays(a, 6); return a.getUTCMonth() === b.getUTCMonth() ? `${a.getUTCDate()}–${b.getUTCDate()} ${MON3[b.getUTCMonth()]} ${b.getUTCFullYear()}` : `${fmtShort(a)} – ${fmtShort(b)} ${b.getUTCFullYear()}`; }

export function todayIso() {
  const n = new Date();
  return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
}
export function weekStartOf(isoStr) { const d = parse(isoStr); return iso(addDays(d, -dow(d))); }
