// Client wrapper with proper code splitting and optimizations
'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import DashboardLoading from '@/components/dashboard/DashboardLoading'
import { MobileOverlay } from '@/components/dashboard/MobileOverlay'
import { User } from '@prisma/client';

// Dynamically import components
const DashboardMetrics = dynamic(() => import('@/components/dashboard/DashboardMetrics'), {
  loading: () => <DashboardLoading />,
  ssr: false
})

const Sidebar = dynamic(() => import('@/components/dashboard/Sidebar'), {
  ssr: false
})

interface DashboardClientProps {
  user: User | null;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <>
      <MobileOverlay />
      <div className="hidden md:flex"> {/* Hide on mobile, show on md breakpoint and up */}
        <Suspense fallback={<DashboardLoading />}>
          <Sidebar userName={user ? `${user.firstName} ${user.lastName}` : null} userImage={user ? user.image : null} />
          <div className="flex-1 p-8">
            <DashboardMetrics user={user} />
          </div>
        </Suspense>
      </div>
    </>
  )
}