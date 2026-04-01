import { Request, Response } from "express";
import {
  handleGetProfile,
  handleUpdateProfile,
  handleChangePassword,
} from "@/services/user.service";

export async function getProfile(req: Request, res: Response) {
  try {
    const { id } = req.user as any;

    const user = await handleGetProfile(+id);

    return res.json({
      message: "Get profile successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const { id } = req.user as any;

    const { fullName, phone, address, avatar } = req.body;

    const user = await handleUpdateProfile(+id, {
      fullName,
      phone,
      address,
      avatar,
    });

    return res.json({
      message: "Update profile successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { id } = req.user as any;
    const { oldPassword, newPassword } = req.body;

    await handleChangePassword(+id, oldPassword, newPassword);

    return res.json({
      message: "Password changed successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}