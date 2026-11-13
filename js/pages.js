// Definicje wszystkich stron planera. Każda strona to { id, name, sec, html(S), recalc?(root,S) }.
import * as C from './cal.js';
import { esc, icon, star4, fields, money, zl } from './ui.js';

export const SECTIONS = {
  front: 'Start', year: 'Rok 2027', strategy: 'Strategia', dates: 'Ważne daty', goals: 'Cele roczne', smart: 'Cele SMART',
  income: 'Przychody', mkt: 'Marketing', month: 'Miesiące', week: 'Tygodnie', notes: 'Notatki',
};

const MONTH_QUOTES = [
  'Rok jest jak czysta karta. Zapisz ją odważnie.',
  'Małe kroki robione codziennie budują duże wyniki.',
  'Dobry plan dziś bywa lepszy niż doskonały jutro.',
  'Konsekwencja to cichy fundament każdego sukcesu.',
  'Skup się na tym, co przybliża Cię do celu.',
  'Półmetek roku. Czas sprawdzić kierunek.',
  'Odpoczynek też jest częścią strategii.',
  'Dobre relacje z klientami to najlepszy kapitał.',
  'Nowy sezon, nowe możliwości. Wracamy na tory.',
  'Co mierzysz, to rośnie. Sprawdź swoje liczby.',
  'Domykaj sprawy. Doprowadź do końca.',
  'Podsumuj rok, podziękuj sobie i zaplanuj więcej.',
];
const MONTH_RIBBON = [
  'Nowy start. Jasny plan. Nieskończone możliwości.',
  'Krótszy miesiąc, pełna koncentracja.',
  'Wiosna zaczyna się od decyzji.',
  'Porządek w ofertach, porządek w głowie.',
  'Majówka za nami. Czas na wyniki.',
  'Półrocze: policz, wyciągnij wnioski, ruszaj dalej.',
  'Lato sprzyja prezentacjom. Wykorzystaj to.',
  'Zbierz siły, zaplanuj jesień.',
  'Wracamy do pełnego tempa.',
  'Złota jesień, złote transakcje.',
  'Doprowadź do końca.',
  'Dobry koniec roku to dobry początek następnego.',
];

export const INC_CATS = ['Prowizja – sprzedaż', 'Prowizja – wynajem', 'Prowizja – strona kupująca', 'Doradztwo kredytowe', 'Wycena i doradztwo', 'Inne'];
export const PIE_COLORS = ['#C8A44D', '#0B0B0D', '#E6CE94', '#8A7231', '#9A978F', '#6E5721', '#55544F', '#CFCBC2', '#B58B2E'];
const MKT_CHANNELS = ['Portale ogłoszeniowe', 'Media społecznościowe', 'Strona WWW / SEO', 'Reklama płatna (Google, Meta)', 'E-mail / newsletter', 'Polecenia i partnerzy', 'Materiały drukowane', 'Dni otwarte / prezentacje', 'Inne'];
const DATE_CATS = ['Podatki i ZUS', 'Umowy i formalności', 'Oferty i prezentacje', 'Spotkania', 'Marketing', 'Finanse', 'Szkolenia', 'Inne'];

// ---------- wspólne elementy ----------
const head = (ic, title, sub, quote) => `<header class="ph">
  <div class="ph-ic">${icon(ic)}</div>
  <div class="ph-t"><h2>${title}</h2>${sub ? `<p class="ph-sub">${sub}</p>` : ''}</div>
  ${quote ? `<blockquote class="ph-q"><span>“</span>${quote}<span>”</span></blockquote>` : ''}
  <div class="corner"><img src="icons/icon-192.png" alt="" width="40" height="40"></div>
</header>`;
const bar = (ic, text, extra = '') => `<div class="bar">${ic ? icon(ic) : ''}<span>${text}</span>${extra}</div>`;
const ribbon = (t) => `<div class="ribbon">${star4}<span>${esc(t).toUpperCase()}</span></div>`;
const lab = (t) => `<span class="fl">${t}</span>`;
const fld = (ic, label, input, cls = '') => `<label class="fld ${cls}">${ic ? `<b class="fi">${icon(ic)}</b>` : ''}<span class="fb">${lab(label)}${input}</span></label>`;
const bl = (F, f, n, ph = '') => Array.from({ length: n }, (_, i) => `<div class="bl"><i></i>${F.in(f + i, { ph: i === 0 ? ph : '' })}</div>`).join('');
const ckl = (F, f, n, ph = '') => Array.from({ length: n }, (_, i) => `<div class="cl">${F.ck(f + 'c' + i)}${F.in(f + i, { ph: i === 0 ? ph : '' })}</div>`).join('');
const nameOf = (S) => S.get('_|name', 'AM Nieruchomości');
const clearBtn = (id) => `<div class="pg-tools"><button class="btn-s" data-clear="${id}">${icon('trash')}<span>Wyczyść stronę</span></button></div>`;

// ---------- okładka ----------
const SKY = (() => {
  const b = [[10, 70, 26], [40, 40, 30], [74, 90, 34], [112, 55, 24], [140, 100, 36], [182, 62, 28], [214, 84, 34], [252, 46, 26], [282, 72, 30], [316, 58, 24]];
  return `<svg class="sky" viewBox="0 0 340 120" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${b.map(([x, h, w]) => {
    let win = '';
    for (let y = 120 - h + 8; y < 114; y += 9) for (let xx = x + 4; xx < x + w - 4; xx += 7) win += `<rect x="${xx}" y="${y}" width="3" height="4" rx=".6"/>`;
    return `<g><rect x="${x}" y="${120 - h}" width="${w}" height="${h}" rx="1"/><g class="win">${win}</g></g>`;
  }).join('')}</svg>`;
})();

function cover(S) {
  return `<div class="cover">
  <div class="cv-tri tl"></div><div class="cv-tri br"></div><div class="cv-frame"></div>
  <div class="cv-body">
    <div class="cv-year"><i></i><span>2027</span><i></i></div>
    <h1 class="cv-h">PLANER</h1>
    <div class="cv-sub"><i></i><span>B I Z N E S O W Y</span><i></i></div>
    <div class="cv-seal"><img src="icons/icon-512.png" alt="Logo planera" width="120" height="120"></div>
    <div class="cv-name">${esc(nameOf(S))}</div>
    <div class="cv-tag">Planuj. Skup się. Działaj. Osiągaj.</div>
    ${SKY}
    <div class="cv-foot">${icon('chart')}<div><b>ROZWIJAJ BIZNES</b><b>BUDUJ PRZYSZŁOŚĆ</b></div></div>
  </div></div>`;
}

