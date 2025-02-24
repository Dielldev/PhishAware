import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserProgress, checkAndUpdateActiveDays } from '@/lib/services/learningPathService'

interface PathProgress {
  completed: boolean;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Update active days if needed
    await checkAndUpdateActiveDays(session.user.id)

    // Get user progress data
    const progress = await getUserProgress(session.user.id)

    // Calculate security score based on various factors
    const totalPaths = progress.pathProgress.length
    const completedPaths = progress.pathProgress.filter((p: PathProgress) => p.completed).length
    const totalAchievements = progress.achievements.length
    const maxXP = 10000 // Example maximum XP threshold

    const securityScore = Math.round(
      (
        (completedPaths / Math.max(totalPaths, 1) * 0.4) + // 40% weight for completed paths
        (progress.totalXP / maxXP * 0.3) + // 30% weight for XP
        (totalAchievements / 10 * 0.3) // 30% weight for achievements (assuming 10 total achievements)
      ) * 100
    )

    return NextResponse.json({
      totalXP: progress.totalXP,
      activeDays: progress.activeDays,
      securityScore,
      pathProgress: progress.pathProgress,
      achievements: progress.achievements
    })
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 