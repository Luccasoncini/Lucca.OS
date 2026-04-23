import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Torus, Icosahedron, MeshWobbleMaterial } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import type { Mesh } from 'three'
import type { Intent } from '@/utils/intent'

function ContactSphere() {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.3
      ref.current.rotation.y = clock.getElapsedTime() * 0.5
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <MeshDistortMaterial
        color="#6366f1"
        distort={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  )
}

function ProjectsShape() {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.4
      ref.current.rotation.y = clock.getElapsedTime() * 0.6
    }
  })
  return (
    <Icosahedron ref={ref} args={[1.2, 1]}>
      <meshStandardMaterial color="#6366f1" wireframe />
    </Icosahedron>
  )
}

function HireShape() {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.2
      ref.current.rotation.y = clock.getElapsedTime() * 0.4
    }
  })
  return (
    <Torus ref={ref} args={[1, 0.4, 32, 64]}>
      <MeshWobbleMaterial color="#a855f7" factor={0.4} speed={2} roughness={0} metalness={0.9} />
    </Torus>
  )
}

const SCENES: Partial<Record<Intent, () => JSX.Element>> = {
  contact: ContactSphere,
  projects: ProjectsShape,
  hire: HireShape,
}

interface Scene3DProps {
  intent: Intent
}

export function Scene3D({ intent }: Scene3DProps) {
  const SceneComponent = SCENES[intent]
  const visible = !!SceneComponent

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={intent}
          initial={{ opacity: 0, scale: 0.8, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 40 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            top: 72,
            right: 24,
            width: 180,
            height: 180,
            borderRadius: 24,
            overflow: 'hidden',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          <Canvas camera={{ position: [0, 0, 4], fov: 40 }} style={{ background: 'transparent' }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1.5} />
            <pointLight position={[-5, -5, -5]} color="#a855f7" intensity={0.8} />
            {SceneComponent && <SceneComponent />}
          </Canvas>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '8px 12px',
              background: 'linear-gradient(to top, var(--surface), transparent)',
              fontSize: 10,
              color: 'var(--text-muted)',
              textAlign: 'center',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {intent === 'contact' && 'Contato'}
            {intent === 'projects' && 'Projetos'}
            {intent === 'hire' && 'Disponível'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
