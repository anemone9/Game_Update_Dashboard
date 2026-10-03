import Link from 'next/link'
import { ArrowLeft, ListRestart } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function UpdatesPage() {
  const updates = await prisma.update.findMany({
    include: { game: true },
    orderBy: { releaseDate: 'desc' },
  })

  return (
    <main className="site-canvas">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
        <header className="portal-reveal mb-10 grid gap-6 border-b border-white/10 pb-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium text-[#d7ff3f]">
              <ListRestart size={15} />
              UPDATE ARCHIVE
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">全部更新记录</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-500">按时间倒序浏览所有版本、赛季和补丁记录。</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
            <ArrowLeft size={16} />
            返回资料库
          </Link>
        </header>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {updates.map((update, index) => (
            <article
              key={update.id}
              className="portal-reveal grid gap-4 py-6 md:grid-cols-[130px_200px_1fr]"
              style={{ animationDelay: `${Math.min(index, 6) * 45}ms` }}
            >
              <p className="text-sm text-zinc-500">
                {update.releaseDate.toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' })}
              </p>
              <div className="min-w-0">
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-black">{update.game.name}</span>
                {update.version ? <p className="mt-3 truncate text-xs text-[#d7ff3f]">{update.version}</p> : null}
              </div>
              <p className="text-sm leading-7 text-zinc-300">{update.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
