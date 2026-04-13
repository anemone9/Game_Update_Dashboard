'use client'

import { useState, useEffect } from 'react'

interface Update {
  id: string
  gameId: string
  version?: string
  summary: string
  releaseDate: string
}

interface Game {
  id: string
  name: string
}

export default function UpdateForm() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [form, setForm] = useState({
    gameId: '',
    version: '',
    summary: '',
    releaseDate: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchUpdates()
    fetchGames()
  }, [])

  const fetchUpdates = async () => {
    const res = await fetch('/api/updates')
    const data = await res.json()
    setUpdates(data)
  }

  const fetchGames = async () => {
    const res = await fetch('/api/games')
    const data = await res.json()
    setGames(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/updates/${editingId}` : '/api/updates'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    fetchUpdates()
    setForm({ gameId: '', version: '', summary: '', releaseDate: '' })
    setEditingId(null)
  }

  const handleEdit = (update: Update) => {
    setForm({
      gameId: update.gameId,
      version: update.version || '',
      summary: update.summary,
      releaseDate: update.releaseDate,
    })
    setEditingId(update.id)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/updates/${id}`, { method: 'DELETE' })
    fetchUpdates()
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <select
          value={form.gameId}
          onChange={(e) => setForm({ ...form, gameId: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          required
        >
          <option value="">选择游戏</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>{game.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="版本"
          value={form.version}
          onChange={(e) => setForm({ ...form, version: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
        />
        <textarea
          placeholder="更新摘要"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          required
        />
        <input
          type="date"
          value={form.releaseDate}
          onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          required
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
          {editingId ? '更新' : '添加'}更新
        </button>
      </form>
      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{update.version}</h3>
              <p className="text-gray-300">{update.summary}</p>
              <p className="text-sm text-gray-500">{update.releaseDate}</p>
            </div>
            <div>
              <button onClick={() => handleEdit(update)} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white mr-2">
                编辑
              </button>
              <button onClick={() => handleDelete(update.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white">
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}