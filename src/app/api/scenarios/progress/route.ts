import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get the scenario type from query params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type) {
      return new NextResponse('Scenario type is required', { status: 400 })
    }

    // Get all completed scenarios for this user and type
    const completedScenarios = await prisma.challengeResult.findMany({
      where: {
        userId: session.user.id,
        type: type
      },
      distinct: ['challengeId'],
      select: {
        challengeId: true,
        correct: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      completedScenarioIds: completedScenarios.map(s => s.challengeId),
      success: true
    })
  } catch (error) {
    console.error('Error fetching scenarios progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}