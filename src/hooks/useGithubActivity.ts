import { useState, useEffect } from 'react'

export interface GithubCommit {
  message: string
  timeAgo: string
  sha: string
}

interface GithubActivity {
  commits: GithubCommit[]
  latest: string | null
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
  const [state, setState] = useState<GithubActivity>({ commits: [], latest: null, loading: true })

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}/commits?per_page=5`)
      .then(r => {
        if (!r.ok) throw new Error('fetch failed')
        return r.json()
      })
      .then((data: unknown) => {
        if (!Array.isArray(data) || data.length === 0) throw new Error('empty')

        type RawCommit = { sha: string; commit: { message: string; author: { date: string } } }
        const commits: GithubCommit[] = (data as RawCommit[]).map(item => ({
          sha: item.sha.slice(0, 7),
          message: item.commit.message.split('\n')[0].slice(0, 60),
          timeAgo: formatTimeAgo(new Date(item.commit.author.date)),
        }))

        setState({ commits, latest: commits[0].timeAgo, loading: false })
      })
      .catch(() => setState({ commits: [], latest: null, loading: false }))
  }, [repo])

  return state
}
