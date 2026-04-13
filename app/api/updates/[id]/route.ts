import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { id: string }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const body = await request.json()
  const update = await prisma.update.update({
    where: { id: params.id },
    data: {
      ...body,
      releaseDate: new Date(body.releaseDate),
    },
  })
  return NextResponse.json(update)
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  await prisma.update.delete({
    where: { id: params.id },
  })
  return NextResponse.json({ message: 'Update deleted' })
}