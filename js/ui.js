// Pomocnicze: ikony SVG, escapowanie, pola formularza związane ze store'em (data-k).
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const P = {
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><path d="M12 12l7-7M16 4.5V8h3.5"/>',
  chart: '<path d="M4 20V10M10 20V6M16 20v-8M22 20H2"/><path d="M4 7l5-3 4 3 7-4"/>',
  bars: '<path d="M5 20v-5M10 20v-9M15 20V8M20 20V4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" stroke-width="2.4"/>',
  dollar: '<circle cx="12" cy="12" r="9"/><path d="M14.8 9.2C14.3 8.3 13.3 7.8 12 7.8c-1.6 0-2.7.8-2.7 2 0 3 5.6 1.4 5.6 4.4 0 1.2-1.2 2-2.9 2-1.4 0-2.6-.6-3.1-1.6M12 6v1.8M12 16.2V18"/>',
  megaphone: '<path d="M3 10v4a1 1 0 001 1h2l7 4V5L6 9H4a1 1 0 00-1 1z"/><path d="M16.5 9a4 4 0 010 6M19 6.5a8 8 0 010 11"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M3 13h18M11 13v2h2v-2"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0012 3z"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 01-8 0V4zM8 6H4.5a1 1 0 00-1 1c0 2.3 1.6 4 4 4M16 6h3.5a1 1 0 011 1c0 2.3-1.6 4-4 4M12 13v4M8.5 20h7M10 17h4"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.2c2.6.2 4.5 2.4 4.5 5.3"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5z"/>',
  book: '<path d="M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2zM12 6.5v13"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke-width="2.4"/>',
  home: '<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5"/>',
  pen: '<path d="M4 20l1-4L16.5 4.5a2 2 0 012.8 0l.2.2a2 2 0 010 2.8L8 19l-4 1z"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
  moon: '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.2 5.2L7 7M17 17l1.8 1.8M18.8 5.2L17 7M7 17l-1.8 1.8"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  trash: '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v6M14 11v6"/>',
  phone: '<path d="M6 3h3l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v3a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  repeat: '<path d="M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5M20 12a8 8 0 01-14 5.3L4 15M4 20v-5h5"/>',
  print: '<path d="M7 9V3.5h10V9M7 17H4.5V10a1 1 0 011-1h13a1 1 0 011 1v7H17M7 14h10v6.5H7z"/>',
  key: '<circle cx="8" cy="14" r="4"/><path d="M11 11l8-8M16 6l3 3M14 8l2 2"/>',
  coin: '<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 14a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3h0a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9v0a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
};

export function icon(name, cls = '') {
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
}
export const star4 = '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.7 6 6.5.7-4.9 4.4 1.4 6.4L12 17l-5.7 3.3 1.4-6.4L2.8 9.5l6.5-.7L12 2.8z"/></svg>';

// Pola formularza. Każde ma data-k (klucz w store). Wartości odczytywane ze store.
export function fields(S, id) {
  const k = (f) => `${id}|${f}`;
  const v = (f) => esc(S.get(k(f)));
  return {
    k, v,
    in: (f, o = {}) => `<input class="ln ${o.cls || ''}" data-k="${k(f)}" value="${v(f)}" placeholder="${esc(o.ph || '')}" ${o.type ? `type="${o.type}"` : 'type="text"'} ${o.inputmode ? `inputmode="${o.inputmode}"` : ''} autocomplete="off" enterkeyhint="next" aria-label="${esc(o.label || o.ph || f)}">`,
    num: (f, o = {}) => `<input class="ln num ${o.cls || ''}" data-k="${k(f)}" data-fmt="money" value="${v(f)}" placeholder="${esc(o.ph ?? '0')}" type="text" inputmode="decimal" autocomplete="off" aria-label="${esc(o.label || f)}">`,
    dt: (f, o = {}) => `<input class="ln dt ${o.cls || ''}" data-k="${k(f)}" value="${v(f)}" type="date" min="2026-01-01" max="2028-12-31" aria-label="${esc(o.label || 'Data')}">`,
    ta: (f, rows = 3, o = {}) => `<textarea class="lines ${o.cls || ''}" data-k="${k(f)}" rows="${rows}" data-rows="${rows}" placeholder="${esc(o.ph || '')}" aria-label="${esc(o.label || o.ph || f)}">${v(f)}</textarea>`,
    ck: (f, label = '', o = {}) => `<label class="chk ${o.cls || ''}"><input type="checkbox" data-k="${k(f)}" ${S.get(k(f)) ? 'checked' : ''}><i><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg></i>${label ? `<span>${label}</span>` : ''}</label>`,
    sel: (f, opts, o = {}) => `<select class="ln sel ${o.cls || ''}" data-k="${k(f)}" aria-label="${esc(o.label || f)}"><option value="">${esc(o.ph || '—')}</option>${opts.map((x) => `<option ${S.get(k(f)) === x ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`,
    rad: (f, opts, o = {}) => opts.map((x) => `<label class="rad"><input type="radio" name="${k(f)}" data-k="${k(f)}" value="${esc(x)}" ${S.get(k(f)) === x ? 'checked' : ''}><i></i><span>${esc(x)}</span></label>`).join(''),
    dots: (f, n = 5, o = {}) => Array.from({ length: n }, (_, i) => `<label class="dot ${o.cls || ''}"><input type="checkbox" data-k="${k(f + i)}" ${S.get(k(f + i)) ? 'checked' : ''}><i></i></label>`).join(''),
    stars: (f, n = 5) => `<span class="stars" role="group" aria-label="Ocena">${Array.from({ length: n }, (_, i) => `<label><input type="radio" name="${k(f)}" data-k="${k(f)}" value="${i + 1}" ${Number(S.get(k(f))) === i + 1 ? 'checked' : ''}><svg viewBox="0 0 24 24"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1L3.2 9.6l6.1-.8L12 3.2z"/></svg></label>`).join('')}</span>`,
  };
}

export const money = (n) => (Math.round(n * 100) / 100).toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
export const zl = (n) => `${money(n)} zł`;
