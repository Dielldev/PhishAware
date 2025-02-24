import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  // Verify admin credentials
  if (session?.user?.email !== 'qwerty@qwerty.com') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Fetch all relevant data, excluding admin users from the users list
    const [users, learningPaths, quizResults, challengeResults] = await Promise.all([
      prisma.user.findMany({
        where: {
          email: {
            not: 'qwerty@qwerty.com' // Exclude admin user
          }
        }
      }),
      prisma.learningPath.findMany({
        include: {
          modules: true,
        },
      }),
      prisma.quizResult.findMany(),
      prisma.challengeResult.findMany(),
    ])

    return NextResponse.json({
      users,
      learningPaths,
      quizResults,
      challengeResults,
    })
  } catch (error) {
    console.error('Error fetching admin data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}