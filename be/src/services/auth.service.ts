import { prisma } from "@/config/prisma-client";
import {
  ACCESS_TOKEN_SECRET,
  ACCOUNT_TYPE,
  REFRESH_TOKEN_SECRET,
} from "@/config/constant";
import hashPassword from "@/utils/hashPassword";
import { parseAccessExpToS } from "@/utils/parseTokenExpToS";
import { Response } from "express";
import jwt from "jsonwebtoken";

export async function handleRegister(email: string, password: string) {
  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      isAdmin: false,
    },
  });
}

export function setAuthCookie(
  res: Response,
  access_token: string,
  refresh_token: string,
  access_token_exp: number = 15 * 60,
  refresh_token_exp: number = 7 * 24 * 60 * 60,
) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: access_token_exp * 1000,
  });

  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: refresh_token_exp * 1000,
  });
}

export async function handleLogin(
  id: number,
  email: string,
  access_token_exp: string,
  refresh_token_exp: string,
) {
  const payload = {
    id,
    email,
  };

  const access_token_exp_s = parseAccessExpToS(access_token_exp);
  const refresh_token_exp_s = parseAccessExpToS(refresh_token_exp);

  const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: access_token_exp_s,
  });

  const refresh_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: refresh_token_exp_s,
  });

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      refresh_token: refresh_token,
    },
  });

  return {
    access_token,
    refresh_token,
    access_token_exp_s,
    refresh_token_exp_s,
  };
}

export async function handleLogout(res: Response, id: number) {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      refresh_token: null,
    },
  });
}

// export async function handleRefreshToken(
//   res: Response,
//   id: number,
//   email: string,
// ) {
//   const payload = {
//     id,
//     email,
//   };
//   const new_access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
//     expiresIn: "15m",
//   });

//   const new_refresh_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
//     expiresIn: "7d",
//   });

//   setAuthCookie(res, new_access_token, new_refresh_token);

//   await prisma.user.update({
//     where: {
//       id,
//     },
//     data: {
//       refresh_token: new_refresh_token,
//     },
//   });
// }
