'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import GameForm from '@/components/GameForm'
import UpdateForm from '@/components/UpdateForm'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('games')

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">后台管理</h1>
          <p className="mt-2 text-sm text-gray-400">在这里维护游戏资料、当前版本和更新记录。</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700"
        >
          退出登录
        </button>
      </div>
      <div className="mb-6">
        <button
          onClick={() => setActiveTab('games')}
          className={`mr-4 rounded px-4 py-2 ${activeTab === 'games' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          管理游戏
        </button>
        <button
          onClick={() => setActiveTab('updates')}
          className={`rounded px-4 py-2 ${activeTab === 'updates' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          管理更新
        </button>
      </div>
      {activeTab === 'games' && <GameForm />}
      {activeTab === 'updates' && <UpdateForm />}
    </div>
  )
}
