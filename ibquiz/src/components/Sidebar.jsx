function SidebarItem({ label, selected, onClick, studyPct, quizResult }) {
  const quizPct = quizResult
    ? Math.round((quizResult.gotIt / quizResult.total) * 100)
    : null

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 rounded-lg border-l-2 btn-press"
      style={{
        borderLeftColor: selected ? 'var(--accent)' : 'transparent',
        color: selected ? 'var(--accent)' : 'var(--text-secondary)',
        background: selected ? 'var(--accent-light-md)' : 'transparent',
        fontWeight: selected ? '500' : '400',
        transition: 'all 0.15s var(--ease-smooth)',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.color = 'var(--text-primary)'
          e.currentTarget.style.background = 'var(--accent-light)'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.color = 'var(--text-secondary)'
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      <span className="truncate flex-1">{label}</span>
      <span className="shrink-0 flex items-center gap-1.5">
        {studyPct === 100 && (
          <span style={{ color: 'var(--accent)', fontSize: 10, lineHeight: 1 }}>✓</span>
        )}
        {quizPct !== null && (
          <span
            className="font-mono text-[9px] tabular-nums"
            style={{ color: quizPct >= 80 ? 'var(--accent)' : '#a07620' }}
          >
            {quizPct}%
          </span>
        )}
      </span>
    </button>
  )
}

export default function Sidebar({ open, view, activeModule, moduleStats, subcategoryList, onGoHome, onSelectModule }) {
  if (!open) return null

  return (
    <aside
      className="w-60 shrink-0 flex flex-col overflow-hidden"
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1C4 1 1 3.5 1 7c0 2 1.5 4 4 5 .5-2 .5-4 2-6 1.5 2 1.5 4 2 6 2.5-1 4-3 4-5 0-3.5-3-6-6-6z"
              fill="var(--accent)"
            />
          </svg>
          <span
            className="font-mono text-xs font-semibold tracking-[0.12em] uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            Capital
          </span>
        </div>
        <p className="mt-1.5 text-[10px] uppercase tracking-widest pl-5 font-mono" style={{ color: 'var(--text-muted)' }}>
          Finance Course
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {/* Back button when in module view */}
        {view === 'module' && (
          <button
            onClick={onGoHome}
            className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-1.5 rounded-lg btn-press mb-2"
            style={{
              color: 'var(--text-muted)',
              transition: 'all 0.15s var(--ease-smooth)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--accent-light)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Course home
          </button>
        )}

        {/* Section label */}
        <div className="pt-1 pb-1.5 px-2 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          <span className="text-[10px] uppercase tracking-widest font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
            Modules
          </span>
        </div>

        <div className="stagger space-y-0.5">
          {subcategoryList.map(sub => (
            <SidebarItem
              key={sub}
              label={sub}
              selected={activeModule === sub}
              onClick={() => onSelectModule(sub)}
              studyPct={moduleStats[sub]?.studyPct || 0}
              quizResult={moduleStats[sub]?.quizResult || null}
            />
          ))}
        </div>
      </nav>
    </aside>
  )
}
