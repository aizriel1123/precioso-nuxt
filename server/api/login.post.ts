import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import prisma from '~/lib/prisma';
import { setCookie } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;
  
  // Find the user by username only
  const user = await prisma.account.findFirst({
    where: { username },
  });
  
  // If user is not found, throw error
  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid username or password' });
  }
  
  // Compare plaintext password with the stored hashed password
  const passwordValid = await argon2.verify(user.password, password);
  if (!passwordValid) {
    throw createError({ statusCode: 401, message: 'Invalid username or password' });
  }
  
  console.log("You have mogged-in");
  
  const token = jwt.sign(
    { userId: user.id, typeId: user.type_id, hashPassword: user.password },
    'your-secret-key',
    { expiresIn: '1h' }
  );
  
  // Save the JWT token into a cookie
  setCookie(event, 'jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600, // seconds
    path: '/',
    sameSite: 'lax'
  });
  
  // Optionally return the token in the response as well
  return { token };
});
