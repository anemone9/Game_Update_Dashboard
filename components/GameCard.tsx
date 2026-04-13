'use client'

import { useState, useEffect } from 'react'
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

export default function GameCard({ game }: GameCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(game.id))
  }, [game.id])

  useEffect(() => {
    if (game.updates.length > 0) {
      const nextUpdate = new Date(game.updates[0].releaseDate)
      
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
    } else {
      setCountdown('暂无更新信息')
    }
  }, [game.updates])

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

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">{game.name}</h2>
        <button 
          onClick={toggleFavorite} 
          className={`transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
        >
          <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      {game.coverImage && (
        <img 
          src={game.coverImage} 
          alt={game.name} 
          className="w-full h-48 object-cover rounded mb-4 bg-gray-700" 
        />
      )}
      <div className="space-y-2 mb-4">
        <p className="text-gray-300 text-sm">当前版本: <span className="font-semibold">{game.currentVersion || '未知'}</span></p>
        <p className="text-gray-300 text-sm">
          {countdown.includes('已更新') ? (
            <span className="text-green-400">已更新</span>
          ) : (
            <span>倒计时: <span className="text-blue-400 font-semibold">{countdown}</span></span>
          )}
        </p>
        {game.updates.length > 0 && (
          <p className="text-gray-300 text-sm">最新: {game.updates[0].summary}</p>
        )}
      </div>
      <Link 
        href={`/games/${game.id}`} 
        className="inline-block bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded text-white text-sm"
      >
        查看详情
      </Link>
    </div>
  )
}
