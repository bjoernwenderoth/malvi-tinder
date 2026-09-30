// Die Startbilder (start-hero.jpg quer, start-hero-mobile.jpg hochkant) enthalten
// Titel und Untertitel bereits – hier liegen nur noch Button und Infos darüber.
export default function StartScreen({ count, resumeCount, onStart, onReset }) {
  const resuming = resumeCount > 0
  const finished = resumeCount >= count

  return (
    <div className="start">
      <picture>
        <source media="(orientation: portrait)" srcSet="images/start-hero-mobile.jpg" />
        <img className="start__bg" src="images/start-hero.jpg" alt="" />
      </picture>
      <h1 className="visually-hidden">Malvi entdeckt den Königssee – mit Mona &amp; Björn</h1>

      <div className="start__panel">
        <p className="start__meta">
          8.–11. Oktober 2026 · Bad Reichenhall
          <br />
          <b>{count} Vorschläge</b> warten auf euch
        </p>

        <button className="btn btn--primary" onClick={onStart}>
          {finished ? 'Zur Bilanz 💛' : resuming ? `Weiter swipen (${resumeCount}/${count})` : 'Los geht’s 🐾'}
        </button>
        {resuming && (
          <button className="btn btn--ghost" onClick={onReset}>
            Von vorne anfangen
          </button>
        )}

        <p className="start__hint">
          <kbd>←</kbd> Nope &nbsp; <kbd>→</kbd> Like
        </p>
      </div>
    </div>
  )
}
