import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getUserLearningPaths(userId: string) {
  const paths = await prisma.learningPath.findMany({
    include: {
      modules: {
        orderBy: {
          order: 'asc'
        },
        include: {
          completions: {
            where: {
              userId: userId
            }
          }
        }
      },
      progress: {
        where: {
          userId: userId
        }
      }
    }
  })

  // Get quiz and challenge results for the user
  const quizResults = await prisma.quizResult.findMany({
    where: {
      userId: userId
    }
  })

  const challengeResults = await prisma.challengeResult.findMany({
    where: {
      userId: userId
    }
  })

  return paths.map(path => {
    // Calculate quiz score
    const pathQuizzes = quizResults.filter(result => 
      result.type === path.id // assuming quiz type matches path id
    )
    const quizScore = pathQuizzes.length > 0
      ? Math.round((pathQuizzes.filter(q => q.correct).length / pathQuizzes.length) * 100)
      : undefined

    // Calculate challenge score
    const pathChallenges = challengeResults.filter(result => 
      result.type === path.id // assuming challenge type matches path id
    )
    const challengeScore = pathChallenges.length > 0
      ? Math.round((pathChallenges.filter(c => c.correct).length / pathChallenges.length) * 100)
      : undefined

    // Calculate completed modules
    const completedModules = path.modules.filter(module => 
      module.completions.some(completion => completion.completed)
    ).length

    // Calculate overall progress
    const progress = (completedModules / Math.max(path.modules.length, 1)) * 100

    return {
      ...path,
      progress: progress,
      completed: progress === 100,
      completedModules,
      quizScore,
      challengeScore
    }
  })
}

export async function updateModuleProgress(userId: string, moduleId: string, score: number) {
  await prisma.moduleCompletion.upsert({
    where: {
      userId_moduleId: {
        userId,
        moduleId,
      },
    },
    update: {
      score: score,
      completed: true,
    },
    create: {
      userId,
      moduleId,
      score: score,
      completed: true,
    },
  })

  return {
    success: true,
    moduleId,
    score
  }
}

export async function getUserProgress(userId: string) {
  const [quizResults, challengeResults] = await Promise.all([
    prisma.quizResult.findMany({
      where: { userId },
      distinct: ['quizId', 'type'],
    }),
    prisma.challengeResult.findMany({
      where: { userId },
      distinct: ['challengeId', 'type'],
    }),
  ])

  // Group results by type
  const quizzesByType = groupByType(quizResults)
  const challengesByType = groupByType(challengeResults)

  // Calculate progress for each type
  const progressByType: Record<string, { completed: boolean }> = {}

  const types = new Set([
    ...Object.keys(quizzesByType),
    ...Object.keys(challengesByType),
  ])

  types.forEach((type) => {
    const quizzes = quizzesByType[type] || []
    const challenges = challengesByType[type] || []

    const quizScore = calculateScore(quizzes)
    const challengeScore = calculateScore(challenges)
    const totalProgress = Math.round((quizScore + challengeScore) / 2)

    // Mark as completed if total progress is 100%
    progressByType[type] = {
      completed: totalProgress === 100,
    }
  })

  return progressByType
}

function groupByType(results: any[]) {
  return results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {})
}

function calculateScore(results: any[]) {
  if (results.length === 0) return 0
  const correctCount = results.filter(r => r.correct).length
  return Math.round((correctCount / results.length) * 100)
}

export async function checkAndUpdateActiveDays(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActive: true, activeDays: true },
  })

  if (!user) return

  const now = new Date()
  const lastActive = user.lastActive
  const isNewDay = now.toDateString() !== lastActive.toDateString()

  if (isNewDay) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        activeDays: user.activeDays + 1,
        lastActive: now,
      },
    })
  }
}