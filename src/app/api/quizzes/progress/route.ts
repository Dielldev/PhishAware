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

    // Get the quiz type from query params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type) {
      return new NextResponse('Quiz type is required', { status: 400 })
    }

    // Get all completed quizzes for this user and type
    const completedQuizzes = await prisma.quizResult.findMany({
      where: {
        userId: session.user.id,
        type: type
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        quizId: true,
        correct: true,
        createdAt: true
      }
    })

    // Get the learning path and quiz module info
    const learningPath = await prisma.learningPath.findFirst({
      where: { id: type },
      include: {
        modules: {
          where: { type: 'quiz' },
          include: {
            completions: {
              where: { userId: session.user.id }
            }
          }
        }
      }
    })

    // Get unique completed quizzes (in case of multiple attempts)
    const uniqueCompletedQuizzes = Array.from(
      new Map(completedQuizzes.map(q => [q.quizId, q])).values()
    )

    // Determine total quizzes based on path type
    let totalQuizzes = 4 // default
    switch (type) {
      case 'phishing':
        totalQuizzes = 4
        break
      case 'password':
        totalQuizzes = 4
        break
      case 'social':
        totalQuizzes = 4
        break
      case 'data':
        totalQuizzes = 5
        break
    }

    const completedCount = uniqueCompletedQuizzes.length
    const correctCount = uniqueCompletedQuizzes.filter(q => q.correct).length
    const progress = Math.round((completedCount / totalQuizzes) * 100)

    // Check module completion
    const quizModule = learningPath?.modules[0]
    const moduleCompletion = quizModule?.completions[0]

    return NextResponse.json({
      completedQuizIds: uniqueCompletedQuizzes.map(q => q.quizId),
      correctQuizIds: uniqueCompletedQuizzes.filter(q => q.correct).map(q => q.quizId),
      moduleCompleted: moduleCompletion?.completed || false,
      progress,
      totalCompleted: completedCount,
      totalCorrect: correctCount,
      totalQuizzes,
      results: uniqueCompletedQuizzes.map(q => ({
        id: q.quizId,
        correct: q.correct,
        createdAt: q.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching quiz progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}