export default function ScoreScreen({ result, moduleName, onGoHome, onStudyAgain, onRetakeQuiz }) {
  if (!result) return null

  const { gotIt, stillLearning, total } = result
  const pct = total > 0 ? Math.round((gotIt / total) * 100) : 0

  const label =
    pct >= 80 ? 'Well done.' :
    pct >= 50 ? 'Getting there.' :
    'Keep studying.'

  return (
    <div className="w-full max-w-2xl animate-card-enter">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderTop: '3px solid var(--accent)',
          boxShadow: '0 2px 16px rgba(27,45,30,0.07), 0 1px 3px rgba(27,45,30,0.05)',
        }}
      >
        {/* Score */}
        <div className="px-10 pt-10 pb-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
            {moduleName} — Quiz complete
          </p>

          <p
            className="font-serif"
            style={{
              fontSize: 'clamp(56px, 8vw, 80px)',
              fontWeight: 300,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: pct >= 80 ? 'var(--accent)' : pct >= 50 ? '#a07620' : 'var(--text-primary)',
            }}
          >
            {pct}%
          </p>

          <p
            className="mt-2 font-serif"
            style={{ fontSize: 18, color: 'var(--text-secondary)', letterSpacing: '-0.02em' }}
          >
            {label}
          </p>

          <p className="mt-1 font-mono text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {gotIt} of {total} correct
          </p>
        </div>

        {/* Breakdown */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <div className="px-10 py-6 flex gap-8 justify-center">
            <div className="text-center">
              <p
                className="font-mono text-2xl tabular-nums font-semibold"
                style={{ color: 'var(--accent)', letterSpacing: '-0.03em' }}
              >
                {gotIt}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>
                Correct
              </p>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div className="text-center">
              <p
                className="font-mono text-2xl tabular-nums font-semibold"
                style={{ color: '#a07620', letterSpacing: '-0.03em' }}
              >
                {stillLearning}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>
                Incorrect
              </p>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div className="text-center">
              <p
                className="font-mono text-2xl tabular-nums font-semibold"
                style={{ color: 'var(--text-secondary)', letterSpacing: '-0.03em' }}
              >
                {total}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>
                Total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          onClick={onGoHome}
          className="px-5 py-2 rounded-full text-sm btn-press"
          style={{
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-strong)',
            background: 'transparent',
            transition: 'all 0.15s var(--ease-smooth)',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--accent-light)'
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'var(--border-strong)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          ← Back to course
        </button>

        <button
          onClick={onStudyAgain}
          className="px-5 py-2 rounded-full text-sm btn-press"
          style={{
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-strong)',
            background: 'transparent',
            transition: 'all 0.15s var(--ease-smooth)',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--accent-light)'
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'var(--border-strong)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          Study again
        </button>

        <button
          onClick={onRetakeQuiz}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white btn-press"
          style={{
            background: 'var(--accent)',
            letterSpacing: '-0.01em',
            transition: 'background 0.15s var(--ease-smooth)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
        >
          Retake quiz
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
