'use client'

import { useState, useEffect } from 'react'

interface Game {
  id: string
  name: string
  description?: string
  coverImage?: string
  officialUrl?: string
  currentVersion?: string
}

export default function GameForm() {
  const [games, setGames] = useState<Game[]>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    coverImage: '',
    officialUrl: '',
    currentVersion: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    const res = await fetch('/api/games')
    const data = await res.json()
    setGames(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/games/${editingId}` : '/api/games'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    fetchGames()
    setForm({ name: '', description: '', coverImage: '', officialUrl: '', currentVersion: '' })
    setEditingId(null)
  }

  const handleEdit = (game: Game) => {
    setForm({
      name: game.name,
      description: game.description || '',
      coverImage: game.coverImage || '',
      officialUrl: game.officialUrl || '',
      currentVersion: game.currentVersion || '',
    })
    setEditingId(game.id)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/games/${id}`, { method: 'DELETE' })
    fetchGames()
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="游戏名称"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          required
        />
        <textarea
          placeholder="描述"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
        />
        <input
          type="text"
          placeholder="封面图URL"
          value={form.coverImage}
          onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
        />
        <input
          type="url"
          placeholder="官网链接"
          value={form.officialUrl}
          onChange={(e) => setForm({ ...form, officialUrl: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
        />
        <input
          type="text"
          placeholder="当前版本"
          value={form.currentVersion}
          onChange={(e) => setForm({ ...form, currentVersion: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
          {editingId ? '更新' : '添加'}游戏
        </button>
      </form>
      <div className="space-y-4">
        {games.map((game) => (
          <div key={game.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{game.name}</h3>
              <p className="text-gray-300">{game.description}</p>
            </div>
            <div>
              <button onClick={() => handleEdit(game)} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white mr-2">
                编辑
              </button>
              <button onClick={() => handleDelete(game.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white">
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}