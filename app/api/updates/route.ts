import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const updates = await prisma.update.findMany({
    include: { game: true },
  })
  return NextResponse.json(updates)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const update = await prisma.update.create({
    data: {
      ...body,
      releaseDate: new Date(body.releaseDate),
    },
  })
  return NextResponse.json(update)
}