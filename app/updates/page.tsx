import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function UpdatesPage() {
  const updates = await prisma.update.findMany({
    include: {
      game: true,
    },
    orderBy: {
      releaseDate: 'desc',
    },
  })

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#020617_0%,#0f172a_45%,#020617_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/80">Updates</p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">全部更新记录</h1>
          <p className="mt-2 text-sm text-slate-400">按时间倒序浏览所有版本记录，适合补历史和查细节。</p>
        </header>

        <div className="space-y-4">
          {updates.map((update) => (
            <article key={update.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-white/8 px-3 py-1 text-slate-300">{update.game.name}</span>
                {update.version ? <span className="text-slate-400">{update.version}</span> : null}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-200">{update.summary}</p>
              <p className="mt-3 text-xs text-slate-500">{update.releaseDate.toLocaleDateString('zh-CN')}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
