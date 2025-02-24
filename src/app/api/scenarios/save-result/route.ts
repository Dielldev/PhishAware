import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { scenarioId, correct, type } = body

    // Save the scenario result
    const result = await prisma.challengeResult.create({
      data: {
        challengeId: scenarioId,
        correct,
        type,
        userId: session.user.id
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error saving scenario result:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}