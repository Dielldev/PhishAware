import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get quiz completions
    const quizResults = await prisma.quizResult.findMany({
      where: {
        userId: session.user.id,
        type: 'data'
      }
    })

    // Get challenge completions
    const challengeResults = await prisma.challengeResult.findMany({
      where: {
        userId: session.user.id,
        type: 'data'
      }
    })

    // Calculate total quizzes and challenges completed
    const totalQuizzes = 5 // Total number of data protection quizzes
    const totalChallenges = 4 // Total number of data protection scenarios

    const completedQuizzes = new Set(quizResults.map((r) => r.quizId)).size
    const completedChallenges = new Set(challengeResults.map((r) => r.challengeId)).size

    // Calculate progress percentages
    const quizProgress = (completedQuizzes / totalQuizzes) * 100
    const challengeProgress = (completedChallenges / totalChallenges) * 100

    // Calculate overall progress (average of quiz and challenge progress)
    const overallProgress = Math.round((quizProgress + challengeProgress) / 2)

    return NextResponse.json({
      progress: overallProgress,
      quizProgress,
      challengeProgress,
      isComplete: overallProgress === 100,
      completedQuizIds: quizResults.map(r => r.quizId),
      completedChallengeIds: challengeResults.map(r => r.challengeId)
    })
  } catch (error) {
    console.error('Error fetching data protection progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}