import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      firstName: string
      lastName: string
      image?: string
    }
  }

  interface User {
    id: string
    email: string | null
    name: string
    firstName: string
    lastName: string
    password?: string
    image?: string
    username?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string | null
    name: string
    firstName: string
    lastName: string
    picture?: string
    username?: string
  }
}