import { Suspense } from 'react'
import DashboardClient from './DashboardClient'
import DashboardLoading from '@/components/dashboard/DashboardLoading'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.email 
    ? await db.user.findUnique({
        where: { email: session.user.email }
      })
    : null

  return (
    <main className="flex min-h-screen flex-col bg-dark-300">
      <div className="flex-1 p-4 md:p-8">
        <Suspense fallback={<DashboardLoading />}>
          <DashboardClient user={user} />
        </Suspense>
      </div>
    </main>
  )
}