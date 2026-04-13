'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
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

export default function GameGrid({ initialGames }: GameGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(savedFavorites)
  }, [])

  const filteredAndSortedGames = useMemo(() => {
    const filtered = initialGames.filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description?.toLowerCase().includes(searchQuery.toLowerCase())

      if (filterType === 'upcoming') {
        return (
          matchesSearch &&
          game.updates.length > 0 &&
          new Date(game.updates[0].releaseDate).getTime() > Date.now()
        )
      }

      if (filterType === 'favorites') {
        return matchesSearch && favorites.includes(game.id)
      }

      return matchesSearch
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'latest':
          if (a.updates.length === 0) return 1
          if (b.updates.length === 0) return -1
          return new Date(b.updates[0].releaseDate).getTime() - new Date(a.updates[0].releaseDate).getTime()
        case 'upcoming':
          if (a.updates.length === 0) return 1
          if (b.updates.length === 0) return -1
          return new Date(a.updates[0].releaseDate).getTime() - new Date(b.updates[0].releaseDate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [favorites, filterType, initialGames, searchQuery, sortBy])

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 backdrop-blur md:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="搜索游戏名或关键词"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-sky-400/60 focus:bg-slate-950"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterType(option.value)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  filterType === option.value
                    ? 'bg-sky-400 text-slate-950'
                    : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/60"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredAndSortedGames.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAndSortedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center">
          <p className="text-lg text-slate-300">没有找到符合条件的游戏</p>
          <p className="mt-2 text-sm text-slate-500">试试更换关键词，或者切换筛选方式。</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-500">
        <span>已显示 {filteredAndSortedGames.length} 个游戏</span>
        <span>总计 {initialGames.length} 个游戏</span>
      </div>
    </section>
  )
}
