// Magazyn danych: płaska mapa klucz -> wartość w localStorage. Autozapis z krótkim opóźnieniem.
const KEY = 'am-planer-2027:v1';

export class Store {
  constructor() {
    this.d = {};
    this.subs = new Set();
    this.timer = null;
    this.ok = true;
    try { const raw = localStorage.getItem(KEY); if (raw) this.d = JSON.parse(raw) || {}; } catch (e) { this.ok = false; }
    // prosimy przeglądarkę, by nie kasowała danych planera
    try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { /* brak */ }
  }
  get(k, def = '') { const v = this.d[k]; return v === undefined ? def : v; }
  num(k, def = 0) { const v = parseFloat(String(this.get(k, '')).replace(/\s/g, '').replace(',', '.')); return isNaN(v) ? def : v; }
  set(k, v) {
    if (v === '' || v === null || v === undefined) delete this.d[k]; else this.d[k] = String(v);
    this.queue();
  }
  del(prefix) { for (const k of Object.keys(this.d)) if (k.startsWith(prefix)) delete this.d[k]; this.queue(); }
  keys(prefix = '') { return Object.keys(this.d).filter((k) => k.startsWith(prefix)); }
  entries() { return Object.entries(this.d); }
  queue() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 250);
    this.subs.forEach((f) => f());
  }
  flush() {
    clearTimeout(this.timer);
    try { localStorage.setItem(KEY, JSON.stringify(this.d)); this.ok = true; } catch (e) { this.ok = false; this.onError && this.onError(); }
  }
  onChange(f) { this.subs.add(f); }
  export() {
    return JSON.stringify({ app: 'am-planer-2027', version: 1, exported: new Date().toISOString(), data: this.d }, null, 1);
  }
  import(text) {
    const j = JSON.parse(text);
    const data = j && j.app === 'am-planer-2027' ? j.data : null;
    if (!data || typeof data !== 'object') throw new Error('To nie jest kopia zapasowa planera.');
    const clean = {};
    for (const [k, v] of Object.entries(data)) if (typeof k === 'string' && (typeof v === 'string' || typeof v === 'number')) clean[k] = String(v);
    this.d = clean; this.flush(); this.subs.forEach((f) => f());
  }
  clear() { this.d = {}; this.flush(); this.subs.forEach((f) => f()); }
  isEmpty() { return Object.keys(this.d).filter((k) => !k.startsWith('_')).length === 0; }
}
