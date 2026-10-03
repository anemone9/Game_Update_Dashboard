'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import GameCard from './GameCard'

interface Update {
  version?: string | null
  summary: string
  releaseDate: string | Date
}

interface Game {
  id: string
  name: string
  description?: string | null
  coverImage?: string | null
  currentVersion?: string | null
  updates: Update[]
}

interface GameGridProps {
  initialGames: Game[]
}

const filterOptions = [
  { value: 'all', label: '全部' },
  { value: 'upcoming', label: '即将更新' },
  { value: 'favorites', label: '我的收藏' },
]

const sortOptions = [
  { value: 'name', label: '按名称' },
  { value: 'latest', label: '按最新动态' },
  { value: 'upcoming', label: '按下次更新' },
]

function readFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]') as string[]
}

export default function GameGrid({ initialGames }: GameGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const syncFavorites = () => setFavorites(readFavorites())

    const handleFavoritesUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ favorites?: string[] }>
      setFavorites(customEvent.detail?.favorites ?? readFavorites())
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'favorites') syncFavorites()
    }

    syncFavorites()
    window.addEventListener('favorites-updated', handleFavoritesUpdated)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdated)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const filteredAndSortedGames = useMemo(() => {
    const filtered = initialGames.filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description?.toLowerCase().includes(searchQuery.toLowerCase())

      if (filterType === 'upcoming') {
        return matchesSearch && game.updates.length > 0 && new Date(game.updates[0].releaseDate).getTime() > Date.now()
      }

      if (filterType === 'favorites') return matchesSearch && favorites.includes(game.id)
      return matchesSearch
    })

    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (a.updates.length === 0) return 1
      if (b.updates.length === 0) return -1

      const aDate = new Date(a.updates[0].releaseDate).getTime()
      const bDate = new Date(b.updates[0].releaseDate).getTime()
      return sortBy === 'latest' ? bDate - aDate : aDate - bDate
    })

    return filtered
  }, [favorites, filterType, initialGames, searchQuery, sortBy])

  return (
    <section id="games" className="space-y-7 scroll-mt-24">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-[#d7ff3f]">LIBRARY</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">游戏资料库</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-zinc-500">按游戏浏览当前版本与最近动态，也可以收藏常玩的项目。</p>
      </div>

      <div className="liquid-glass rounded-md p-3">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_auto_190px] lg:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="search"
              placeholder="搜索游戏名或关键词"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 w-full rounded-md border border-white/10 bg-black/55 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#d7ff3f] focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-3 rounded-md border border-white/10 bg-black/40 p-1" aria-label="游戏筛选">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilterType(option.value)}
                className={`min-h-9 rounded px-3 text-sm transition ${
                  filterType === option.value ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-11 w-full appearance-none rounded-md border border-white/10 bg-black/55 pl-10 pr-8 text-sm text-white focus:border-[#d7ff3f] focus:outline-none"
              aria-label="排序方式"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filteredAndSortedGames.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAndSortedGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-white/15 px-6 py-14 text-center">
          <p className="text-lg text-zinc-300">没有找到符合条件的游戏</p>
          <p className="mt-2 text-sm text-zinc-600">换个关键词，或者切换筛选方式。</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-zinc-600">
        <span>显示 {filteredAndSortedGames.length} 个游戏</span>
        <span>资料库共 {initialGames.length} 个游戏</span>
      </div>
    </section>
  )
}
