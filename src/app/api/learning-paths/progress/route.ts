import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { updateModuleProgress } from '@/lib/services/learningPathService'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { moduleId, score } = await req.json()

    if (!moduleId || typeof score !== 'number') {
      return new NextResponse('Invalid request body', { status: 400 })
    }

    const progress = await updateModuleProgress(session.user.id, moduleId, score)
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error updating module progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 