'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'

interface Game {
  id: string
  name: string
  description?: string | null
  coverImage?: string | null
  currentVersion?: string | null
  updates: {
    version?: string | null
    summary: string
    releaseDate: string | Date
  }[]
}

interface GameCardProps {
  game: Game
}

function formatCompactSummary(summary: string) {
  const withoutDates = summary
    .replace(/\d{4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日/g, '')
    .replace(/\d{1,2}\s*月\s*\d{1,2}\s*日/g, '')
    .replace(/北京时间凌晨?\s*\d+\s*点/g, '')
    .replace(/北京时间早上\s*\d+\s*点/g, '')
    .replace(/北京时间上午\s*\d+\s*点/g, '')
    .replace(/北京时间下午\s*\d+\s*点/g, '')
    .replace(/将于/g, '')
    .replace(/预计/g, '')
    .replace(/开启；?/g, '')
    .replace(/上线；?/g, '')
    .replace(/更新；?/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const firstSentence = withoutDates.split(/[。；!！?？]/)[0]?.trim() || withoutDates
  const normalized = firstSentence.replace(/^[；，、,\s]+|[；，、,\s]+$/g, '')

  if (normalized.length <= 42) {
    return normalized
  }

  return `${normalized.slice(0, 42).trim()}...`
}

export default function GameCard({ game }: GameCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [countdown, setCountdown] = useState('')

  const latestUpdate = game.updates[0]
  const compactSummary = useMemo(
    () => (latestUpdate ? formatCompactSummary(latestUpdate.summary) : '暂无更新摘要'),
    [latestUpdate]
  )

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(game.id))
  }, [game.id])

  useEffect(() => {
    if (!latestUpdate) {
      setCountdown('暂无更新信息')
      return
    }

    const nextUpdate = new Date(latestUpdate.releaseDate)

    const updateCountdown = () => {
      const now = new Date()
      const diff = nextUpdate.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setCountdown(`${days}天 ${hours}小时 ${minutes}分钟`)
      } else {
        setCountdown('已更新')
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [latestUpdate])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== game.id)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    } else {
      favorites.push(game.id)
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }

    setIsFavorite(!isFavorite)
  }

  const hasUpcomingUpdate = latestUpdate ? new Date(latestUpdate.releaseDate).getTime() > Date.now() : false

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-1 hover:border-sky-400/40">
      {game.coverImage && (
        <div className="relative h-48 overflow-hidden bg-slate-800">
          <img src={game.coverImage} alt={game.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <button
            onClick={toggleFavorite}
            className={`absolute right-3 top-3 rounded-full border border-white/10 bg-slate-950/75 p-2 transition-colors ${
              isFavorite ? 'text-rose-400' : 'text-slate-300 hover:text-rose-400'
            }`}
            aria-label={isFavorite ? '取消收藏' : '收藏游戏'}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      )}

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">{game.name}</h2>
              <p className="mt-1 text-sm text-slate-400">当前版本：{game.currentVersion || '待补充'}</p>
            </div>
            {!game.coverImage && (
              <button
                onClick={toggleFavorite}
                className={`rounded-full border border-white/10 bg-slate-800 p-2 transition-colors ${
                  isFavorite ? 'text-rose-400' : 'text-slate-300 hover:text-rose-400'
                }`}
                aria-label={isFavorite ? '取消收藏' : '收藏游戏'}
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span
              className={`rounded-full px-3 py-1 ${
                hasUpcomingUpdate ? 'bg-sky-500/15 text-sky-300' : 'bg-emerald-500/15 text-emerald-300'
              }`}
            >
              {hasUpcomingUpdate ? `倒计时 ${countdown}` : countdown}
            </span>
            {latestUpdate?.version && (
              <span className="rounded-full bg-white/8 px-3 py-1 text-slate-300">{latestUpdate.version}</span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">更新摘要</p>
          <p className="text-sm leading-6 text-slate-200">{compactSummary}</p>
        </div>

        <Link
          href={`/games/${game.id}`}
          className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-sky-400"
        >
          查看详情
        </Link>
      </div>
    </article>
  )
}
