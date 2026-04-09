import { useState, useEffect } from 'react'
import QuizRating from './QuizRating'

const DIFF_TOP_BORDER = {
  'Basic':        'var(--accent)',
  'Advanced':     'var(--accent-amber)',
  'Brain Teaser': 'var(--accent-purple)',
}

const DIFF_BADGE = {
  'Basic':        { color: 'var(--accent)',              bg: 'var(--accent-light)' },
  'Advanced':     { color: 'var(--accent-amber-dark)',   bg: 'var(--accent-amber-light)' },
  'Brain Teaser': { color: 'var(--accent-purple-dark)',  bg: 'var(--accent-purple-light)' },
}

const SUB_PILL = { color: 'var(--accent)', bg: 'var(--accent-light)' }

export default function QuizCard({
  question, index, total,
  onNext, onPrev, onRate,
  isFirst, isLast,
  mode = 'study',
}) {
  const [revealed, setRevealed] = useState(mode === 'study')
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setRevealed(mode === 'study')
    setAnimKey(k => k + 1)
  }, [question.id, mode])

  const handleKeyDown = (e) => {
    if (mode === 'study') {
      if (e.key === 'ArrowRight' || e.key === 'l') onNext?.()
      if (e.key === 'ArrowLeft'  || e.key === 'h') onPrev?.()
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      setRevealed(r => !r)
    }
  }

  const topBorderColor = DIFF_TOP_BORDER[question.difficulty] || 'var(--border-strong)'
  const badge = DIFF_BADGE[question.difficulty] || { color: 'var(--text-secondary)', bg: 'var(--accent-light)' }

  return (
    <div
      className="w-full max-w-2xl outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderTop: `3px solid ${topBorderColor}`,
          boxShadow: '0 2px 16px rgba(27,45,30,0.07), 0 1px 3px rgba(27,45,30,0.05)',
        }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-7 pt-5 pb-0 gap-3">
          <span
            className="text-[10px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-full"
            style={{ color: SUB_PILL.color, background: SUB_PILL.bg }}
          >
            {question.subcategory}
          </span>
          <div className="flex items-center gap-2.5">
            <span
              className="text-[10px] uppercase tracking-widest font-mono px-2.5 py-1 rounded-full"
              style={{ color: badge.color, background: badge.bg }}
            >
              {question.difficulty}
            </span>
            <span className="font-mono text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
              Q{String(index + 1).padStart(2, '0')} / {total}
            </span>
          </div>
        </div>

        {/* Question area */}
        <div className="relative px-7 pt-5 pb-8 overflow-hidden" key={animKey}>
          <span
            className="absolute right-5 top-2 text-8xl font-bold select-none pointer-events-none leading-none tabular-nums"
            style={{ color: 'rgba(44,74,47,0.06)' }}
          >
            {String(index + 1).padStart(3, '0')}
          </span>
          <p
            className="animate-card-enter relative font-serif leading-snug"
            style={{
              fontSize: 'clamp(18px, 2.2vw, 23px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            {question.question}
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)' }} />

        {/* Answer section */}
        {!revealed ? (
          <div className="px-7 py-7">
            <div className="flex flex-col items-center gap-3 py-2">
              <button
                onClick={() => setRevealed(true)}
                className="text-sm btn-press"
                style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                Reveal answer
              </button>
              <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                <span>press</span>
                <kbd>Space</kbd>
                <span>to reveal</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-7 py-7 animate-answer-reveal">
            <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: 'var(--text-muted)' }}>
              Answer
            </p>
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
              {question.answer}
            </div>

            {/* Study mode: Hide button */}
            {mode === 'study' && (
              <button
                onClick={() => setRevealed(false)}
                className="mt-5 text-[10px] uppercase tracking-widest font-mono btn-press"
                style={{ color: 'var(--text-muted)', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                Hide
              </button>
            )}

            {/* Quiz mode: rating buttons */}
            {mode === 'quiz' && (
              <QuizRating onRate={onRate} isLast={isLast} />
            )}
          </div>
        )}
      </div>

      {/* Navigation — study mode only */}
      {mode === 'study' && (
        <div className="flex items-center justify-between mt-5 gap-3">
          <button
            onClick={onPrev}
            disabled={isFirst}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm btn-press disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              color: 'var(--text-secondary)',
              borderColor: 'var(--border)',
              background: 'transparent',
              transition: 'all 0.15s var(--ease-smooth)',
            }}
            onMouseEnter={e => {
              if (!isFirst) {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.color = 'var(--text-primary)'
                e.currentTarget.style.background = 'var(--accent-light)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            <span>Prev</span>
            <kbd>←</kbd>
          </button>

          <span className="font-mono text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {index + 1} / {total}
          </span>

          <button
            onClick={onNext}
            disabled={isLast}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white btn-press disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'var(--accent)',
              letterSpacing: '-0.01em',
              transition: 'all 0.15s var(--ease-smooth)',
            }}
            onMouseEnter={e => { if (!isLast) e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            <span>Next</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      )}

      {/* Quiz mode: just show progress counter */}
      {mode === 'quiz' && (
        <div className="flex items-center justify-center mt-4">
          <span className="font-mono text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {index + 1} / {total}
          </span>
        </div>
      )}
    </div>
  )
}
