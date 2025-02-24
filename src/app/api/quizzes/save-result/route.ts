import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateModuleProgress } from '@/lib/services/learningPathService'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { quizId, correct, type, pathId } = body

    if (!quizId || typeof correct !== 'boolean' || !type || !pathId) {
      return new NextResponse('Invalid request body', { status: 400 })
    }

    // Save quiz result
    await prisma.quizResult.create({
      data: {
        userId: session.user.id,
        quizId,
        type,
        correct
      }
    })

    // Get all quiz results for this user and type
    const allResults = await prisma.quizResult.findMany({
      where: {
        userId: session.user.id,
        type
      },
      distinct: ['quizId']
    })

    // Calculate overall score
    const totalQuizzes = 4 // This should match the number of quizzes in your component
    const completedQuizzes = allResults.length
    const correctQuizzes = allResults.filter(r => r.correct).length
    const overallScore = Math.round((correctQuizzes / totalQuizzes) * 100)

    // Find the quiz module
    const module = await prisma.module.findFirst({
      where: {
        type: 'quiz',
        learningPath: {
          id: pathId
        }
      }
    })

    if (module) {
      // Update module progress
      await updateModuleProgress(session.user.id, module.id, overallScore)

      // Update user XP
      await prisma.user.update({
        where: {
          id: session.user.id
        },
        data: {
          totalXP: {
            increment: correct ? 50 : 10
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      completedQuizzes,
      totalQuizzes,
      overallScore
    })
  } catch (error) {
    console.error('Error saving quiz result:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 