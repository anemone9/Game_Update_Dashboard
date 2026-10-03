'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Heart } from 'lucide-react'

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
  index?: number
}

const fallbackCoverImages: Record<string, string> = {
  鸣潮: '/wuthering-waves.jpg',
  异环: '/yihuan.jpg',
  无畏契约: '/valorant.jpg',
  CS2: '/cs2.jpg',
}

function getFallbackCoverImage(gameName: string) {
  return fallbackCoverImages[gameName] ?? '/delta-force.svg'
}

function formatCompactSummary(summary: string) {
  const normalized = summary
    .replace(
      /\d{4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日(?:\s*(?:上午|下午|凌晨|中午|晚间|晚上|早上)?\s*\d{1,2}(?::\d{2})?)?(?:（[^）]*）)?/g,
      ''
    )
    .replace(/\d{1,2}\s*月\s*\d{1,2}\s*日(?:\s*\d{1,2}:\d{2})?/g, '')
    .replace(/截至\s*[，,。；;]?/g, '')
    .replace(/北京时间|服务器时间|更新后|上线后/g, '')
    .replace(/将于|预计|现已|正式|开启|上线|更新/g, '')
    .replace(/[（(]\s*[）)]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[；;，,、。：:·\-\s]+/, '')
    .replace(/[；;，,、。：:·\-\s]+$/, '')

  const firstSentence = normalized.split(/[。！？!?]/)[0]?.trim() || normalized
  return firstSentence.length > 52 ? `${firstSentence.slice(0, 52).trim()}...` : firstSentence
}

function readFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]') as string[]
}

function broadcastFavorites(favorites: string[]) {
  window.dispatchEvent(new CustomEvent('favorites-updated', { detail: { favorites } }))
}

export default function GameCard({ game, index = 0 }: GameCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [countdown, setCountdown] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const [isPopping, setIsPopping] = useState(false)
  const [imageSrc, setImageSrc] = useState(game.coverImage || getFallbackCoverImage(game.name))

  const latestUpdate = game.updates[0]
  const compactSummary = useMemo(
    () => (latestUpdate ? formatCompactSummary(latestUpdate.summary) : '暂无更新摘要'),
    [latestUpdate]
  )

  useEffect(() => {
    setImageSrc(game.coverImage || getFallbackCoverImage(game.name))
  }, [game.coverImage, game.name])

  useEffect(() => {
    const syncFavorite = () => setIsFavorite(readFavorites().includes(game.id))

    const handleFavoritesUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ favorites?: string[] }>
      setIsFavorite((customEvent.detail?.favorites ?? readFavorites()).includes(game.id))
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'favorites') syncFavorite()
    }

    syncFavorite()
    window.addEventListener('favorites-updated', handleFavoritesUpdated)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdated)
      window.removeEventListener('storage', handleStorage)
    }
  }, [game.id])

  useEffect(() => {
    if (!latestUpdate) {
      setCountdown('暂无更新')
      return
    }

    const nextUpdate = new Date(latestUpdate.releaseDate)
    const updateCountdown = () => {
      const diff = nextUpdate.getTime() - Date.now()

      if (diff <= 0) {
        setCountdown('已更新')
        return
      }

      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      setCountdown(`${days}天 ${hours}小时 ${minutes}分钟`)
    }

    updateCountdown()
    const interval = window.setInterval(updateCountdown, 60000)
    return () => window.clearInterval(interval)
  }, [latestUpdate])

  const toggleFavorite = () => {
    const favorites = readFavorites()
    const nextFavorites = isFavorite ? favorites.filter((id) => id !== game.id) : [...favorites, game.id]

    localStorage.setItem('favorites', JSON.stringify(nextFavorites))
    broadcastFavorites(nextFavorites)
    setIsFavorite(!isFavorite)
    setShowTooltip(!isFavorite)
    setIsPopping(true)

    window.setTimeout(() => setIsPopping(false), 260)
    if (!isFavorite) window.setTimeout(() => setShowTooltip(false), 1400)
  }

  const handleImageError = () => {
    const fallback = getFallbackCoverImage(game.name)
    if (imageSrc !== fallback) setImageSrc(fallback)
  }

  const hasUpcomingUpdate = latestUpdate ? new Date(latestUpdate.releaseDate).getTime() > Date.now() : false

  return (
    <article
      className="portal-reveal group overflow-hidden rounded-md border border-white/10 bg-[#0d0d0d] transition duration-300 hover:-translate-y-1 hover:border-white/30"
      style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
        <img
          src={imageSrc}
          alt={game.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-black/15" />

        <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          {hasUpcomingUpdate ? `倒计时 ${countdown}` : countdown}
        </div>

        <div className="absolute right-3 top-3">
          <button
            onClick={toggleFavorite}
            onMouseEnter={() => isFavorite && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={`grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/70 backdrop-blur transition ${
              isFavorite ? 'text-[#ff6b5b]' : 'text-white hover:text-[#ff6b5b]'
            } ${isPopping ? 'scale-125' : 'scale-100'}`}
            aria-label={isFavorite ? '取消收藏该游戏' : '收藏游戏'}
            title={isFavorite ? '取消收藏' : '收藏游戏'}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          {showTooltip && isFavorite ? (
            <span className="absolute right-0 top-full z-10 mt-2 whitespace-nowrap rounded bg-white px-2.5 py-1 text-xs font-medium text-black">
              已收藏
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-2xl font-semibold text-white">{game.name}</h3>
            <p className="mt-2 truncate text-sm text-zinc-500">当前版本 · {game.currentVersion || '待补充'}</p>
          </div>
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-400">#{String(index + 1).padStart(2, '0')}</span>
        </div>

        {latestUpdate?.version ? (
          <p className="mt-4 text-xs font-medium text-[#d7ff3f]">{latestUpdate.version}</p>
        ) : null}

        <p className="mt-3 min-h-[48px] border-l-2 border-[#d7ff3f] pl-3 text-sm leading-6 text-zinc-300">{compactSummary}</p>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-xs text-zinc-600">UPDATE INTEL</span>
          <Link
            href={`/games/${game.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d7ff3f]"
          >
            查看详情
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}
