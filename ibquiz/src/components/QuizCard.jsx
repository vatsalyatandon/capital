import { useState, useEffect } from 'react'
import mcqData from '../data/mcqData.json'

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
const OPTION_LABELS = ['A', 'B', 'C', 'D']

function shuffleWithTracking(options, correctIndex) {
  const indices = [0, 1, 2, 3]
  for (let i = 3; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return {
    shuffled: indices.map(i => options[i]),
    correctShuffledIndex: indices.indexOf(correctIndex),
  }
}

export default function QuizCard({
  question, index, total,
  onNext, onPrev, onRate,
  isFirst, isLast,
  mode = 'study',
}) {
  const [revealed, setRevealed] = useState(mode === 'study')
  const [animKey, setAnimKey] = useState(0)

  // MCQ state (quiz mode)
  const [selectedOption, setSelectedOption] = useState(null)   // user's pick (shuffled index)
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [correctShuffledIndex, setCorrectShuffledIndex] = useState(null)

  const mcq = mode === 'quiz' ? mcqData[question.id] : null
  const hasMCQ = !!mcq

  useEffect(() => {
    setRevealed(mode === 'study')
    setAnimKey(k => k + 1)
    setSelectedOption(null)

    if (mode === 'quiz' && mcq) {
      const { shuffled, correctShuffledIndex } = shuffleWithTracking(mcq.options, mcq.correctIndex)
      setShuffledOptions(shuffled)
      setCorrectShuffledIndex(correctShuffledIndex)
    }
  }, [question.id, mode])

  const handleKeyDown = (e) => {
    if (mode === 'study') {
      if (e.key === 'ArrowRight' || e.key === 'l') onNext?.()
      if (e.key === 'ArrowLeft'  || e.key === 'h') onPrev?.()
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (mode === 'study') setRevealed(r => !r)
    }
  }

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return  // already answered
    setSelectedOption(index)
    const isCorrect = index === correctShuffledIndex
    // Auto-advance after feedback delay
    setTimeout(() => {
      onRate(isCorrect ? 'got_it' : 'still_learning')
    }, 1600)
  }

  const topBorderColor = DIFF_TOP_BORDER[question.difficulty] || 'var(--border-strong)'
  const badge = DIFF_BADGE[question.difficulty] || { color: 'var(--text-secondary)', bg: 'var(--accent-light)' }
  const answered = selectedOption !== null

  // Option button style based on state
  const getOptionStyle = (i) => {
    const isSelected = i === selectedOption
    const isCorrect = i === correctShuffledIndex

    if (!answered) {
      return {
        border: '1px solid var(--border)',
        background: 'transparent',
        color: 'var(--text-primary)',
        cursor: 'pointer',
      }
    }
    if (isCorrect) {
      return {
        border: '1px solid var(--accent)',
        background: 'var(--accent-light-md)',
        color: 'var(--accent)',
        cursor: 'default',
      }
    }
    if (isSelected && !isCorrect) {
      return {
        border: '1px solid #b43c3c',
        background: 'rgba(180,60,60,0.07)',
        color: '#8b2020',
        cursor: 'default',
      }
    }
    return {
      border: '1px solid var(--border)',
      background: 'transparent',
      color: 'var(--text-muted)',
      opacity: 0.5,
      cursor: 'default',
    }
  }

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
        <div className="relative px-7 pt-5 pb-6 overflow-hidden" key={animKey}>
          <span
            className="absolute right-5 top-2 text-8xl font-bold select-none pointer-events-none leading-none tabular-nums"
            style={{ color: 'rgba(44,74,47,0.06)' }}
          >
            {String(index + 1).padStart(3, '0')}
          </span>
          <p
            className="animate-card-enter relative font-serif leading-snug"
            style={{
              fontSize: 'clamp(17px, 2vw, 21px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            {question.question}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }} />

        {/* ── QUIZ MODE — Multiple Choice ─────────────────────────────────── */}
        {mode === 'quiz' && (
          <div className="px-7 py-5">
            {hasMCQ ? (
              <>
                <div className="space-y-2.5">
                  {shuffledOptions.map((option, i) => {
                    const style = getOptionStyle(i)
                    const isCorrect = i === correctShuffledIndex
                    const isSelected = i === selectedOption
                    return (
                      <button
                        key={i}
                        onClick={() => handleOptionSelect(i)}
                        disabled={answered}
                        className="w-full text-left rounded-xl px-4 py-3 flex items-start gap-3 btn-press"
                        style={{
                          ...style,
                          transition: 'all 0.15s var(--ease-smooth)',
                        }}
                        onMouseEnter={e => {
                          if (!answered) {
                            e.currentTarget.style.background = 'var(--accent-light)'
                            e.currentTarget.style.borderColor = 'var(--accent)'
                          }
                        }}
                        onMouseLeave={e => {
                          if (!answered) {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.borderColor = 'var(--border)'
                          }
                        }}
                      >
                        <span
                          className="shrink-0 font-mono text-[10px] font-semibold rounded-full flex items-center justify-center"
                          style={{
                            width: 20, height: 20, marginTop: 1,
                            background: answered && isCorrect ? 'var(--accent)' :
                                        answered && isSelected && !isCorrect ? '#b43c3c' :
                                        'var(--border)',
                            color: answered && (isCorrect || (isSelected && !isCorrect)) ? 'white' : 'var(--text-muted)',
                          }}
                        >
                          {OPTION_LABELS[i]}
                        </span>
                        <span className="text-sm leading-relaxed" style={{ lineHeight: 1.55 }}>
                          {option}
                        </span>
                        {answered && isCorrect && (
                          <span className="ml-auto shrink-0 font-mono text-[10px]" style={{ color: 'var(--accent)', marginTop: 2 }}>✓</span>
                        )}
                        {answered && isSelected && !isCorrect && (
                          <span className="ml-auto shrink-0 font-mono text-[10px]" style={{ color: '#b43c3c', marginTop: 2 }}>✗</span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Feedback message */}
                {answered && (
                  <div className="mt-4 animate-answer-reveal">
                    <p
                      className="font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: selectedOption === correctShuffledIndex ? 'var(--accent)' : '#8b2020' }}
                    >
                      {selectedOption === correctShuffledIndex ? '✓ Correct' : '✗ Incorrect — see answer highlighted above'}
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Fallback if no MCQ data yet */
              <div className="flex flex-col items-center gap-3 py-4">
                <button
                  onClick={() => setRevealed(r => !r)}
                  className="text-sm btn-press"
                  style={{ color: 'var(--text-secondary)', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {revealed ? 'Hide answer' : 'Reveal answer'}
                </button>
                {revealed && (
                  <div className="w-full mt-2 animate-answer-reveal">
                    <p className="text-[10px] uppercase tracking-widest font-mono mb-2" style={{ color: 'var(--text-muted)' }}>Answer</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{question.answer}</p>
                  </div>
                )}
                {revealed && (
                  <div className="flex gap-3 mt-2 animate-answer-reveal">
                    <button onClick={() => onRate('got_it')} className="px-4 py-1.5 rounded-full text-xs font-medium text-white btn-press" style={{ background: 'var(--accent)' }}>Got it ✓</button>
                    <button onClick={() => onRate('still_learning')} className="px-4 py-1.5 rounded-full text-xs btn-press" style={{ border: '1px solid var(--border-strong)', color: 'var(--text-secondary)' }}>Still learning</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STUDY MODE — Reveal / Hide ──────────────────────────────────── */}
        {mode === 'study' && (
          !revealed ? (
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
                  <span>press</span><kbd>Space</kbd><span>to reveal</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-7 py-7 animate-answer-reveal">
              <p className="text-[10px] uppercase tracking-widest font-mono mb-3" style={{ color: 'var(--text-muted)' }}>Answer</p>
              <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                {question.answer}
              </div>
              <button
                onClick={() => setRevealed(false)}
                className="mt-5 text-[10px] uppercase tracking-widest font-mono btn-press"
                style={{ color: 'var(--text-muted)', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                Hide
              </button>
            </div>
          )
        )}
      </div>

      {/* Navigation — study mode only */}
      {mode === 'study' && (
        <div className="flex items-center justify-between mt-5 gap-3">
          <button
            onClick={onPrev}
            disabled={isFirst}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm btn-press disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', background: 'transparent', transition: 'all 0.15s var(--ease-smooth)' }}
            onMouseEnter={e => { if (!isFirst) { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.borderColor = 'var(--border-strong)' } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            <span>Prev</span><kbd>←</kbd>
          </button>

          <span className="font-mono text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {index + 1} / {total}
          </span>

          <button
            onClick={onNext}
            disabled={isLast}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white btn-press disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'var(--accent)', letterSpacing: '-0.01em', transition: 'all 0.15s var(--ease-smooth)' }}
            onMouseEnter={e => { if (!isLast) e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            <span>Next</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      )}

      {/* Quiz mode — just progress counter */}
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
