const CALLOUT_ICONS = {
  tip: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
    </svg>
  ),
  example: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="13" y2="15"/>
    </svg>
  ),
  insight: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>
  ),
  warning: (color) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
}

const CALLOUT_STYLES = {
  tip: {
    bg: 'rgba(44,74,47,0.07)',
    border: 'var(--accent)',
    titleColor: 'var(--accent)',
  },
  example: {
    bg: 'var(--accent-amber-light)',
    border: 'var(--accent-amber)',
    titleColor: 'var(--accent-amber-dark)',
  },
  insight: {
    bg: 'var(--accent-purple-light)',
    border: 'var(--accent-purple)',
    titleColor: 'var(--accent-purple-dark)',
  },
  warning: {
    bg: 'rgba(180,60,60,0.07)',
    border: '#b43c3c',
    titleColor: '#8b2020',
  },
}

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          className="font-serif mt-10 mb-3 first:mt-0"
          style={{ fontSize: 'clamp(20px, 2.2vw, 24px)', fontWeight: 400, letterSpacing: '-0.025em', color: 'var(--text-primary)', lineHeight: 1.25 }}
        >
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3
          className="font-serif mt-7 mb-2"
          style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.015em', color: 'var(--text-primary)', lineHeight: 1.3 }}
        >
          {block.text}
        </h3>
      )
    case 'p':
      return (
        <p
          className="mb-4 leading-relaxed"
          style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75 }}
        >
          {block.text}
        </p>
      )
    case 'formula':
      return (
        <div
          className="my-5 rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)' }}
        >
          {block.label && (
            <div
              className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}
            >
              {block.label}
            </div>
          )}
          <div
            className="px-5 py-4 font-mono text-sm leading-relaxed"
            style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', overflowX: 'auto' }}
          >
            {block.formula}
          </div>
        </div>
      )
    case 'list':
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag className="mb-4 pl-0 space-y-1.5" style={{ listStyle: 'none' }}>
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3" style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              <span
                className="shrink-0 mt-1 font-mono text-[10px]"
                style={{ color: 'var(--accent)', minWidth: 16 }}
              >
                {block.ordered ? `${i + 1}.` : '●'}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ListTag>
      )
    case 'table':
      return (
        <div className="my-5 overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
          {block.caption && (
            <div
              className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}
            >
              {block.caption}
            </div>
          )}
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card)' }}>
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr
                  key={ri}
                  style={{ background: ri % 2 === 0 ? 'transparent' : 'var(--accent-light)', borderBottom: '1px solid var(--border)' }}
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'callout': {
      const s = CALLOUT_STYLES[block.variant] || CALLOUT_STYLES.insight
      return (
        <div
          className="my-5 rounded-xl px-5 py-4"
          style={{ background: s.bg, borderLeft: `3px solid ${s.border}` }}
        >
          {block.title && (
            <div
              className="font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5"
              style={{ color: s.titleColor }}
            >
              {CALLOUT_ICONS[block.variant]?.(s.titleColor)}
              <span>{block.title}</span>
            </div>
          )}
          <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {block.text}
          </p>
        </div>
      )
    }
    default:
      return null
  }
}

export default function LessonViewer({ lesson, lessonIndex, totalLessons, isRead, onComplete, onPrev, onNext, onBackToList }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 md:px-10 pt-10 pb-20">
        {/* Breadcrumb nav */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={onBackToList}
            className="btn-press flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--text-muted)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            All lessons
          </button>
          <span style={{ color: 'var(--border-strong)' }}>·</span>
          <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            {lessonIndex + 1} / {totalLessons}
          </span>
        </div>

        {/* Lesson title */}
        <div className="mb-8">
          <h1
            className="font-serif"
            style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--text-primary)' }}
          >
            {lesson.title}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              ~{lesson.estimatedMinutes} min read
            </span>
            {isRead && (
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                ✓ Completed
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8" style={{ height: 1, background: 'var(--border)' }} />

        {/* Content blocks */}
        <div>
          {lesson.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        {/* Key takeaways */}
        {lesson.keyTakeaways?.length > 0 && (
          <div
            className="mt-10 rounded-xl p-5"
            style={{ background: 'var(--accent-light-md)', border: '1px solid var(--border)' }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
              Key Takeaways
            </p>
            <ul className="space-y-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {lesson.keyTakeaways.map((pt, i) => (
                <li key={i} className="flex gap-3 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  <span className="shrink-0" style={{ color: 'var(--accent)' }}>✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Interview tip */}
        {lesson.interviewTip && (
          <div
            className="mt-4 rounded-xl px-5 py-4"
            style={{ background: 'var(--accent-amber-light)', borderLeft: '3px solid var(--accent-amber)' }}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5" style={{ color: 'var(--accent-amber-dark)' }}>
              {CALLOUT_ICONS.example('var(--accent-amber-dark)')}
              <span>Interview Tip</span>
            </div>
            <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {lesson.interviewTip}
            </p>
          </div>
        )}

        {/* Navigation footer */}
        <div className="flex items-center justify-between mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onPrev}
            disabled={lessonIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm btn-press disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', background: 'transparent', transition: 'all 0.15s var(--ease-smooth)' }}
            onMouseEnter={e => { if (lessonIndex > 0) { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.borderColor = 'var(--border-strong)' } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Previous
          </button>

          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white btn-press"
            style={{ background: 'var(--accent)', letterSpacing: '-0.01em', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            {lessonIndex < totalLessons - 1 ? (
              <>Next lesson <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
            ) : (
              <>Done — Practice now <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
