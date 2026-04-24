import { useState, useEffect, lazy, Suspense } from 'react'
import { AIAssistant } from '@/features/ai-assistant/AIAssistant'
import { TopBar } from '@/components/ui/TopBar'
import { StatusBar } from '@/components/ui/StatusBar'
import { BootSequence } from '@/components/ui/BootSequence'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { ProjectPanel } from '@/components/ui/ProjectPanel'
import { useUIStore } from '@/store/ui.store'

const Background3D = lazy(() =>
  import('@/components/3d/Background3D').then(m => ({ default: m.Background3D })),
)

export default function App() {
  const [booted, setBooted] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const { intent } = useUIStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (intent === 'projects') {
      const id = setTimeout(() => setProjectsOpen(true), 0)
      return () => clearTimeout(id)
    }
  }, [intent])

  return (
    <div
      style={{
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        position: 'relative',
        paddingBottom: 24,
      }}
    >
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      <Suspense fallback={null}>
        <Background3D />
      </Suspense>
      <TopBar onOpenPalette={() => setPaletteOpen(true)} />
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AIAssistant />
      </main>
      <StatusBar />
      <ProjectPanel open={projectsOpen} onClose={() => setProjectsOpen(false)} />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenProjects={() => setProjectsOpen(true)}
      />
    </div>
  )
}
