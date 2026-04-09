export default function ModuleProgress({ pct, studied, total }) {
  return (
    <div>
      <div
        style={{
          height: 3,
          background: 'var(--border)',
          borderRadius: 100,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: pct === 100 ? 'var(--accent)' : 'var(--accent)',
            borderRadius: 100,
            transition: 'width 0.6s var(--ease-smooth)',
            opacity: pct === 0 ? 0.3 : 1,
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {studied}/{total} studied
        </span>
        {pct === 100 && (
          <span style={{ color: 'var(--accent)', fontSize: 11 }}>✓</span>
        )}
      </div>
    </div>
  )
}
