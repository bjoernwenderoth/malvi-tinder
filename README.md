# Malvi entdeckt den Königssee 🐾

Kleine Tinder-artige Swipe-App für den Ausflug nach Bad Reichenhall (8.–11.10.2026).
Läuft komplett lokal – auf dem Mac im Querformat und auf dem Handy im Hochformat.

## Starten

```bash
npm install      # nur beim ersten Mal
npm run dev      # dann http://localhost:5173 im Browser öffnen
```

Tipp: Browser im Vollbild (⌃⌘F) sieht am besten aus.

### Auf dem Handy

Mac und Handy müssen im selben WLAN sein.

```bash
npm run dev:handy
```

Im Terminal erscheint eine Zeile `Network: http://192.168.x.x:5173` – diese Adresse
auf dem Handy im Browser öffnen. Wischen geht dort per Finger.

### Online (GitHub Pages)

https://bjoernwenderoth.github.io/malvi-tinder/

Jeder Push auf `main` baut die Seite automatisch neu und veröffentlicht sie
(`.github/workflows/deploy.yml`, dauert ca. 1–2 Minuten).

## Bedienung

| Aktion        | Maus / Trackpad        | Tastatur |
|---------------|------------------------|----------|
| Mag ich       | Karte nach rechts / ♥  | →        |
| Mag ich nicht | Karte nach links / ✕   | ←        |
| Rückgängig    | ↺                      | ⌫        |
| Hunde-Info    | 🐾 auf der Karte        |          |
| Mehr Infos    | i auf der Karte        |          |

Der Fortschritt wird im Browser gespeichert – ein Neuladen setzt nichts zurück.
Zurücksetzen: auf dem Startscreen „Von vorne anfangen“.

## Anpassen

- **Startbild:** `public/images/start-hero.jpg` (Querformat, Mac) und
  `public/images/start-hero-mobile.jpg` (Hochformat, Handy) – der Titel ist jeweils im Bild enthalten.
- **Kartenbilder:** je Karte zwei Dateien (id = id aus der JSON), beide ums Motiv zugeschnitten:
  `public/images/<id>.jpg` (quer 4:3, 1600×1200) und `public/images/<id>-hoch.jpg` (hoch 2:3, 1000×1500).
  Eigenes Foto? Beide Dateien in diesen Formaten ersetzen.
- **Inhalte:** `src/data/ideas.json`
- **Fotonachweise:** `src/data/credits.json` (Wikimedia Commons, CC-Lizenzen) – werden im i-Fenster angezeigt.
