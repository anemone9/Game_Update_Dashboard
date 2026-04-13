import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const headlineDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  month: 'numeric',
  day: 'numeric',
})

const fullDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function formatHeadlineDate(date: Date) {
  const parts = headlineDateFormatter.formatToParts(date)
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  return `${month} 月 ${day} 日`
}

function formatFullDate(date: Date) {
  return fullDateFormatter.format(date).replace(/\//g, '-')
}

function toShortSummary(summary: string) {
  const firstSentence = summary.split(/[。；!！?？]/)[0]?.trim() || summary
  return firstSentence.length > 44 ? `${firstSentence.slice(0, 44).trim()}...` : firstSentence
}

export default async function TimelinePage() {
  const [upcomingUpdates, recentUpdates] = await Promise.all([
    prisma.update.findMany({
      where: {
        releaseDate: {
          gte: new Date(),
        },
      },
      include: {
        game: true,
      },
      orderBy: {
        releaseDate: 'asc',
      },
      take: 12,
    }),
    prisma.update.findMany({
      where: {
        releaseDate: {
          lt: new Date(),
        },
      },
      include: {
        game: true,
      },
      orderBy: {
        releaseDate: 'desc',
      },
      take: 12,
    }),
  ])

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#020617_0%,#0f172a_45%,#020617_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/80">Timeline</p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">更新时间轴</h1>
          <p className="mt-2 text-sm text-slate-400">按日期直接看即将更新和最近节点。</p>
        </header>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">即将更新</h2>
            <Link href="/" className="text-sm text-sky-300 transition hover:text-sky-200">
              返回首页
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingUpdates.length > 0 ? (
              upcomingUpdates.map((update) => (
                <article
                  key={update.id}
                  className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:grid-cols-[116px_1fr]"
                >
                  <div className="rounded-2xl bg-sky-400/10 px-4 py-3 text-sky-300">
                    <p className="text-xs uppercase tracking-[0.2em]">Date</p>
                    <p className="mt-2 text-2xl font-semibold">{formatHeadlineDate(update.releaseDate)}</p>
                    <p className="mt-1 text-xs text-sky-200/70">{formatFullDate(update.releaseDate)}</p>
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-slate-300">{update.game.name}</span>
                      {update.version ? (
                        <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-200">{update.version}</span>
                      ) : null}
                    </div>

                    <p className="text-base text-slate-100">{toShortSummary(update.summary)}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 px-6 py-12 text-center text-slate-500">
                暂无未来更新节点
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">最近记录</h2>
          <div className="space-y-3">
            {recentUpdates.map((update) => (
              <article key={update.id} className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-slate-400">{formatFullDate(update.releaseDate)}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-200">{update.game.name}</span>
                  {update.version ? <span className="text-slate-500">/ {update.version}</span> : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{toShortSummary(update.summary)}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
