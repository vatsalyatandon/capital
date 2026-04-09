const MODULE_COLORS = {
  'Accounting':                     '#4a7c59',
  'Valuation':                      '#a07620',
  'Restructuring / Distressed M&A': '#7a5aa0',
  'DCF':                            '#4a7c59',
  'Enterprise / Equity Value':      '#4a6a7c',
  'Merger Model':                   '#7c4a5a',
  'Credit Analysis':                '#5a7c4a',
  'LBO Model':                      '#a07620',
  'Private Equity':                 '#4a5a7c',
  'Capital Markets':                '#7c6a4a',
  'Brain Teasers':                  '#7a5aa0',
}

function ModuleCard({ sub, stats, onOpenModule }) {
  const { total, lessonPct, totalLessons, completedLessons, quizResult, hasLessons } = stats
  const topColor = MODULE_COLORS[sub] || 'var(--accent)'

  const quizPct = quizResult
    ? Math.round((quizResult.gotIt / quizResult.total) * 100)
    : null

  // Overall progress: lesson % + quiz result presence
  const overallProgress = hasLessons ? lessonPct : 0

  return (
    <div
      className="rounded-2xl flex flex-col overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderTop: `3px solid ${topColor}`,
        boxShadow: '0 2px 12px rgba(27,45,30,0.06), 0 1px 3px rgba(27,45,30,0.04)',
        transition: 'box-shadow 0.2s var(--ease-smooth), transform 0.2s var(--ease-smooth)',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(27,45,30,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(27,45,30,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div className="px-5 pt-5 pb-4 flex-1">
        <h3
          className="font-serif mb-1 leading-snug"
          style={{ fontSize: 15, fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
        >
          {sub}
        </h3>

        {/* Stats row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {hasLessons && (
            <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {totalLessons} lessons
            </span>
          )}
          {hasLessons && <span style={{ color: 'var(--border-strong)', fontSize: 10 }}>·</span>}
          <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {total} questions
          </span>
          {quizPct !== null && (
            <>
              <span style={{ color: 'var(--border-strong)', fontSize: 10 }}>·</span>
              <span
                className="font-mono text-[10px]"
                style={{ color: quizPct >= 80 ? 'var(--accent)' : '#a07620' }}
              >
                Quiz: {quizPct}%
              </span>
            </>
          )}
        </div>

        {/* Lesson progress bar */}
        {hasLessons && (
          <div>
            <div style={{ height: 3, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${overallProgress}%`,
                background: 'var(--accent)',
                borderRadius: 100,
                transition: 'width 0.6s var(--ease-smooth)',
                opacity: overallProgress === 0 ? 0.3 : 1,
              }} />
            </div>
            <p className="font-mono text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              {completedLessons}/{totalLessons} lessons complete
              {overallProgress === 100 && ' ✓'}
            </p>
          </div>
        )}
      </div>

      {/* Footer CTAs */}
      <div className="px-5 py-3 flex items-center gap-2" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => onOpenModule(sub, hasLessons ? 'lessons' : 'practice')}
          className="flex-1 py-1.5 rounded-full text-[11px] font-medium btn-press"
          style={{ background: 'var(--accent)', color: 'white', letterSpacing: '-0.01em', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
        >
          {hasLessons ? (overallProgress > 0 ? 'Continue →' : 'Start →') : 'Practice →'}
        </button>

        <button
          onClick={() => onOpenModule(sub, 'quiz')}
          className="flex-1 py-1.5 rounded-full text-[11px] font-medium btn-press"
          style={{
            border: '1px solid var(--border-strong)',
            color: quizPct !== null ? (quizPct >= 80 ? 'var(--accent)' : '#a07620') : 'var(--text-secondary)',
            background: 'transparent',
            letterSpacing: '-0.01em',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'var(--border-strong)'
            e.currentTarget.style.color = quizPct !== null ? (quizPct >= 80 ? 'var(--accent)' : '#a07620') : 'var(--text-secondary)'
          }}
        >
          {quizPct !== null ? `${quizPct}% ↻` : 'Quiz'}
        </button>
      </div>
    </div>
  )
}

export default function CourseHome({ subcategoryList, moduleStats, onOpenModule }) {
  const totalLessons = subcategoryList.reduce((sum, sub) => sum + (moduleStats[sub]?.totalLessons || 0), 0)
  const completedLessons = subcategoryList.reduce((sum, sub) => sum + (moduleStats[sub]?.completedLessons || 0), 0)
  const totalQuestions = subcategoryList.reduce((sum, sub) => sum + (moduleStats[sub]?.total || 0), 0)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 pt-12 pb-16">
        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            Finance Course
          </p>
          <h1
            className="font-serif"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--text-primary)' }}
          >
            Capital
          </h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>
            {totalLessons} lessons · {totalQuestions} practice questions · {subcategoryList.length} modules.
            {completedLessons > 0 && ` ${completedLessons}/${totalLessons} lessons complete.`}
          </p>
        </div>

        <div
          className="stagger"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}
        >
          {subcategoryList.map(sub => (
            <ModuleCard
              key={sub}
              sub={sub}
              stats={moduleStats[sub] || { total: 0, lessonPct: 0, totalLessons: 0, completedLessons: 0, quizResult: null, hasLessons: false }}
              onOpenModule={onOpenModule}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
