import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { signIn } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, password, termsAccepted } = req.body;

  if (!firstName || !lastName || !email || !password || !termsAccepted) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        termsAccepted,
      },
    });

    // Return success with user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      user: userWithoutPassword,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}