// ---------- spis treści ----------
function toc(S, ctx) {
  const items = [
    ['calendar', 'Rok 2027 na rzut oka', 'Dwanaście miesięcy i święta w jednym miejscu', 'year'],
    ['chart', 'Strategia biznesowa', 'Wizja, misja, SWOT, KPI i plan działań', 'strategy'],
    ['calendar', 'Ważne daty i terminy', 'Terminy, przypomnienia, rzeczy do zapamiętania', 'dates'],
    ['target', 'Roczne cele biznesowe', 'Pięć największych celów, kamienie milowe', 'goals'],
    ['flag', 'Planer celów SMART', 'Dowolna liczba stron, jeden cel na stronę', 'smart:1'],
    ['dollar', 'Tracker przychodów', 'Dziennik, podsumowanie roczne, wykres', 'income'],
    ['megaphone', 'Planer kampanii marketingowej', 'Kanały, budżet, oś czasu, KPI', 'mkt:1'],
    ['calendar', 'Kalendarze miesięczne', 'Dwanaście miesięcy z priorytetami i notatkami', 'month:2027-01'],
    ['briefcase', 'Planery tygodniowe', 'Pięćdziesiąt trzy tygodnie z harmonogramem godzinowym', ctx.firstWeek],
    ['pen', 'Notatki', 'Strony w linie na wszystko inne', 'notes:1'],
  ];
  return `${head('book', 'SPIS <em>TREŚCI</em>', 'Twój planer na rok 2027', 'Doprowadź do końca.')}
  <div class="pg-body">
   <div class="toc">${items.map(([ic, t, d, go], i) => `<a class="toc-i" data-go="${go}"><b class="toc-n">${i + 1}</b><span class="toc-ic">${icon(ic)}</span><span class="toc-t"><strong>${t}</strong><small>${d}</small></span>${icon('right', 'toc-ar')}</a>`).join('')}</div>
   <div class="toc-m"><div class="bar">${icon('calendar')}<span>SKOK DO MIESIĄCA</span></div><div class="chips">${C.MONTHS.map((m, i) => `<a class="chip" data-go="month:2027-${C.pad(i + 1)}">${C.MON3[i]}</a>`).join('')}</div></div>
   <div class="row2">
     <div class="card"><div class="bar">${icon('home')}<span>MOJA FIRMA</span></div><div class="card-b">${fld('', 'Nazwa firmy (widoczna na okładce)', `<input class="ln" data-k="_|name" value="${esc(S.get('_|name', 'AM Nieruchomości'))}" placeholder="AM Nieruchomości" autocomplete="off">`)}
       ${fld('', 'Moje motto na 2027', `<input class="ln" data-k="toc|motto" value="${esc(S.get('toc|motto'))}" placeholder="Np. Sprawdzone do końca" autocomplete="off">`)}</div></div>
     <div class="card"><div class="bar">${icon('bulb')}<span>SZYBKI START</span></div><ul class="tips">
       <li>Dotknij dowolnego pola i pisz. Zapis jest <b>automatyczny</b>.</li>
       <li>Przesuń palcem w bok, żeby przewrócić stronę.</li>
       <li>Dotknij dnia w kalendarzu, by dodać wpisy i godziny.</li>
       <li>Dane są na tym urządzeniu. Raz w tygodniu zrób kopię: ⚙ Ustawienia → Eksport.</li></ul></div>
   </div>
   ${ribbon('Plan. Skupienie. Działanie. Sukces.')}
  </div>`;
}

// ---------- rok na rzut oka ----------
function year(S) {
  const holList = Object.entries(C.HOL).filter(([, v]) => v.some((h) => h.off)).sort();
  const sat = C.saturdayHolidays();
  let work = 0, off = 0;
  for (let m = 0; m < 12; m++) { const s = C.monthStats(C.YEAR, m); work += s.work; off += s.off; }
  const mini = (m) => {
    const rows = C.monthGrid(C.YEAR, m);
    return `<div class="mini"><a class="mini-t" data-go="month:2027-${C.pad(m + 1)}">${C.MONTHS[m]}</a>
      <div class="mini-g">${C.DOW1.map((d, i) => `<b class="${i > 4 ? 'we' : ''}">${d}</b>`).join('')}${rows.flat().map((d) => {
      if (!d) return '<span></span>';
      const k = C.iso(d), h = C.holidaysOn(k), hasEv = S.get(`ev:${k}|d`) || S.keys(`ev:${k}|h`).length;
      const cls = [C.dow(d) > 4 ? 'we' : '', h.some((x) => x.off) ? 'ho' : h.length ? 'ob' : '', hasEv ? 'ev' : ''].join(' ');
      return `<button class="${cls}" data-day="${k}" title="${esc(C.holName(k))}">${d.getUTCDate()}</button>`;
    }).join('')}</div></div>`;
  };
  return `${head('calendar', 'ROK <em>2027</em>', 'Cały rok na rzut oka', 'Plan na rok zaczyna się od jednego spojrzenia.')}
  <div class="pg-body">
    <div class="minis">${Array.from({ length: 12 }, (_, m) => mini(m)).join('')}</div>
    <div class="legend"><span><i class="lg ho"></i>Święto wolne od pracy</span><span><i class="lg ob"></i>Okolicznościowe</span><span><i class="lg we"></i>Weekend</span><span><i class="lg ev"></i>Dzień z wpisem</span></div>
    <div class="row2">
      <div class="card"><div class="bar">${icon('flag')}<span>ŚWIĘTA WOLNE W 2027</span></div><ul class="hol-l">${holList.map(([k, v]) => { const d = C.parse(k); return `<li><b>${d.getUTCDate()} ${C.MON3[d.getUTCMonth()]}</b><span>${C.DOW3[C.dow(d)]}</span><em>${esc(v.filter((h) => h.off).map((h) => h.n).join(', '))}</em></li>`; }).join('')}</ul></div>
      <div class="card"><div class="bar">${icon('chart')}<span>W LICZBACH</span></div><div class="stat-g">
        <div><b>${work}</b><span>dni roboczych (pon–pt bez świąt)</span></div><div><b>${off}</b><span>dni wolnych (weekendy i święta)</span></div><div><b>365</b><span>dni w roku</span></div><div><b>53</b><span>tygodnie w planerze</span></div></div>
        ${sat.length ? `<p class="note-s">${icon('bulb')}<span>${sat.map((s) => { const d = C.parse(s.date); return `${d.getUTCDate()} ${C.MONTHS_GEN[d.getUTCMonth()]} (${esc(s.name)})`; }).join(' i ')} wypada w sobotę. Pracownikom przysługuje wtedy inny dzień wolny.</span></p>` : ''}</div>
    </div>
    ${ribbon('Rok pełen możliwości zaczyna się od planu')}
  </div>`;
}

