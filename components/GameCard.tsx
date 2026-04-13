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
  const simplified = summary
    .replace(/\d{4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日/g, '')
    .replace(/\d{1,2}\s*月\s*\d{1,2}\s*日/g, '')
    .replace(/北京时间(?:凌晨|早上|上午|下午)?\s*\d+\s*点/g, '')
    .replace(/将于|预计|开启|上线|更新/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[；，、]\s*$/, '')
    .trim()

  const firstSentence = simplified.split(/[。；!！?？]/)[0]?.trim() || simplified
  return firstSentence.length > 34 ? `${firstSentence.slice(0, 34).trim()}...` : firstSentence
}

export default function GameCard({ game }: GameCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [countdown, setCountdown] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const [isPopping, setIsPopping] = useState(false)

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
      setCountdown('暂无更新')
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
      const nextFavorites = favorites.filter((id: string) => id !== game.id)
      localStorage.setItem('favorites', JSON.stringify(nextFavorites))
      setShowTooltip(false)
    } else {
      favorites.push(game.id)
      localStorage.setItem('favorites', JSON.stringify(favorites))
      setShowTooltip(true)
      window.setTimeout(() => setShowTooltip(false), 1400)
    }

    setIsFavorite(!isFavorite)
    setIsPopping(true)
    window.setTimeout(() => setIsPopping(false), 260)
  }

  const hasUpcomingUpdate = latestUpdate ? new Date(latestUpdate.releaseDate).getTime() > Date.now() : false

  const favoriteButton = (
    <div className="relative">
      <button
        onClick={toggleFavorite}
        onMouseEnter={() => isFavorite && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`rounded-full border border-white/10 bg-slate-950/75 p-2.5 transition duration-200 ${
          isFavorite ? 'text-rose-400' : 'text-slate-300 hover:text-rose-400'
        } ${isPopping ? 'scale-125' : 'scale-100'}`}
        aria-label={isFavorite ? '已收藏该游戏' : '收藏游戏'}
        title={isFavorite ? '已收藏该游戏' : '收藏游戏'}
      >
        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      {showTooltip && isFavorite && (
        <span className="absolute right-0 top-full z-10 mt-2 whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-900 shadow-lg">
          已收藏该游戏
        </span>
      )}
    </div>
  )

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,15,30,0.98))] shadow-[0_20px_60px_rgba(0,0,0,0.32)] transition duration-300 hover:-translate-y-1 hover:border-sky-400/35">
      {game.coverImage && (
        <div className="relative h-52 overflow-hidden bg-slate-800">
          <img
            src={game.coverImage}
            alt={game.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
          <div className="absolute right-4 top-4">{favoriteButton}</div>
        </div>
      )}

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-semibold text-white">{game.name}</h2>
            <p className="mt-2 text-sm text-slate-400">当前版本：{game.currentVersion || '待补充'}</p>
          </div>

          {!game.coverImage && favoriteButton}
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span
            className={`rounded-full px-3 py-1.5 ${
              hasUpcomingUpdate ? 'bg-sky-500/15 text-sky-300' : 'bg-emerald-500/15 text-emerald-300'
            }`}
          >
            {hasUpcomingUpdate ? `倒计时 ${countdown}` : countdown}
          </span>
          {latestUpdate?.version && (
            <span className="rounded-full bg-white/7 px-3 py-1.5 text-slate-300">{latestUpdate.version}</span>
          )}
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
          <p className="text-sm leading-6 text-slate-100">{compactSummary}</p>
        </div>

        <Link
          href={`/games/${game.id}`}
          className="inline-flex items-center rounded-full bg-sky-400 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-sky-300"
        >
          查看详情
        </Link>
      </div>
    </article>
  )
}
