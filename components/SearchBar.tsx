'use client'

import { useState } from 'react'

export default function SearchBar() {
  const [query, setQuery] = useState('')

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="搜索游戏..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 bg-gray-700 text-white rounded"
      />
    </div>
  )
}