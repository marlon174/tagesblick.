# tagesblick.

**Der Tag. Auf den Punkt.** Eine Nachrichtenseite, die du komplett auf dem iPad mit **Textastic** schreibst und pflegst. Du brauchst keinen Server, keine Datenbank und kein Programm, das man installieren muss: nur HTML, CSS und ein bisschen JavaScript.

Artikel schreibst du als ganz normalen Text mit ein paar Angaben wie `titel:` und `datum:`. Die Seite baut daraus automatisch Startseite, Rubriken, Zeitleiste und Suche.

---

## Die Idee

Der Name endet mit einem Punkt, und dieser Punkt zieht sich durch die ganze Seite:

- **Der Punkt im Logo ist eine kleine Sonne.** Er wechselt die Farbe mit der Tageszeit: morgens Morgenrot, tagsüber Sonnengelb, abends Abendrot, nachts Nachtblau.
- **„Der Tag auf einen Blick“:** Neben dem wichtigsten Artikel (dem *Aufmacher*) läuft eine Zeitleiste mit allen neuen Meldungen, nach Tagen sortiert.
- **„Auf den Punkt“:** Jeder Artikel beginnt mit einem Kasten, in dem die zwei oder drei wichtigsten Fakten stehen.
- **Überschriften enden mit einem farbigen Punkt**, zum Beispiel „Politik.“ oder „Sport.“, jeweils in der Farbe der Rubrik.
- **Artikel ohne Foto bekommen automatisch eine Titelgrafik:** eine Sonne über dem Horizont in der Farbe der Rubrik. Jede sieht ein bisschen anders aus.

## Das steckt drin

- Startseite mit Aufmacher, Zeitleiste und allen Rubriken
- Artikelseite mit „Auf den Punkt“, Lesezeit, Lesefortschritt, Teilen-Knopf und „Weiterlesen“
- Rubrikseiten, „Alle Meldungen“ (nach Tagen sortiert) und eine Suche
- Roter Balken für **Eilmeldungen**
- **Entwürfe**, die nur du in der Vorschau siehst
- Helles und dunkles Design (folgt dem iPad oder per Knopf oben rechts)
- **Fehlerhilfe:** Vertippst du dich, zeigt die Vorschau einen Hinweis mit Zeilennummer, oft sogar mit Vorschlag („Meintest du *sport*?“)
- Datenschutzfreundlich: keine Cookies, kein Tracking, keine Schriften oder Skripte von fremden Servern
- Passt sich an iPad, Handy und großen Bildschirm an
- 14 Beispielartikel, damit du siehst, wie alles aussieht

## Ordner und Dateien

```
tagesblick./
├── inhalt/
│   ├── artikel.js        ← hier schreibst du deine Artikel
│   └── einstellungen.js  ← Name, Slogan und Rubriken
├── bilder/               ← hierhin kommen deine Fotos
├── index.html            Startseite
├── artikel.html          ein einzelner Artikel
├── rubrik.html           eine Rubrik oder „Alle Meldungen“
├── suche.html            Suche
├── impressum.html        ← bitte ausfüllen, bevor die Seite online geht
├── datenschutz.html      ← bitte prüfen
├── 404.html              „Seite nicht gefunden“ (für GitHub Pages)
├── css/style.css         Aussehen, Farben stehen ganz oben
└── js/app.js             Technik, musst du nicht anfassen
```

Im Alltag arbeitest du fast nur mit **`inhalt/artikel.js`**.

---

## Loslegen auf dem iPad

### 1. Die Dateien aufs iPad holen

**Weg A: mit Working Copy (empfohlen, wenn du GitHub nutzt)**

1. Lade die App **Working Copy** aus dem App Store und melde dich dort mit deinem GitHub-Konto an.
2. Klone das Repository `marlon174/tagesblick.`.
3. Working Copy erscheint danach in der **Dateien-App** als eigener Speicherort. Darüber öffnest du den Ordner in Textastic und bearbeitest die Dateien direkt.
4. Wenn du fertig bist, speicherst du in Working Copy deine Änderungen (*Commit*) und lädst sie hoch (*Push*). Für das Hochladen brauchst du je nach Version die Pro-Funktionen von Working Copy.

**Weg B: ohne Git, als ZIP-Datei**

1. Öffne das Repository auf github.com in Safari, tippe auf **Code** und dann auf **Download ZIP**.
2. Tippe in der Dateien-App auf die ZIP-Datei. Sie wird entpackt.
3. Verschiebe den Ordner nach **Auf meinem iPad → Textastic**.

### 2. Die Vorschau öffnen

