const DIFF_COLORS = {
  'All':          { color: 'var(--accent)',  activeBg: 'var(--accent-light-md)', border: 'var(--accent)' },
  'Basic':        { color: 'var(--accent)',  activeBg: 'var(--accent-light-md)', border: 'var(--accent)' },
  'Advanced':     { color: '#7c5a14',        activeBg: 'rgba(124,90,20,0.1)',    border: '#a07620' },
  'Brain Teaser': { color: '#5a3f7a',        activeBg: 'rgba(90,63,122,0.1)',    border: '#7a5aa0' },
}

function DiffPill({ label, selected, onClick }) {
  const c = DIFF_COLORS[label] || DIFF_COLORS['All']
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest font-mono btn-press"
      style={{
        borderColor: selected ? c.border : 'var(--border)',
        color: selected ? c.color : 'var(--text-muted)',
        background: selected ? c.activeBg : 'transparent',
        transition: 'all 0.15s var(--ease-smooth)',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = c.border
          e.currentTarget.style.color = c.color
          e.currentTarget.style.background = c.activeBg
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.color = 'var(--text-muted)'
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      {label}
    </button>
  )
}

export default function FilterBar({
  mode = 'study',
  difficulties,
  selectedDifficulty,
  onDifficultyChange,
  isShuffled,
  onShuffle,
  onReset,
  answered,
  total,
}) {
  return (
    <div
      className="px-6 py-2.5 flex items-center gap-2 shrink-0 flex-wrap"
      style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        {difficulties.map(diff => (
          <DiffPill
            key={diff}
            label={diff}
            selected={selectedDifficulty === diff}
            onClick={() => onDifficultyChange(diff)}
          />
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="font-mono text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
          {answered}/{total} studied
        </span>

        {mode === 'study' && (
          <>
            <button
              onClick={onShuffle}
              title="Shuffle questions"
              className="p-1 rounded btn-press"
              style={{ color: isShuffled ? 'var(--accent)' : 'var(--text-muted)', transition: 'color 0.15s' }}
              onMouseEnter={e => { if (!isShuffled) e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={e => { if (!isShuffled) e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 3 21 3 21 8"/>
                <line x1="4" y1="20" x2="21" y2="3"/>
                <polyline points="21 16 21 21 16 21"/>
                <line x1="15" y1="15" x2="21" y2="21"/>
              </svg>
            </button>

            <button
              onClick={onReset}
              title="Reset study progress for this module"
              className="p-1 rounded btn-press"
              style={{ color: 'var(--text-muted)', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
