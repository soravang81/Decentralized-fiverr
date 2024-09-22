import { hash, compare } from 'bcrypt';
import prisma from "../../../db/db";

export async function signUp(email: string, password: string, name: string) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { username : email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = await hash(password, 10);

  // Create new user
  const user = await prisma.user.create({
    data: {
      username : email,
      password: hashedPassword,
      name,
    },
  });

  return { id: user.id, email: user.username, name: user.name };
}

export async function signIn(email: string, password: string) {
  // Find user by email
  const user = await prisma.user.findUnique({ where: { username : email } });
  if (!user) {
    throw new Error('User not found');
  }
  if(!user.password){
    throw new Error('User not found');
  }
  // Compare passwords
  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid password');
  }

  return { id: user.id, email: user.username, name: user.name };
}