Öffne in Textastic die Datei **`index.html`** und tippe auf das Vorschau-Symbol in der Leiste oben. Du siehst jetzt die Startseite mit allen Beispielartikeln.

Wichtig:

- Öffne für die Vorschau immer eine der **HTML-Dateien**, nicht `artikel.js`.
- Nach jeder Änderung: **speichern** und die Vorschau neu laden.
- In der Vorschau siehst du zusätzlich einen Kasten mit **Hinweisen**, falls sich ein Tippfehler eingeschlichen hat. Online sieht den niemand.

### 3. Den ersten Artikel schreiben

Öffne `inhalt/artikel.js`. Ganz oben steht eine Kurzanleitung und darunter der Block **VORLAGE**:

1. Kopiere den Block von der Zeile `=== VORLAGE ===` bis zum Ende seines Textes.
2. Füge ihn unter der Zeile „DEINE ARTIKEL“ ein.
3. Mach aus `=== VORLAGE ===` die Zeile `=== ARTIKEL ===`.
4. Fülle die Angaben aus und schreib unter die Linie `---` deinen Text.
5. Speichern, Vorschau neu laden. Fertig!

So sieht ein vollständiger Artikel aus:

```
=== ARTIKEL ===
id: neuer-radweg
rubrik: politik
datum: 28.09.2026 14:30
autor: Dein Name
dachzeile: Verkehr
titel: Musterstadt bekommt einen neuen Radweg
teaser: Zwischen Bahnhof und Schulzentrum entsteht ein 2 Kilometer langer Radweg. Die Bauarbeiten beginnen im Frühjahr.
kurz: Der Radweg verbindet Bahnhof und Schulzentrum.
kurz: Die Bauarbeiten beginnen im Frühjahr und dauern etwa sechs Monate.
bild: bilder/radweg.jpg
bildtext: So soll der neue Radweg an der Hauptstraße aussehen.
bildquelle: Grafik: Stadt Musterstadt
---
Hier beginnt der Text. Jede Zeile wird ein eigener Absatz.

## Eine Zwischenüberschrift

Noch ein Absatz mit **fettem** und *kursivem* Text.
```

Die **Reihenfolge der Artikel in der Datei ist egal**. Die Seite sortiert automatisch nach Datum, der neueste steht oben.

### Die drei goldenen Regeln