// ---------- strategia ----------
function strategy(S) {
  const F = fields(S, 'strategy');
  return `${head('chart', 'STRATEGIA <em>BIZNESOWA</em>', 'Planuj z celem. Działaj z koncentracją. Osiągaj dzięki strategii.', 'Dobra strategia zamienia wizję w wyniki.')}
  <div class="pg-body">
   <div class="row4">${fld('home', 'Nazwa firmy', `<input class="ln" data-k="_|name" value="${esc(nameOf(S))}" autocomplete="off">`)}${fld('calendar', 'Data', F.dt('date'))}${fld('star', 'Wizja', F.in('vision', { ph: 'Dokąd zmierzamy?' }))}${fld('target', 'Misja', F.in('mission', { ph: 'Po co istniejemy?' }))}</div>
   <div class="row2">
    <div class="card">${bar('target', '1. OBSZARY STRATEGICZNE')}<div class="card-b"><p class="hint">Jakie są kluczowe obszary, które zadecydują o rozwoju i sukcesie?</p>${bl(F, 'fa', 5, 'Np. pozyskiwanie ofert na wyłączność')}</div></div>
    <div class="card">${bar('chart', '2. ANALIZA SWOT')}<div class="card-b swot">
      <div><h5>${icon('star')}MOCNE STRONY</h5>${bl(F, 'sw_s', 3)}</div><div><h5>${icon('flag')}SŁABE STRONY</h5>${bl(F, 'sw_w', 3)}</div>
      <div><h5>${icon('bulb')}SZANSE</h5>${bl(F, 'sw_o', 3)}</div><div><h5>${icon('target')}ZAGROŻENIA</h5>${bl(F, 'sw_t', 3)}</div></div></div>
   </div>
   <div class="row2">
    <div class="card">${bar('trophy', '3. CELE STRATEGICZNE')}<div class="card-b"><p class="hint">Co chcemy osiągnąć?</p>${bl(F, 'sg', 5)}</div></div>
    <div class="card">${bar('bars', '4. WSKAŹNIKI EFEKTYWNOŚCI (KPI)')}<div class="card-b"><p class="hint">Jak zmierzymy sukces?</p>${bl(F, 'kpi', 5, 'Np. liczba podpisanych umów pośrednictwa')}</div></div>
   </div>
   <div class="card">${bar('list', '5. KLUCZOWE STRATEGIE I PLAN DZIAŁAŃ')}<div class="card-b"><div class="tbl" style="--c:1.8fr 1fr 130px">
      <div class="tr th"><span>Kluczowe działanie</span><span>Odpowiedzialny</span><span>Termin</span></div>
      ${Array.from({ length: 5 }, (_, i) => `<div class="tr">${F.in('ka' + i)}${F.in('kr' + i)}${F.dt('kt' + i)}</div>`).join('')}</div></div></div>
   <div class="row2">
    <div class="card">${bar('repeat', '6. PRZEGLĄD I ADAPTACJA')}<div class="card-b"><p class="hint">Częstotliwość przeglądu</p><div class="opts">${['Co tydzień', 'Co miesiąc', 'Co kwartał', 'Co rok'].map((x, i) => F.ck('rv' + i, x)).join('')}</div>
      <p class="hint">Jak dostosujemy strategię w czasie?</p>${F.ta('rvt', 3)}</div></div>
    <div class="card">${bar('bulb', 'NOTATKI I DODATKOWE POMYSŁY')}<div class="card-b">${F.ta('notes', 5)}</div></div>
   </div>
   ${ribbon('Strategia dziś. Sukces jutro.')}${clearBtn('strategy')}
  </div>`;
}

// ---------- ważne daty ----------
function dates(S) {
  const F = fields(S, 'dates');
  const n = Number(S.get('dates|_n', 14));
  const pr = (i) => ['W', 'Ś', 'N'].map((x, j) => `<label class="rad s" title="${['Wysoki', 'Średni', 'Niski'][j]}"><input type="radio" name="dates|r${i}.p" data-k="dates|r${i}.p" value="${['Wysoki', 'Średni', 'Niski'][j]}" ${S.get(`dates|r${i}.p`) === ['Wysoki', 'Średni', 'Niski'][j] ? 'checked' : ''}><i></i><span>${x}</span></label>`).join('');
  const rows = Array.from({ length: n }, (_, i) => `<div class="tr">${F.dt(`r${i}.d`)}<span class="dn" data-dayfor="dates|r${i}.d"></span>${F.in(`r${i}.e`, { ph: i === 0 ? 'Co i kiedy' : '' })}${F.sel(`r${i}.c`, DATE_CATS, { ph: '' })}${F.sel(`r${i}.p`, ['Wysoki', 'Średni', 'Niski'], { ph: '—', label: 'Priorytet' })}${F.in(`r${i}.n`, { cls: 'hs' })}</div>`).join('');
  const q = [['Q1 (sty–mar)', 'q1'], ['Q2 (kwi–cze)', 'q2'], ['Q3 (lip–wrz)', 'q3'], ['Q4 (paź–gru)', 'q4']];
  const todo = ['Terminy podatkowe i ZUS', 'Odnowienia umów pośrednictwa', 'Ubezpieczenie OC pośrednika', 'Licencje, uprawnienia i szkolenia', 'Spotkania zespołu i podsumowania', 'Prezentacje i nowe oferty', 'Kampanie marketingowe', 'Rozliczenia i podsumowania finansowe', 'Święta i dni wolne'];
  return `${head('calendar', 'WAŻNE DATY <em>i terminy</em>', 'Planuj z wyprzedzeniem. Skup się. Osiągaj więcej.', 'Dobrze zaplanowany harmonogram tworzy więcej możliwości i większy sukces.')}
  <div class="pg-body">
   <div class="row3">${fld('home', 'Nazwa firmy', `<input class="ln" data-k="_|name" value="${esc(nameOf(S))}" autocomplete="off">`)}${fld('calendar', 'Rok', '<input class="ln" value="2027" readonly>')}${fld('target', 'Moje 3 priorytety roku', F.in('top', { ph: '1. … 2. … 3. …' }))}</div>
   <div class="card">${bar('star', 'WSZYSTKIE WAŻNE DATY I TERMINY', `<button class="bar-btn" data-more="dates|_n" data-step="5">${icon('plus')}<span>5 wierszy</span></button>`)}
    <div class="card-b scrollx"><div class="tbl dts" style="--c:128px 54px 1.8fr 1.1fr 82px 1fr;min-width:640px"><div class="tr th"><span>Data</span><span>Dzień</span><span>Wydarzenie / termin</span><span>Kategoria</span><span>Priorytet</span><span class="hs">Notatki</span></div>${rows}</div></div></div>
   <div class="row3 q3">
    <div class="card">${bar('calendar', 'PRZEGLĄD KWARTALNY')}<div class="card-b">${q.map(([t, f]) => `<div class="qb"><h5>${t}</h5>${bl(F, f, 2)}</div>`).join('')}</div></div>
    <div class="card">${bar('clock', 'MIESIĘCZNE PRZYPOMNIENIA')}<div class="card-b mrem">${C.MONTHS.map((m, i) => `<div class="mr"><b>${C.MON3[i].toUpperCase()}</b>${F.in('mr' + i)}</div>`).join('')}</div></div>
    <div class="card">${bar('check', 'RZECZY DO ZAPAMIĘTANIA')}<div class="card-b">${todo.map((t, i) => `<div class="cl">${F.ck('td' + i)}<span class="cl-t">${t}</span></div>`).join('')}${ckl(F, 'tx', 2)}<p class="sig">${icon('star')}<span>Przygotowanie dziś tworzy sukces jutro.</span></p></div></div>
   </div>
   <div class="card">${bar('pen', 'NOTATKI')}<div class="card-b">${F.ta('notes', 3)}</div></div>
   ${ribbon('Dobre planowanie dziś buduje lepszy biznes jutro.')}${clearBtn('dates')}
  </div>`;
}

