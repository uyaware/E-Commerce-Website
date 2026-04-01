import {
  handleLogin,
  handleLogout,
  handleRegister,
  setAuthCookie,
} from "@/services/auth.service";
import { handleGetUserByEmail } from "@/services/user.service";
import { LoginSchema, RegisterSchema } from "@/validation/auth.schema";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { handleGetCartQuantity } from "@/services/cart.service";

export async function postRegister(req: Request, res: Response) {
  const validate = RegisterSchema.safeParse(req.body);
  if (!validate.success) {
    return res.status(422).json({
      ok: false,
      message: "validation error",
      errors: validate.error.issues,
    });
  }

  const { email, password } = validate.data;

  try {
    const existingUser = await handleGetUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: "email already exists",
      });
    }

    await handleRegister(email, password);

    return res.status(201).json({
      ok: true,
      message: "register successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function postLogin(req: Request, res: Response) {
  let { email, password, access_token_exp, refresh_token_exp } = req.body;

  if (!access_token_exp) {
    access_token_exp = 15 * 60;
  }
  if (!refresh_token_exp) {
    refresh_token_exp = 7 * 24 * 60 * 60;
  }

  const validate = LoginSchema.safeParse({ email, password });
  if (!validate.success) {
    console.log(validate.error.issues);

    return res.status(422).json({
      ok: false,
      message: "validation error",
      errors: validate.error.flatten(),
    });
  }

  try {
    const user = await handleGetUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "invalid email/password",
      });
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);
    if (!isMatchedPassword) {
      return res.status(401).json({
        ok: false,
        message: "invalid email/password",
      });
    }

    const {
      access_token,
      refresh_token,
      access_token_exp_s,
      refresh_token_exp_s,
    } = await handleLogin(+user.id, email, access_token_exp, refresh_token_exp);

    setAuthCookie(
      res,
      access_token,
      refresh_token,
      access_token_exp_s,
      refresh_token_exp_s,
    );

    return res.status(200).json({
      ok: true,
      message: "login successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function postLogout(req: Request, res: Response) {
  try {
    const { id } = req.user as any;

    await handleLogout(res, +id);
    
    return res.status(200).json({
      ok: true,
      message: "logout successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
}

// export async function postRefreshToken(req: Request, res: Response) {
//   try {
//     const { id, email } = req.user as any;

//     await handleRefreshToken(res, +id, email);

//     return res.status(200).json({
//       ok: true,
//       message: "token refreshed",
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       ok: false,
//       message: error.message,
//     });
//   }
// }

export async function getMe(req: Request, res: Response) {
  try {
    const { id, email } = req.user as any;

    const [user, cartQuantity] = await Promise.all([
      handleGetUserByEmail(email),
      handleGetCartQuantity(+id),
    ]);

    return res.status(200).json({
      ok: true,
      data: {
        id,
        email,
        avatar: user.avatar,
        cartQuantity,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
}