import { imageFor } from '../data/images.js'

// Lädt je nach Bildschirm das passende Bildformat (quer 4:3 / hoch 2:3).
// portraitOn="phone": Hochformat auf dem Handy (Swipe-Karte),
// portraitOn="desktop": Hochformat auf dem Mac (linke Hälfte im Detailfenster).
export function SpotImage({ id, alt = '', className, portraitOn = 'phone' }) {
  const img = imageFor(id)
  const media = portraitOn === 'phone' ? '(max-width: 760px)' : '(min-width: 761px)'
  return (
    <picture>
      <source media={media} srcSet={img.portrait} />
      <img className={className} src={img.src} alt={alt} draggable="false" />
    </picture>
  )
}

export function Dots({ value, max }) {
  return (
    <span className="dots" aria-label={`${value} von ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <i key={i} className={i < value ? 'on' : ''} />
      ))}
    </span>
  )
}

const DOG_LABELS = {
  1: 'Ohne Malvi',
  2: 'Schwierig für Malvi',
  3: 'Teilweise mit Malvi',
  4: 'Malvi-tauglich',
  5: 'Malvi-Paradies',
}

export function DogBadge({ value }) {
  return (
    <span className={`chip chip--dog chip--dog-${value}`}>
      🐾 {DOG_LABELS[value]}
    </span>
  )
}

export function Thumb({ idea, img }) {
  return (
    <div className="thumb" title={idea.title}>
      <img src={img.src} alt="" />
      <span>{idea.title}</span>
    </div>
  )
}

export function costLabel(level) {
  return ['', '€', '€€', '€€€'][level]
}

// "3–4 gesamt" → "3–4 h gesamt", "2–3" → "2–3 h"
export function formatHours(value) {
  const s = String(value)
  return s.includes('gesamt') ? s.replace(' gesamt', ' h gesamt') : `${s} h`
}

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

export function formatEuro(value) {
  return Number.isInteger(value) ? `${value} €` : euro.format(value)
}

// Summe für 2 Personen + Malvi (inkl. Parken/Maut)
export function priceTotal(idea) {
  return idea.prices.items.reduce((sum, item) => sum + item.each * item.qty, 0)
}

export function priceIsApprox(idea) {
  return idea.prices.items.some((item) => item.approx)
}

export function PriceChip({ idea }) {
  const total = priceTotal(idea)
  return (
    <span className="chip chip--price">
      {costLabel(idea.costLevel)} · {total === 0 ? 'kostenlos' : `${priceIsApprox(idea) ? 'ca. ' : ''}${formatEuro(total)}`}
    </span>
  )
}

export function PriceTable({ idea }) {
  const { items, note } = idea.prices
  const total = priceTotal(idea)
  return (
    <div className="price-table">
      {items.map((item) => (
        <div key={item.label} className="price-table__row">
          <span>
            {item.qty > 1 && `${item.qty} × `}
            {item.label}
          </span>
          <span>
            {item.approx && 'ca. '}
            {formatEuro(item.each * item.qty)}
          </span>
        </div>
      ))}
      <div className="price-table__row price-table__total">
        <span>Für euch zwei + Malvi</span>
        <span>{total === 0 ? 'kostenlos 🎉' : `${priceIsApprox(idea) ? 'ca. ' : ''}${formatEuro(total)}`}</span>
      </div>
      {note && <p className="price-table__note">{note}</p>}
    </div>
  )
}
