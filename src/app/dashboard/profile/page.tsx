import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import ProfileForm from "@/components/dashboard/ProfileForm"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }

  // Fetch the latest user data from the database
  const user = await db.user.findUnique({
    where: {
      email: session.user.email
    },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      image: true
    }
  })

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
          <div className="p-8">
            <ProfileForm 
              initialData={{
                name: user ? `${user.firstName} ${user.lastName}`.trim() : '',
                email: user.email,
                image: user.image || '',
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  )
} 