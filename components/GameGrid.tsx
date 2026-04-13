'use client'

import { useState, useMemo, useEffect } from 'react'
import GameCard from './GameCard'
import { Search, SortAsc } from 'lucide-react'

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

export default function GameGrid({ initialGames }: GameGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(saved)
  }, [])

  const filteredAndSortedGames = useMemo(() => {
    let filtered = initialGames.filter((game) => {
      const matchesSearch = 
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description?.toLowerCase().includes(searchQuery.toLowerCase())

      if (filterType === 'upcoming') {
        return matchesSearch && game.updates.length > 0
      } else if (filterType === 'favorites') {
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
          return (
            new Date(b.updates[0].releaseDate).getTime() -
            new Date(a.updates[0].releaseDate).getTime()
          )
        case 'upcoming':
          if (a.updates.length === 0) return 1
          if (b.updates.length === 0) return -1
          return (
            new Date(a.updates[0].releaseDate).getTime() -
            new Date(b.updates[0].releaseDate).getTime()
          )
        default:
          return 0
      }
    })

    return filtered
  }, [initialGames, searchQuery, filterType, sortBy, favorites])

  return (
    <div className="space-y-6">
      {/* 搜索和过滤栏 */}
      <div className="space-y-4">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="搜索游戏名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* 过滤和排序按钮 */}
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterType('upcoming')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              即将更新
            </button>
            <button
              onClick={() => setFilterType('favorites')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'favorites'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              ♥ 收藏
            </button>
          </div>

          {/* 排序选择 */}
          <div className="ml-auto flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="name">按名称</option>
              <option value="latest">按最新更新</option>
              <option value="upcoming">按下次更新时间</option>
            </select>
          </div>
        </div>
      </div>

      {/* 游戏网格 */}
      {filteredAndSortedGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">没有找到匹配的游戏</p>
        </div>
      )}

      {/* 统计信息 */}
      <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-800">
        显示 {filteredAndSortedGames.length} / {initialGames.length} 个游戏
      </div>
    </div>
  )
}