1. **Die erste und die letzte Zeile** der Dateien im Ordner `inhalt` nie verändern (oben `inhalt` mit dem schrägen Hochkomma, unten das einzelne schräge Hochkomma).
2. **Kein Backtick (`` ` ``) im Text.** Nimm für Apostrophe `'` oder `´`.
3. Zwischen den Angaben und dem Text steht eine **Linie aus drei Strichen**: `---`

Alles andere verzeiht die Seite, und bei Tippfehlern bekommst du einen Hinweis.

---

## Alle Angaben im Überblick

| Angabe | Beispiel | Muss das sein? |
|---|---|---|
| `titel` | Musterstadt bekommt einen neuen Radweg | ja |
| `rubrik` | politik | ja, eine `id` aus `einstellungen.js` |
| `datum` | 28.09.2026 14:30 | ja, die Uhrzeit darfst du weglassen |
| `teaser` | Ein, zwei Sätze, die neugierig machen. | empfohlen |
| `kurz` | Ein Satz für „Auf den Punkt“ | empfohlen, gern mehrmals |
| `dachzeile` | Verkehr | nein, kleine Zeile über dem Titel |
| `autor` | Dein Name | nein, sonst steht dort „Redaktion“ |
| `id` | neuer-radweg | nein, sonst wird sie aus dem Titel gebaut |
| `bild` | bilder/radweg.jpg | nein |
| `bildtext` | Was auf dem Foto zu sehen ist. | nein |
| `bildquelle` | Foto: Dein Name | nein, aber bei Fotos wichtig |
| `top` | ja | nein, macht den Artikel zum großen Aufmacher |
| `eilmeldung` | ja | nein, zeigt den roten Balken auf allen Seiten |
| `entwurf` | ja | nein, nur in deiner Vorschau sichtbar |

**Tipp zur `id`:** Sie ist die Adresse des Artikels (`artikel.html#neuer-radweg`). Wenn du sie selbst festlegst, bleibt der Link gleich, auch wenn du den Titel später änderst.

## Text gestalten

| So schreibst du es | So sieht es aus |
|---|---|
| `## Zwischenüberschrift` | eine Zwischenüberschrift |
| `- Punkt` | ein Aufzählungspunkt |
| `> „Zitat“` und darunter `> – Name` | ein Zitat mit Quelle |
| `**fett**` | **fett** |
| `*kursiv*` | *kursiv* |
| `[Linktext](https://example.com)` | ein Link |
| `[Linktext](#neuer-radweg)` | ein Link zu einem anderen Artikel |
| `![Bildunterschrift](bilder/foto.jpg)` | ein Bild mitten im Text |
| `---` (im Text) | ein Trenner: • • • |

Automatisch passiert außerdem:

- Gerade Anführungszeichen `"so"` werden zu deutschen „Gänsefüßchen“.
- ` - ` wird zum Gedankenstrich ` – `, und `...` wird zu `…`.
- Internetadressen im Text werden anklickbar.
- Zeilen, die mit `//` beginnen, sind Notizen für dich und erscheinen nirgends.

---

## Fotos einfügen

1. **Foto vorbereiten:** Am besten als **JPEG** und etwa **1600 Pixel breit**. Fotos vom iPad oder iPhone sind oft im HEIC-Format, das nicht jeder Browser anzeigt.
   - Dauerhaft lösen: *Einstellungen → Kamera → Formate → Maximale Kompatibilität*. Dann speichert die Kamera JPEG.
   - Oder in der App **Kurzbefehle** einen Kurzbefehl mit den Aktionen *Bild konvertieren* (JPEG) und *Bildgröße ändern* (1600) bauen.
2. **Foto in den Ordner `bilder` legen**, zum Beispiel über die Dateien-App.
3. **Im Artikel eintragen:** `bild: bilder/radweg.jpg` (oder kurz `bild: radweg.jpg`).

Gut zu wissen:

- Bei Dateinamen zählt **Groß- und Kleinschreibung**: `Radweg.JPG` ist nicht `radweg.jpg`. Am sichersten sind kleine Buchstaben ohne Leerzeichen und Umlaute.
- Findet die Seite ein Foto nicht, zeigt sie stattdessen die Titelgrafik und in der Vorschau einen Hinweis.
- **Bildrechte:** Verwende nur eigene Fotos oder solche, die du nutzen darfst, und trag immer die `bildquelle` ein. Wer auf einem Foto gut erkennbar ist, muss in der Regel einverstanden sein.

---

## Name, Farben und Rubriken ändern

Alles steht in **`inhalt/einstellungen.js`**:

- **`name`**: Endet der Name mit einem Punkt, wird daraus im Logo der farbige Tageszeit-Punkt.
- **`slogan`**, **`beschreibung`** (für Suchmaschinen), **`autor`** (Standard-Autor) und **`fusszeile`**.
- **Rubriken:** Jede Rubrik ist ein eigener Block `=== RUBRIK ===` mit `id`, `name` und `farbe`. Für eine neue Rubrik kopierst du einfach einen Block. Die Reihenfolge der Blöcke ist die Reihenfolge im Menü.
- `menue: nein` versteckt eine Rubrik im Menü; sie steht dann nur unten im Fußbereich (so wie „In eigener Sache“).
- `symbol:` legt fest, welches Zeichen die Titelgrafiken der Rubrik zeigen: zeitung, gebaeude, grafik, ball, kolben, buch, chip, sonne, globus, ort, note, spiel, blatt oder herz.

Die Grundfarben der ganzen Seite (Hintergrund, Schrift und die Farben des Tageszeit-Punkts) stehen ganz oben in **`css/style.css`**, jeweils fürs helle und fürs dunkle Design.

---

## Veröffentlichen

### Mit GitHub Pages (kostenlos)

1. Deine Dateien müssen im Branch **`main`** liegen.
2. Öffne das Repository auf github.com in Safari und gehe zu **Settings → Pages**.
3. Wähle unter *Build and deployment* bei **Source** die Option **Deploy from a branch**, dann Branch **`main`** und Ordner **`/ (root)`**, und tippe auf **Save**.
4. Nach ein, zwei Minuten ist die Seite online unter
   **https://marlon174.github.io/tagesblick./**

Jede Änderung, die du danach hochlädst (Commit und Push in Working Copy), ist nach wenigen Minuten online. Manchmal zeigt der Browser noch ein paar Minuten die alte Version, dann hilft Neuladen.

> **Tipp:** Der Punkt am Ende des Repository-Namens landet auch in der Adresse. Wenn dich das stört oder die Adresse Probleme macht, benenne das Repository unter *Settings → General* in `tagesblick` um. Dann heißt die Adresse `https://marlon174.github.io/tagesblick/`.

### Ohne Git: im Browser hochladen

Du kannst geänderte Dateien auch direkt auf github.com hochladen: im passenden Ordner (zum Beispiel `inhalt`) auf **Add file → Upload files** tippen, die Datei aus der Dateien-App auswählen und **Commit changes** drücken. Eine Datei mit gleichem Namen wird dabei ersetzt.

### Auf eigenem Webspace

Hast du Webspace mit FTP- oder SFTP-Zugang, kann Textastic die Dateien direkt hochladen. Lade den ganzen Ordner hoch, so wie er ist.

---

## Wenn etwas nicht klappt

| Problem | Lösung |
|---|---|
| Die Vorschau meldet „In inhalt/artikel.js steckt ein Fehler“ | Meistens steht ein Backtick (`` ` ``) mitten im Text, oder die erste oder letzte Zeile der Datei wurde verändert. In Textastic hat ab der Fehlerstelle oft der ganze Rest eine andere Farbe. Wenn der Fehler gerade erst passiert ist, hilft Rückgängig (⌘Z). |
| Ein Kasten „Hinweise zu deinen Inhalten“ erscheint | Dort steht, in welcher Zeile etwas nicht stimmt, oft mit Verbesserungsvorschlag. |
| Mein neuer Artikel fehlt | Steht über dem Artikel `=== ARTIKEL ===` (und nicht mehr VORLAGE)? Ist `entwurf: ja` gesetzt? Hast du gespeichert und die Vorschau neu geladen? |
| Ein Foto wird nicht angezeigt | Prüfe Dateiname, Groß- und Kleinschreibung und ob das Foto im Ordner `bilder` liegt. |
| Die Vorschau hat keine Farben | Öffne die HTML-Datei aus dem Projektordner, damit die Ordner `css`, `js` und `inhalt` daneben liegen. |
| Umlaute sehen komisch aus | Speichere die Datei in Textastic mit der Zeichenkodierung UTF-8. |
| Online ist noch die alte Version | Ein paar Minuten warten und neu laden. |

---

## Rechtliches, kurz erklärt

*Das ist keine Rechtsberatung, sondern eine Orientierung.*

- **Impressum:** Eine öffentliche Nachrichtenseite braucht in Deutschland in der Regel ein Impressum mit Name und Anschrift (§ 5 DDG, § 18 MStV). Fülle `impressum.html` aus, bevor du die Seite online stellst, und lösche danach den Vorlagen-Kasten. Überleg dir gut, welche Daten du veröffentlichst. Wenn du noch nicht volljährig bist, sprich vorher mit deinen Eltern.
- **Datenschutz:** Die Vorlage in `datenschutz.html` passt zur Seite, wie sie jetzt gebaut ist: ohne Cookies und Tracking, gehostet bei GitHub Pages. Wenn du später Dienste wie YouTube-Videos, Karten oder Statistiken einbaust, muss sie angepasst werden.
- **Bilder und Texte:** Nutze nur, was du selbst gemacht hast oder verwenden darfst, und nenne die Quelle.
- **Beispielartikel:** Die Artikel mit `beispiel: ja` spielen in der erfundenen Musterstadt und sind als „Beispiel“ gekennzeichnet. Lösche oder ersetze sie, bevor du richtig loslegst.

---

## Ideen für später

- **Liveticker** für Fußballspiele oder Wahlabende, mit Uhrzeit vor jedem Eintrag
- **Autorenseiten**, wenn mehrere Leute mitschreiben
- **Umfrage** oder „Zitat des Tages“ auf der Startseite
- **Wetter für deinen Ort**, zum Beispiel über den kostenlosen Dienst Open-Meteo (dann die Datenschutzerklärung ergänzen)
- **Newsletter** oder RSS-Feed, damit Leser nichts verpassen
- **Auf den Home-Bildschirm**: Ein App-Symbol ist schon dabei. In Safari über *Teilen → Zum Home-Bildschirm* sieht tagesblick. aus wie eine App.

---

## Für Neugierige: So funktioniert die Technik

- Die Dateien in `inhalt/` sind JavaScript-Dateien, die aus einem einzigen langen Text bestehen (zwischen dem Backtick in der ersten und dem in der letzten Zeile). `js/app.js` liest diesen Text Zeile für Zeile. Deshalb brauchst du keine Kommas, Klammern oder Anführungszeichen wie in normalem Code.
- Die Seite braucht keinen Server-Code. Sie läuft in der Textastic-Vorschau (`file://`), auf GitHub Pages und auf jedem normalen Webspace.
- Läuft die Seite auf deinem Gerät (Vorschau oder `localhost`), zeigt sie Hinweise und Entwürfe. Im Internet bleiben beide verborgen.
- Es gibt keine Bibliotheken und kein Framework. Alles liegt in `css/style.css` und `js/app.js` und ist auf Deutsch kommentiert.
