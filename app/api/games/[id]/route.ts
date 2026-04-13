import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const game = await prisma.game.findUnique({
    where: { id: params.id },
    include: { updates: true },
  })
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 })
  }
  return NextResponse.json(game)
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const body = await request.json()
  const game = await prisma.game.update({
    where: { id: params.id },
    data: body,
  })
  return NextResponse.json(game)
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  await prisma.game.delete({
    where: { id: params.id },
  })
  return NextResponse.json({ message: 'Game deleted' })
}