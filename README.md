# Planer AM 2027

Planer biznesowy 2027 dla biura nieruchomości jako aplikacja PWA. Działa offline, otwiera się z ekranu startowego, dane zapisuje lokalnie na urządzeniu.

## Publikacja na GitHub Pages

1. Na GitHubie utwórz nowe repozytorium, np. `planer-2027` (publiczne).
2. Wgraj do niego **zawartość** tego folderu (pliki `index.html`, `manifest.webmanifest`, `sw.js`, `.nojekyll` oraz foldery `css`, `js`, `fonts`, `icons`).
3. **Settings → Pages → Build and deployment**: Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)`. Zapisz.
4. Po minucie planer będzie pod adresem `https://TWOJLOGIN.github.io/planer-2027/`.

Wszystkie ścieżki są względne, więc działa w podfolderze bez zmian.

## Instalacja na telefonie

- **iPhone (Safari):** Udostępnij → *Do ekranu początkowego*.
- **Android (Chrome):** menu ⋮ → *Zainstaluj aplikację*.
- **Komputer (Chrome/Edge):** ikona instalacji w pasku adresu.

## Kopia zapasowa

Dane są tylko na urządzeniu. W aplikacji: ⚙ Ustawienia → *Eksportuj kopię zapasową* (plik `.json`). Przywracanie: *Przywróć z kopii*. Terminy można wyeksportować do kalendarza (`.ics`).

## Aktualizacja aplikacji

Po zmianie plików zwiększ `VERSION` w `sw.js` (np. `am-planer-2027-v2`). Urządzenia pobiorą nową wersję przy następnym otwarciu z internetem.

## Struktura

```
index.html            szkielet aplikacji
manifest.webmanifest  ustawienia PWA
sw.js                 tryb offline
css/style.css         cały wygląd
js/cal.js             kalendarz 2027, święta, tygodnie ISO
js/store.js           zapis danych
js/pages.js           wszystkie strony planera
js/app.js             nawigacja, arkusze, szukanie, kopie, eksport
fonts/ icons/         Marcellus, Archivo, logo AM
```
