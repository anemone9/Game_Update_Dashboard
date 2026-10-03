import Link from 'next/link'
import { ArrowDown, ArrowUpRight, CalendarDays, Radio, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import GameGrid from '@/components/GameGrid'

export const dynamic = 'force-dynamic'

const timelineDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  month: 'numeric',
  day: 'numeric',
})

function formatBeijingDate(date: Date) {
  const parts = timelineDateFormatter.formatToParts(date)
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  return `${month} 月 ${day} 日`
}

function getLocalCover(gameName?: string | null) {
  const covers: Record<string, string> = {
    鸣潮: '/wuthering-waves.jpg',
    异环: '/yihuan.jpg',
    无畏契约: '/valorant.jpg',
    CS2: '/cs2.jpg',
  }

  return (gameName && covers[gameName]) || '/delta-force.svg'
}

export default async function Home() {
  const [games, upcomingUpdates, updateCount] = await Promise.all([
    prisma.game.findMany({
      include: {
        updates: {
          orderBy: { releaseDate: 'desc' },
          take: 2,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.update.findMany({
      where: {
        releaseDate: {
          gte: new Date(),
        },
        AND: [
          { version: { not: { contains: '预测' } } },
          { version: { not: { contains: '未官宣' } } },
          { version: { not: { contains: '情报观察' } } },
        ],
      },
      include: {
        game: true,
      },
      orderBy: {
        releaseDate: 'asc',
      },
      take: 3,
    }),
    prisma.update.count(),
  ])

  const featuredUpdate = upcomingUpdates[0]
  const featuredCover = featuredUpdate?.game.coverImage || getLocalCover(featuredUpdate?.game.name || games[0]?.name)

  return (
    <main className="site-canvas">
      <section className="relative isolate min-h-[500px] overflow-hidden border-b border-white/10">
        <div
          className="media-fade absolute inset-0 -z-20 bg-cover bg-center opacity-55"
          style={{ backgroundImage: `url(${featuredCover})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden="true" />

        <div className="mx-auto flex min-h-[500px] max-w-[1440px] flex-col justify-between px-4 py-8 md:px-8 md:py-12">
          <div className="portal-reveal flex items-center gap-3 text-xs font-medium text-zinc-300">
            <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 backdrop-blur">
              <Radio size={14} className="text-[#d7ff3f]" />
              数据持续维护中
            </span>
            <span className="hidden text-zinc-400 sm:inline">版本 · 卡池 · 赛季 · 补丁</span>
          </div>

          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="portal-reveal max-w-3xl" style={{ animationDelay: '100ms' }}>
              <p className="mb-3 flex items-center gap-2 text-sm text-[#d7ff3f]">
                <Sparkles size={16} />
                GAME UPDATE PORTAL
              </p>
              <h1 className="text-4xl font-semibold leading-[1.08] text-white sm:text-5xl md:text-6xl">
                游戏更新聚合
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
                把新版本、角色卡池、赛季节点和补丁记录放进同一个清晰时间线，打开就知道最近值得关注什么。
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#games"
                  className="inline-flex items-center gap-2 rounded-md bg-[#d7ff3f] px-5 py-3 text-sm font-semibold text-black transition hover:bg-white"
                >
                  浏览全部游戏
                  <ArrowDown size={16} />
                </a>
                <Link
                  href="/timeline"
                  className="liquid-glass inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  打开时间轴
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            <aside className="liquid-glass portal-reveal rounded-md p-5" style={{ animationDelay: '220ms' }}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-500">NEXT UP</p>
                  <h2 className="mt-1 text-lg font-semibold text-white">近期更新时间轴</h2>
                </div>
                <CalendarDays size={20} className="text-[#d7ff3f]" />
              </div>

              <div className="divide-y divide-white/10">
                {upcomingUpdates.length > 0 ? (
                  upcomingUpdates.map((update) => (
                    <div key={update.id} className="grid grid-cols-[82px_1fr] gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="text-sm font-medium text-[#d7ff3f]">{formatBeijingDate(update.releaseDate)}</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{update.game.name}</p>
                        <p className="mt-1 truncate text-xs text-zinc-400">{update.version || '版本更新'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-3 text-sm text-zinc-500">暂时没有已确认的未来更新。</p>
                )}
              </div>
            </aside>
          </div>

          <div className="portal-reveal mt-10 grid max-w-2xl grid-cols-3 border-t border-white/15 pt-5" style={{ animationDelay: '320ms' }}>
            <div>
              <p className="text-2xl font-semibold text-white">{games.length}</p>
              <p className="mt-1 text-xs text-zinc-500">收录游戏</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{updateCount}</p>
              <p className="mt-1 text-xs text-zinc-500">更新记录</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{upcomingUpdates.length}</p>
              <p className="mt-1 text-xs text-zinc-500">近期节点</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
        <GameGrid initialGames={games} />
      </div>
    </main>
  )
}
