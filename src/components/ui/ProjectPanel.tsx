import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS, TYPE_COLORS, TYPE_LABELS, type Project } from '@/data/projects'
import { useIsMobile } from '@/hooks/useIsMobile'

function ProjectCard({ project }: { project: Project }) {
  const color = TYPE_COLORS[project.type]

  return (
    <div
      style={{
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${color}`,
        borderRadius: 10,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 10,
              fontFamily: 'monospace',
              color,
              backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
              border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
              borderRadius: 4,
              padding: '1px 6px',
              letterSpacing: '0.04em',
            }}
          >
            {TYPE_LABELS[project.type]}
          </span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          {project.period}
        </span>
      </div>

      {/* name */}
      <h3
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text)',
          letterSpacing: '-0.2px',
        }}
      >
        {project.name}
      </h3>

      {/* description */}
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: 'var(--text-muted)',
          lineHeight: 1.55,
        }}
      >
        {project.description}
      </p>

      {/* footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 2,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {project.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 11,
              color,
              textDecoration: 'none',
              fontFamily: 'monospace',
              flexShrink: 0,
              marginLeft: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {project.linkLabel} ↗
          </a>
        )}
      </div>
    </div>
  )
}

interface ProjectPanelProps {
  open: boolean
  onClose: () => void
}

export function ProjectPanel({ open, onClose }: ProjectPanelProps) {
  const isMobile = useIsMobile()

  const panelWidth = isMobile ? '100%' : 400

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop — mobile only */}
          {isMobile && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 40,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            />
          )}

          <motion.aside
            key="panel"
            initial={{ x: isMobile ? '100%' : 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? '100%' : 420, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 52,
              right: 0,
              bottom: 24,
              width: panelWidth,
              zIndex: 41,
              backgroundColor: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.2)',
            }}
          >
            {/* panel header */}
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12 }}>
                  {'>'}{' '}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text)',
                    fontFamily: 'monospace',
                  }}
                >
                  projetos
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '1px 7px',
                    fontFamily: 'monospace',
                  }}
                >
                  {PROJECTS.length}
                </span>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--text-muted)',
                  width: 26,
                  height: 26,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.color = 'var(--text)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                ✕
              </button>
            </div>

            {/* legend */}
            <div
              style={{
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                gap: 12,
                flexShrink: 0,
              }}
            >
              {(['pessoal', 'empresa', 'freelance'] as const).map(type => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: TYPE_COLORS[type],
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}
                  >
                    {TYPE_LABELS[type]}
                  </span>
                </div>
              ))}
            </div>

            {/* project list */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {PROJECTS.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
