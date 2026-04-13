import { prisma } from '@/lib/prisma'
import GameGrid from '@/components/GameGrid'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const games = await prisma.game.findMany({
    include: {
      updates: {
        orderBy: { releaseDate: 'desc' },
        take: 2,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_45%,#020617_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-10 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] px-6 py-8 shadow-2xl shadow-black/20 backdrop-blur md:px-8 md:py-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300/80">Game Update Dashboard</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
            一眼看清你关注游戏的最新动态
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            这里集中展示鸣潮、三角洲行动、无畏契约和 CS2 的版本变化、倒计时与重点摘要。
            首页只保留最值得看的内容，减少阅读负担。
          </p>
        </header>

        <GameGrid initialGames={games} />
      </div>
    </main>
  )
}
