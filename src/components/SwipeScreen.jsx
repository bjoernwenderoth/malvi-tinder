import { useCallback, useEffect, useRef, useState } from 'react'
import Card from './Card.jsx'
import { Thumb } from './bits.jsx'
import { imageFor } from '../data/images.js'

const SWIPE_THRESHOLD = 110

export default function SwipeScreen({ ideas, liked, total, done, canUndo, onDecide, onUndo, onHome }) {
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false })
  const [leaving, setLeaving] = useState(null) // 'left' | 'right'
  const [toast, setToast] = useState(null)
  const start = useRef(null)
  const top = ideas[0]

  const fly = useCallback(
    (dir) => {
      if (!top || leaving) return
      setLeaving(dir)
      const liked = dir === 'right'
      if (liked && top.dogFriendliness >= 5) setToast('Malvi wedelt mit dem Schwanz 🐶💛')
      else if (liked && top.dogFriendliness <= 2) setToast('Malvi guckt skeptisch … 🥺')
      setTimeout(() => {
        onDecide(top.id, liked)
        setLeaving(null)
        setDrag({ x: 0, y: 0, active: false })
      }, 320)
    },
    [top, leaving, onDecide],
  )

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 1600)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') fly('right')
      if (e.key === 'ArrowLeft') fly('left')
      if (e.key === 'Backspace' && canUndo) onUndo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fly, canUndo, onUndo])

  function onPointerDown(e) {
    if (leaving || e.target.closest('button, a')) return
    start.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ x: 0, y: 0, active: true })
  }

  function onPointerMove(e) {
    if (!start.current) return
    setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y, active: true })
  }

  function onPointerUp() {
    if (!start.current) return
    start.current = null
    if (drag.x > SWIPE_THRESHOLD) fly('right')
    else if (drag.x < -SWIPE_THRESHOLD) fly('left')
    else setDrag({ x: 0, y: 0, active: false })
  }

  let topStyle
  if (leaving) {
    const dx = leaving === 'right' ? window.innerWidth : -window.innerWidth
    topStyle = { transform: `translate(${dx}px, ${drag.y}px) rotate(${leaving === 'right' ? 30 : -30}deg)`, transition: 'transform .32s ease-in' }
  } else {
    topStyle = {
      transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 18}deg)`,
      transition: drag.active ? 'none' : 'transform .25s ease',
    }
  }
  const intent = leaving ? (leaving === 'right' ? 1 : -1) : Math.max(-1, Math.min(1, drag.x / SWIPE_THRESHOLD))

  return (
    <div className="swipe">
      <aside className="sidebar">
        <button className="sidebar__head" onClick={onHome} title="Zum Start">
          <img src="images/malvi.jpg" alt="Malvi" />
          <div>
            <strong>Malvis Matches</strong>
            <small>Mona &amp; Björn · 8.–11.10.</small>
          </div>
        </button>

        <div className="progress">
          <div className="progress__bar" style={{ width: `${(done / total) * 100}%` }} />
        </div>
        <p className="sidebar__count">
          Karte {Math.min(done + 1, total)} von {total} · {liked.length} ♥
        </p>

        <div className="sidebar__grid">
          {liked.map((idea) => (
            <Thumb key={idea.id} idea={idea} img={imageFor(idea.id)} />
          ))}
          {liked.length === 0 && <p className="sidebar__empty">Noch keine Matches – swipe nach rechts! 💛</p>}
        </div>

        <p className="sidebar__keys">
          <kbd>←</kbd> Nope &nbsp; <kbd>→</kbd> Like &nbsp; <kbd>⌫</kbd> Zurück
        </p>
      </aside>

      <section className="stage">
        <main className="deck">
          {ideas
            .slice(0, 3)
            .reverse()
            .map((idea, i, arr) => {
              const depth = arr.length - 1 - i // 0 = oberste Karte
              const isTop = depth === 0
              return (
                <div
                  key={idea.id}
                  className={`deck__slot ${isTop ? 'deck__slot--top' : ''}`}
                  style={isTop ? topStyle : { transform: `scale(${1 - depth * 0.04}) translateY(${depth * 14}px)` }}
                  onPointerDown={isTop ? onPointerDown : undefined}
                  onPointerMove={isTop ? onPointerMove : undefined}
                  onPointerUp={isTop ? onPointerUp : undefined}
                  onPointerCancel={isTop ? onPointerUp : undefined}
                >
                  <Card idea={idea} intent={isTop ? intent : 0} />
                </div>
              )
            })}
          {ideas.length === 0 && <div className="deck__empty">Fertig! Malvi rechnet … 🐾</div>}
          {toast && <div className="toast">{toast}</div>}
        </main>

        <footer className="actions">
          <button className="round round--nope" onClick={() => fly('left')} aria-label="Mag ich nicht">
            ✕
          </button>
          <button className="round round--undo" onClick={onUndo} disabled={!canUndo} aria-label="Rückgängig" title="Rückgängig (⌫)">
            ↺
          </button>
          <button className="round round--like" onClick={() => fly('right')} aria-label="Mag ich">
            ♥
          </button>
        </footer>
      </section>
    </div>
  )
}
