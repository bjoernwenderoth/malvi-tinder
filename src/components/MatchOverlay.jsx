export const LOVE_NOTE = 'Ich freue mich auf die Tage mit dir.'

const HEARTS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i * 0.45) % 4}s`,
  duration: `${5 + (i % 4)}s`,
  size: `${18 + ((i * 7) % 22)}px`,
}))

// Tinder-artiges "It's a Match!"-Vollbild nach der letzten Karte
export default function MatchOverlay({ onClose }) {
  return (
    <div className="match-overlay" role="dialog" aria-label="It’s a Match!">
      <div className="match-overlay__hearts" aria-hidden="true">
        {HEARTS.map((h, i) => (
          <span
            key={i}
            style={{ left: h.left, animationDelay: h.delay, animationDuration: h.duration, fontSize: h.size }}
          >
            {i % 3 ? '💛' : '🐾'}
          </span>
        ))}
      </div>

      <div className="match-overlay__content">
        <p className="match-overlay__kicker">It’s a Match!</p>
        <img className="match-overlay__malvi" src="images/malvi.jpg" alt="Malvi" />
        <p className="match-overlay__note">{LOVE_NOTE}</p>
        <button className="btn btn--primary" onClick={onClose} autoFocus>
          Zur Bilanz 💛
        </button>
      </div>
    </div>
  )
}