// ---------- cele roczne ----------
function goals(S) {
  const F = fields(S, 'goals');
  const ics = ['flag', 'chart', 'users', 'megaphone', 'trophy'];
  const sm = ['Konkretny', 'Mierzalny', 'Osiągalny', 'Istotny', 'Terminowy'];
  return `${head('target', 'ROCZNE CELE <em>BIZNESOWE</em>', 'Duże cele. Jasny plan. Mocne wyniki.', 'Cel bez planu jest tylko życzeniem.')}
  <div class="pg-body">
   <div class="row2 how">
     <div class="howto"><b class="fi">${icon('bulb')}</b><div>${lab('JAK KORZYSTAĆ')}<p>Zapisz największe cele biznesowe na ten rok. Rozbij je na konkretne kroki i działaj konsekwentnie, aby je osiągnąć.</p></div></div>
     <div class="focus">${lab('MÓJ FOKUS NA TEN ROK')}${F.ta('focus', 2, { ph: 'Np. wzrost, wyłączności, polecenia' })}</div>
   </div>
   ${bar('star', 'MOJE 5 NAJWAŻNIEJSZYCH CELÓW BIZNESOWYCH NA TEN ROK', '', true)}
   <div class="goals">${Array.from({ length: 5 }, (_, i) => `<div class="goal"><div class="g-n"><b>${i + 1}</b>${icon(ics[i])}</div>
     <div class="g-m"><label class="g-l"><span>CEL:</span>${F.in('g' + i, { ph: i === 0 ? 'Np. 30 transakcji w 2027 roku' : '' })}</label><label class="g-l"><span>DLACZEGO TO WAŻNE:</span>${F.in('w' + i)}</label></div>
     <div class="g-s"><div class="g-sh">${['S', 'M', 'A', 'R', 'T'].map((x) => `<b>${x}</b>`).join('')}</div>${sm.map((x, j) => `<div class="g-sr">${F.ck(`s${i}_${j}`)}<span>${x}</span></div>`).join('')}</div></div>`).join('')}</div>
   <div class="row2">
    <div class="card">${bar('flag', 'KAMIENIE MILOWE')}<div class="card-b">${Array.from({ length: 5 }, (_, i) => `<div class="ms"><b>${i + 1}.</b>${F.in('ms' + i)}${F.dt('md' + i)}</div>`).join('')}</div></div>
    <div class="card">${bar('repeat', 'JAK BĘDĘ OCENIAĆ POSTĘPY')}<div class="card-b"><div class="opts col">${F.rad('rev', ['Codziennie', 'Co tydzień', 'Co miesiąc', 'Co kwartał', 'Inne'])}</div>${F.in('revo', { ph: 'Np. w niedziele o 10:00' })}</div></div>
   </div>
   ${ribbon('Skup się na celu. Zaufaj procesowi. Świętuj postępy.')}${clearBtn('goals')}
  </div>`;
}

// ---------- cele SMART ----------
function smart(S, id) {
  const F = fields(S, id);
  const qs = [
    ['S', 'target', 'KONKRETNY', 'Określ dokładnie, co chcesz osiągnąć.', 'Co dokładnie chcę osiągnąć?'],
    ['M', 'chart', 'MIERZALNY', 'Ustal liczby, dzięki którym zobaczysz postęp.', 'Jak zmierzę postępy? Jakie są kluczowe wskaźniki?'],
    ['A', 'trophy', 'OSIĄGALNY', 'Cel ma być ambitny, ale realny.', 'Jak to osiągnę? Jakich zasobów potrzebuję?'],
    ['R', 'puzzle', 'ISTOTNY', 'Cel ma pasować do wizji Twojego biznesu.', 'Dlaczego jest ważny? Jak wpisuje się w moją wizję?'],
    ['T', 'clock', 'TERMINOWY', 'Daj sobie jasny termin i harmonogram.', 'Jaki jest mój termin? Jaki mam harmonogram?'],
  ];
  const n = Number(S.get('_|n.smart', 1)), idx = Number(id.split(':')[1]);
  return `${head('flag', 'PLANER CELÓW <em>SMART</em>', `Wyznacz jasne cele. Działaj. Osiągaj sukces.${n > 1 ? ` <b class="pn">Cel ${idx}/${n}</b>` : ''}`, 'Zapisany cel staje się planem.')}
  <div class="pg-body">
   <div class="row4 sm-top">${fld('flag', 'Tytuł celu', F.in('title', { ph: 'Np. Pozyskać 12 ofert na wyłączność do czerwca' }), 'span2')}${fld('calendar', 'Termin', F.dt('target'))}${fld('calendar', 'Data', F.dt('date'))}</div>
   <div class="prio"><span class="fl">PRIORYTET</span>${F.rad('pr', ['Wysoki', 'Średni', 'Niski'])}</div>
   <div class="smart">${qs.map(([l, ic, t, d, q]) => `<div class="sm"><div class="sm-l"><b>${l}</b>${icon(ic === 'puzzle' ? 'users' : ic)}<small>${t}</small></div><div class="sm-b"><p class="hint">${d}</p><span class="fl">${q}</span>${F.ta('t' + l, 2)}</div></div>`).join('')}</div>
   <div class="row3">
    <div class="card">${bar('list', 'KROKI DZIAŁANIA')}<div class="card-b"><p class="hint">Rozbij cel na konkretne kroki.</p>${ckl(F, 'st', 6)}</div></div>
    <div class="card">${bar('flag', 'POTENCJALNE WYZWANIA')}<div class="card-b"><p class="hint">Co może przeszkodzić i jak temu zaradzę?</p>${bl(F, 'ch', 6)}</div></div>
    <div class="card">${bar('trophy', 'SPRAWDZIAN SUKCESU')}<div class="card-b"><p class="hint">Skąd będę wiedzieć, że osiągnąłem cel?</p>${[1, 2, 3, 4].map((x) => `<div class="cl">${F.ck('mc' + x)}${F.in('ml' + x, { ph: `Etap ${x}` })}</div>`).join('')}<div class="cl">${F.ck('done')}<span class="cl-t">Data osiągnięcia celu</span>${F.dt('dd')}</div><p class="sig">${icon('star')}<span>Świętuj swoje postępy!</span></p></div></div>
   </div>
   ${ribbon('Marz. Planuj. Działaj. Osiągaj.')}
   <div class="pg-tools"><button class="btn-s" data-add="smart">${icon('plus')}<span>Dodaj kolejny cel</span></button>${n > 1 && idx === n ? `<button class="btn-s" data-del="smart">${icon('trash')}<span>Usuń tę stronę</span></button>` : `<button class="btn-s" data-clear="${id}">${icon('trash')}<span>Wyczyść stronę</span></button>`}</div>
  </div>`;
}

