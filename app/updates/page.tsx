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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">所有更新记录</h1>
      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="bg-gray-800 p-4 rounded">
            <p className="font-semibold">{update.game.name} - {update.version}</p>
            <p className="text-gray-300">{update.summary}</p>
            <p className="text-sm text-gray-500">{update.releaseDate.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
