import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Intent } from '@/utils/intent'

type Theme = 'dark' | 'light'

interface UIStore {
  theme: Theme
  toggleTheme: () => void
  intent: Intent
  setIntent: (intent: Intent) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    set => ({
      theme: 'dark',
      toggleTheme: () =>
        set(state => {
          const next = state.theme === 'dark' ? 'light' : 'dark'
          document.documentElement.classList.toggle('light', next === 'light')
          return { theme: next }
        }),
      intent: 'default',
      setIntent: (intent: Intent) => set({ intent }),
    }),
    {
      name: 'lucca-os-ui',
      partialize: state => ({ theme: state.theme }),
      onRehydrateStorage: () => state => {
        if (state?.theme === 'light') {
          document.documentElement.classList.add('light')
        }
      },
    },
  ),
)
