import { imageFor } from '../data/images.js'
import { Dots, DogBadge, PriceTable, formatHours } from './bits.jsx'

// Inhalte der Hinweisfenster – genutzt auf der Karte (🐾 / i) und im Detailfenster der Bilanz.

export function DogDetails({ idea, heading = '🐾 Was sagt Malvi?' }) {
  const dogWarning = idea.dogFriendliness <= 2
  return (
    <>
      <h3>{heading}</h3>
      <DogBadge value={idea.dogFriendliness} />
      <p className="popup__rating">
        Hundefreundlich: <Dots value={idea.dogFriendliness} max={5} />
      </p>
      <p className="popup__lead">{idea.dog}</p>
      <p>{idea.dogNotes}</p>
      {dogWarning && (
        <p className="popup__warn">
          {idea.dogNotes.includes('Maulkorb')
            ? '⚠️ Heikel, weil Malvi keinen Maulkorb gewohnt ist.'
            : '⚠️ Heikel für Malvi – vorher klären oder Betreuung einplanen.'}
        </p>
      )}
    </>
  )
}

export function InfoDetails({ idea, showTitle = true }) {
  const img = imageFor(idea.id)
  return (
    <>
      {showTitle && <h3>{idea.title}</h3>}
      <p className="popup__vibe">✨ {idea.vibe}</p>
      <div className="facts">
        <span>⏱ {formatHours(idea.durationHours)}</span>
        <span>🥾 Anstrengung <Dots value={idea.effort} max={5} /></span>
      </div>
      <h4>💶 Kosten</h4>
      <PriceTable idea={idea} />
      <p>🌤 <b>Ideal:</b> {idea.bestWeather}</p>
      <p>🌧 <b>Lieber nicht:</b> {idea.avoidWeather}</p>
      <p>💡 {idea.specialNote}</p>
      <p>🔗 <b>Passt gut zu:</b> {idea.combineWith.join(', ')}</p>
      {img.credit && <p className="popup__credit">Foto: {img.credit}</p>}
    </>
  )
}
