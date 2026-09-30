import { useState } from 'react'
import { PriceChip, SpotImage } from './bits.jsx'
import { DogDetails, InfoDetails } from './IdeaDetails.jsx'

// Die Karte zeigt nur das Wichtigste. Hunde-Einschätzung (🐾) und
// weitere Infos (i) öffnen sich als Hinweisfenster.
export default function Card({ idea, intent }) {
  const [popup, setPopup] = useState(null) // 'dog' | 'info' | null
  const dogWarning = idea.dogFriendliness <= 2

  function toggle(which) {
    setPopup((p) => (p === which ? null : which))
  }

  return (
    <article className="card">
      <SpotImage id={idea.id} className="card__img" alt={idea.title} portraitOn="phone" />
      <div className="card__gradient" />

      <div className="stamp stamp--like" style={{ opacity: Math.max(0, intent) }}>LIKE</div>
      <div className="stamp stamp--nope" style={{ opacity: Math.max(0, -intent) }}>NOPE</div>

      <div className="card__icons">
        <button
          className={`icon-circle ${dogWarning ? 'icon-circle--warn' : ''}`}
          onClick={() => toggle('dog')}
          aria-label="Hunde-Einschätzung"
          title="Was sagt Malvi dazu?"
        >
          🐾
        </button>
        <button className="icon-circle icon-circle--info" onClick={() => toggle('info')} aria-label="Mehr Infos" title="Mehr Infos">
          i
        </button>
      </div>

      <div className="card__body">
        <div className="card__chips">
          <span className="chip">{idea.category}</span>
          <PriceChip idea={idea} />
        </div>
        <h2 className="card__title">{idea.title}</h2>
        <p className="card__area">
          📍 {idea.area} · 🚗 {idea.driveMinutesFromTivoli} Min
        </p>
        <p className="card__pitch">{idea.quickPitch}</p>
      </div>

      {popup && (
        <div className="popup" onPointerDown={(e) => e.stopPropagation()}>
          <button className="popup__close" onClick={() => setPopup(null)} aria-label="Schließen">
            ✕
          </button>

          {popup === 'dog' && <DogDetails idea={idea} />}
          {popup === 'info' && <InfoDetails idea={idea} />}
        </div>
      )}
    </article>
  )
}
