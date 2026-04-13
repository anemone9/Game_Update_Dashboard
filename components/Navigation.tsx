'use client'

import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-400">
          <Gamepad2 size={28} />
          <span>游戏更新聚合</span>
        </Link>
        <div className="flex gap-6">
          <Link
            href="/"
            className={`transition-colors ${
              isActive('/') ? 'text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
          >
            首页
          </Link>
          <Link
            href="/updates"
            className={`transition-colors ${
              isActive('/updates') ? 'text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
          >
            更新记录
          </Link>
        </div>
      </div>
    </nav>
  )
}
