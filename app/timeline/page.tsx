import Link from 'next/link'
import { ArrowLeft, CalendarClock } from 'lucide-react'
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
  return firstSentence.length > 58 ? `${firstSentence.slice(0, 58).trim()}...` : firstSentence
}

export default async function TimelinePage() {
  const [upcomingUpdates, recentUpdates] = await Promise.all([
    prisma.update.findMany({
      where: { releaseDate: { gte: new Date() } },
      include: { game: true },
      orderBy: { releaseDate: 'asc' },
      take: 12,
    }),
    prisma.update.findMany({
      where: { releaseDate: { lt: new Date() } },
      include: { game: true },
      orderBy: { releaseDate: 'desc' },
      take: 12,
    }),
  ])

  return (
    <main className="site-canvas">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
        <header className="portal-reveal mb-10 grid gap-6 border-b border-white/10 pb-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium text-[#d7ff3f]">
              <CalendarClock size={15} />
              TIMELINE
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">更新时间轴</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">把即将到来的版本节点和最近发生的更新放在同一条时间线上。</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
            <ArrowLeft size={16} />
            返回资料库
          </Link>
        </header>

        <section className="mb-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">即将更新</h2>
            <span className="text-xs text-zinc-600">{upcomingUpdates.length} 个节点</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {upcomingUpdates.length > 0 ? (
              upcomingUpdates.map((update, index) => (
                <article
                  key={update.id}
                  className="portal-reveal grid gap-5 rounded-md border border-white/10 bg-[#0d0d0d] p-5 sm:grid-cols-[112px_1fr]"
                  style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
                >
                  <div className="border-l-2 border-[#d7ff3f] pl-4">
                    <p className="text-xs text-zinc-600">DATE</p>
                    <p className="mt-2 text-xl font-semibold text-white">{formatHeadlineDate(update.releaseDate)}</p>
                    <p className="mt-1 text-xs text-zinc-500">{formatFullDate(update.releaseDate)}</p>
                  </div>

                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-white px-2.5 py-1 font-medium text-black">{update.game.name}</span>
                      {update.version ? <span className="truncate text-[#d7ff3f]">{update.version}</span> : null}
                    </div>
                    <p className="text-sm leading-6 text-zinc-300">{toShortSummary(update.summary)}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full rounded-md border border-dashed border-white/15 px-6 py-12 text-center text-zinc-600">
                暂无未来更新节点
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">最近记录</h2>
            <span className="text-xs text-zinc-600">RECENT LOG</span>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {recentUpdates.map((update) => (
              <article key={update.id} className="grid gap-3 py-5 md:grid-cols-[120px_180px_1fr] md:items-start">
                <span className="text-sm text-zinc-500">{formatFullDate(update.releaseDate)}</span>
                <div>
                  <p className="text-sm font-medium text-white">{update.game.name}</p>
                  {update.version ? <p className="mt-1 truncate text-xs text-[#d7ff3f]">{update.version}</p> : null}
                </div>
                <p className="text-sm leading-6 text-zinc-400">{toShortSummary(update.summary)}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