// ---------- tracker przychodów ----------
function income(S) {
  const F = fields(S, 'income');
  const n = Number(S.get('income|_n', 16));
  const PAY = ['Przelew', 'Gotówka', 'Karta', 'Inne'];
  const rows = Array.from({ length: n }, (_, i) => `<div class="tr">${F.dt(`r${i}.d`)}${F.in(`r${i}.s`, { ph: i === 0 ? 'Klient / źródło' : '' })}${F.in(`r${i}.o`, { ph: i === 0 ? 'Adres oferty, opis' : '' })}${F.sel(`r${i}.c`, INC_CATS, { ph: '' })}${F.num(`r${i}.a`)}${F.sel(`r${i}.p`, PAY, { ph: '', cls: 'hs' })}${F.in(`r${i}.n`, { cls: 'hs' })}</div>`).join('');
  return `${head('dollar', 'TRACKER <em>PRZYCHODÓW</em>', 'Śledź. Rośnij. Osiągaj.', 'Znajomość swoich przychodów to pierwszy krok do budowania sukcesu.')}
  <div class="pg-body">
   <div class="row4">${fld('home', 'Nazwa firmy', `<input class="ln" data-k="_|name" value="${esc(nameOf(S))}" autocomplete="off">`)}${fld('calendar', 'Rok', '<input class="ln" value="2027" readonly>')}${fld('target', 'Roczny cel przychodów (zł)', F.num('goal', { ph: 'Np. 480 000' }))}${fld('trophy', 'Łączny przychód', '<span class="calc big" data-bind="total">0 zł</span>')}</div>
   <div class="prog" title="Realizacja rocznego celu"><div class="prog-b"><i data-bind="pbar"></i></div><span data-bind="ptxt"></span></div>
   <div class="card">${bar('bars', 'PODSUMOWANIE PRZYCHODÓW (ROK NA RZUT OKA)')}<div class="card-b"><div class="sum">${C.MON3.map((m, i) => `<div class="sc"><b>${m.toUpperCase()}</b><span data-bind="m${i}">–</span></div>`).join('')}<div class="sc tot"><b>RAZEM</b><span data-bind="total2">–</span></div></div></div></div></div>
   <div class="card">${bar('list', 'DZIENNIK PRZYCHODÓW', `<button class="bar-btn" data-more="income|_n" data-step="5">${icon('plus')}<span>5 wierszy</span></button>`)}
    <div class="card-b scrollx"><div class="tbl inc" style="--c:126px 1fr 1.2fr 1.3fr 104px 92px .9fr;min-width:760px"><div class="tr th"><span>Data</span><span>Klient / źródło</span><span>Opis / oferta</span><span>Kategoria</span><span class="r">Kwota (zł)</span><span class="hs">Płatność</span><span class="hs">Notatki</span></div>${rows}
     <div class="tr tf"><span></span><span></span><span></span><span class="r">RAZEM</span><span class="r" data-bind="total3">0 zł</span><span class="hs"></span><span class="hs"></span></div></div></div></div>
   <div class="row3">
    <div class="card">${bar('chart', 'PRZYCHÓD WG KATEGORII')}<div class="card-b pie-w"><div class="pie" data-bind-pie="cat"></div><ul class="leg" data-bind-leg="cat"></ul></div></div>
    <div class="card">${bar('trophy', 'NAJLEPSZE ŹRÓDŁA PRZYCHODU')}<div class="card-b"><ol class="top5" data-bind-top="src"></ol><p class="sig">${icon('star')}<span>Skup się na tym, co daje największą wartość.</span></p></div></div>
    <div class="card">${bar('bulb', 'NOTATKI I WNIOSKI')}<div class="card-b">${F.ta('notes', 6)}</div></div>
   </div>
   <p class="hint ctr">Przychody są sumowane automatycznie według daty (miesiące) i kategorii. Wiersze bez daty liczą się tylko do sumy rocznej.</p>
   ${ribbon('Śledź dziś. Rośnij jutro. Osiągaj zawsze.')}${clearBtn('income')}
  </div>`;
}

// wykres kołowy SVG z listy [wartość, kolor]
export function pieSvg(parts) {
  const tot = parts.reduce((a, p) => a + p[0], 0);
  if (tot <= 0) return '<svg viewBox="0 0 100 100" class="pie-s"><circle cx="50" cy="50" r="38" fill="none" stroke="var(--line)" stroke-width="16"/><text x="50" y="53" text-anchor="middle" class="pie-e">brak danych</text></svg>';
  let a0 = -Math.PI / 2, out = '';
  const R = 46, r = 24;
  parts.forEach(([v, col]) => {
    if (v <= 0) return;
    const a1 = a0 + (v / tot) * Math.PI * 2;
    if (parts.filter((p) => p[0] > 0).length === 1) out += `<circle cx="50" cy="50" r="${(R + r) / 2}" fill="none" stroke="${col}" stroke-width="${R - r}"/>`;
    else {
      const x0 = 50 + R * Math.cos(a0), y0 = 50 + R * Math.sin(a0), x1 = 50 + R * Math.cos(a1), y1 = 50 + R * Math.sin(a1);
      const x2 = 50 + r * Math.cos(a1), y2 = 50 + r * Math.sin(a1), x3 = 50 + r * Math.cos(a0), y3 = 50 + r * Math.sin(a0);
      const big = a1 - a0 > Math.PI ? 1 : 0;
      out += `<path d="M${x0} ${y0}A${R} ${R} 0 ${big} 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 ${big} 0 ${x3} ${y3}Z" fill="${col}" stroke="var(--paper)" stroke-width=".8"/>`;
    }
    a0 = a1;
  });
  return `<svg viewBox="0 0 100 100" class="pie-s" role="img" aria-label="Wykres kołowy">${out}</svg>`;
}

