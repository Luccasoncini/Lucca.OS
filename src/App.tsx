import { useState } from 'react'
import { AIAssistant } from '@/features/ai-assistant/AIAssistant'
import { TopBar } from '@/components/ui/TopBar'
import { StatusBar } from '@/components/ui/StatusBar'
import { Background3D } from '@/components/3d/Background3D'
import { BootSequence } from '@/components/ui/BootSequence'

export default function App() {
  const [booted, setBooted] = useState(false)

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
      <Background3D />
      <TopBar />
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
    </div>
  )
}
