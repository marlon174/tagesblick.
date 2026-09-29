inhalt`
// =====================================================================
//  ARTIKEL  ·  Hier schreibst du deine Nachrichten.
// =====================================================================
//
//  WICHTIG: Die allererste Zeile und die allerletzte Zeile dieser
//  Datei nicht verändern. Alles dazwischen gehört dir.
//
//  So schreibst du einen neuen Artikel:
//   1. Kopiere den Block VORLAGE weiter unten, von der Zeile
//      „=== VORLAGE ===“ bis zum Ende seines Textes.
//   2. Füge ihn unter der Zeile „DEINE ARTIKEL“ ein und mach aus
//      dem Wort VORLAGE das Wort ARTIKEL.
//   3. Fülle die Angaben aus. Unter die Linie --- kommt dein Text.
//   4. Speichern, Vorschau von index.html neu laden – fertig.
//
//  Die Reihenfolge der Artikel ist egal: Die Seite sortiert nach Datum.
//  Zeilen, die mit // beginnen, sind Notizen und erscheinen nirgends.
//  Das Zeichen Backtick (das „schräge Hochkomma“ aus der ersten und
//  letzten Zeile) darf im Text nicht vorkommen.
//
//  ALLE ANGABEN
//   id           Adresse des Artikels, z. B. neuer-radweg (optional)
//   rubrik       id einer Rubrik aus einstellungen.js, z. B. sport
//   datum        z. B. 28.09.2026 14:30
//   autor        dein Name (sonst steht dort „Redaktion“)
//   dachzeile    kleine Zeile über dem Titel (optional)
//   titel        die Überschrift
//   teaser       ein, zwei Sätze, die neugierig machen
//   kurz         ein Satz für den Kasten „Auf den Punkt“ – gern mehrmals
//   bild         z. B. bilder/foto.jpg (optional)
//   bildtext     Bildunterschrift (optional)
//   bildquelle   z. B. Foto: Dein Name (optional)
//   top          ja = großer Aufmacher auf der Startseite
//   eilmeldung   ja = roter Balken ganz oben auf jeder Seite
//   entwurf      ja = nur in deiner Vorschau sichtbar, nicht online
//
//  TEXT GESTALTEN (unter der Linie ---)
//   Jede Zeile wird ein eigener Absatz.
//   ## Zwischenüberschrift
//   - Aufzählung
//   > Zitat           (letzte Zeile mit „> – Name“ = wer es gesagt hat)
//   **fett**   *kursiv*   [Linktext](https://example.com)
//   ![Bildunterschrift](bilder/foto.jpg)
// =====================================================================


=== VORLAGE ===
id: mein-erster-artikel
rubrik: politik
datum: 28.09.2026 18:00
autor: Dein Name
dachzeile: Worum es geht
titel: Hier steht die Überschrift
teaser: Ein, zwei Sätze, die Lust aufs Weiterlesen machen.
kurz: Das Wichtigste in einem Satz.
kurz: Noch ein wichtiger Punkt.
---
Hier beginnt dein Text. Jede Zeile wird ein eigener Absatz.

## Eine Zwischenüberschrift

Noch ein Absatz, diesmal mit **fettem** und *kursivem* Text.


// =====================================================================
//  DEINE ARTIKEL  ·  neue Artikel am besten direkt hier drunter
// =====================================================================


=== ARTIKEL ===
id: tagesblick-ist-online
rubrik: in-eigener-sache
datum: 28.09.2026 07:00
dachzeile: Premiere
titel: tagesblick. ist online
teaser: Ab heute gibt es hier jeden Tag Nachrichten, die schnell gelesen und leicht verstanden sind. Was dich erwartet und warum im Namen ein Punkt steckt.
kurz: tagesblick. bringt die wichtigsten Nachrichten des Tages kurz und verständlich auf den Punkt.
kurz: Jeder Artikel beginnt mit einer Zusammenfassung wie dieser. Wer wenig Zeit hat, ist nach drei Sätzen informiert.
kurz: Die ganze Seite entsteht auf einem iPad, geschrieben mit der App Textastic.
bild: bilder/tagesblick-start.svg
bildtext: Der Punkt im Logo ist eine kleine Sonne. Seine Farbe verrät die Tageszeit.
bildquelle: Grafik: tagesblick.
top: ja
eilmeldung: ja
---
Willkommen bei tagesblick.! Hier findest du jeden Tag die Nachrichten, die wichtig sind. Ohne Umwege und ohne Fachchinesisch.

## Was dich hier erwartet

Auf der Startseite steht oben der wichtigste Artikel des Tages, der **Aufmacher**. Daneben läuft die **Zeitleiste**: Sie zeigt alle neuen Meldungen in der Reihenfolge, in der sie erschienen sind. So siehst du mit einem Blick, was heute passiert ist.

Darunter sind die Nachrichten nach **Rubriken** sortiert, von Politik über Sport bis Technik. Über das Menü oben kommst du direkt zu jeder Rubrik.

## Auf den Punkt

Jeder Artikel beginnt mit dem Kasten „Auf den Punkt“. Dort stehen die zwei oder drei wichtigsten Fakten. Wer mehr wissen will, liest weiter. Wer wenig Zeit hat, ist trotzdem informiert.

Der Punkt steckt auch im Namen: tagesblick. endet mit einem Punkt, und der leuchtet im Logo in der Farbe der Tageszeit. Morgens in Morgenrot, tagsüber sonnengelb, abends in Abendrot und nachts in Nachtblau.

## Kleine Extras

- Mit der **Suche** findest du jeden Artikel über ein Stichwort.
- Oben rechts schaltest du zwischen hellem und dunklem Design um.
- Mit „Teilen“ schickst du einen Artikel an Freundinnen und Freunde.

## Wie tagesblick. entsteht

Die ganze Seite wird auf einem iPad geschrieben, mit der App Textastic. Wie das genau funktioniert, steht im Artikel [So entsteht ein Artikel bei tagesblick.](#so-entsteht-ein-artikel)

Viel Spaß beim Lesen!


=== ARTIKEL ===
id: so-entsteht-ein-artikel
rubrik: in-eigener-sache
datum: 28.09.2026 06:45
dachzeile: Blick hinter die Kulissen
titel: So entsteht ein Artikel bei tagesblick.
teaser: Kein Redaktionssystem, keine Datenbank: Jede Meldung auf dieser Seite ist ein kurzer Textblock in einer einzigen Datei. So funktioniert es.
kurz: Alle Artikel stehen in der Datei inhalt/artikel.js.
kurz: Ein neuer Artikel ist ein kopierter Block mit ein paar Angaben und dem eigentlichen Text.
kurz: Startseite, Rubriken, Zeitleiste und Suche baut die Seite danach von selbst.
---
Große Nachrichtenseiten arbeiten mit riesigen Redaktionssystemen. tagesblick. kommt mit viel weniger aus: Alle Artikel stehen als einfacher Text in einer einzigen Datei. Geschrieben wird mit Textastic auf dem iPad.

## Schritt 1: Die Datei öffnen

In Textastic liegt im Ordner **inhalt** die Datei **artikel.js**. Ganz oben stehen eine kurze Anleitung und eine Vorlage für neue Artikel.

## Schritt 2: Die Vorlage kopieren

Der Block, der mit der Zeile === VORLAGE === beginnt, wird kopiert und weiter unten wieder eingefügt. Dann wird aus dem Wort VORLAGE das Wort ARTIKEL. Die Reihenfolge in der Datei ist egal, denn die Seite sortiert alle Artikel nach dem Datum.

## Schritt 3: Die Angaben ausfüllen

Oben im Block steht in jeder Zeile eine Angabe, immer mit einem Doppelpunkt:

- **titel:** die Überschrift
- **teaser:** ein, zwei Sätze, die neugierig machen
- **rubrik:** zum Beispiel politik, sport oder wissen
- **datum:** zum Beispiel 28.09.2026 14:30
- **kurz:** ein Satz für den Kasten „Auf den Punkt“, gern mehrmals

## Schritt 4: Den Text schreiben

Unter einer Linie aus drei Strichen beginnt der eigentliche Text. Jede Zeile wird ein eigener Absatz. Eine Zeile mit zwei Rauten am Anfang wird zur Zwischenüberschrift, ein Strich am Anfang macht einen Aufzählungspunkt, und mit dem Zeichen \> am Anfang entsteht ein Zitat.

Aus \*\*doppelten Sternchen\*\* wird **fett**, aus \*einfachen Sternchen\* wird *kursiv*. Ein Link sieht so aus: \[Linktext\](adresse).

## Schritt 5: Speichern und ansehen

Nach dem Speichern zeigt die Vorschau von index.html den neuen Artikel. Er steht automatisch oben in der Zeitleiste.

## Wenn etwas nicht stimmt

Hat sich ein Tippfehler eingeschlichen, zeigt die Vorschau einen Kasten mit Hinweisen und der passenden Zeilennummer. Den Kasten sieht nur die Redaktion, nicht die Leserinnen und Leser.


=== ARTIKEL ===
id: warum-blaetter-bunt-werden
rubrik: wissen
datum: 28.09.2026 06:30
dachzeile: Einfach erklärt
titel: Warum sich die Blätter im Herbst bunt färben
teaser: Gelb, Orange, Rot: Im Herbst leuchten die Bäume. Dabei sind viele dieser Farben gar nicht neu. Sie waren den ganzen Sommer über schon da.
kurz: Im Herbst baut der Baum das grüne Chlorophyll ab und holt wertvolle Stoffe daraus zurück.
kurz: Dann werden gelbe und orange Farbstoffe sichtbar, die die ganze Zeit im Blatt steckten.
kurz: Das leuchtende Rot bilden manche Bäume dagegen erst im Herbst neu.
---
Im Sommer sind Blätter grün, weil sie sehr viel **Chlorophyll** enthalten. Mit diesem Farbstoff fangen Pflanzen Sonnenlicht ein und stellen daraus Zucker her. Das nennt man Fotosynthese.

## Der Baum räumt auf

Wenn die Tage kürzer und kühler werden, bereitet sich der Baum auf den Winter vor. Er baut das Chlorophyll ab und holt wertvolle Bausteine wie Stickstoff aus den Blättern zurück in Äste, Stamm und Wurzeln. Im Frühjahr braucht er sie für die neuen Blätter.

## Gelb war schon immer da

Sobald das Grün verschwindet, kommen die **Carotinoide** zum Vorschein. Diese gelben und orangefarbenen Farbstoffe stecken das ganze Jahr über im Blatt, im Sommer überdeckt sie aber das viele Grün. Carotinoide sind übrigens auch der Grund, warum Karotten orange sind.

## Rot ist neu

Das kräftige Rot mancher Ahornbäume entsteht dagegen erst im Herbst. Dafür sorgen die **Anthocyane**. Forschende vermuten, dass sie wie ein Sonnenschutz wirken, während der Baum die letzten Nährstoffe aus dem Blatt holt. Besonders leuchtend wird das Rot, wenn auf sonnige Tage kühle, aber frostfreie Nächte folgen.

## Und dann fällt das Blatt

Zum Schluss bildet der Baum am Blattstiel eine Trennschicht. Sie verschließt die Leitungen, und irgendwann reicht ein Windstoß: Das Blatt fällt.


=== ARTIKEL ===
id: fc-musterstadt-gewinnt-derby
rubrik: sport
datum: 27.09.2026 19:30
dachzeile: Kreisliga
titel: FC Musterstadt gewinnt das Derby mit 3:1
teaser: Vor vollen Rängen dreht der FC Musterstadt einen frühen Rückstand. Matchwinner ist ein 17-Jähriger aus der eigenen Jugend.
kurz: Der FC Musterstadt gewinnt das Derby gegen den SV Beispielhausen mit 3:1.
kurz: Nach dem frühen 0:1 drehen zwei Tore kurz nach der Pause das Spiel.
kurz: Mit 13 Punkten steht der FC nun auf Platz zwei der Tabelle.
beispiel: ja
---
Beim Anpfiff sah es nicht gut aus für den FC Musterstadt: Schon in der 6. Minute traf der SV Beispielhausen nach einer Ecke zum 0:1. Die rund 800 Fans am Sportplatz Lindenweg mussten lange warten, bis ihre Mannschaft ins Spiel fand.

## Die Wende nach der Pause

Direkt nach dem Seitenwechsel ging es dann schnell. In der 48. Minute glich Jonas Beispiel per Kopfball aus, nur vier Minuten später traf der erst 17 Jahre alte Emil Muster zum 2:1. Den Schlusspunkt setzte wieder Muster, der in der 81. Minute einen Konter eiskalt abschloss.

> „Die Jungs haben in der Pause gezeigt, dass sie dieses Derby unbedingt wollen.“
> – Trainerin Petra Probe

## Platz zwei in Reichweite

Mit dem Sieg klettert der FC auf den zweiten Tabellenplatz. Am kommenden Sonntag geht es auswärts zum Tabellenführer nach Musterdorf. Anstoß ist um 15 Uhr.


=== ARTIKEL ===
id: abseits-einfach-erklaert
rubrik: sport
datum: 27.09.2026 11:15
dachzeile: Einfach erklärt
titel: Abseits in drei Fragen erklärt
teaser: Kaum eine Fußballregel sorgt für so viel Streit. Dabei ist die Grundidee ganz einfach, wenn man die richtigen drei Fragen stellt.
kurz: Im Abseits stehen kann man nur in der gegnerischen Hälfte.
kurz: Entscheidend ist der Moment, in dem ein Mitspieler den Ball spielt.
kurz: Strafbar ist das Abseits erst, wenn der Spieler ins Spiel eingreift.
---
Die Abseitsregel soll verhindern, dass ein Stürmer die ganze Zeit neben dem gegnerischen Tor wartet. Ob ein Spieler im Abseits steht, lässt sich mit drei Fragen klären.

## Frage 1: Wo steht der Spieler?

Abseits ist nur in der gegnerischen Hälfte möglich. Wer in der eigenen Hälfte steht, kann nie im Abseits sein.

## Frage 2: Wo steht er, wenn der Ball gespielt wird?

Es zählt der Augenblick, in dem ein Mitspieler den Ball spielt oder berührt. Ist der Angreifer in diesem Moment näher an der gegnerischen Torlinie als der Ball und der vorletzte Gegenspieler, steht er im Abseits. Der letzte Gegenspieler ist meistens der Torwart. Auf gleicher Höhe ist kein Abseits. Mitgemessen werden Kopf, Körper und Füße, aber nicht die Arme.

## Frage 3: Greift er ins Spiel ein?

Eine Abseitsstellung allein ist noch nicht verboten. Gepfiffen wird erst, wenn der Spieler aktiv wird: wenn er den Ball spielt, einen Gegner behindert oder aus seiner Position einen Vorteil zieht.

## Die wichtigsten Ausnahmen

Bei Abstoß, Einwurf und Eckstoß gibt es kein Abseits. Wer den Ball direkt aus einer dieser Situationen bekommt, darf also überall stehen.


=== ARTIKEL ===
id: lange-nacht-der-bibliothek
rubrik: kultur
datum: 26.09.2026 16:00
dachzeile: Musterstadt
titel: Lange Nacht der Bibliothek: Lesen bis Mitternacht
teaser: Am 10. Oktober öffnet die Stadtbibliothek Musterstadt ausnahmsweise bis 24 Uhr. Auf dem Programm stehen Lesungen, ein Escape-Room und Führungen mit Taschenlampe.
kurz: Die Stadtbibliothek Musterstadt lädt am Samstag, 10. Oktober, zur Langen Nacht ein.
kurz: Von 18 bis 24 Uhr gibt es Lesungen, einen Escape-Room zwischen den Regalen und Führungen mit Taschenlampe.
kurz: Der Eintritt ist frei, für den Escape-Room braucht man eine Anmeldung.
beispiel: ja
---
Einmal im Jahr wird die Stadtbibliothek zur Bühne: Am **Samstag, 10. Oktober**, bleibt sie von 18 bis 24 Uhr geöffnet. Das Team hat ein Programm für alle Altersgruppen zusammengestellt.

## Das Programm

- **18 Uhr:** Vorlesestunde für Kinder, mit Kakao und Keksen
- **19.30 Uhr:** Lesung der Musterstädter Krimiautorin Clara Probe
- **21 Uhr:** Rätselabend im Escape-Room zwischen den Regalen
- **22.30 Uhr:** Führung mit Taschenlampe durch das Magazin im Keller

„Viele wissen gar nicht, was bei uns im Keller schlummert“, sagt Bibliotheksleiterin Hanna Beispiel. Dort lagern unter anderem alte Ausgaben der Musterstädter Zeitung, die bis ins Jahr 1890 zurückreichen.

## So kommst du rein

Der Eintritt ist frei. Für den Escape-Room gibt es nur zwölf Plätze pro Runde, deshalb ist eine Anmeldung an der Ausleihtheke nötig. Wer bis 23 Uhr bleibt, darf sich zum Abschluss ein Buch aus der Bücherkiste aussuchen und behalten.


=== ARTIKEL ===
id: zwei-faktor-authentifizierung
rubrik: technik
datum: 26.09.2026 10:15
dachzeile: Sicher im Netz
titel: Zwei-Faktor-Authentifizierung: Doppelt hält besser
teaser: Passwörter werden gestohlen, erraten oder landen in Datenlecks. Ein zweiter Faktor schützt dein Konto trotzdem. So funktioniert er.
kurz: Bei der Zwei-Faktor-Authentifizierung brauchst du beim Anmelden neben dem Passwort einen zweiten Nachweis.
kurz: Authenticator-Apps, Sicherheitsschlüssel und Passkeys sind sicherer als Codes per SMS.
kurz: Bewahre die Wiederherstellungscodes gut auf, sonst sperrst du dich im Notfall selbst aus.
---
Ein Passwort allein ist wie ein Haustürschlüssel: Wer ihn in die Finger bekommt, kommt rein. Die **Zwei-Faktor-Authentifizierung**, kurz 2FA, baut eine zweite Tür ein.

## Wissen und Haben

Beim Anmelden musst du zwei verschiedene Dinge vorweisen: etwas, das du **weißt**, nämlich dein Passwort, und etwas, das du **hast**, zum Beispiel dein Handy. Selbst wenn jemand dein Passwort kennt, fehlt ihm dann immer noch der zweite Faktor.

## Welche Methode ist die beste?

- **Authenticator-App:** Eine App auf dem Handy erzeugt alle 30 Sekunden einen neuen sechsstelligen Code. Sicher und kostenlos.
- **Sicherheitsschlüssel und Passkeys:** Hier bestätigst du die Anmeldung mit Fingerabdruck, Gesicht oder einem kleinen USB-Stick. Diese Methode gilt als besonders sicher, weil sie auch vor gefälschten Anmeldeseiten schützt.
- **SMS-Code:** Besser als gar kein zweiter Faktor, aber am leichtesten auszutricksen.

## So schaltest du 2FA ein

Die Funktion steckt meist in den Einstellungen deines Kontos unter „Sicherheit“ oder „Anmeldung“. Fang mit den wichtigsten Konten an: E-Mail, Apple-Account oder Google-Konto und soziale Netzwerke.

## Wichtig: die Notfall-Codes

Beim Einrichten bekommst du oft **Wiederherstellungscodes**. Schreib sie auf und bewahre sie an einem sicheren Ort auf. Wenn dein Handy verloren geht, kommst du damit trotzdem in dein Konto.


=== ARTIKEL ===
id: was-ist-das-feuilleton
rubrik: kultur
datum: 25.09.2026 15:00
dachzeile: Einfach erklärt
titel: Was ist eigentlich das Feuilleton?
teaser: In fast jeder großen Zeitung gibt es ein Ressort mit einem französischen Namen. Woher das Wort kommt und was dort drinsteht.
kurz: Das Feuilleton ist der Kulturteil einer Zeitung.
kurz: Der Name kommt vom französischen Wort für „Blättchen“.
kurz: Dort geht es um Bücher, Filme, Musik, Kunst und Debatten über die Gesellschaft.
---
Wer eine gedruckte Zeitung aufschlägt, findet meist einen Teil mit Buchkritiken, Theaterberichten und langen Essays. Dieser Teil heißt **Feuilleton**. Ausgesprochen wird das Wort ungefähr wie „Föj-tong“.

## Ein Wort aus Paris

„Feuilleton“ ist Französisch und bedeutet so viel wie „Blättchen“. Um 1800 begann die Pariser Zeitung „Journal des Débats“, Kritiken und Unterhaltsames vom Rest der Zeitung abzusetzen: Sie standen unten auf der Seite, durch einen Strich von den politischen Nachrichten getrennt. Deshalb nannte man das Feuilleton früher auch den Teil „unter dem Strich“.

## Was dort heute steht

Im Feuilleton geht es um Kultur im weiten Sinn: neue Bücher, Filme, Serien, Musik, Ausstellungen und Theaterstücke. Dazu kommen Texte über Sprache, Wissenschaft und die großen Fragen der Gesellschaft. Viele Debatten, über die später alle reden, beginnen im Feuilleton.

Bei tagesblick. heißt dieses Ressort schlicht Kultur.


=== ARTIKEL ===
id: jugendbeirat-musterstadt
rubrik: politik
datum: 25.09.2026 08:30
dachzeile: Gemeinderat
titel: Musterstadt bekommt einen Jugendbeirat
teaser: Junge Menschen sollen in Musterstadt künftig mitreden, wenn es um Skaterpark, Busverbindungen oder das Freibad geht. Der Gemeinderat hat einstimmig zugestimmt.
kurz: Der Gemeinderat hat am Donnerstagabend ohne Gegenstimme einen Jugendbeirat beschlossen.
kurz: Zwölf Jugendliche zwischen 14 und 21 Jahren werden für zwei Jahre gewählt.
kurz: Die erste Wahl ist für März 2027 geplant.
beispiel: ja
---
Wer in Musterstadt jung ist, soll künftig mehr zu sagen haben. Der Gemeinderat hat am Donnerstagabend ohne Gegenstimme beschlossen, einen **Jugendbeirat** einzurichten.

## Was der Beirat darf

Der Jugendbeirat hat zwölf Mitglieder zwischen 14 und 21 Jahren. Er darf in allen Ausschüssen Fragen stellen und eigene Anträge einbringen. Außerdem bekommt er jedes Jahr 5.000 Euro für eigene Projekte.

> „Wir entscheiden über Dinge, die junge Menschen jeden Tag betreffen. Dann sollen sie auch mitreden.“
> – Bürgermeisterin Erika Mustermann

## Wie gewählt wird

Wählen dürfen alle Musterstädterinnen und Musterstädter zwischen 14 und 21 Jahren. Die erste Wahl soll im März 2027 stattfinden, online und in den Schulen. Wer kandidieren möchte, kann sich ab Januar im Rathaus melden.

## Das erste Projekt

Als Erstes soll sich der Beirat um den geplanten Skaterpark am Bahnhof kümmern. Die Stadt hatte dafür schon Geld eingeplant, das Projekt aber verschoben. Nun sollen die Jugendlichen mitplanen.


=== ARTIKEL ===
id: wochenmarkt-neue-staende
rubrik: wirtschaft
datum: 24.09.2026 14:20
dachzeile: Musterstadt
titel: Wochenmarkt wächst: Fünf neue Stände ab Oktober
teaser: Kaffee aus der eigenen Rösterei, Käse von Höfen aus der Region und ein Stand für Reparaturen: Der Musterstädter Wochenmarkt bekommt Zuwachs.
kurz: Ab Mittwoch, 7. Oktober, hat der Wochenmarkt auf dem Marktplatz fünf neue Stände.
kurz: Neu sind unter anderem eine Kaffeerösterei, ein Käsestand und ein Reparatur-Stand.
kurz: Der Markt hat mittwochs und samstags von 7 bis 13 Uhr geöffnet.
beispiel: ja
---
Der Wochenmarkt in Musterstadt wird größer. Ab **Mittwoch, 7. Oktober**, bauen fünf neue Händlerinnen und Händler ihre Stände auf dem Marktplatz auf. Damit hat der Markt künftig 23 Stände.

## Das ist neu

- eine kleine Kaffeerösterei aus der Nachbarschaft
- ein Käsestand mit Sorten von Höfen aus der Region
- Brot aus dem Holzofen
- frische Nudeln und Soßen
- ein Reparatur-Stand für Fahrräder und kleine Elektrogeräte

## Warum der Markt wächst

„Die Leute wollen wissen, wo ihr Essen herkommt“, sagt Marktmeister Paul Beispiel. Seit zwei Jahren kämen jeden Samstag mehr Besucherinnen und Besucher. Davon profitieren auch die Läden rund um den Marktplatz: Viele Marktgäste trinken danach noch einen Kaffee oder kaufen in der Innenstadt ein.

## Öffnungszeiten

Der Markt hat mittwochs und samstags von 7 bis 13 Uhr geöffnet. Wer mit dem Fahrrad kommt, findet an der Nordseite des Platzes 40 neue Stellplätze.


=== ARTIKEL ===
id: so-entsteht-ein-gesetz
rubrik: politik
datum: 24.09.2026 12:00
dachzeile: Einfach erklärt
titel: Vom Entwurf ins Gesetzblatt: So entsteht ein Gesetz
teaser: Bevor in Deutschland ein Bundesgesetz gilt, geht es durch viele Hände und durch drei Lesungen. Der Weg in fünf Stationen.
kurz: Gesetzentwürfe kommen von der Bundesregierung, aus dem Bundestag oder vom Bundesrat.
kurz: Der Bundestag berät jeden Entwurf in drei Lesungen und stimmt dann ab.
kurz: Danach ist der Bundesrat an der Reihe, zum Schluss unterschreibt der Bundespräsident.
---
Gesetze regeln unser Zusammenleben, vom Mindestlohn bis zum Jugendschutz. Doch wie entsteht eigentlich ein Bundesgesetz? Der Weg führt über fünf Stationen.

## 1. Die Idee

Einen Gesetzentwurf einbringen dürfen drei Stellen: die **Bundesregierung**, der **Bundesrat** und Abgeordnete aus der Mitte des **Bundestags**. Die meisten Entwürfe kommen von der Bundesregierung.

## 2. Beratung im Bundestag

Im Bundestag wird der Entwurf in drei **Lesungen** beraten. Nach der ersten Lesung geht er in die Fachausschüsse. Dort prüfen Abgeordnete die Einzelheiten, hören Fachleute an und schlagen Änderungen vor.

## 3. Die Abstimmung

In der zweiten und dritten Lesung debattiert der Bundestag über die überarbeitete Fassung. Am Ende der dritten Lesung steht die Schlussabstimmung. Für die meisten Gesetze reicht die einfache Mehrheit.

## 4. Der Bundesrat

Danach ist die Länderkammer dran. Bei **Zustimmungsgesetzen** muss der Bundesrat ausdrücklich Ja sagen. Bei **Einspruchsgesetzen** kann er Einspruch einlegen, den der Bundestag aber überstimmen kann. Gibt es Streit, sucht der **Vermittlungsausschuss** einen Kompromiss.

## 5. Unterschrift und Verkündung

Zum Schluss unterschreiben die zuständigen Mitglieder der Bundesregierung, dann prüft und unterzeichnet der Bundespräsident das Gesetz. Sobald es im **Bundesgesetzblatt** verkündet ist, kann es in Kraft treten.


=== ARTIKEL ===
id: html-css-javascript
rubrik: technik
datum: 23.09.2026 15:00
dachzeile: Einfach erklärt
titel: HTML, CSS und JavaScript: Die drei Bausteine jeder Webseite
teaser: Ob Nachrichtenseite, Onlineshop oder Blog: Fast jede Webseite besteht aus denselben drei Zutaten. Auch tagesblick. ist so gebaut.
kurz: HTML legt fest, was auf einer Seite steht: Überschriften, Texte, Bilder und Links.
kurz: CSS bestimmt, wie es aussieht: Farben, Schriften und Abstände.
kurz: JavaScript macht die Seite lebendig, zum Beispiel die Suche oder das dunkle Design.
---
Eine Webseite ist im Grunde ein Textdokument, das der Browser liest und darstellt. Damit daraus eine richtige Seite wird, arbeiten drei Sprachen zusammen. Man kann sie sich wie ein Haus vorstellen.

## HTML: die Mauern

**HTML** steht für *Hypertext Markup Language*. Damit wird der Inhalt gegliedert: Das hier ist eine Überschrift, das ein Absatz, dort ein Bild. HTML ist das Mauerwerk des Hauses.

## CSS: die Einrichtung

**CSS** heißt *Cascading Style Sheets*. Es legt fest, wie die Inhalte aussehen: welche Schrift, welche Farbe, wie viel Abstand. Mit CSS wird aus dem Rohbau ein Zuhause. Bei tagesblick. sorgt CSS zum Beispiel dafür, dass sich die Seite an jede Bildschirmgröße anpasst.

## JavaScript: die Technik im Haus

**JavaScript** ist eine Programmiersprache. Damit reagiert eine Seite auf das, was du tust. Bei tagesblick. baut JavaScript aus den Artikeln die Startseite zusammen, sortiert alles nach Datum und sorgt dafür, dass die Suche funktioniert.

## Selbst ausprobieren

Das Schöne an diesen drei Sprachen: Man braucht dafür kein teures Programm. Ein Texteditor wie Textastic auf dem iPad und ein Browser reichen, um loszulegen.


=== ARTIKEL ===
id: was-ist-inflation
rubrik: wirtschaft
datum: 23.09.2026 09:00
dachzeile: Einfach erklärt
titel: Was ist eigentlich Inflation?
teaser: Wenn es heißt, die Inflation steigt, wird das Leben teurer. Aber was genau wird da gemessen? Und warum ist ein bisschen Inflation sogar gewollt?
kurz: Inflation bedeutet: Die Preise steigen allgemein, und für dasselbe Geld bekommt man weniger.
kurz: In Deutschland misst das Statistische Bundesamt die Inflation mit einem Warenkorb.
kurz: Die Europäische Zentralbank strebt eine Inflationsrate von zwei Prozent an.
---
Stell dir vor, eine Kugel Eis kostet heute 1,50 Euro und in einem Jahr 1,65 Euro. Dein Taschengeld bleibt aber gleich. Dann kannst du dir mit demselben Geld weniger kaufen. Genau das passiert bei **Inflation**: Die Preise steigen allgemein, und das Geld verliert an Wert.

## Wie misst man das?

In Deutschland erfasst das **Statistische Bundesamt** jeden Monat die Preise von Hunderten Waren und Dienstleistungen, von Brot und Butter über Miete und Strom bis zum Friseurbesuch. Zusammen bilden sie einen gedachten **Warenkorb**. Wie stark sich dessen Preis im Vergleich zum Vorjahresmonat verändert hat, ist die Inflationsrate.

## Warum steigen Preise?

Dafür gibt es viele Gründe. Manchmal wollen mehr Menschen etwas kaufen, als es gibt. Manchmal wird die Herstellung teurer, etwa weil Energie oder Rohstoffe mehr kosten. Auch die Erwartung, dass bald alles teurer wird, kann die Preise antreiben.

## Ist Inflation immer schlecht?

Nicht unbedingt. Die **Europäische Zentralbank** strebt mittelfristig eine Inflationsrate von zwei Prozent an. Leicht steigende Preise gelten als Zeichen einer gesunden Wirtschaft. Schwierig wird es, wenn die Preise sehr schnell steigen oder wenn sie dauerhaft fallen. Das nennt man **Deflation**.

Steigt die Inflation zu stark, erhöht die Zentralbank meist die Leitzinsen. Kredite werden dann teurer, es wird weniger gekauft, und die Preise steigen langsamer.


=== ARTIKEL ===
id: warum-ist-der-himmel-blau
rubrik: wissen
datum: 22.09.2026 17:45
dachzeile: Einfach erklärt
titel: Warum ist der Himmel blau?
teaser: Sonnenlicht ist eigentlich weiß. Trotzdem sehen wir tagsüber einen blauen Himmel und abends ein rotes Leuchten. Der Grund sind winzige Teilchen in der Luft.
kurz: Sonnenlicht besteht aus allen Farben des Regenbogens.
kurz: Die Luft streut blaues Licht viel stärker als rotes, deshalb kommt Blau aus allen Richtungen.
kurz: Abends ist der Weg durch die Luft länger. Dann kommt vor allem rotes und oranges Licht bei uns an.
---
Das Licht der Sonne sieht weiß aus, steckt aber voller Farben. Das siehst du bei einem Regenbogen: Dort wird das Licht in Rot, Orange, Gelb, Grün, Blau und Violett aufgefächert.

## Blau wird am stärksten gestreut

Auf dem Weg zu uns trifft das Sonnenlicht auf unzählige winzige Stickstoff- und Sauerstoffteilchen in der Luft. Sie lenken das Licht in alle Richtungen ab. Physiker nennen das **Streuung**. Blaues Licht hat eine kürzere Wellenlänge als rotes und wird deshalb um ein Vielfaches stärker gestreut. Egal wohin du am Himmel schaust: Von überall kommt gestreutes blaues Licht in dein Auge.

## Und warum nicht violett?

Violettes Licht wird sogar noch stärker gestreut. Trotzdem sieht der Himmel nicht lila aus. Die Sonne sendet weniger violettes Licht aus, ein Teil davon wird schon hoch in der Atmosphäre verschluckt, und unsere Augen sind für Blau viel empfindlicher.

## Rot am Abend

Steht die Sonne tief, muss ihr Licht einen viel längeren Weg durch die Luft zurücklegen. Unterwegs wird das Blau fast vollständig herausgestreut. Bei uns kommt vor allem rotes und oranges Licht an. Deshalb leuchten Sonnenauf- und Sonnenuntergänge so schön.
`
