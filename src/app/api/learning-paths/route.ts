import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserLearningPaths } from '@/lib/services/learningPathService'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const paths = await getUserLearningPaths(session.user.id)
    return NextResponse.json(paths)
  } catch (error) {
    console.error('Error fetching learning paths:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 