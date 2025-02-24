import Sidebar from '@/components/dashboard/Sidebar'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  // Fetch complete user data including the image
  const user = session?.user?.email ? await db.user.findUnique({
    where: {
      email: session.user.email
    },
    select: {
      firstName: true,
      lastName: true,
      image: true
    }
  }) : null

  const userName = user ? `${user.firstName} ${user.lastName}`.trim() : null
  
  return (
    <div className="min-h-screen bg-[#121212] flex">
      <Sidebar 
        userName={userName}
        userImage={user?.image}
      />
      <main className="flex-1 pl-[272px] min-w-0">
        {children}
      </main>
    </div>
  )
}