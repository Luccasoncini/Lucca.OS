import { AIAssistant } from '@/features/ai-assistant/AIAssistant'
import { TopBar } from '@/components/ui/TopBar'
import { Background3D } from '@/components/3d/Background3D'

export default function App() {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        position: 'relative',
      }}
    >
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
    </div>
  )
}
