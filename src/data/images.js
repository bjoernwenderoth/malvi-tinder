import credits from './credits.json'

// Jedes Kartenbild liegt in zwei einheitlichen, um das Motiv zugeschnittenen Formaten vor
// (Quelle: Wikimedia Commons):
//   public/images/<id>.jpg       quer 4:3  (1600×1200)
//   public/images/<id>-hoch.jpg  hoch 2:3  (1000×1500)
// Eigenes Foto? Beide Dateien mit gleichem Namen ersetzen.
export function imageFor(id) {
  const info = credits[String(id)] ?? { credit: '' }
  return { ...info, src: `images/${id}.jpg`, portrait: `images/${id}-hoch.jpg` }
}
