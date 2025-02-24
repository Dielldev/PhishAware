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
    const { challengeId, correct, type, pathId } = body

    if (!challengeId || typeof correct !== 'boolean' || !type || !pathId) {
      return new NextResponse('Invalid request body', { status: 400 })
    }

    // Save challenge result
    await prisma.challengeResult.create({
      data: {
        userId: session.user.id,
        challengeId,
        type,
        correct
      }
    })

    // Get all challenge results for this user and type
    const allResults = await prisma.challengeResult.findMany({
      where: {
        userId: session.user.id,
        type
      },
      distinct: ['challengeId']
    })

    // Calculate overall score
    const totalChallenges = 3 // This should match the number of challenges in your component
    const completedChallenges = allResults.length
    const correctChallenges = allResults.filter(r => r.correct).length
    const overallScore = Math.round((correctChallenges / totalChallenges) * 100)

    // Find the challenge module
    const module = await prisma.module.findFirst({
      where: {
        type: 'challenge',
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
            increment: correct ? 50 : 10 // Same XP rewards as quizzes
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      completedChallenges,
      totalChallenges,
      overallScore
    })
  } catch (error) {
    console.error('Error saving challenge result:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 