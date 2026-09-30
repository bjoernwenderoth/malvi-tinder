import { useEffect } from 'react'
import { PriceChip, SpotImage } from './bits.jsx'
import { DogDetails, InfoDetails } from './IdeaDetails.jsx'

// Großes Detailfenster für eine Karte in der Bilanz
export default function DetailModal({ idea, liked, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__box" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={idea.title}>
        <button className="popup__close modal__close" onClick={onClose} aria-label="Schließen (Esc)" title="Schließen (Esc)">
          ✕
        </button>
        <div className="modal__hero">
          <SpotImage id={idea.id} alt={idea.title} portraitOn="desktop" />
          <div className="card__gradient" />
          <div className="card__body">
            <div className="card__chips">
              <span className="chip">{liked ? '💛 Match' : '✕ Nicht dabei'}</span>
              <span className="chip">{idea.category}</span>
              <PriceChip idea={idea} />
            </div>
            <h2 className="card__title">{idea.title}</h2>
            <p className="card__area">
              📍 {idea.area} · 🚗 {idea.driveMinutesFromTivoli} Min
            </p>
            <p className="card__pitch">{idea.quickPitch}</p>
          </div>
        </div>

        <div className="modal__info popup popup--static">
          <DogDetails idea={idea} />
          <hr />
          <h3>ⓘ Infos</h3>
          <InfoDetails idea={idea} showTitle={false} />
        </div>
      </div>
    </div>
  )
}