function recalcIncome(root, S) {
  const n = Number(S.get('income|_n', 16));
  const mon = Array(12).fill(0), cat = {}, src = {};
  let total = 0;
  for (let i = 0; i < Math.max(n, 200); i++) {
    const a = S.num(`income|r${i}.a`);
    if (!a) continue;
    total += a;
    const d = S.get(`income|r${i}.d`);
    if (d && d.startsWith('2027-')) mon[Number(d.slice(5, 7)) - 1] += a;
    const c = S.get(`income|r${i}.c`) || 'Bez kategorii';
    cat[c] = (cat[c] || 0) + a;
    const s = (S.get(`income|r${i}.s`) || '').trim();
    if (s) { const key = s.toLocaleLowerCase('pl'); src[key] = src[key] || { n: s, v: 0 }; src[key].v += a; }
  }
  const q = (k) => root.querySelector(`[data-bind="${k}"]`);
  mon.forEach((v, i) => { const e = q('m' + i); if (e) e.textContent = v ? money(v) : '–'; });
  ['total2', 'total3'].forEach((k) => { const e = q(k); if (e) e.textContent = k === 'total3' ? zl(total) : (total ? money(total) : '–'); });
  const t = q('total'); if (t) t.textContent = zl(total);
  const goal = S.num('income|goal');
  const pb = q('pbar'), pt = q('ptxt');
  if (pb && pt) { const p = goal > 0 ? Math.min(100, (total / goal) * 100) : 0; pb.style.width = p + '%'; pt.textContent = goal > 0 ? `${Math.round((total / goal) * 100)}% rocznego celu` : 'Wpisz roczny cel, aby zobaczyć postęp'; }
  const catKeys = [...INC_CATS, 'Bez kategorii'].filter((k) => cat[k]);
  const parts = catKeys.map((k, i) => [cat[k], PIE_COLORS[i % PIE_COLORS.length]]);
  const pie = root.querySelector('[data-bind-pie]'); if (pie) pie.innerHTML = pieSvg(parts);
  const leg = root.querySelector('[data-bind-leg]');
  if (leg) leg.innerHTML = (catKeys.length ? catKeys : INC_CATS.slice(0, 4)).map((k, i) => `<li><i style="background:${PIE_COLORS[i % PIE_COLORS.length]}"></i><span>${esc(k)}</span><b>${cat[k] ? money(cat[k]) : '–'}</b></li>`).join('');
  const top = root.querySelector('[data-bind-top]');
  if (top) { const arr = Object.values(src).sort((a, b) => b.v - a.v).slice(0, 5); top.innerHTML = Array.from({ length: 5 }, (_, i) => `<li><span>${arr[i] ? esc(arr[i].n) : ''}</span><b>${arr[i] ? zl(arr[i].v) : ''}</b></li>`).join(''); }
}

// ---------- kampania marketingowa ----------
function mkt(S, id) {
  const F = fields(S, id);
  const n = Number(S.get('_|n.mkt', 1)), idx = Number(id.split(':')[1]);
  const kpis = ['Wyświetlenia ofert', 'Zapytania (leady)', 'Prezentacje', 'Koszt pozyskania leada', 'Podpisane umowy', 'Przychód z kampanii'];
  const chk = ['Określ cel i grupę docelową', 'Wybierz kanały marketingowe', 'Przygotuj zdjęcia, opisy i materiały', 'Ustal budżet i harmonogram', 'Uruchom kampanię', 'Monitoruj wyniki co tydzień', 'Zoptymalizuj działania', 'Podsumuj i zapisz wnioski'];
  const tl = Array.from({ length: 6 }, (_, i) => `<div class="tr">${F.in('tl' + i + '.t')}${F.dt('tl' + i + '.s')}${F.dt('tl' + i + '.e')}${F.in('tl' + i + '.r')}${F.sel('tl' + i + '.st', ['Do zrobienia', 'W toku', 'Gotowe'], { ph: '' })}</div>`).join('');
  return `${head('megaphone', 'PLANER KAMPANII <em>MARKETINGOWEJ</em>', `Planuj mądrze. Promuj mocno. Rośnij większy.${n > 1 ? ` <b class="pn">Kampania ${idx}/${n}</b>` : ''}`)}
  <div class="pg-body">
   <div class="row4 mk-top">${fld('megaphone', 'Nazwa kampanii', F.in('name', { ph: 'Np. Wiosna na Czechowie' }))}${fld('calendar', 'Data startu', F.dt('start'))}${fld('calendar', 'Data końca', F.dt('end'))}${fld('target', 'Cel kampanii', F.in('goal'))}</div>
   <div class="row2 stack">
    <div class="card">${bar('target', '1. PRZEGLĄD KAMPANII')}<div class="card-b ov">${[['Cel kampanii', 'ov1'], ['Kluczowy przekaz', 'ov2'], ['Propozycja wartości', 'ov3'], ['Grupa docelowa', 'ov4'], ['Opis kampanii', 'ov5']].map(([l, f]) => `<div class="ov-r"><span class="fl">${l}</span>${F.ta(f, 2)}</div>`).join('')}</div></div>
    <div class="card">${bar('megaphone', '2. KANAŁY I STRATEGIA')}<div class="card-b scrollx"><div class="tbl" style="--c:1.5fr 1fr 1fr 96px;min-width:420px"><div class="tr th"><span>Kanał</span><span>Podejście</span><span>Treść</span><span class="r">Budżet (zł)</span></div>
      ${MKT_CHANNELS.map((c, i) => `<div class="tr ch"><span class="chn">${F.ck('c' + i)}<em>${c}</em></span>${F.in('ca' + i)}${F.in('cm' + i)}${F.num('cb' + i)}</div>`).join('')}
      <div class="tr tf"><span></span><span></span><span class="r">ŁĄCZNY BUDŻET</span><span class="r" data-bind="btot">0 zł</span></div></div></div></div>
   </div>
   <div class="row2 stack">
    <div class="card">${bar('clock', '3. OŚ CZASU KAMPANII')}<div class="card-b scrollx"><div class="tbl" style="--c:1.5fr 118px 118px 1fr 104px;min-width:560px"><div class="tr th"><span>Zadanie</span><span>Start</span><span>Koniec</span><span>Odpowiedzialny</span><span>Status</span></div>${tl}</div></div></div>
    <div class="card">${bar('chart', '4. PODZIAŁ BUDŻETU')}<div class="card-b pie-w"><div class="pie" data-bind-pie="bud"></div><ul class="leg" data-bind-leg="bud"></ul></div></div>
   </div>
   <div class="row3">
    <div class="card">${bar('bars', '5. KPI I WSKAŹNIKI SUKCESU')}<div class="card-b scrollx"><div class="tbl" style="--c:1.4fr .7fr .7fr;min-width:300px"><div class="tr th"><span>Wskaźnik</span><span>Cel</span><span>Wynik</span></div>${kpis.map((k, i) => `<div class="tr"><span class="lbl">${k}</span>${F.in('kc' + i)}${F.in('kw' + i)}</div>`).join('')}</div></div></div>
    <div class="card">${bar('check', '6. CHECKLISTA KAMPANII')}<div class="card-b">${chk.map((t, i) => `<div class="cl">${F.ck('ck' + i)}<span class="cl-t">${t}</span></div>`).join('')}</div></div>
    <div class="card">${bar('bulb', '7. NOTATKI I POMYSŁY')}<div class="card-b">${F.ta('notes', 8)}</div></div>
   </div>
   ${ribbon('Planuj kampanię. Mierz wyniki. Zwiększaj zasięg.')}
   <div class="pg-tools"><button class="btn-s" data-add="mkt">${icon('plus')}<span>Dodaj kolejną kampanię</span></button>${n > 1 && idx === n ? `<button class="btn-s" data-del="mkt">${icon('trash')}<span>Usuń tę stronę</span></button>` : `<button class="btn-s" data-clear="${id}">${icon('trash')}<span>Wyczyść stronę</span></button>`}</div>
  </div>`;
}

