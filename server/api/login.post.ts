import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '~/lib/prisma';


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  const user = await prisma.account.findFirst({
    where: { 
      username: username,
      password: password,
     },
  });

  // if (!user || !(await bcrypt.compare(password, user.password))) {
  //   throw createError({ statusCode: 401, message: 'Invalid username or password' });
  // }
  console.log("You have mogged-in")

  const token = jwt.sign({ userId: user?.id }, 'your-secret-key', { expiresIn: '1h' });

  return { token };
});
