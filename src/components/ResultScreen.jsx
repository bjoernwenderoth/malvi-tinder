import { useState } from 'react'
import { imageFor } from '../data/images.js'
import { DogBadge, PriceChip, formatEuro, formatHours, priceIsApprox, priceTotal } from './bits.jsx'
import DetailModal from './DetailModal.jsx'
import { LOVE_NOTE } from './MatchOverlay.jsx'

function midHours(range) {
  const nums = String(range).match(/[\d.]+/g)?.map(Number) ?? [0]
  return (nums[0] + nums[nums.length - 1]) / 2
}

function verdict(likes, total) {
  const ratio = likes / total
  if (ratio >= 0.75) return 'Ihr wollt einfach ALLES sehen. Malvi packt schon mal den Rucksack. 🎒'
  if (ratio >= 0.5) return 'Ein richtig gutes Programm – Malvi ist begeistert! 🐶'
  if (ratio >= 0.25) return 'Wählerisch, aber mit Stil. Qualität vor Quantität. ✨'
  if (likes > 0) return 'Ihr wisst genau, was ihr wollt. Der Rest ist Sofa-Zeit. 🛋️'
  return 'Null Matches?! Dann wird’s eben ein Wellness-Wochenende. 🧖'
}

export default function ResultScreen({ ideas, decisions, onRestart, onBack }) {
  const [copied, setCopied] = useState(false)
  const [selected, setSelected] = useState(null) // { idea, liked }
  const byId = Object.fromEntries(ideas.map((i) => [i.id, i]))
  // Likes: hundefreundlichste zuerst
  const likes = decisions
    .filter((d) => d.liked)
    .map((d) => byId[d.id])
    .sort((a, b) => b.dogFriendliness - a.dogFriendliness)
  const nopes = decisions.filter((d) => !d.liked).map((d) => byId[d.id])

  const malviScore = likes.length
    ? Math.round((likes.reduce((s, i) => s + i.dogFriendliness, 0) / likes.length / 5) * 100)
    : 0
  const hours = Math.round(likes.reduce((s, i) => s + midHours(i.durationHours), 0))
  const rainProof = likes.filter((i) => i.weatherFlexibility >= 4)
  const tricky = likes.filter((i) => i.dogFriendliness <= 2)
  const cost = Math.round(likes.reduce((s, i) => s + priceTotal(i), 0))
  const costApprox = likes.some(priceIsApprox)
  const freeCount = likes.filter((i) => priceTotal(i) === 0).length

  async function copy() {
    const text = [
      'Malvi entdeckt den Königssee – unsere Matches 💛',
      '',
      ...likes.map((i) => `♥ ${i.title} (${i.area}) – ${priceTotal(i) === 0 ? 'kostenlos' : formatEuro(priceTotal(i))}`),
      '',
      `Malvi-Score: ${malviScore} % · ca. ${hours} h Programm · ${costApprox ? 'ca. ' : ''}${cost} € für uns zwei + Malvi`,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  }

  return (
    <div className="result">
      <aside className="result__summary">
        <p className="result__kicker">It’s a Match!</p>
        <img className="result__malvi" src="images/malvi.jpg" alt="Malvi" />
        <h1>Malvis Bilanz</h1>
        <p className="result__verdict">{verdict(likes.length, ideas.length)}</p>

        <div className="stats">
          <div className="stat"><b>{likes.length}</b><span>Likes</span></div>
          <div className="stat"><b>{nopes.length}</b><span>Nopes</span></div>
          <div className="stat"><b>{malviScore}%</b><span>Malvi-Score</span></div>
          <div className="stat"><b>~{hours} h</b><span>Programm</span></div>
          <div className="stat stat--wide">
            <b>{costApprox ? 'ca. ' : ''}{cost} €</b>
            <span>Kosten für euch zwei + Malvi (Tickets, Parken, Maut)</span>
          </div>
        </div>

        <p className="result__note">„{LOVE_NOTE}“ 😊</p>

        {likes.length > 0 && (
          <ul className="result__notes">
            <li>☔ {rainProof.length} eurer Likes funktionieren auch bei Regen.</li>
            {freeCount > 0 && <li>🎉 {freeCount} davon kosten gar nichts.</li>}
            {hours > 30 && <li>⏰ Das sind mehr Stunden, als 4 Tage hergeben – ihr müsst priorisieren!</li>}
            {tricky.length > 0 && (
              <li>⚠️ Mit Maulkorb-/Hunde-Thema: {tricky.map((i) => i.title).join(', ')}</li>
            )}
          </ul>
        )}

        <div className="result__buttons">
          <button className="btn btn--primary" onClick={copy}>
            {copied ? 'Kopiert ✓' : 'Ergebnis kopieren'}
          </button>
          <button className="btn btn--ghost" onClick={onBack}>Letzte Karte nochmal</button>
          <button className="btn btn--ghost" onClick={onRestart}>Nochmal swipen</button>
        </div>
      </aside>

      <main className="result__main">
        <h2>💛 Eure Matches</h2>
        {likes.length > 0 && <p className="result__tip">Tipp: Karte anklicken für alle Infos 👆</p>}
        {likes.length === 0 && <p className="muted">Keine Likes … Malvi ist ein bisschen traurig.</p>}
        <div className="match-grid">
          {likes.map((i) => (
            <button key={i.id} className="match" onClick={() => setSelected({ idea: i, liked: true })}>
              <img src={imageFor(i.id).src} alt="" />
              <div className="match__body">
                <strong>{i.title}</strong>
                <small>📍 {i.area} · ⏱ {formatHours(i.durationHours)}</small>
                <div className="match__chips">
                  <DogBadge value={i.dogFriendliness} />
                  <PriceChip idea={i} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {nopes.length > 0 && (
          <>
            <h2 className="result__nope-title">✕ Nicht dabei</h2>
            <div className="nope-list">
              {nopes.map((i) => (
                <button key={i.id} className="nope" onClick={() => setSelected({ idea: i, liked: false })}>
                  {i.title}
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      {selected && <DetailModal idea={selected.idea} liked={selected.liked} onClose={() => setSelected(null)} />}
    </div>
  )
}
