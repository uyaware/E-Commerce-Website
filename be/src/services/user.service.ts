import { prisma } from "@/config/prisma-client";
import bcrypt from "bcryptjs";

export async function handleGetUserByEmail(email: string) {
  return await prisma.user.findFirst({
    where: {
      email
    }
  })
}

export async function handleGetProfile(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      address: true,
      avatar: true,
      createdAt: true,
    },
  });
}

export async function handleUpdateProfile(
  userId: number,
  data: {
    fullName?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }
) {
  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      address: true,
      avatar: true,
      updatedAt: true,
    },
  });
}

export async function handleChangePassword(
  userId: number,
  oldPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return true;
}