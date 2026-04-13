import Link from 'next/link'
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

export default async function Home() {
  const [games, upcomingUpdates] = await Promise.all([
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
        version: {
          not: {
            contains: '预测',
          },
        },
      },
      include: {
        game: true,
      },
      orderBy: {
        releaseDate: 'asc',
      },
      take: 2,
    }),
  ])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.10),transparent_24%),linear-gradient(180deg,#020617_0%,#0f172a_45%,#020617_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <header className="mb-8 border-b border-white/10 pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/80">Game Update Dashboard</p>
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl">游戏更新，一屏看完</h1>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="mb-2 flex items-center justify-between gap-6">
                <p className="text-sm font-medium text-slate-200">近期时间轴</p>
                <Link href="/timeline" className="text-sm text-sky-300 transition hover:text-sky-200">
                  查看全部
                </Link>
              </div>

              <div className="space-y-2 text-sm text-slate-300">
                {upcomingUpdates.length > 0 ? (
                  upcomingUpdates.map((update) => (
                    <div key={update.id} className="flex items-center gap-3">
                      <span className="min-w-[72px] text-sky-300">{formatBeijingDate(update.releaseDate)}</span>
                      <span className="text-slate-500">→</span>
                      <span className="truncate">
                        {update.game.name}
                        {update.version ? ` 更新 · ${update.version}` : ' 更新'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">暂时没有即将到来的更新。</p>
                )}
              </div>
            </div>
          </div>
        </header>

        <GameGrid initialGames={games} />
      </div>
    </main>
  )
}
