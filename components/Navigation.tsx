'use client'

import Link from 'next/link'
import { Gamepad2, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/', label: '首页' },
  { href: '/timeline', label: '时间轴' },
  { href: '/updates', label: '更新记录' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3 text-base font-semibold text-white" onClick={() => setMenuOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[#d7ff3f] text-black">
            <Gamepad2 size={20} strokeWidth={2.2} />
          </span>
          <span>游戏更新聚合</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b py-2 text-sm transition ${
                  isActive ? 'border-[#d7ff3f] text-white' : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-white md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={`absolute left-0 right-0 top-16 border-b border-white/10 bg-black/95 p-4 backdrop-blur-xl transition md:hidden ${
          menuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <div className="mx-auto grid max-w-[1440px] gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-md px-4 py-3 text-sm ${pathname === item.href ? 'bg-white/10 text-white' : 'text-zinc-400'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