function recalcMkt(root, S, id) {
  let tot = 0; const parts = [];
  MKT_CHANNELS.forEach((c, i) => { const v = S.num(`${id}|cb${i}`); tot += v; parts.push([v, PIE_COLORS[i % PIE_COLORS.length], c]); });
  const b = root.querySelector('[data-bind="btot"]'); if (b) b.textContent = zl(tot);
  const pie = root.querySelector('[data-bind-pie]'); if (pie) pie.innerHTML = pieSvg(parts);
  const leg = root.querySelector('[data-bind-leg]');
  if (leg) leg.innerHTML = parts.filter((p) => p[0] > 0).map((p) => `<li><i style="background:${p[1]}"></i><span>${esc(p[2])}</span><b>${money(p[0])}</b></li>`).join('') || '<li class="muted"><span>Wpisz budżety kanałów, aby zobaczyć podział.</span></li>';
}

// ---------- miesiąc ----------
function month(S, id) {
  const [y, mm] = id.split(':')[1].split('-').map(Number), m = mm - 1;
  const F = fields(S, id);
  const rows = C.monthGrid(y, m), st = C.monthStats(y, m);
  const weeks = C.weekStarts().filter((w) => C.weekMonth(w) === m);
  const weekOf = (d) => C.iso(C.addDays(d, -C.dow(d)));
  const body = rows.map((r) => {
    const first = r.find(Boolean), wk = weekOf(first), wn = C.isoWeek(first).week;
    return `<a class="wkn" data-go="week:${wk}" title="Otwórz tydzień ${wn}">${wn}</a>${r.map((d) => {
      if (!d) return '<span class="md empty"></span>';
      const k = C.iso(d), h = C.holidaysOn(k), note = S.get(`ev:${k}|d`), nh = S.keys(`ev:${k}|h`).length;
      const cls = ['md', C.dow(d) === 5 ? 'sat' : '', C.dow(d) === 6 ? 'sun' : '', h.some((x) => x.off) ? 'ho' : h.length ? 'ob' : '', k === C.todayIso() ? 'today' : ''].join(' ');
      return `<button class="${cls}" data-day="${k}"><span class="dn">${d.getUTCDate()}</span>${h.length ? `<span class="hn">${esc(h[0].n)}</span>` : ''}${note ? `<span class="pv">${esc(note.split('\n')[0])}</span>` : ''}${nh ? `<span class="cnt">${nh}</span>` : ''}</button>`;
    }).join('')}`;
  }).join('');
  return `<header class="ph mh"><div class="ph-t"><h2 class="mt">${C.MONTHS[m].toUpperCase()}</h2><p class="my"><i></i><span>${y}</span><i></i></p></div>
    <blockquote class="ph-q"><span>“</span>${MONTH_QUOTES[m]}<span>”</span></blockquote><div class="corner"><img src="icons/icon-192.png" alt="" width="40" height="40"></div></header>
  <div class="pg-body">
   <div class="mcal"><div class="mh-r"><b class="wkh">TYDZ.</b>${C.DOW3.map((d, i) => `<b class="${i > 4 ? 'we' : ''}">${d.toUpperCase()}</b>`).join('')}</div><div class="mg">${body}</div></div>
   <div class="m-st"><span><b>${st.work}</b> dni roboczych</span><span><b>${st.off}</b> dni wolnych</span><span class="wks">Tygodnie: ${weeks.map((w) => `<a data-go="week:${C.iso(w)}">${C.isoWeek(w).week}</a>`).join('')}</span></div>
   <div class="row2 mb">
    <div class="card">${bar('target', 'NAJWAŻNIEJSZE PRIORYTETY')}<div class="card-b">${Array.from({ length: 5 }, (_, i) => `<div class="cl pr"><b>${i + 1}</b>${F.in('p' + i)}${F.ck('pc' + i)}</div>`).join('')}</div></div>
    <div class="card">${bar('pen', 'NOTATKI')}<div class="card-b">${F.ta('notes', 6)}</div></div>
   </div>
   ${ribbon(MONTH_RIBBON[m])}
  </div>`;
}

