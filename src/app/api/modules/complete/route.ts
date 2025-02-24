import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface ModuleCompletionRequest {
  moduleId: string;
  score: number;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json() as ModuleCompletionRequest
    const { moduleId, score } = body

    if (!moduleId || typeof score !== 'number') {
      return new NextResponse('Invalid request body', { status: 400 })
    }

    // First check if the module exists
    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    })

    if (!module) {
      return new NextResponse('Module not found', { status: 404 })
    }

    // If module exists, proceed with updating completion
    await prisma.moduleCompletion.upsert({
      where: {
        userId_moduleId: {
          userId: session.user.id,
          moduleId,
        },
      },
      update: {
        score: score,
        completed: true,
      },
      create: {
        userId: session.user.id,
        moduleId,
        score: score,
        completed: true,
      },
    })

    return NextResponse.json({
      success: true,
      moduleId,
      score
    })
  } catch (error) {
    console.error('Error completing module:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}