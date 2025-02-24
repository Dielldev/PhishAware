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
        type: 'password'
      }
    })

    // Get challenge completions
    const challengeResults = await prisma.challengeResult.findMany({
      where: {
        userId: session.user.id,
        type: 'password'
      }
    })

    // Calculate total quizzes and challenges completed
    const totalQuizzes = 4 // Total number of password security quizzes
    const totalChallenges = 2 // Total number of password security challenges

    const completedQuizzes = new Set(quizResults.map((r: { quizId: number }) => r.quizId)).size
    const completedChallenges = new Set(challengeResults.map((r: { challengeId: number }) => r.challengeId)).size

    // Calculate progress percentages
    const quizProgress = (completedQuizzes / totalQuizzes) * 100
    const challengeProgress = (completedChallenges / totalChallenges) * 100

    // Calculate overall progress (average of quiz and challenge progress)
    const overallProgress = Math.round((quizProgress + challengeProgress) / 2)

    return NextResponse.json({
      progress: overallProgress,
      quizProgress,
      challengeProgress,
      isComplete: overallProgress === 100
    })
  } catch (error) {
    console.error('Error fetching password progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}