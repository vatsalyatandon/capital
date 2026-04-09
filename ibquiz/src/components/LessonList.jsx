export default function LessonList({ moduleData, readLessons, onSelectLesson, onStartPractice }) {
  if (!moduleData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ color: 'var(--text-muted)' }}>
        <p className="font-serif text-xl" style={{ letterSpacing: '-0.02em', color: 'var(--text-secondary)' }}>
          Lessons coming soon
        </p>
        <p className="text-xs uppercase tracking-widest font-mono">Content is being prepared</p>
        <button
          onClick={onStartPractice}
          className="mt-4 px-5 py-2 rounded-full text-sm font-medium text-white btn-press"
          style={{ background: 'var(--accent)', letterSpacing: '-0.01em' }}
        >
          Go to Practice →
        </button>
      </div>
    )
  }

  const { lessons, overview, estimatedHours } = moduleData
  const completedCount = lessons.filter(l => readLessons.has(l.id)).length
  const pct = Math.round((completedCount / lessons.length) * 100)
  const totalMinutes = lessons.reduce((sum, l) => sum + (l.estimatedMinutes || 0), 0)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 md:px-10 pt-10 pb-16">
        {/* Module overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {lessons.length} lessons · {totalMinutes} min
              </span>
              {pct === 100 && (
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                  ✓ All complete
                </span>
              )}
            </div>
            {completedCount > 0 && pct < 100 && (
              <span className="font-mono text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {completedCount}/{lessons.length} done
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 100, transition: 'width 0.6s var(--ease-smooth)', opacity: pct === 0 ? 0 : 1 }} />
          </div>

          {/* Overview text */}
          {overview && (
            <p className="mt-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.75, letterSpacing: '-0.005em' }}>
              {overview}
            </p>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', marginBottom: 24 }} />

        {/* Lesson list */}
        <div className="space-y-1">
          {lessons.map((lesson, i) => {
            const isRead = readLessons.has(lesson.id)
            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(i)}
                className="w-full text-left rounded-xl px-4 py-3.5 btn-press flex items-center gap-4"
                style={{
                  background: 'transparent',
                  border: '1px solid transparent',
                  transition: 'all 0.15s var(--ease-smooth)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
              >
                {/* Status indicator */}
                <div
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono"
                  style={{
                    background: isRead ? 'var(--accent)' : 'var(--border)',
                    color: isRead ? 'white' : 'var(--text-muted)',
                  }}
                >
                  {isRead ? '✓' : i + 1}
                </div>

                {/* Lesson info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm truncate"
                    style={{ color: isRead ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: isRead ? 400 : 450, letterSpacing: '-0.01em' }}
                  >
                    {lesson.title}
                  </p>
                </div>

                {/* Duration */}
                <span className="shrink-0 font-mono text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {lesson.estimatedMinutes} min
                </span>

                {/* Arrow */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            )
          })}
        </div>

        {/* CTA after lessons */}
        {completedCount > 0 && (
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={onStartPractice}
              className="w-full py-3 rounded-full text-sm font-medium text-white btn-press"
              style={{ background: 'var(--accent)', letterSpacing: '-0.01em', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
            >
              {pct === 100 ? 'Practice questions →' : 'Continue — go to practice →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
