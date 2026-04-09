export default function QuizRating({ onRate, isLast }) {
  return (
    <div className="flex items-center gap-3 mt-6 animate-answer-reveal">
      <button
        onClick={() => onRate('got_it')}
        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white btn-press"
        style={{
          background: 'var(--accent)',
          letterSpacing: '-0.01em',
          transition: 'background 0.15s var(--ease-smooth)',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
      >
        Got it ✓
      </button>
      <button
        onClick={() => onRate('still_learning')}
        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm btn-press"
        style={{
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-strong)',
          background: 'transparent',
          letterSpacing: '-0.01em',
          transition: 'all 0.15s var(--ease-smooth)',
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
        Still learning
      </button>
      {isLast && (
        <span className="ml-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          last one
        </span>
      )}
    </div>
  )
}
