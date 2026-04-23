import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useUIStore } from '@/store/ui.store'
import type { Intent } from '@/utils/intent'

const PARTICLE_COUNT = 1800

// Module-level constants — computed once, never change
const INITIAL_POSITIONS = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 14
    pos[i * 3 + 1] = (Math.random() - 0.5) * 8
    pos[i * 3 + 2] = (Math.random() - 0.5) * 5
  }
  return pos
})()

const COLORS = (() => {
  const c = new Float32Array(PARTICLE_COUNT * 3)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = Math.random()
    c[i * 3] = 0.38 + t * 0.28
    c[i * 3 + 1] = 0.2 + t * 0.13
    c[i * 3 + 2] = 0.9 + t * 0.1
  }
  return c
})()

const SIZES = (() => {
  const s = new Float32Array(PARTICLE_COUNT)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    s[i] = Math.random() * 2.5 + 0.5
  }
  return s
})()

function buildTargetPositions(intent: Intent): Float32Array {
  const positions = new Float32Array(PARTICLE_COUNT * 3)

  if (intent === 'contact') {
    // Concentric glowing rings / sphere
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ring = Math.floor(i / 180)
      const angle = (i % 180) * ((2 * Math.PI) / 180)
      const radius = 1.5 + ring * 0.55
      const tilt = (ring * Math.PI) / 10
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.sin(angle) * radius * Math.cos(tilt) + (Math.random() - 0.5) * 0.3
      positions[i * 3 + 2] = Math.sin(tilt) * radius * 0.5 + (Math.random() - 0.5) * 0.3
    }
  } else if (intent === 'projects') {
    // Isometric grid lattice
    const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * 1.6))
    const rows = Math.ceil(PARTICLE_COUNT / cols)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      positions[i * 3] = (col / cols - 0.5) * 12
      positions[i * 3 + 1] = (row / rows - 0.5) * 7
      positions[i * 3 + 2] = Math.sin(col * 0.8) * Math.cos(row * 0.8) * 1.2
    }
  } else if (intent === 'hire') {
    // Ascending double helix
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const strand = i % 2
      const t = (i / PARTICLE_COUNT) * Math.PI * 12
      const radius = 2.5
      const x = Math.cos(t + strand * Math.PI) * radius
      const y = (i / PARTICLE_COUNT) * 8 - 4
      const z = Math.sin(t + strand * Math.PI) * radius
      positions[i * 3] = x + (Math.random() - 0.5) * 0.2
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.1
      positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.2
    }
  } else {
    // Default: soft nebula cloud
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + (Math.random() - 0.5) * 4
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
  }

  return positions
}

const CLICK_RADIUS = 3.5
const CLICK_STRENGTH = 3.2

function Particles() {
  const { intent } = useUIStore()
  const { camera } = useThree()
  const geoRef = useRef<THREE.BufferGeometry>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const currentPositions = useRef<Float32Array>(buildTargetPositions('default'))
  const targetPositions = useRef<Float32Array>(buildTargetPositions('default'))

  useEffect(() => {
    targetPositions.current = buildTargetPositions(intent)
  }, [intent])

  useEffect(() => {
    currentPositions.current = new Float32Array(INITIAL_POSITIONS)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Convert screen position to world space on the z=0 plane
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1
      const ndcY = -((e.clientY / window.innerHeight) * 2 - 1)
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera)
      const dir = vec.sub(camera.position).normalize()
      const distance = -(camera.position.z / dir.z)
      const worldPos = camera.position.clone().addScaledVector(dir, distance)

      const wx = worldPos.x
      const wy = worldPos.y
      const cur = currentPositions.current

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3
        const dx = cur[ix] - wx
        const dy = cur[ix + 1] - wy
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < CLICK_RADIUS && d > 0.01) {
          const force = (1 - d / CLICK_RADIUS) * CLICK_STRENGTH
          cur[ix] += (dx / d) * force
          cur[ix + 1] += (dy / d) * force
          cur[ix + 2] += (Math.random() - 0.5) * force * 0.6
        }
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [camera])

  useFrame(({ clock }) => {
    if (!geoRef.current || !pointsRef.current) return

    const t = clock.getElapsedTime()
    const cur = currentPositions.current
    const tgt = targetPositions.current
    const lerpSpeed = 0.015

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3
      cur[ix] += (tgt[ix] - cur[ix]) * lerpSpeed
      cur[ix + 1] += (tgt[ix + 1] - cur[ix + 1]) * lerpSpeed
      cur[ix + 2] += (tgt[ix + 2] - cur[ix + 2]) * lerpSpeed

      // subtle float
      cur[ix + 1] += Math.sin(t * 0.4 + i * 0.05) * 0.0008
    }

    const posAttr = geoRef.current.attributes.position as THREE.BufferAttribute
    posAttr.set(cur)
    posAttr.needsUpdate = true

    // mouse parallax on the entire group
    pointsRef.current.rotation.y +=
      (mouseRef.current.x * 0.08 - pointsRef.current.rotation.y) * 0.04
    pointsRef.current.rotation.x +=
      (mouseRef.current.y * 0.05 - pointsRef.current.rotation.x) * 0.04

    // slow drift rotation
    pointsRef.current.rotation.z = t * 0.015
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[INITIAL_POSITIONS, 3]} />
        <bufferAttribute attach="attributes-color" args={[COLORS, 3]} />
        <bufferAttribute attach="attributes-size" args={[SIZES, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export function Background3D() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: false, alpha: true }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
