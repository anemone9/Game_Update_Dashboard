import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const games = await prisma.game.findMany()
  return NextResponse.json(games)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const game = await prisma.game.create({
    data: body,
  })
  return NextResponse.json(game)
}
