/* =====================================================================
   tagesblick.  ·  Technik
   ---------------------------------------------------------------------
   Diese Datei liest deine Inhalte aus dem Ordner „inhalt“ und baut
   daraus die Seiten zusammen. Normalerweise musst du hier nichts
   ändern: Texte, Rubriken und den Namen der Seite bearbeitest du in
   inhalt/artikel.js und inhalt/einstellungen.js.

    1. Inhalte einsammeln
    2. Inhalte lesen und prüfen
    3. Text, Datum und Titelgrafiken
    4. Bausteine (Kopf, Fuß, Karten, Zeitleiste …)
    5. Seiten (Start, Artikel, Rubrik, Suche, Textseiten)
    6. Start
   ===================================================================== */

(function () {
  "use strict";

  // Vorschau heißt: Die Seite läuft auf deinem Gerät (zum Beispiel in
  // Textastic) und nicht im Internet. Nur dann siehst du Hinweise zu
  // Tippfehlern und Artikel, die als Entwurf markiert sind.
  const VORSCHAU = !/^https?:$/.test(location.protocol) ||
    /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname);

  const BACKTICK = "\u0060";


  /* =================================================================
     1. Inhalte einsammeln
     Jede Datei im Ordner „inhalt“ beginnt mit inhalt und einem
     Backtick und endet mit einem Backtick. Dadurch wird die Funktion
     unten aufgerufen und bekommt den ganzen Text der Datei.
     Gelesen wird er erst, wenn alle Dateien geladen sind.
     ================================================================= */

  const eingang = [];     // { datei, text }
  const ladefehler = [];  // was beim Laden schiefging
  let gestartet = false;

  window.inhalt = function (teile) {
    const werte = Array.prototype.slice.call(arguments, 1);
    eingang.push({ datei: aktuelleDatei(), text: rohtext(teile, werte) });
  };

  function aktuelleDatei() {
    const skript = document.currentScript;
    return (skript && skript.getAttribute("src")) || "inhalt";
  }

  // Den Text genau so übernehmen, wie er in der Datei steht
  // (auch Backslashes bleiben erhalten).
  function rohtext(teile, werte) {
    if (typeof teile === "string") return teile;
    if (!teile || !teile.raw) return "";
    let text = teile.raw[0];
    for (let i = 1; i < teile.raw.length; i++) text += String(werte[i - 1]) + teile.raw[i];
    return text.replace(/\\`/g, BACKTICK).replace(/\\\$\{/g, "${");
  }

  // Fehler beim Laden merken, um sie später verständlich zu erklären.
  window.addEventListener("error", function (e) {
    if (gestartet) return;
    const ziel = e.target;
    if (ziel && ziel !== window && ziel.tagName) {
      if (ziel.tagName === "SCRIPT") ladefehler.push({ art: "fehlt", datei: ziel.getAttribute("src") });
      return;
    }
    ladefehler.push({
      art: "skript",
      datei: (String(e.filename || "").match(/inhalt\/[^/?#]+$/) || [""])[0],
      zeile: e.lineno || 0,
      meldung: String(e.message || ""),
    });
  }, true);


  /* =================================================================
     2. Inhalte lesen und prüfen
     ================================================================= */

  // Alle Angaben, die es gibt …
  const FELDER = {
    seite: {
      name: {}, slogan: {}, beschreibung: {}, autor: {}, fusszeile: {},
    },
    rubrik: {
      id: {}, name: {}, farbe: {}, beschreibung: {}, menue: {}, symbol: {},
    },
    artikel: {
      id: {}, rubrik: {}, datum: {}, autor: {}, dachzeile: {}, titel: {}, teaser: {},
      kurz: { liste: true }, bild: {}, bildtext: {}, bildquelle: {},
      top: {}, eilmeldung: {}, entwurf: {}, beispiel: {},
    },
  };

  // … und Wörter, die dasselbe meinen.
  const AUCH_ERLAUBT = {
    ueberschrift: "titel", schlagzeile: "titel", title: "titel",
    kategorie: "rubrik", ressort: "rubrik",
    zeit: "datum", date: "datum",
    autorin: "autor", von: "autor",
    kicker: "dachzeile", spitzmarke: "dachzeile", thema: "dachzeile",
    vorspann: "teaser", anreisser: "teaser", lead: "teaser",
    punkt: "kurz", stichpunkt: "kurz",
    foto: "bild", image: "bild",
    bildunterschrift: "bildtext", bu: "bildtext",
    quelle: "bildquelle", fotograf: "bildquelle", credit: "bildquelle",
    aufmacher: "top", eil: "eilmeldung",
    menu: "menue", fusszeile: "fusszeile",
  };

  const GRAU = "#6b7385";

  function lesen() {
    const hinweise = [];
    const seite = { name: "tagesblick.", slogan: "", beschreibung: "", autor: "Redaktion", fusszeile: "" };
    const rubriken = [];
    const rubrikNachId = {};
    const artikel = [];
    const nachId = {};

    const bloecke = [];
    eingang.forEach(function (e) { bloecke.push.apply(bloecke, bloeckeAus(e, hinweise)); });

    // Zuerst Einstellungen und Rubriken …
    bloecke.forEach(function (b) {
      if (b.art === "seite" || b.art === "einstellungen") {
        const w = leseFelder(b, "seite", hinweise);
        Object.keys(FELDER.seite).forEach(function (k) { if (w[k] !== undefined) seite[k] = w[k]; });
      } else if (b.art === "rubrik") {
        const r = leseRubrik(b, hinweise);
        if (!r) return;
        if (rubrikNachId[r.id]) {
          hinweise.push({ datei: b.datei, zeile: b.zeile, text: "Die Rubrik „" + r.id + "“ gibt es doppelt. Die zweite wird ignoriert." });
          return;
        }
        rubriken.push(r);
        rubrikNachId[r.id] = r;
      } else if (b.art !== "artikel" && b.art !== "vorlage") {
        hinweise.push({ datei: b.datei, zeile: b.zeile, text: "Den Block „=== " + b.art.toUpperCase() + " ===“ kenne ich nicht. Erlaubt sind ARTIKEL, VORLAGE, SEITE und RUBRIK." });
      }
    });
    const ohneRubriken = rubriken.length === 0;

    function neueRubrik(id, name) {
      if (rubrikNachId[id]) return rubrikNachId[id];
      const r = { id: id, name: gross(String(name).replace(/-/g, " ")), farbe: GRAU, beschreibung: "", menue: ohneRubriken, symbol: "" };
      rubriken.push(r);
      rubrikNachId[id] = r;
      return r;
    }

    function findeRubrik(a) {
      const melde = function (t) { hinweise.push({ datei: a.block.datei, zeile: a.rubrikZeile, text: t }); };
      if (!a.rubrikWert) {
        melde(zitat(a.titel) + ": Die Rubrik fehlt. Ergänze zum Beispiel „rubrik: " + (rubriken[0] ? rubriken[0].id : "politik") + "“.");
        return neueRubrik("allgemein", "Allgemein");
      }
      const s = slug(a.rubrikWert);
      const r = rubrikNachId[s] || rubriken.filter(function (x) { return slug(x.name) === s; })[0];
      if (r) return r;
      if (!ohneRubriken) {
        const tipp = vorschlag(s, Object.keys(rubrikNachId));
        melde(zitat(a.titel) + ": Die Rubrik „" + a.rubrikWert + "“ gibt es nicht." +
          (tipp ? " Meintest du „" + tipp + "“?" : " Lege sie in inhalt/einstellungen.js an."));
      }
      return neueRubrik(s, a.rubrikWert);
    }

    // … dann die Artikel.
    bloecke.forEach(function (b) {
      if (b.art !== "artikel") return;
      const a = leseArtikel(b, hinweise, seite);
      a.rubrik = findeRubrik(a);
      if (nachId[a.id]) {
        let n = 2;
        while (nachId[a.id + "-" + n]) n++;
        hinweise.push({ datei: b.datei, zeile: b.zeile, text: "Die id „" + a.id + "“ gibt es schon. Dieser Artikel heißt deshalb „" + a.id + "-" + n + "“. Besser: Gib ihm eine eigene id." });
        a.id = a.id + "-" + n;
      }
      if (a.entwurf && !VORSCHAU) return;   // Entwürfe erscheinen nur in der Vorschau
      nachId[a.id] = a;
      artikel.push(a);
    });

    artikel.sort(function (x, y) { return zeitwert(y) - zeitwert(x); });

    return {
      seite: seite, rubriken: rubriken, rubrikNachId: rubrikNachId,
      artikel: artikel, nachId: nachId, hinweise: hinweise,
    };
  }

  // Den Text einer Datei in Blöcke zerlegen: === ARTIKEL ===, === RUBRIK === …
  function bloeckeAus(eintrag, hinweise) {
    const bloecke = [];
    let block = null;
    eintrag.text.split(/\r\n|\r|\n/).forEach(function (zeile, i) {
      const nr = i + 1;   // die erste Zeile der Datei ist Zeile 1
      if (/^\s*\/\//.test(zeile)) return;   // Notiz
      const kopf = zeile.match(/^\s*={2,}\s*([^=]*?)\s*={2,}\s*$/);
      if (kopf) {
        block = { art: klein(kopf[1]), datei: eintrag.datei, zeile: nr, zeilen: [] };
        bloecke.push(block);
      } else if (block) {
        block.zeilen.push({ nr: nr, text: zeile });
      } else if (zeile.trim()) {
        hinweise.push({ datei: eintrag.datei, zeile: nr, text: "Diese Zeile steht vor dem ersten Block (zum Beispiel „=== ARTIKEL ===“) und wird nicht verwendet." });
      }
    });
    return bloecke;
  }

  // Angaben wie „titel: …“ lesen. Alles unter der Linie --- ist der Text.
  function leseFelder(block, art, hinweise) {
    const felder = FELDER[art];
    const werte = {};
    const zeilen = {};   // in welcher Zeile steht welche Angabe?
    const text = [];
    let imText = false;
    let letztes = null;
    const mitLinie = block.zeilen.some(function (z) { return /^\s*-{3,}\s*$/.test(z.text); });
    const ohneLinie = art === "artikel" && !mitLinie;
    const melde = function (nr, t) { hinweise.push({ datei: block.datei, zeile: nr, text: t }); };

    block.zeilen.forEach(function (z) {
      if (imText) { text.push(z.text); return; }
      const t = z.text.trim();
      if (!t) { letztes = null; return; }
      if (/^-{3,}$/.test(t)) { imText = true; return; }

      // Aufzählung unter einer Angabe wie „kurz:“
      const punkt = t.match(/^[-•*]\s+(.+)$/);
      if (punkt && letztes && felder[letztes].liste) { werte[letztes].push(punkt[1].trim()); return; }

      const m = t.match(/^([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß0-9_-]*)\s*:(?!\/\/)\s*(.*)$/);
      if (m) {
        const name = feldname(m[1], art);
        if (name) {
          const wert = m[2].trim();
          zeilen[name] = z.nr;
          if (felder[name].liste) {
            werte[name] = werte[name] || [];
            if (wert) werte[name].push(wert);
          } else {
            if (werte[name]) melde(z.nr, "„" + name + "“ steht doppelt. Ich nehme die zweite Angabe.");
            werte[name] = wert;
          }
          letztes = name;
          return;
        }
        if (!ohneLinie) {
          const tipp = vorschlag(klein(m[1]), Object.keys(felder));
          melde(z.nr, "Die Angabe „" + m[1] + "“ kenne ich nicht." + (tipp ? " Meintest du „" + tipp + "“?" : ""));
          letztes = null;
          return;
        }
      }

      if (ohneLinie) {
        // Ohne --- beginnt der Text bei der ersten Zeile, die keine Angabe ist.
        melde(z.nr, "Vor dem Text fehlt die Linie aus drei Strichen (---). Ich nehme an, dass der Text hier beginnt.");
        imText = true;
        text.push(z.text);
        return;
      }
      if (letztes) {
        // Eine lange Angabe, die in der nächsten Zeile weitergeht
        if (felder[letztes].liste) {
          const liste = werte[letztes];
          if (liste.length) liste[liste.length - 1] += " " + t; else liste.push(t);
        } else {
          werte[letztes] = (werte[letztes] ? werte[letztes] + " " : "") + t;
        }
        return;
      }
      melde(z.nr, "Diese Zeile gehört zu keiner Angabe. Fehlt vorne ein Name mit Doppelpunkt, zum Beispiel „titel:“?");
    });

    werte.text = text;
    werte.zeile = function (name) { return zeilen[name] || block.zeile; };
    return werte;
  }

  function feldname(wort, art) {
    const n = klein(wort);
    if (FELDER[art][n]) return n;
    const anders = AUCH_ERLAUBT[n];
    return anders && FELDER[art][anders] ? anders : null;
  }

  function leseRubrik(block, hinweise) {
    const w = leseFelder(block, "rubrik", hinweise);
    const id = slug(w.id || w.name);
    if (!id) {
      hinweise.push({ datei: block.datei, zeile: block.zeile, text: "Diese Rubrik hat keine id (zum Beispiel „id: sport“) und wird übersprungen." });
      return null;
    }
    return {
      id: id,
      name: w.name || gross(id.replace(/-/g, " ")),
      farbe: pruefeFarbe(w.farbe, block.datei, w.zeile("farbe"), hinweise),
      beschreibung: w.beschreibung || "",
      menue: w.menue === undefined ? true : janein(w.menue, "menue", block.datei, w.zeile("menue"), hinweise),
      symbol: klein(w.symbol),
    };
  }

  function leseArtikel(block, hinweise, seite) {
    const w = leseFelder(block, "artikel", hinweise);
    const melde = function (zeile, t) { hinweise.push({ datei: block.datei, zeile: zeile, text: t }); };
    const titel = w.titel || "";
    if (!titel) melde(block.zeile, "Dieser Artikel hat keinen Titel. Ergänze eine Zeile wie „titel: Meine Überschrift“.");

    let datum = null;
    if (!w.datum) melde(block.zeile, zitat(titel) + ": Das Datum fehlt. Ergänze zum Beispiel „datum: 28.09.2026 14:30“.");
    else {
      datum = leseDatum(w.datum);
      if (!datum) melde(w.zeile("datum"), zitat(titel) + ": Das Datum „" + w.datum + "“ verstehe ich nicht. So klappt es: 28.09.2026 14:30");
    }
    const jaNein = function (name) { return janein(w[name], name, block.datei, w.zeile(name), hinweise); };

    return {
      block: block,
      id: slug(w.id || titel) || "artikel-" + block.zeile,
      rubrikWert: w.rubrik || "",
      rubrikZeile: w.zeile("rubrik"),
      datum: datum ? datum.wert : null,
      mitZeit: datum ? datum.mitZeit : false,
      autor: w.autor || seite.autor || "Redaktion",
      dachzeile: w.dachzeile || "",
      titel: titel || "Ohne Titel",
      teaser: w.teaser || "",
      kurz: w.kurz || [],
      bild: w.bild ? bildPfad(w.bild) : "",
      bildZeile: w.zeile("bild"),
      bildtext: w.bildtext || "",
      bildquelle: w.bildquelle || "",
      top: jaNein("top"),
      eilmeldung: jaNein("eilmeldung"),
      entwurf: jaNein("entwurf"),
      beispiel: jaNein("beispiel"),
      textZeilen: w.text,
    };
  }

  function janein(wert, name, datei, zeile, hinweise) {
    if (wert === undefined) return false;
    const w = klein(wert);
    if (/^(ja|j|yes|y|true|wahr|1|x|an)$/.test(w)) return true;
    if (/^(nein|n|no|false|falsch|0|aus|-|)$/.test(w)) return false;
    hinweise.push({ datei: datei, zeile: zeile, text: "Bei „" + name + ": " + wert + "“ weiß ich nicht, ob ja oder nein gemeint ist. Schreib „ja“ oder „nein“." });
    return false;
  }

  function pruefeFarbe(farbe, datei, zeile, hinweise) {
    if (!farbe) return GRAU;
    const ok = window.CSS && CSS.supports
      ? CSS.supports("color", farbe)
      : /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(farbe);
    if (ok) return farbe;
    hinweise.push({ datei: datei, zeile: zeile, text: "Die Farbe „" + farbe + "“ verstehe ich nicht. Nimm einen Farbcode wie #1d6fb8." });
    return GRAU;
  }

  // Ein Dateiname ohne Ordner landet automatisch im Ordner „bilder“.
  function bildPfad(wert) {
    const w = String(wert).trim();
    if (/^(https?:|data:)/i.test(w) || w.indexOf("/") !== -1) return w;
    return "bilder/" + w;
  }

  // Welche Inhaltsdateien sollten geladen werden – und welche fehlen?
  function ladeProbleme() {
    const erwartet = Array.prototype.map.call(
      document.querySelectorAll('script[src*="inhalt/"]'),
      function (s) { return s.getAttribute("src"); }
    );
    const gelesen = eingang.map(function (e) { return e.datei; });
    return erwartet.filter(function (d) { return gelesen.indexOf(d) === -1; }).map(function (datei) {
      const fehlt = ladefehler.some(function (f) { return f.art === "fehlt" && f.datei === datei; });
      if (fehlt) return { datei: datei, fehlt: true };
      const f = ladefehler.filter(function (x) { return x.art === "skript" && (!x.datei || x.datei === datei); })[0];
      return { datei: datei, zeile: f && f.datei ? f.zeile : 0, meldung: f && f.datei ? f.meldung : "" };
    });
  }


  /* =================================================================
     3. Text, Datum und Titelgrafiken
     ================================================================= */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (z) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[z];
    });
  }

  function klein(s) {
    return String(s || "").trim().toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
  }

  function gross(s) { s = String(s || "").trim(); return s.charAt(0).toUpperCase() + s.slice(1); }

  function slug(s) {
    return klein(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  }

  function kuerze(s, n) { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  function zitat(titel) { return titel ? "„" + kuerze(titel, 40) + "“" : "Ein Artikel ohne Titel"; }

  // Für die Suche: klein, ohne Akzente, ß = ss
  function suchform(s) {
    return String(s || "").toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Ähnliches Wort finden, um bei Tippfehlern zu helfen
  function vorschlag(wort, liste) {
    let bestes = null;
    let abstand = 3;
    liste.forEach(function (w) {
      const a = levenshtein(wort, w);
      if (a < abstand) { abstand = a; bestes = w; }
    });
    return bestes;
  }

  function levenshtein(a, b) {
    const d = [];
    for (let i = 0; i <= a.length; i++) d[i] = [i];
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[a.length][b.length];
  }

  // Schöne Typografie: "so" wird zu „so“, ... zu … und - zu –
  function typo(t) {
    return String(t)
      .replace(/(^|[\s(\[{\/\-–—\u00a0])"(?=\S)/g, "$1„")
      .replace(/"/g, "“")
      .replace(/'/g, "’")
      .replace(/\.\.\./g, "…")
      .replace(/ --? /g, " – ");
  }

  // Einfacher Text ohne Formatierung (Titel, Teaser …)
  function txt(s) { return esc(typo(s)); }

  // Text mit **fett**, *kursiv*, [Links](adresse) und Adressen
  function inline(text) {
    const schutz = [];
    function merke(html) { schutz.push(html); return "\uE000" + (schutz.length - 1) + "\uE001"; }
    function zurueck(s) { return s.replace(/\uE000(\d+)\uE001/g, function (_, i) { return zurueck(schutz[+i]); }); }

    let t = String(text);
    t = t.replace(/\\([\\*_[\]()#>!\-~+`])/g, function (_, z) { return merke(esc(z)); });
    t = t.replace(/\[([^\]]+)\]\(\s*([^)\s]+)\s*\)/g, function (_, linkText, adresse) {
      return merke(link(adresse, formatiere(linkText)));
    });
    t = t.replace(/\bhttps?:\/\/[^\s<>"„“]*[^\s<>"„“.,;:!?)\]]/g, function (url) {
      return merke(link(url, esc(url.replace(/^https?:\/\/(www\.)?/, ""))));
    });
    return zurueck(formatiere(t));
  }

  function formatiere(t) {
    return esc(typo(t))
      .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(?=\S)([^*]*?\S)\*/g, "<em>$1</em>")
      .replace(/(^|[\s(„>])_(?=\S)([^_]*?\S)_(?=$|[\s).,;:!?“<])/g, "$1<em>$2</em>");
  }

  function link(adresse, inhaltHtml) {
    let url = String(adresse).trim();
    if (/^(javascript|vbscript|data):/i.test(url.replace(/[\s\u0000-\u001f]/g, ""))) return inhaltHtml;
    if (/^#[a-z0-9-]+$/i.test(url)) url = "artikel.html" + url;   // [Text](#artikel-id)
    const extern = /^https?:\/\//i.test(url);
    return '<a href="' + esc(url) + '"' + (extern ? ' target="_blank" rel="noopener"' : "") + ">" + inhaltHtml + "</a>";
  }

  // Der Artikeltext: Jede Zeile wird ein Absatz.
  //   ## Zwischenüberschrift   - Aufzählung   > Zitat   ![Bildtext](bild.jpg)
  function textZuHtml(zeilen) {
    const html = [];
    let liste = null;
    let zitatZeilen = null;

    function abschliessen() {
      if (liste) {
        html.push("<ul>" + liste.map(function (p) { return "<li>" + inline(p) + "</li>"; }).join("") + "</ul>");
        liste = null;
      }
      if (zitatZeilen) { html.push(zitatHtml(zitatZeilen)); zitatZeilen = null; }
    }

    zeilen.forEach(function (zeile) {
      const t = zeile.trim();
      let m;
      if (!t) { abschliessen(); return; }
      if ((m = t.match(/^>\s?(.*)$/))) {
        if (liste) abschliessen();
        zitatZeilen = zitatZeilen || [];
        zitatZeilen.push(m[1]);
        return;
      }
      if ((m = t.match(/^[-*•]\s+(.+)$/))) {
        if (zitatZeilen) abschliessen();
        liste = liste || [];
        liste.push(m[1]);
        return;
      }
      abschliessen();
      if ((m = t.match(/^(#{1,3})\s+(.+)$/))) {
        const ebene = m[1].length === 3 ? 3 : 2;
        html.push("<h" + ebene + ">" + inline(m[2]) + "</h" + ebene + ">");
      } else if (/^(-{3,}|\*{3,})$/.test(t)) {
        html.push("<hr>");
      } else if ((m = t.match(/^!\[([^\]]*)\]\(\s*([^)\s]+)\s*\)$/))) {
        html.push('<figure class="text-bild"><img src="' + esc(bildPfad(m[2])) + '" alt="' + esc(m[1]) + '" loading="lazy" decoding="async">' +
          (m[1] ? "<figcaption>" + inline(m[1]) + "</figcaption>" : "") + "</figure>");
      } else if (/^<(table|div|figure|iframe|video|audio|details|p|section|aside|blockquote|dl|pre)[\s>]/i.test(t)) {
        html.push(/^<table/i.test(t) ? '<div class="tabelle">' + t + "</div>" : t);   // eigenes HTML
      } else {
        html.push("<p>" + inline(t) + "</p>");
      }
    });
    abschliessen();
    return html.join("\n");
  }

  function zitatHtml(zeilen) {
    let quelle = "";
    const letzte = zeilen[zeilen.length - 1] || "";
    const m = letzte.match(/^[–—-]\s*(.+)$/);
    if (m && zeilen.length > 1) { quelle = m[1]; zeilen = zeilen.slice(0, -1); }
    return '<figure class="zitat"><blockquote>' +
      zeilen.map(function (z) { return "<p>" + inline(z) + "</p>"; }).join("") +
      "</blockquote>" + (quelle ? "<figcaption>" + inline(quelle) + "</figcaption>" : "") + "</figure>";
  }

  function nurText(zeilen) {
    return zeilen.join(" ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[#>*_\\]/g, " ");
  }

  // ---------- Datum ----------

  const WOCHENTAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

  // Versteht „28.09.2026 14:30“ und „2026-09-28 14:30“ (Uhrzeit optional)
  function leseDatum(s) {
    s = String(s || "").trim().replace(/\s*uhr$/i, "");
    let m, j, mo, t, h = 0, mi = 0, zeit = false;
    if ((m = s.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4}|\d{2})(?:\s*,?\s*(?:um\s+)?(\d{1,2})[:.](\d{2}))?$/i))) {
      t = +m[1]; mo = +m[2]; j = +m[3]; if (j < 100) j += 2000;
      if (m[4]) { h = +m[4]; mi = +m[5]; zeit = true; }
    } else if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s]+(\d{1,2}):(\d{2}))?$/))) {
      j = +m[1]; mo = +m[2]; t = +m[3];
      if (m[4]) { h = +m[4]; mi = +m[5]; zeit = true; }
    } else {
      return null;
    }
    if (h > 23 || mi > 59) return null;
    const d = new Date(j, mo - 1, t, h, mi);
    if (d.getFullYear() !== j || d.getMonth() !== mo - 1 || d.getDate() !== t) return null;
    return { wert: d, mitZeit: zeit };
  }

  function zeitwert(a) { return a.datum ? a.datum.getTime() : -1e15; }
  function zwei(n) { return (n < 10 ? "0" : "") + n; }
  function uhrzeit(d) { return zwei(d.getHours()) + ":" + zwei(d.getMinutes()); }
  function datumLang(d) { return WOCHENTAGE[d.getDay()] + ", " + d.getDate() + ". " + MONATE[d.getMonth()] + " " + d.getFullYear(); }

  function iso(a) {
    const d = a.datum;
    return d.getFullYear() + "-" + zwei(d.getMonth() + 1) + "-" + zwei(d.getDate()) + (a.mitZeit ? "T" + uhrzeit(d) : "");
  }

  function tageBis(d, jetzt) {
    const a = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const b = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate());
    return Math.round((b - a) / 86400000);
  }

  // Kurz für Karten: „Vor 3 Stunden“, „Gestern, 19:30“, „Samstag, 16:00“
  function wann(a) {
    if (!a.datum) return "";
    const jetzt = new Date();
    const d = a.datum;
    const minuten = Math.round((jetzt - d) / 60000);
    const tage = tageBis(d, jetzt);
    const zeit = a.mitZeit ? ", " + uhrzeit(d) : "";
    if (a.mitZeit && minuten >= 0 && minuten < 60) return minuten < 2 ? "Gerade eben" : "Vor " + minuten + " Minuten";
    if (a.mitZeit && tage === 0 && minuten >= 60 && minuten < 360) {
      const h = Math.round(minuten / 60);
      return h === 1 ? "Vor einer Stunde" : "Vor " + h + " Stunden";
    }
    if (tage === 0) return "Heute" + zeit;
    if (tage === 1) return "Gestern" + zeit;
    if (tage === -1) return "Morgen" + zeit;
    if (tage > 1 && tage < 7) return WOCHENTAGE[d.getDay()] + zeit;
    return d.getDate() + ". " + MONATE[d.getMonth()] + (d.getFullYear() !== jetzt.getFullYear() ? " " + d.getFullYear() : "");
  }

  // Für Überschriften über Tagen: „Heute“, „Gestern“, „Samstag, 26. September“
  function tagTitel(d) {
    if (!d) return "Ohne Datum";
    const jetzt = new Date();
    const tage = tageBis(d, jetzt);
    if (tage === 0) return "Heute";
    if (tage === 1) return "Gestern";
    return WOCHENTAGE[d.getDay()] + ", " + d.getDate() + ". " + MONATE[d.getMonth()] +
      (d.getFullYear() !== jetzt.getFullYear() ? " " + d.getFullYear() : "");
  }

  function datumVoll(a) {
    const d = a.datum;
    return d.getDate() + ". " + MONATE[d.getMonth()] + " " + d.getFullYear() + (a.mitZeit ? ", " + uhrzeit(d) + " Uhr" : "");
  }

  function nachTagen(liste) {
    const gruppen = [];
    liste.forEach(function (a) {
      const schluessel = a.datum ? a.datum.toDateString() : "ohne";
      let g = gruppen[gruppen.length - 1];
      if (!g || g.schluessel !== schluessel) { g = { schluessel: schluessel, titel: tagTitel(a.datum), artikel: [] }; gruppen.push(g); }
      g.artikel.push(a);
    });
    return gruppen;
  }

  function tageszeit(d) {
    const h = d.getHours();
    if (h >= 5 && h < 11) return "morgen";
    if (h >= 11 && h < 17) return "tag";
    if (h >= 17 && h < 23) return "abend";
    return "nacht";
  }

  function gruss(d) {
    return { morgen: "Guten Morgen", tag: "Guten Tag", abend: "Guten Abend", nacht: "Noch wach?" }[tageszeit(d)];
  }

  function lesezeit(a) {
    const woerter = (a.titel + " " + a.teaser + " " + a.kurz.join(" ") + " " + nurText(a.textZeilen))
      .split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(woerter / 200));
  }

  // ---------- Titelgrafiken für Artikel ohne Foto ----------
  // Jede Grafik zeigt einen „Tagesblick“: eine Sonne über dem Horizont,
  // in der Farbe der Rubrik. Die Anordnung hängt von der id ab – so sieht
  // jeder Artikel etwas anders aus, aber immer gleich.

  const SYMBOLE = {
    zeitung:  "M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M7.5 8.5h6M7.5 12h6M7.5 15.5h4",
    gebaeude: "M3 10l9-6 9 6M5.5 10v8M10 10v8M14 10v8M18.5 10v8M3 20.5h18",
    grafik:   "M4 4v16h16M7.5 15l4-4 3 3 5-6M15.5 8h4v4",
    ball:     "M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM12 8.4l3.1 2.25-1.2 3.65h-3.8l-1.2-3.65zM12 8.4V3.6M15.1 10.65l4.5-1.5M13.9 14.3l2.8 3.9M10.1 14.3l-2.8 3.9M8.9 10.65l-4.5-1.5",
    kolben:   "M9 3h6M10 3v6.5l-4.9 8.6A2 2 0 0 0 6.8 21h10.4a2 2 0 0 0 1.7-2.9L14 9.5V3M7.6 15h8.8",
    buch:     "M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5V20",
    chip:     "M7 7h10v10H7zM10 10h4v4h-4zM9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4",
    sonne:    "M4.5 16a7.5 7.5 0 0 1 15 0M2.5 16h19M6 19.5h12M12 3.5V6M5 7l1.7 1.7M19 7l-1.7 1.7",
    globus:   "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM3 12h18M12 3c2.6 2.4 3.9 5.4 3.9 9s-1.3 6.6-3.9 9M12 3C9.4 5.4 8.1 8.4 8.1 12s1.3 6.6 3.9 9",
    ort:      "M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11zM12 7.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z",
    note:     "M9 18V5.5l11-2.5v12.5M9 18a3 3 0 1 1-6 0a3 3 0 1 1 6 0zM20 15.5a3 3 0 1 1-6 0a3 3 0 1 1 6 0z",
    spiel:    "M7.5 7.5h9a4.5 4.5 0 0 1 4.5 4.5v1.5a3 3 0 0 1-5.4 1.8L14.4 14H9.6l-1.2 1.3A3 3 0 0 1 3 13.5V12a4.5 4.5 0 0 1 4.5-4.5zM7.5 10v3.5M5.75 11.75h3.5M15.5 11h.01M17.5 13h.01",
    blatt:    "M5 19c0-8.5 5.5-14 15-15-1 9.5-6.5 15-15 15zM5 19c3-4 6-7 10-9.5",
    herz:     "M12 20s-7.5-4.6-7.5-10A4.4 4.4 0 0 1 12 7.2 4.4 4.4 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z",
  };

  const SYMBOL_FUER = {
    politik: "gebaeude", wirtschaft: "grafik", finanzen: "grafik", sport: "ball",
    wissen: "kolben", wissenschaft: "kolben", kultur: "buch", technik: "chip", digital: "chip",
    "in-eigener-sache": "sonne", lokales: "ort", region: "ort", welt: "globus", ausland: "globus",
    musik: "note", spiele: "spiel", gaming: "spiel", umwelt: "blatt", klima: "blatt", natur: "blatt",
    gesundheit: "herz",
  };

  let grafikNr = 0;

  function titelgrafik(a) {
    const r = a.rubrik;
    const zufall = zufallsfolge(a.id);
    const basis = r.farbe;
    const tief = mische(basis, "#0b1120", 0.5);
    const hell = mische(basis, "#ffffff", 0.55);
    const nr = ++grafikNr;
    const horizont = 57 + zufall() * 9;
    const sr = 15 + zufall() * 12;
    const sx = 84 + zufall() * 50;
    const zahl = function (n) { return n.toFixed(1); };

    let sterne = "";
    for (let i = 0; i < 6; i++) {
      sterne += '<circle cx="' + zahl(8 + zufall() * 144) + '" cy="' + zahl(6 + zufall() * (horizont - 30)) +
        '" r="' + (0.5 + zufall() * 0.8).toFixed(2) + '" fill="#fff" fill-opacity="' + (0.25 + zufall() * 0.45).toFixed(2) + '"/>';
    }

    let spiegelung = "";
    for (let i = 0; i < 4; i++) {
      const breite = sr * 2.3 * (1 - i * 0.24) * (0.85 + zufall() * 0.3);
      spiegelung += '<rect x="' + zahl(sx - breite / 2) + '" y="' + zahl(horizont + 4.5 + i * 5.8) + '" width="' + zahl(breite) +
        '" height="2.3" rx="1.15" fill="' + hell + '" fill-opacity="' + (0.8 - i * 0.18).toFixed(2) + '"/>';
    }

    const symbol = SYMBOLE[r.symbol] || SYMBOLE[SYMBOL_FUER[r.id]] || SYMBOLE.zeitung;

    return '<svg class="titelgrafik" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="tg' + nr + 'h" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + tief + '"/><stop offset="1" stop-color="' + basis + '"/></linearGradient>' +
      '<clipPath id="tg' + nr + 'c"><rect width="160" height="' + zahl(horizont) + '"/></clipPath></defs>' +
      '<rect width="160" height="90" fill="url(#tg' + nr + 'h)"/>' + sterne +
      '<circle cx="' + zahl(sx) + '" cy="' + zahl(horizont) + '" r="' + zahl(sr + 10) + '" fill="' + hell + '" fill-opacity=".15" clip-path="url(#tg' + nr + 'c)"/>' +
      '<circle cx="' + zahl(sx) + '" cy="' + zahl(horizont) + '" r="' + zahl(sr) + '" fill="' + hell + '" clip-path="url(#tg' + nr + 'c)"/>' +
      '<rect y="' + zahl(horizont) + '" width="160" height="' + zahl(90 - horizont) + '" fill="' + tief + '" fill-opacity=".6"/>' +
      spiegelung +
      '<g transform="translate(11 10) scale(.75)" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" opacity=".92">' +
      '<path d="' + symbol + '"/></g></svg>';
  }

  function zufallsfolge(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h = (h + 0x6D2B79F5) | 0;
      let t = Math.imul(h ^ (h >>> 15), h | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rgbSpeicher = {};
  function rgb(farbe) {
    if (rgbSpeicher[farbe]) return rgbSpeicher[farbe];
    let f = String(farbe).trim();
    let m = f.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    if (m) f = "#" + m[1] + m[1] + m[2] + m[2] + m[3] + m[3];
    m = f.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    let werte;
    if (m) {
      werte = [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
    } else {
      // andere Schreibweisen (zum Beispiel „teal“) rechnet der Browser um
      const probe = document.createElement("span");
      probe.style.color = f;
      document.body.appendChild(probe);
      const zahlen = getComputedStyle(probe).color.match(/[\d.]+/g) || [107, 115, 133];
      probe.parentNode.removeChild(probe);
      werte = [+zahlen[0], +zahlen[1], +zahlen[2]];
    }
    rgbSpeicher[farbe] = werte;
    return werte;
  }

  function mische(farbe, ziel, anteil) {
    const a = rgb(farbe);
    const b = rgb(ziel);
    return "#" + a.map(function (w, i) {
      const x = Math.round(w + (b[i] - w) * anteil);
      return (x < 16 ? "0" : "") + x.toString(16);
    }).join("");
  }


  /* =================================================================
     4. Bausteine
     ================================================================= */

  const ICON = {
    suche:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 20 20"/></svg>',
    mond:   '<svg class="icon-mond" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/></svg>',
    sonne:  '<svg class="icon-sonne" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>',
    teilen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4M7 10.5H6a1.5 1.5 0 0 0-1.5 1.5v7.5A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5V12a1.5 1.5 0 0 0-1.5-1.5h-1"/></svg>',
    pfeil:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };

  function artikelLink(a) { return "artikel.html#" + encodeURIComponent(a.id); }
  function rubrikLink(r) { return "rubrik.html#" + encodeURIComponent(r.id); }
  function farbe(r) { return ' style="--rubrik:' + esc(r.farbe) + '"'; }

  function hashWert() {
    try { return decodeURIComponent(location.hash.replace(/^#/, "")); }
    catch (e) { return location.hash.replace(/^#/, ""); }
  }

  function markeHtml(name) {
    const n = String(name || "");
    const mitPunkt = /\.$/.test(n);
    return '<span class="marke-name">' + txt(mitPunkt ? n.slice(0, -1) : n) +
      (mitPunkt ? '<span class="marke-punkt" aria-hidden="true"></span>' : "") + "</span>";
  }

  function label(r, alsLink) {
    return alsLink
      ? '<a class="label" href="' + rubrikLink(r) + '"' + farbe(r) + ">" + txt(r.name) + "</a>"
      : '<span class="label"' + farbe(r) + ">" + txt(r.name) + "</span>";
  }

  function chip(text) { return '<span class="chip">' + esc(text) + "</span>"; }

  function metaKurz(a) {
    return [
      a.datum ? '<time datetime="' + iso(a) + '">' + wann(a) + "</time>" : "",
      a.beispiel ? chip("Beispiel") : "",
      a.entwurf ? chip("Entwurf") : "",
    ].join("");
  }

  function bildbox(a, klasse) {
    const inhalt = a.bild
      ? '<img src="' + esc(a.bild) + '" alt="" loading="lazy" decoding="async" data-ersatz="' + esc(a.id) + '">'
      : titelgrafik(a);
    return '<div class="bildbox' + (klasse ? " " + klasse : "") + '">' + inhalt + "</div>";
  }

  function kicker(a, mitRubrik, rubrikAlsLink) {
    const teile = (mitRubrik ? label(a.rubrik, rubrikAlsLink) : "") +
      (a.dachzeile ? '<span class="dachzeile">' + txt(a.dachzeile) + "</span>" : "");
    return teile ? '<p class="kicker">' + teile + "</p>" : "";
  }

  function karte(a, optionen) {
    const o = optionen || {};
    return '<article class="karte"' + farbe(a.rubrik) + ">" +
      bildbox(a) +
      '<div class="karte-text">' +
      kicker(a, !o.ohneRubrik, true) +
      '<h3 class="titel karte-titel"><a href="' + artikelLink(a) + '">' + txt(a.titel) + "</a></h3>" +
      (a.teaser && !o.ohneTeaser ? '<p class="karte-teaser">' + txt(a.teaser) + "</p>" : "") +
      '<p class="meta">' + metaKurz(a) + "</p>" +
      "</div></article>";
  }

  function markiere(html, woerter) {
    if (!woerter || !woerter.length) return html;
    const muster = woerter
      .filter(function (w) { return w.length > 1; })
      .map(function (w) { return esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
    if (!muster.length) return html;
    return html.replace(new RegExp("(&[a-z#0-9]+;)|(" + muster.join("|") + ")", "gi"), function (ganz, entity, wort) {
      return entity ? entity : "<mark>" + wort + "</mark>";
    });
  }

  function meldung(a, woerter) {
    return '<li class="meldung"' + farbe(a.rubrik) + ">" +
      '<div class="meldung-text">' +
      kicker(a, true, true) +
      '<h3 class="titel meldung-titel"><a href="' + artikelLink(a) + '">' + markiere(txt(a.titel), woerter) + "</a></h3>" +
      (a.teaser ? '<p class="meldung-teaser">' + markiere(txt(a.teaser), woerter) + "</p>" : "") +
      '<p class="meta">' + metaKurz(a) + "</p>" +
      "</div>" + bildbox(a, "klein") + "</li>";
  }

  function meldungsliste(liste, woerter) {
    return '<ol class="meldungen">' + liste.map(function (a) { return meldung(a, woerter); }).join("") + "</ol>";
  }

  // Kopf, Eilmeldung, Menü und Fuß – auf jeder Seite gleich
  function zeichneRahmen(d, art) {
    const jetzt = new Date();
    const kopf = document.getElementById("tb-kopf");
    const navi = document.getElementById("tb-navi");
    const fuss = document.getElementById("tb-fuss");
    const eil = d.artikel.filter(function (a) { return a.eilmeldung; })[0];

    if (kopf) {
      kopf.innerHTML =
        (eil ? '<div class="eil" id="tb-eil"><div class="wrap"><a href="' + artikelLink(eil) + '">' +
          '<span class="eil-marke">Eilmeldung</span><span class="eil-titel">' + txt(eil.titel) + "</span></a></div></div>" : "") +
        '<header class="kopf"><div class="wrap kopf-innen">' +
        '<a class="marke" href="index.html" aria-label="' + esc(d.seite.name) + ' – zur Startseite">' + markeHtml(d.seite.name) +
        (d.seite.slogan ? '<span class="marke-slogan">' + txt(d.seite.slogan) + "</span>" : "") + "</a>" +
        '<p class="kopf-datum"><span id="tb-gruss">' + gruss(jetzt) + "</span> <strong>" + datumLang(jetzt) + "</strong></p>" +
        '<div class="kopf-knoepfe">' +
        '<a class="icon-knopf" href="suche.html" aria-label="Suche">' + ICON.suche + "</a>" +
        '<button class="icon-knopf" type="button" id="tb-design" aria-label="Design wechseln">' + ICON.mond + ICON.sonne + "</button>" +
        "</div></div></header>";
    }

    if (navi) {
      navi.innerHTML = '<div class="wrap"><ul class="navi-liste">' +
        '<li><a href="index.html" data-rubrik=""' + (art === "start" ? ' aria-current="page"' : "") + ">Start</a></li>" +
        d.rubriken.filter(function (r) { return r.menue; }).map(function (r) {
          return '<li><a href="' + rubrikLink(r) + '" data-rubrik="' + esc(r.id) + '"' + farbe(r) + ">" + txt(r.name) + "</a></li>";
        }).join("") +
        "</ul></div>";
    }

    if (fuss) {
      const neueste = d.artikel[0];
      fuss.innerHTML = '<div class="wrap"><div class="fuss-raster">' +
        '<div class="fuss-marke"><a class="marke" href="index.html">' + markeHtml(d.seite.name) + "</a>" +
        (d.seite.slogan ? "<p>" + txt(d.seite.slogan) + "</p>" : "") +
        (d.seite.fusszeile ? '<p class="fuss-notiz">' + inline(d.seite.fusszeile) + "</p>" : "") + "</div>" +
        '<nav aria-label="Alle Rubriken"><h2>Rubriken</h2><ul>' +
        d.rubriken.map(function (r) { return '<li><a href="' + rubrikLink(r) + '">' + txt(r.name) + "</a></li>"; }).join("") +
        "</ul></nav>" +
        '<nav aria-label="Service"><h2>Service</h2><ul>' +
        '<li><a href="rubrik.html">Alle Meldungen</a></li>' +
        '<li><a href="suche.html">Suche</a></li>' +
        '<li><a href="impressum.html">Impressum</a></li>' +
        '<li><a href="datenschutz.html">Datenschutz</a></li>' +
        "</ul></nav></div>" +
        '<div class="fuss-unten"><span>© ' + jetzt.getFullYear() + " " + txt(d.seite.name) + "</span>" +
        (neueste && neueste.datum ? "<span>Letzte Meldung: " + wann(neueste) + "</span>" : "") + "</div></div>";
    }
  }

  function naviAktiv(rubrikId) {
    Array.prototype.forEach.call(document.querySelectorAll(".navi a"), function (a) {
      if (a.getAttribute("data-rubrik") === rubrikId) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function eilmeldungFuer(artikelId) {
    const band = document.getElementById("tb-eil");
    if (band) band.hidden = band.querySelector("a").getAttribute("href") === "artikel.html#" + encodeURIComponent(artikelId);
  }

  function seitentitel(titel, d) {
    document.title = titel ? titel + " – " + d.seite.name : d.seite.name + (d.seite.slogan ? " " + d.seite.slogan : "");
  }

  function beschreibung(text) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta && text) meta.setAttribute("content", text);
  }

  // Fotos, die nicht gefunden werden, durch die Titelgrafik ersetzen
  function bilderPruefen(d) {
    Array.prototype.forEach.call(document.querySelectorAll("img[data-ersatz]"), function (img) {
      img.addEventListener("error", function () {
        const a = d.nachId[img.getAttribute("data-ersatz")];
        if (!a || !img.parentNode) return;
        img.insertAdjacentHTML("afterend", titelgrafik(a));
        img.parentNode.classList.remove("foto");
        img.parentNode.removeChild(img);
        if (VORSCHAU) {
          hinweisNachtragen({
            datei: a.block.datei, zeile: a.bildZeile,
            text: zitat(a.titel) + ": Das Bild „" + a.bild + "“ wurde nicht gefunden. Prüfe den Namen – auch Groß- und Kleinschreibung zählt.",
          });
        }
      });
    });
  }

  let toastZeit = null;
  function toast(text, lang) {
    let el = document.getElementById("tb-toast");
    if (!el) {
      document.body.insertAdjacentHTML("beforeend", '<div class="toast" id="tb-toast" role="status" aria-live="polite" hidden></div>');
      el = document.getElementById("tb-toast");
    }
    el.textContent = text;
    el.hidden = false;
    clearTimeout(toastZeit);
    toastZeit = setTimeout(function () { el.hidden = true; }, lang ? 9000 : 2600);
  }

  // ---------- Hinweise für dich (nur in der Vorschau) ----------

  function hinweisZeile(h) {
    return "<li>" + (h.datei ? "<code>" + esc(h.datei) + "</code>" + (h.zeile ? " · Zeile " + h.zeile : "") + ": " : "") + esc(h.text) + "</li>";
  }

  function hinweisKasten(liste) {
    return '<details class="hinweis" id="tb-hinweisliste" open>' +
      '<summary class="hinweis-titel">' + (liste.length === 1 ? "1 Hinweis" : liste.length + " Hinweise") + " zu deinen Inhalten</summary>" +
      "<ul>" + liste.slice(0, 40).map(hinweisZeile).join("") + "</ul>" +
      '<p class="hinweis-klein">Diesen Kasten siehst nur du in der Vorschau. Online erscheint er nicht.</p></details>';
  }

  function hinweisNachtragen(h) {
    const kasten = document.getElementById("tb-hinweisliste");
    if (kasten) {
      kasten.querySelector("ul").insertAdjacentHTML("beforeend", hinweisZeile(h));
      const alle = kasten.querySelectorAll("li").length;
      kasten.querySelector("summary").textContent = (alle === 1 ? "1 Hinweis" : alle + " Hinweise") + " zu deinen Inhalten";
    } else {
      hinweisBereich().insertAdjacentHTML("beforeend", hinweisKasten([h]));
    }
  }

  // Die Hinweise stehen direkt über dem Inhalt, damit sie beim
  // Blättern zwischen Artikeln nicht verschwinden.
  function hinweisBereich() {
    let bereich = document.getElementById("tb-hinweise");
    if (!bereich) {
      const main = document.getElementById("tb-inhalt");
      main.insertAdjacentHTML("beforebegin", '<div class="wrap hinweise" id="tb-hinweise"></div>');
      bereich = document.getElementById("tb-hinweise");
    }
    return bereich;
  }

  function fehlerKasten(p) {
    if (p.fehlt) {
      return '<div class="hinweis hinweis-fehler" role="alert"><p class="hinweis-titel">Die Datei <code>' + esc(p.datei) + "</code> wurde nicht gefunden.</p>" +
        "<p>Prüfe, ob sie im Ordner <code>inhalt</code> liegt und genau so heißt.</p></div>";
    }
    return '<div class="hinweis hinweis-fehler" role="alert">' +
      '<p class="hinweis-titel">In <code>' + esc(p.datei) + "</code> steckt ein Fehler" + (p.zeile ? ", vermutlich in Zeile " + p.zeile : "") + ".</p>" +
      "<p>Deshalb konnte diese Datei nicht gelesen werden. Meistens ist es eine Kleinigkeit:</p><ul>" +
      "<li>Ein Backtick (das Zeichen <code>" + BACKTICK + "</code>) mitten im Text. Er darf nur in der ersten und in der letzten Zeile der Datei stehen. Nimm im Text stattdessen <code>'</code> oder <code>´</code>.</li>" +
      "<li>Die erste Zeile (<code>inhalt" + BACKTICK + "</code>) oder die letzte Zeile (<code>" + BACKTICK + "</code>) wurde gelöscht oder verändert.</li>" +
      "<li>Im Text steht die Zeichenfolge <code>$" + "{</code>. Auch die ist nicht erlaubt.</li></ul>" +
      "<p>Tipp: In Textastic hat ab der Fehlerstelle oft der ganze Rest der Datei eine andere Farbe. Wenn der Fehler gerade erst passiert ist, hilft auch Rückgängig (⌘Z).</p>" +
      (p.meldung ? '<p class="hinweis-klein">Meldung des Browsers: ' + esc(p.meldung) + "</p>" : "") +
      "</div>";
  }

  function zeigeHinweise(d) {
    let html = "";
    if (d.probleme.length) {
      html += VORSCHAU
        ? d.probleme.map(fehlerKasten).join("")
        : '<div class="hinweis hinweis-fehler" role="alert"><p class="hinweis-titel">Hier stimmt gerade etwas nicht.</p>' +
          "<p>Ein Teil der Inhalte konnte nicht geladen werden. Bitte versuch es später noch einmal.</p>" +
          '<details><summary>Für die Redaktion</summary>' + d.probleme.map(fehlerKasten).join("") + "</details></div>";
    }
    if (VORSCHAU && d.hinweise.length) {
      const dateien = eingang.map(function (e) { return e.datei; });
      const sortiert = d.hinweise.map(function (h, i) { return { h: h, i: i }; }).sort(function (x, y) {
        return (dateien.indexOf(x.h.datei) - dateien.indexOf(y.h.datei)) || ((x.h.zeile || 0) - (y.h.zeile || 0)) || (x.i - y.i);
      }).map(function (x) { return x.h; });
      html += hinweisKasten(sortiert);
    }
    if (html) hinweisBereich().innerHTML = html;
  }


  /* =================================================================
     5. Seiten
     ================================================================= */

  // ---------- Startseite ----------

  function startseite(d) {
    const main = document.getElementById("tb-inhalt");
    seitentitel("", d);
    if (!d.artikel.length) {
      main.innerHTML = '<div class="wrap">' + (d.probleme.length
        ? leer("Die Nachrichten sind gleich wieder da", VORSCHAU
          ? "Sobald der Fehler oben behoben ist, erscheinen hier wieder alle Artikel."
          : "Bitte schau in ein paar Minuten noch einmal vorbei.", true)
        : leer("Noch keine Artikel", VORSCHAU
          ? "Öffne inhalt/artikel.js in Textastic und schreib deinen ersten Artikel. Eine Vorlage steht ganz oben in der Datei."
          : "Hier erscheinen bald die ersten Nachrichten.", true)) + "</div>";
      return;
    }

    const aufmacher = d.artikel.filter(function (a) { return a.top; })[0] || d.artikel[0];
    const rest = d.artikel.filter(function (a) { return a !== aufmacher; });
    const bloecke = d.rubriken
      .filter(function (r) { return r.menue; })
      .map(function (r) { return { rubrik: r, artikel: rest.filter(function (a) { return a.rubrik === r; }) }; })
      .filter(function (b) { return b.artikel.length; });

    main.innerHTML = '<div class="wrap stapel">' +
      beispielHinweis(d) +
      '<div class="buehne">' + aufmacherHtml(aufmacher) + zeitleisteHtml(rest.slice(0, 6)) + "</div>" +
      (bloecke.length ? '<div class="rubrik-raster">' + bloecke.map(rubrikBlock).join("") + "</div>" : "") +
      "</div>";
    bilderPruefen(d);
  }

  function beispielHinweis(d) {
    const anzahl = d.artikel.filter(function (a) { return a.beispiel; }).length;
    if (!anzahl) return "";
    const anleitung = d.nachId["so-entsteht-ein-artikel"];
    if (VORSCHAU) {
      return '<div class="hinweis"><p class="hinweis-titel">Deine Seite läuft.</p>' +
        "<p>" + anzahl + " Artikel sind mit „Beispiel“ markiert. Sie spielen in der erfundenen Musterstadt und zeigen, wie Meldungen aussehen können. " +
        "Ersetze sie in <code>inhalt/artikel.js</code> durch eigene Nachrichten." +
        (anleitung ? ' Wie das geht, steht im Artikel <a href="' + artikelLink(anleitung) + '">' + txt(anleitung.titel) + "</a>" +
          (/[.!?]$/.test(anleitung.titel) ? "" : ".") : "") + "</p></div>";
    }
    return '<div class="hinweis"><p class="hinweis-titel">Im Aufbau</p>' +
      "<p>" + txt(d.seite.name) + " ist gerade gestartet. Artikel mit dem Hinweis „Beispiel“ sind erfunden und zeigen, wie die Seite einmal aussehen wird.</p></div>";
  }

  function aufmacherHtml(a) {
    return '<article class="aufmacher"' + farbe(a.rubrik) + ">" +
      bildbox(a, "gross") +
      '<div class="aufmacher-text">' +
      kicker(a, true, true) +
      '<h2 class="titel aufmacher-titel"><a href="' + artikelLink(a) + '">' + txt(a.titel) + "</a></h2>" +
      (a.teaser ? '<p class="aufmacher-teaser">' + txt(a.teaser) + "</p>" : "") +
      '<p class="meta">' + metaKurz(a) + "</p>" +
      "</div></article>";
  }

  function zeitleisteHtml(liste) {
    if (!liste.length) return "";
    return '<aside class="zeitleiste" aria-labelledby="tb-zl-titel">' +
      '<h2 class="zl-titel" id="tb-zl-titel">Der Tag auf einen Blick<span class="schlusspunkt">.</span></h2>' +
      nachTagen(liste).map(function (g, gi) {
        return '<h3 class="zl-tag">' + esc(g.titel) + "</h3>" +
          '<ol class="zl-liste">' + g.artikel.map(function (a, i) {
            return '<li class="zl-eintrag' + (gi === 0 && i === 0 ? " neu" : "") + '"' + farbe(a.rubrik) + ">" +
              '<span class="zl-zeit">' + (a.datum && a.mitZeit ? '<time datetime="' + iso(a) + '">' + uhrzeit(a.datum) + "</time>" : "·") + "</span>" +
              '<div class="zl-inhalt"><span class="zl-rubrik">' + txt(a.rubrik.name) + "</span>" +
              '<a class="zl-link" href="' + artikelLink(a) + '">' + txt(a.titel) + "</a></div></li>";
          }).join("") + "</ol>";
      }).join("") +
      '<a class="mehr-link" href="rubrik.html">Alle Meldungen ' + ICON.pfeil + "</a>" +
      "</aside>";
  }

  function rubrikBlock(b) {
    const r = b.rubrik;
    const weitere = b.artikel.slice(1, 3);
    return '<section class="rubrik-block"' + farbe(r) + ' aria-labelledby="tb-rb-' + esc(r.id) + '">' +
      '<div class="block-kopf"><h2 class="block-titel" id="tb-rb-' + esc(r.id) + '"><a href="' + rubrikLink(r) + '">' +
      txt(r.name) + '<span class="schlusspunkt">.</span></a></h2>' +
      '<a class="mehr-link" href="' + rubrikLink(r) + '" aria-label="Alle Artikel aus ' + esc(r.name) + '">Alle ' + ICON.pfeil + "</a></div>" +
      karte(b.artikel[0], { ohneRubrik: true }) +
      (weitere.length ? '<ul class="schlagzeilen">' + weitere.map(function (a) {
        return '<li class="schlagzeile"><a href="' + artikelLink(a) + '">' + txt(a.titel) + '</a><p class="meta">' + metaKurz(a) + "</p></li>";
      }).join("") + "</ul>" : "") +
      "</section>";
  }

  function leer(titel, text, ohneKnopf) {
    return '<div class="leer"><p class="leer-titel">' + esc(titel) + '<span class="schlusspunkt">.</span></p><p>' + esc(text) + "</p>" +
      (ohneKnopf ? "" : '<a class="knopf" href="index.html">Zur Startseite</a>') + "</div>";
  }

  // ---------- Artikelseite (artikel.html#id) ----------

  function artikelseite(d) {
    const main = document.getElementById("tb-inhalt");
    function zeigen() {
      const wert = hashWert();
      if (/^tb-/.test(wert)) return;
      const a = wert ? d.nachId[wert] || d.nachId[slug(wert)] : d.artikel[0];
      if (!a) {
        seitentitel("Artikel nicht gefunden", d);
        main.innerHTML = '<div class="wrap">' + leer("Diesen Artikel gibt es nicht", "Vielleicht wurde er umbenannt oder gelöscht. Auf der Startseite findest du alle aktuellen Meldungen.") + "</div>";
        naviAktiv(null);
        return;
      }
      seitentitel(a.titel, d);
      beschreibung(a.teaser);
      main.innerHTML = artikelHtml(a, d);
      naviAktiv(a.rubrik.id);
      eilmeldungFuer(a.id);
      bilderPruefen(d);
      teilenKnopf(a);
      lesefortschritt();
      window.scrollTo(0, 0);
    }
    zeigen();
    window.addEventListener("hashchange", zeigen);
  }

  function artikelHtml(a, d) {
    const bild = a.bild
      ? '<div class="bildbox foto"><img src="' + esc(a.bild) + '" alt="' + esc(a.bildtext || a.titel) + '" data-ersatz="' + esc(a.id) + '"></div>'
      : '<div class="bildbox">' + titelgrafik(a) + "</div>";
    const unterschrift = (a.bildtext ? inline(a.bildtext) : "") +
      (a.bildquelle ? (a.bildtext ? " " : "") + '<span class="bildquelle">' + txt(a.bildquelle) + "</span>" : "");
    const weitere = weiterlesen(a, d);

    return '<div class="wrap">' +
      '<article class="artikel"' + farbe(a.rubrik) + ">" +
      '<header class="artikel-kopf">' +
      '<p class="kicker">' + label(a.rubrik, true) + (a.beispiel ? chip("Beispiel") : "") + (a.entwurf ? chip("Entwurf") : "") + "</p>" +
      (a.dachzeile ? '<p class="dachzeile">' + txt(a.dachzeile) + "</p>" : "") +
      '<h1 class="titel artikel-titel">' + txt(a.titel) + "</h1>" +
      (a.teaser ? '<p class="artikel-teaser">' + txt(a.teaser) + "</p>" : "") +
      '<p class="artikel-meta"><span>Von <strong>' + txt(a.autor) + "</strong></span>" +
      (a.datum ? '<time datetime="' + iso(a) + '">' + datumVoll(a) + "</time>" : "") +
      "<span>" + lesezeit(a) + " Min. Lesezeit</span></p>" +
      "</header>" +
      '<figure class="artikel-bild">' + bild + (unterschrift ? "<figcaption>" + unterschrift + "</figcaption>" : "") + "</figure>" +
      '<div class="artikel-koerper">' +
      (a.beispiel ? '<p class="hinweis">Beispielartikel: Musterstadt gibt es nicht. Dieser Text ist erfunden und zeigt, wie ein Artikel bei ' + txt(d.seite.name) + " aussehen kann.</p>" : "") +
      (a.kurz.length ? '<aside class="auf-den-punkt" aria-labelledby="tb-adp"><h2 class="adp-titel" id="tb-adp">Auf den Punkt<span class="schlusspunkt">.</span></h2>' +
        '<ul class="adp-liste">' + a.kurz.map(function (k) { return "<li>" + inline(k) + "</li>"; }).join("") + "</ul></aside>" : "") +
      '<div class="text">' + textZuHtml(a.textZeilen) + "</div>" +
      '<div class="artikel-fuss">' +
      '<button type="button" class="knopf" id="tb-teilen">' + ICON.teilen + "Teilen</button>" +
      '<a class="knopf" href="' + rubrikLink(a.rubrik) + '">Mehr aus der Rubrik ' + txt(a.rubrik.name) + "</a>" +
      "</div></div></article>" +
      (weitere.length ? '<section class="weiterlesen" aria-labelledby="tb-wl"><h2 class="block-titel" id="tb-wl">Weiterlesen<span class="schlusspunkt">.</span></h2>' +
        '<div class="karten">' + weitere.map(function (x) { return karte(x, { ohneTeaser: true }); }).join("") + "</div></section>" : "") +
      "</div>";
  }

  // Erst Artikel aus derselben Rubrik, dann die neuesten anderen
  function weiterlesen(a, d) {
    const gleich = d.artikel.filter(function (x) { return x !== a && x.rubrik === a.rubrik; });
    const andere = d.artikel.filter(function (x) { return x !== a && x.rubrik !== a.rubrik; });
    return gleich.concat(andere).slice(0, 3);
  }

  function teilenKnopf(a) {
    const knopf = document.getElementById("tb-teilen");
    if (!knopf) return;
    knopf.addEventListener("click", function () {
      const url = location.href;
      if (location.protocol === "file:") { toast("Teilen klappt, sobald deine Seite online ist."); return; }
      if (navigator.share) {
        navigator.share({ title: a.titel, text: a.teaser, url: url }).catch(function (f) {
          if (!f || f.name !== "AbortError") kopieren(url);
        });
      } else {
        kopieren(url);
      }
    });
  }

  function kopieren(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { toast("Link kopiert"); },
        function () { toast("Link zum Teilen: " + text, true); }
      );
    } else {
      toast("Link zum Teilen: " + text, true);
    }
  }

  let fortschrittAktiv = false;
  function lesefortschritt() {
    if (!document.getElementById("tb-fortschritt")) {
      document.body.insertAdjacentHTML("afterbegin", '<div class="lesefortschritt" id="tb-fortschritt" aria-hidden="true"><span></span></div>');
    }
    const balken = document.querySelector("#tb-fortschritt span");
    let geplant = false;
    function messen() {
      geplant = false;
      const artikel = document.querySelector(".artikel");
      if (!artikel) return;
      const box = artikel.getBoundingClientRect();
      const strecke = box.height - window.innerHeight;
      const anteil = strecke > 0 ? Math.min(1, Math.max(0, -box.top / strecke)) : 1;
      balken.style.transform = "scaleX(" + anteil.toFixed(4) + ")";
    }
    if (!fortschrittAktiv) {
      fortschrittAktiv = true;
      window.addEventListener("scroll", function () {
        if (!geplant) { geplant = true; window.requestAnimationFrame(messen); }
      }, { passive: true });
      window.addEventListener("resize", messen);
    }
    messen();
  }

  // ---------- Rubrikseite (rubrik.html#id) und „Alle Meldungen“ ----------

  function rubrikseite(d) {
    const main = document.getElementById("tb-inhalt");
    function zeigen() {
      const wert = hashWert();
      if (/^tb-/.test(wert)) return;
      if (!wert) {
        seitentitel("Alle Meldungen", d);
        naviAktiv(null);
        main.innerHTML = '<div class="wrap stapel-klein">' +
          '<header class="seitenkopf"><h1 class="seitentitel">Alle Meldungen<span class="schlusspunkt">.</span></h1>' +
          '<p class="meta">' + d.artikel.length + " Artikel, die neuesten zuerst</p></header>" +
          "<div>" + nachTagen(d.artikel).map(function (g) {
            return '<h2 class="tag-titel">' + esc(g.titel) + "</h2>" + meldungsliste(g.artikel);
          }).join("") + "</div></div>";
      } else {
        const r = d.rubrikNachId[slug(wert)];
        if (!r) {
          seitentitel("Rubrik nicht gefunden", d);
          naviAktiv(null);
          main.innerHTML = '<div class="wrap">' + leer("Diese Rubrik gibt es nicht", "Unten auf jeder Seite findest du alle Rubriken.") + "</div>";
          return;
        }
        const liste = d.artikel.filter(function (a) { return a.rubrik === r; });
        seitentitel(r.name, d);
        beschreibung(r.beschreibung);
        naviAktiv(r.id);
        main.innerHTML = '<div class="wrap stapel-klein">' +
          '<header class="seitenkopf"' + farbe(r) + '><h1 class="seitentitel">' + txt(r.name) + '<span class="schlusspunkt">.</span></h1>' +
          (r.beschreibung ? '<p class="seitenkopf-text">' + txt(r.beschreibung) + "</p>" : "") +
          '<p class="meta">' + (liste.length === 1 ? "1 Artikel" : liste.length + " Artikel") + "</p></header>" +
          (liste.length ? meldungsliste(liste) : leer("Hier ist noch nichts", "In dieser Rubrik gibt es noch keine Artikel.")) +
          "</div>";
      }
      bilderPruefen(d);
      window.scrollTo(0, 0);
    }
    zeigen();
    window.addEventListener("hashchange", zeigen);
  }

  // ---------- Suche (suche.html#begriff) ----------

  function suchseite(d) {
    const main = document.getElementById("tb-inhalt");
    seitentitel("Suche", d);
    naviAktiv(null);
    main.innerHTML = '<div class="wrap stapel-klein">' +
      '<header class="seitenkopf"><h1 class="seitentitel">Suche<span class="schlusspunkt">.</span></h1></header>' +
      '<form class="suche" role="search" id="tb-suchform">' +
      '<label class="suche-feld"><span class="sr">Suchbegriff</span>' + ICON.suche +
      '<input id="tb-suchfeld" type="search" name="q" placeholder="Wonach suchst du?" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></label>' +
      "</form>" +
      '<p class="suche-status" id="tb-suchstatus" aria-live="polite"></p>' +
      '<div id="tb-treffer"></div></div>';

    const feld = document.getElementById("tb-suchfeld");
    const status = document.getElementById("tb-suchstatus");
    const ziel = document.getElementById("tb-treffer");

    const index = d.artikel.map(function (a) {
      return {
        artikel: a,
        felder: [
          [suchform(a.titel), 6], [suchform(a.dachzeile), 3], [suchform(a.teaser), 3],
          [suchform(a.kurz.join(" ")), 2], [suchform(a.rubrik.name), 2], [suchform(a.autor), 1],
          [suchform(nurText(a.textZeilen)), 1],
        ],
      };
    });

    function suchen() {
      const begriff = feld.value.trim();
      adresseMerken(begriff);
      if (!begriff) {
        status.textContent = "";
        ziel.innerHTML = '<div class="stapel-klein"><div><h2 class="tag-titel">Rubriken</h2><ul class="stichworte">' +
          d.rubriken.map(function (r) { return '<li><a href="' + rubrikLink(r) + '"' + farbe(r) + ">" + txt(r.name) + "</a></li>"; }).join("") +
          '</ul></div><div><h2 class="tag-titel">Neueste Meldungen</h2>' + meldungsliste(d.artikel.slice(0, 5)) + "</div></div>";
        bilderPruefen(d);
        return;
      }
      const woerter = suchform(begriff).split(/\s+/).filter(Boolean);
      const treffer = index.map(function (e) {
        let punkte = 0;
        for (let i = 0; i < woerter.length; i++) {
          let p = 0;
          e.felder.forEach(function (f) { if (f[0].indexOf(woerter[i]) !== -1) p += f[1]; });
          if (!p) return null;
          punkte += p;
        }
        return { artikel: e.artikel, punkte: punkte };
      }).filter(Boolean).sort(function (x, y) {
        return y.punkte - x.punkte || zeitwert(y.artikel) - zeitwert(x.artikel);
      });

      status.textContent = treffer.length
        ? (treffer.length === 1 ? "1 Treffer" : treffer.length + " Treffer") + " für „" + begriff + "“"
        : "Keine Treffer für „" + begriff + "“. Versuch es mit einem anderen oder kürzeren Wort.";
      ziel.innerHTML = treffer.length ? meldungsliste(treffer.map(function (t) { return t.artikel; }), begriff.split(/\s+/)) : "";
      bilderPruefen(d);
    }

    function adresseMerken(begriff) {
      const neu = begriff ? "#" + encodeURIComponent(begriff) : location.pathname + location.search;
      try { history.replaceState(null, "", neu); } catch (e) { /* in manchen Vorschauen nicht erlaubt */ }
    }

    let warten = null;
    feld.addEventListener("input", function () { clearTimeout(warten); warten = setTimeout(suchen, 120); });
    document.getElementById("tb-suchform").addEventListener("submit", function (e) { e.preventDefault(); suchen(); feld.blur(); });
    window.addEventListener("hashchange", function () {
      if (hashWert() !== feld.value.trim()) { feld.value = hashWert(); suchen(); }
    });

    feld.value = hashWert();
    suchen();
    if (!feld.value) feld.focus();
  }

  // ---------- Textseiten (Impressum, Datenschutz, 404) ----------

  function textseite(d) {
    naviAktiv(null);
    const h1 = document.querySelector("main h1");
    seitentitel(h1 ? h1.textContent.replace(/\.$/, "") : "", d);
  }


  /* =================================================================
     6. Start – sobald alle Dateien geladen sind
     ================================================================= */

  function designKnopf() {
    const knopf = document.getElementById("tb-design");
    if (!knopf) return;
    const wurzel = document.documentElement;
    const systemDunkel = function () { return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches); };
    const istDunkel = function () {
      const t = wurzel.getAttribute("data-theme");
      return t ? t === "dark" : systemDunkel();
    };
    function beschriften() {
      knopf.setAttribute("aria-label", istDunkel() ? "Helles Design einschalten" : "Dunkles Design einschalten");
    }
    knopf.addEventListener("click", function () {
      const neu = istDunkel() ? "light" : "dark";
      // Entspricht die Wahl dem Gerät, folgt die Seite wieder dem Gerät.
      const folgen = (neu === "dark") === systemDunkel();
      if (folgen) wurzel.removeAttribute("data-theme"); else wurzel.setAttribute("data-theme", neu);
      try {
        if (folgen) localStorage.removeItem("tagesblick-design");
        else localStorage.setItem("tagesblick-design", neu);
      } catch (e) { /* ohne Speicher gilt die Wahl nur bis zum Neuladen */ }
      beschriften();
    });
    beschriften();
  }

  function sprungLink() {
    const link = document.querySelector(".skip");
    const main = document.getElementById("tb-inhalt");
    if (!link || !main) return;
    link.addEventListener("click", function (e) {
      e.preventDefault();
      main.setAttribute("tabindex", "-1");
      main.focus();
      main.scrollIntoView();
    });
  }

  function tageszeitAktualisieren() {
    const jetzt = new Date();
    document.documentElement.setAttribute("data-tageszeit", tageszeit(jetzt));
    const g = document.getElementById("tb-gruss");
    if (g) g.textContent = gruss(jetzt);
  }

  function starten() {
    tageszeitAktualisieren();
    setInterval(tageszeitAktualisieren, 60000);

    const d = lesen();
    d.probleme = ladeProbleme();
    const art = document.body.getAttribute("data-seite") || "start";

    zeichneRahmen(d, art);
    const seiten = { start: startseite, artikel: artikelseite, rubrik: rubrikseite, suche: suchseite, text: textseite };
    (seiten[art] || textseite)(d);
    zeigeHinweise(d);
    designKnopf();
    sprungLink();
  }

  document.addEventListener("DOMContentLoaded", function () {
    gestartet = true;
    try {
      starten();
    } catch (fehler) {
      if (window.console) console.error(fehler);
      const main = document.getElementById("tb-inhalt");
      if (main) {
        main.innerHTML = '<div class="wrap"><div class="hinweis hinweis-fehler" role="alert">' +
          '<p class="hinweis-titel">Beim Aufbau der Seite ist etwas schiefgegangen.</p>' +
          "<p>" + esc(fehler && fehler.message) + "</p></div></div>";
      }
    }
  });
})();
