import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, CalendarDays } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { id: string }
}

const fallbackCoverImages: Record<string, string> = {
  鸣潮: '/wuthering-waves.jpg',
  异环: '/yihuan.jpg',
  无畏契约: '/valorant.jpg',
  CS2: '/cs2.jpg',
}

function getCover(gameName: string, coverImage?: string | null) {
  return coverImage || fallbackCoverImages[gameName] || '/delta-force.svg'
}

export default async function GameDetail({ params }: PageProps) {
  const game = await prisma.game.findUnique({
    where: { id: params.id },
    include: {
      updates: {
        orderBy: { releaseDate: 'desc' },
      },
    },
  })

  if (!game) notFound()

  return (
    <main className="site-canvas">
      <section className="relative isolate min-h-[420px] overflow-hidden border-b border-white/10">
        <img
          src={getCover(game.name, game.coverImage)}
          alt=""
          className="media-fade absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-black/55" />

        <div className="mx-auto flex min-h-[420px] max-w-6xl flex-col justify-between px-4 py-8 md:px-8 md:py-12">
          <Link href="/" className="portal-reveal inline-flex w-fit items-center gap-2 text-sm text-zinc-300 transition hover:text-white">
            <ArrowLeft size={16} />
            返回游戏资料库
          </Link>

          <div className="portal-reveal max-w-3xl" style={{ animationDelay: '100ms' }}>
            <p className="text-xs font-medium text-[#d7ff3f]">GAME PROFILE</p>
            <h1 className="mt-3 text-5xl font-semibold text-white md:text-6xl">{game.name}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">{game.description || '暂无游戏简介。'}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#d7ff3f] px-3 py-1.5 text-xs font-semibold text-black">
                当前版本 · {game.currentVersion || '待补充'}
              </span>
              {game.officialUrl ? (
                <a
                  href={game.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="liquid-glass inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  官方网站
                  <ArrowUpRight size={15} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-7 flex items-end justify-between border-b border-white/10 pb-5">
          <div>
            <p className="flex items-center gap-2 text-xs text-[#d7ff3f]">
              <CalendarDays size={14} />
              VERSION HISTORY
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">更新记录</h2>
          </div>
          <span className="text-xs text-zinc-600">共 {game.updates.length} 条</span>
        </div>

        <div className="relative space-y-4 before:absolute before:bottom-0 before:left-[7px] before:top-0 before:w-px before:bg-white/10">
          {game.updates.map((update, index) => (
            <article
              key={update.id}
              className="portal-reveal relative grid gap-3 pl-8 md:grid-cols-[170px_1fr]"
              style={{ animationDelay: `${Math.min(index, 7) * 45}ms` }}
            >
              <span className="absolute left-0 top-5 h-[15px] w-[15px] rounded-full border-4 border-[#070707] bg-[#d7ff3f]" />
              <div className="py-5">
                <p className="text-sm font-medium text-white">{update.version || '版本更新'}</p>
                <p className="mt-1 text-xs text-zinc-600">
                  {update.releaseDate.toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' })}
                </p>
              </div>
              <p className="rounded-md border border-white/10 bg-[#0d0d0d] p-5 text-sm leading-7 text-zinc-300">{update.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
