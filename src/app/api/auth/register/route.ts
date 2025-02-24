import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    // Add headers to prevent caching
    const headers = {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json',
    }

    const body = await req.json()
    const { email, password, firstName, lastName, termsAccepted } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers }
      )
    }

    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409, headers }
      )
    }

    const hashedPassword = await hash(password, 10)

    const user = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        termsAccepted: termsAccepted || false,
      },
      // Only select safe fields to return
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      { 
        user,
        success: true
      },
      { status: 201, headers }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      }}
    )
  }
}

// Add this to handle OPTIONS requests
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
} 