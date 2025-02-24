import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { name, email, image } = body

    // Handle empty or undefined name
    let firstName = '', lastName = ''
    if (name && typeof name === 'string') {
      const nameParts = name.trim().split(' ')
      firstName = nameParts[0] || ''
      lastName = nameParts.slice(1).join(' ') || ''
    }

    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        firstName,
        lastName,
        email: email || session.user.email,
        image: image || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        image: true
      }
    })

    // Return the user with the combined name
    return NextResponse.json({
      ...user,
      name: `${user.firstName} ${user.lastName}`.trim() || null
    })
  } catch (error) {
    console.error("[USER_PROFILE_UPDATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}