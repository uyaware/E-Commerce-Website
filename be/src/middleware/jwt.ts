import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/config/constant";
import { handleGetUserByEmail } from "@/services/user.service";

function generateAccessToken(res: Response, id: number, email: string) {
  const newAccess = jwt.sign({ id: id, email: email }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  res.cookie("access_token", newAccess, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });
}

export async function jwtAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const access_token = req.cookies?.access_token;
  const refresh_token = req.cookies?.refresh_token;

  try {
    // Nếu có access_token thì verify
    if (access_token) {
      const decoded = jwt.verify(access_token, ACCESS_TOKEN_SECRET) as any;

      req.user = {
        id: decoded.id,
        email: decoded.email,
      };

      return next();
    }

    // Nếu KHÔNG có access_token → thử refresh
    if (!refresh_token) {
      return res.status(401).json({
        ok: false,
        code: "UNAUTHORIZED",
      });
    }

    const decodedRefresh = jwt.verify(
      refresh_token,
      REFRESH_TOKEN_SECRET,
    ) as any;

    const user = await handleGetUserByEmail(decodedRefresh.email);

    if (!user || user.refresh_token !== refresh_token) {
      return res.status(401).json({
        ok: false,
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    // Cấp lại access token mới
    generateAccessToken(res, user.id, user.email);

    req.user = {
      id: user.id,
      email: user.email,
    };

    return next();
  } catch (error: any) {
    return res.status(401).json({
      ok: false,
      message: error.message,
    });
  }
}
