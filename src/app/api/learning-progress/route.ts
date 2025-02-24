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

    // Fetch all learning paths with their modules and completions
    const learningPaths = await prisma.learningPath.findMany({
      include: {
        modules: {
          include: {
            completions: {
              where: { userId: session.user.id }
            }
          }
        }
      }
    })

    // Fetch all quiz and challenge results
    const [quizResults, challengeResults] = await Promise.all([
      prisma.quizResult.findMany({
        where: { userId: session.user.id },
        distinct: ['quizId', 'type']
      }),
      prisma.challengeResult.findMany({
        where: { userId: session.user.id },
        distinct: ['challengeId', 'type']
      })
    ])

    // Calculate progress for each learning path
    const pathProgress = await Promise.all(
      learningPaths.map(async (path) => {
        // Get results for this path
        const pathQuizzes = quizResults.filter(r => r.type === path.id)
        const pathChallenges = challengeResults.filter(r => r.type === path.id)

        // Get total counts based on path type
        let totalQuizzes = 4, totalChallenges = 3
        switch (path.id) {
          case 'phishing':
            totalQuizzes = 4
            totalChallenges = 3
            break
          case 'password':
            totalQuizzes = 4
            totalChallenges = 2
            break
          case 'social':
            totalQuizzes = 4
            totalChallenges = 3
            break
          case 'data':
            totalQuizzes = 5
            totalChallenges = 4
            break
        }

        // Calculate progress percentages
        const quizProgress = Math.round((pathQuizzes.length / totalQuizzes) * 100)
        const challengeProgress = Math.round((pathChallenges.length / totalChallenges) * 100)

        // Calculate overall progress (weighted average)
        const progress = Math.round((quizProgress * 0.6 + challengeProgress * 0.4))

        return {
          id: path.id,
          progress,
          quizProgress,
          challengeProgress,
          isComplete: progress === 100,
          moduleCompletions: path.modules.map(m => ({
            moduleId: m.id,
            completed: m.completions[0]?.completed || false
          }))
        }
      })
    )

    const progressMap = Object.fromEntries(
      pathProgress.map(p => [p.id, {
        progress: p.progress,
        isComplete: p.isComplete,
        quizProgress: p.quizProgress,
        challengeProgress: p.challengeProgress
      }])
    )

    return NextResponse.json(progressMap)
  } catch (error) {
    console.error('Error fetching learning progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
