import { prisma } from '@/lib/prisma'
import GameGrid from '@/components/GameGrid'

export const revalidate = 60

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
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2">游戏更新聚合</h1>
          <p className="text-gray-400 text-lg">集中查看您喜爱游戏的最新更新信息</p>
        </header>
        
        <GameGrid initialGames={games} />
      </div>
    </main>
  )
}