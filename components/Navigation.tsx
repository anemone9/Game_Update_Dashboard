'use client'

import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: '首页' },
  { href: '/timeline', label: '时间轴' },
  { href: '/updates', label: '更新记录' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-sky-300 md:text-xl">
          <Gamepad2 size={24} />
          <span>游戏更新聚合</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive ? 'bg-sky-400 text-slate-950' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
