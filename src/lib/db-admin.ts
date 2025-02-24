import bcryptjs from 'bcryptjs';
import { db } from './db';

async function verifyAdminUser() {
  try {
    const admin = await db.user.findUnique({
      where: { email: 'qwerty@qwerty.com' }
    });

    if (admin) {
      console.log('Admin user exists:', {
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName
      });
    } else {
      console.log('Admin user not found, creating...');
      const hashedPassword = await bcryptjs.hash('zxcvbn', 10);
      const newAdmin = await db.user.create({
        data: {
          email: 'qwerty@qwerty.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          termsAccepted: true
        }
      });
      console.log('Admin user created successfully:', newAdmin.email);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$disconnect();
  }
}

verifyAdminUser();

async function testAdminAuth() {
  try {
    const admin = await db.user.findUnique({
      where: { email: 'qwerty@qwerty.com' }
    });

    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    const testPassword = 'zxcvbn';
    const isPasswordValid = await bcryptjs.compare(testPassword, admin.password);
    
    console.log('Password verification result:', {
      passwordValid: isPasswordValid,
      hasPassword: !!admin.password,
      passwordLength: admin.password?.length
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.$disconnect();
  }
}

testAdminAuth();