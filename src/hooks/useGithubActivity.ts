import { useState, useEffect } from 'react'

interface GithubActivity {
  timeAgo: string | null
  loading: boolean
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes}m atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  const days = Math.floor(hours / 24)
  return `${days}d atrás`
}

export function useGithubActivity(repo: string): GithubActivity {
  const [state, setState] = useState<GithubActivity>({ timeAgo: null, loading: true })

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`)
      .then(r => {
        if (!r.ok) throw new Error('fetch failed')
        return r.json()
      })
      .then((data: unknown) => {
        if (!Array.isArray(data) || data.length === 0) throw new Error('empty')
        const dateStr = (data[0] as { commit: { author: { date: string } } }).commit.author.date
        setState({ timeAgo: formatTimeAgo(new Date(dateStr)), loading: false })
      })
      .catch(() => setState({ timeAgo: null, loading: false }))
  }, [repo])

  return state
}
