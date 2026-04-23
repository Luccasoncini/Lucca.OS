import { useUIStore } from '@/store/ui.store'

interface TopBarProps {
  onOpenPalette: () => void
}

export function TopBar({ onOpenPalette }: TopBarProps) {
  const { theme, toggleTheme } = useUIStore()

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      <span
        style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}
      >
        lucca<span style={{ color: 'var(--accent)' }}>.os</span>
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onOpenPalette}
          style={{
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface-2)',
            color: 'var(--text-muted)',
            height: 32,
            padding: '0 10px',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
          aria-label="Open command palette"
        >
          <span>⌘K</span>
        </button>

        <button
          onClick={toggleTheme}
          style={{
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface-2)',
            color: 'var(--text-muted)',
            width: 32,
            height: 32,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            cursor: 'pointer',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  )
}