// ---------- tydzień ----------
function week(S, id) {
  const ws = id.split(':')[1], mon = C.parse(ws), F = fields(S, id);
  const days = Array.from({ length: 7 }, (_, i) => C.addDays(mon, i));
  const iw = C.isoWeek(mon);
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);
  const focus = ['Pozyskiwanie ofert', 'Prezentacje i spotkania', 'Transakcje i formalności', 'Marketing i promocja', 'Finanse i rozliczenia', 'Klienci i relacje', 'Dokumenty i administracja', 'Rozwój i szkolenia'];
  const dh = days.map((d) => { const k = C.iso(d), h = C.holidaysOn(k); return { d, k, h, out: d.getUTCFullYear() !== C.YEAR }; });
  const head7 = dh.map(({ d, k, h, out }, i) => `<button class="sdh ${i > 4 ? 'we' : ''} ${h.some((x) => x.off) ? 'ho' : ''} ${out ? 'out' : ''}" data-day="${k}"><b>${C.DOW3[i]}</b><span>${d.getUTCDate()}</span>${h.length ? `<em>${esc(h[0].n)}</em>` : ''}</button>`).join('');
  const grid = hours.map((h) => `<span class="sh">${h}:00</span>${dh.map(({ k, h: hh }, i) => `<input class="slot ${i > 4 || hh.some((x) => x.off) ? 'we' : ''}" data-k="ev:${k}|h${C.pad(h)}" value="${esc(S.get(`ev:${k}|h${C.pad(h)}`))}" aria-label="${C.DOW[i]} ${h}:00" autocomplete="off">`).join('')}`).join('');
  const habit = Array.from({ length: 4 }, (_, i) => `<div class="hb">${F.in('h' + i, { ph: i === 0 ? 'Nawyk' : '' })}<span class="hd">${Array.from({ length: 7 }, (_, j) => `<label class="dot"><input type="checkbox" data-k="${id}|h${i}d${j}" ${S.get(`${id}|h${i}d${j}`) ? 'checked' : ''}><i></i></label>`).join('')}</span></div>`).join('');
  const work = dh.filter((x) => !C.isOff(x.d)).length;
  const topPr = Array.from({ length: 3 }, (_, i) => `<div class="cl pr"><b>${i + 1}</b>${F.in('p' + i)}${F.dt('pd' + i)}${F.ck('pc' + i)}</div>`).join('');
  const meet = dh.map(({ d }, i) => `<div class="mt-r"><b>${C.DOW3[i].toUpperCase()}</b>${F.in('mt' + i)}</div>`).join('');
  const wl = iw.week === 53 || (iw.week === 1 && mon.getUTCFullYear() === 2026) ? `${iw.week}/2026` : `${iw.week}`;
  return `${head('briefcase', 'TYGODNIOWY PLANER <em>BIZNESOWY</em>', 'Planuj mądrze. Pracuj skupiony. Osiągaj więcej.', '')}
  <div class="pg-body">
   <div class="row3 wk-top">${fld('calendar', 'Tydzień', `<span class="calc">${C.fmtRange(mon)} <small>· tydzień ${wl} · ${work} dni roboczych</small></span>`)}${fld('target', 'Cel tygodnia', F.in('goal', { ph: 'Co musi się wydarzyć?' }))}${fld('star', 'Główny priorytet', F.in('top'))}</div>
   <div class="wk-main">
    <div class="wk-l">
     <div class="card">${bar('target', 'CELE TYGODNIA')}<div class="card-b">${ckl(F, 'g', 5)}</div></div>
     <div class="card">${bar('star', 'NAJWAŻNIEJSZE PRIORYTETY')}<div class="card-b">${topPr}</div></div>
     <div class="card">${bar('list', 'LISTA ZADAŃ')}<div class="card-b">${ckl(F, 'td', 8)}</div></div>
    </div>
    <div class="wk-r"><div class="card">${bar('clock', 'HARMONOGRAM TYGODNIA')}<div class="card-b scrollx sch"><div class="sg" style="min-width:660px"><span class="sc"></span>${head7}${grid}</div></div></div></div>
   </div>
   <div class="row3">
    <div class="card">${bar('repeat', 'NAWYKI I RUTYNA')}<div class="card-b"><div class="hb hh"><span></span><span class="hd">${C.DOW1.map((x) => `<b>${x}</b>`).join('')}</span></div>${habit}</div></div>
    <div class="card">${bar('briefcase', 'OBSZARY SKUPIENIA')}<div class="card-b foc">${focus.map((t, i) => `<div class="cl">${F.ck('f' + i)}<span class="cl-t">${t}</span></div>`).join('')}</div></div>
    <div class="card">${bar('phone', 'SPOTKANIA I TELEFONY')}<div class="card-b">${meet}</div></div>
   </div>
   <div class="row3">
    <div class="card">${bar('trophy', 'PRZEGLĄD TYGODNIA')}<div class="card-b"><span class="fl">Co poszło dobrze?</span>${F.ta('rw', 2)}<span class="fl">Co poprawić?</span>${F.ta('rb', 2)}<div class="rate"><span class="fl">Ocena tygodnia</span>${F.stars('rate')}</div></div></div>
    <div class="card">${bar('flag', 'PLAN NA PRZYSZŁY TYDZIEŃ')}<div class="card-b">${F.ta('nx', 5, { ph: 'Najważniejsze tematy…' })}</div></div>
    <div class="card">${bar('pen', 'NOTATKI')}<div class="card-b">${F.ta('notes', 5)}</div></div>
   </div>
   ${ribbon('Skup się na tym, co ważne. Resztę zaplanuj.')}
  </div>`;
}

// ---------- notatki ----------
function notes(S, id) {
  const F = fields(S, id);
  const n = Number(S.get('_|n.notes', 3)), idx = Number(id.split(':')[1]);
  return `${head('pen', 'NOTATKI', `Pomysły, rozmowy, zobowiązania.${n > 1 ? ` <b class="pn">${idx}/${n}</b>` : ''}`, '')}
  <div class="pg-body"><div class="row2">${fld('', 'Temat', F.in('topic'))}${fld('calendar', 'Data', F.dt('date'))}</div>${F.ta('t', 26, { cls: 'big' })}
   <div class="pg-tools"><button class="btn-s" data-add="notes">${icon('plus')}<span>Dodaj stronę notatek</span></button>${n > 1 && idx === n ? `<button class="btn-s" data-del="notes">${icon('trash')}<span>Usuń tę stronę</span></button>` : ''}</div></div>`;
}

// ---------- lista stron ----------
export function buildPages(S) {
  const P = [];
  const add = (id, name, sec, html, recalc) => P.push({ id, name, sec, html, recalc });
  const weeks = C.weekStarts();
  const firstWeek = `week:${C.iso(weeks.find((w) => C.weekMonth(w) === 0) || weeks[0])}`;
  const ctx = { firstWeek };
  add('cover', 'Okładka', 'front', (s) => cover(s));
  add('toc', 'Spis treści', 'front', (s) => toc(s, ctx));
  add('year', 'Rok 2027 na rzut oka', 'year', year);
  add('strategy', 'Strategia biznesowa', 'strategy', strategy);
  add('dates', 'Ważne daty i terminy', 'dates', dates, (r, s) => recalcDates(r, s));
  add('goals', 'Roczne cele biznesowe', 'goals', goals);
  const ns = Number(S.get('_|n.smart', 1));
  for (let i = 1; i <= ns; i++) add(`smart:${i}`, `Cel SMART ${i}`, 'smart', (s) => smart(s, `smart:${i}`));
  add('income', 'Tracker przychodów', 'income', income, recalcIncome);
  const nm = Number(S.get('_|n.mkt', 1));
  for (let i = 1; i <= nm; i++) add(`mkt:${i}`, `Kampania ${i}`, 'mkt', (s) => mkt(s, `mkt:${i}`), (r, s) => recalcMkt(r, s, `mkt:${i}`));
  for (let m = 0; m < 12; m++) {
    add(`month:2027-${C.pad(m + 1)}`, `${C.MONTHS[m]} 2027`, 'month', (s) => month(s, `month:2027-${C.pad(m + 1)}`));
    weeks.filter((w) => C.weekMonth(w) === m).forEach((w) => {
      const iw = C.isoWeek(w);
      add(`week:${C.iso(w)}`, `Tydzień ${iw.week} · ${C.fmtRange(w).replace(/ 20\d\d$/, '')}`, 'week', (s) => week(s, `week:${C.iso(w)}`));
    });
  }
  const nn = Number(S.get('_|n.notes', 3));
  for (let i = 1; i <= nn; i++) add(`notes:${i}`, `Notatki ${i}`, 'notes', (s) => notes(s, `notes:${i}`));
  return P;
}

function recalcDates(root, S) {
  root.querySelectorAll('[data-dayfor]').forEach((e) => {
    const v = S.get(e.dataset.dayfor);
    e.textContent = v ? C.DOW3[C.dow(C.parse(v))] : '';
  });
}

export { MONTH_QUOTES };
