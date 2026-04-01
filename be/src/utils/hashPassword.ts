import bcrypt from 'bcryptjs';

const saltRounds = 10;

export default async function hashPassword(plainText: string) {
  return await bcrypt.hash(plainText, saltRounds);
}