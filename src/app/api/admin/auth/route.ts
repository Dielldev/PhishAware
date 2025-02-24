import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user?.email !== 'qwerty@qwerty.com') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  return NextResponse.json({ success: true })
}