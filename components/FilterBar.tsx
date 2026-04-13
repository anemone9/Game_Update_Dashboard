'use client'

import { useState } from 'react'

export default function FilterBar() {
  const [filter, setFilter] = useState('all')

  return (
    <div className="mb-6 flex gap-4">
      <button
        onClick={() => setFilter('all')}
        className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-700'}`}
      >
        全部
      </button>
      <button
        onClick={() => setFilter('upcoming')}
        className={`px-4 py-2 rounded ${filter === 'upcoming' ? 'bg-blue-600' : 'bg-gray-700'}`}
      >
        即将更新
      </button>
      <button
        onClick={() => setFilter('favorites')}
        className={`px-4 py-2 rounded ${filter === 'favorites' ? 'bg-blue-600' : 'bg-gray-700'}`}
      >
        收藏
      </button>
    </div>
  )
}