import { useEffect, useState } from 'react'
import data from './data/ideas.json'
import StartScreen from './components/StartScreen.jsx'
import SwipeScreen from './components/SwipeScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import MatchOverlay from './components/MatchOverlay.jsx'

const STORAGE_KEY = 'malvi-swipe-v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function App() {
  // Immer mit dem Startscreen beginnen – der Button führt dann zum gespeicherten Stand.
  const [screen, setScreen] = useState('start')
  // Liste von { id, liked } in Swipe-Reihenfolge
  const [decisions, setDecisions] = useState(() => loadState()?.decisions ?? [])
  // "It's a Match!"-Überraschung direkt nach der letzten Karte
  const [showMatch, setShowMatch] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ decisions }))
    } catch {
      /* egal – läuft auch ohne Speicher */
    }
  }, [decisions])

  const ideas = data.ideas
  const remaining = ideas.filter((i) => !decisions.some((d) => d.id === i.id))
  const liked = decisions.filter((d) => d.liked).map((d) => ideas.find((i) => i.id === d.id))

  function decide(id, liked) {
    const next = [...decisions, { id, liked }]
    setDecisions(next)
    if (next.length === ideas.length) {
      setTimeout(() => {
        setShowMatch(true)
        setScreen('result')
      }, 450)
    }
  }

  function undo() {
    setDecisions((d) => d.slice(0, -1))
  }

  function restart() {
    setDecisions([])
    setScreen('start')
  }

  if (screen === 'start') {
    return (
      <StartScreen
        count={ideas.length}
        resumeCount={decisions.length}
        onStart={() => setScreen(decisions.length === ideas.length ? 'result' : 'swipe')}
        onReset={() => setDecisions([])}
      />
    )
  }

  if (screen === 'result') {
    return (
      <>
        <ResultScreen ideas={ideas} decisions={decisions} onRestart={restart} onBack={() => { undo(); setScreen('swipe') }} />
        {showMatch && <MatchOverlay onClose={() => setShowMatch(false)} />}
      </>
    )
  }

  return (
    <SwipeScreen
      ideas={remaining}
      liked={liked}
      total={ideas.length}
      done={decisions.length}
      canUndo={decisions.length > 0}
      onDecide={decide}
      onUndo={undo}
      onHome={() => setScreen('start')}
    />
  )
}
