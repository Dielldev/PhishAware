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

    // Get the challenge type from query params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type) {
      return new NextResponse('Challenge type is required', { status: 400 })
    }

    // Get all completed challenges for this user and type
    const completedChallenges = await prisma.challengeResult.findMany({
      where: {
        userId: session.user.id,
        type: type
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        challengeId: true,
        correct: true,
        createdAt: true
      }
    })

    // Get unique completed challenges (in case of multiple attempts)
    const uniqueCompletedChallenges = Array.from(
      new Map(completedChallenges.map(c => [c.challengeId, c])).values()
    )

    // Determine total challenges based on path type
    let totalChallenges = 3 // default
    switch (type) {
      case 'phishing':
        totalChallenges = 3
        break
      case 'password':
        totalChallenges = 2
        break
      case 'social':
        totalChallenges = 3
        break
      case 'data':
        totalChallenges = 4
        break
    }

    const completedCount = uniqueCompletedChallenges.length
    const correctCount = uniqueCompletedChallenges.filter(c => c.correct).length
    const progress = Math.round((completedCount / totalChallenges) * 100)

    // Get the learning path and challenge module info
    const learningPath = await prisma.learningPath.findFirst({
      where: { id: type },
      include: {
        modules: {
          where: { type: 'challenge' },
          include: {
            completions: {
              where: { userId: session.user.id }
            }
          }
        }
      }
    })

    const challengeModule = learningPath?.modules[0]
    const moduleCompletion = challengeModule?.completions[0]

    return NextResponse.json({
      completedChallengeIds: uniqueCompletedChallenges.map(c => c.challengeId),
      correctChallengeIds: uniqueCompletedChallenges.filter(c => c.correct).map(c => c.challengeId),
      moduleCompleted: moduleCompletion?.completed || false,
      progress,
      totalCompleted: completedCount,
      totalCorrect: correctCount,
      totalChallenges,
      results: uniqueCompletedChallenges.map(c => ({
        id: c.challengeId,
        correct: c.correct,
        createdAt: c.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching challenge progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}