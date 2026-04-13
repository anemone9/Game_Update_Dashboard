import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { id: string }
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

  if (!game) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{game.name}</h1>
      {game.coverImage && (
        <img src={game.coverImage} alt={game.name} className="mb-4 h-64 w-full rounded object-cover" />
      )}
      <p className="mb-4 text-gray-300">{game.description}</p>
      <p className="mb-4 text-gray-300">
        官网:{' '}
        {game.officialUrl ? (
          <a href={game.officialUrl} className="text-blue-400">
            {game.officialUrl}
          </a>
        ) : (
          <span className="text-gray-500">暂无</span>
        )}
      </p>
      <p className="mb-8 text-gray-300">当前版本: {game.currentVersion || '未知'}</p>
      <h2 className="mb-4 text-2xl font-semibold">更新记录</h2>
      <div className="space-y-4">
        {game.updates.map((update) => (
          <div key={update.id} className="rounded bg-gray-800 p-4">
            <p className="font-semibold">{update.version}</p>
            <p className="text-gray-300">{update.summary}</p>
            <p className="text-sm text-gray-500">{update.releaseDate.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
