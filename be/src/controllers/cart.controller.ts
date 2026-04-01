import {
  handleAddToCart,
  handleDeleteCartItem,
  handleGetCart,
  handleUpdateCartItem,
} from "@/services/cart.service";
import { Request, Response } from "express";

export async function postCart(req: Request, res: Response) {
  try {
    const { productId, quantity } = req.body;

    const userId = (req.user as any).id;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        ok: false,
        message: "Missing required fields",
      });
    }

    const totalQuantity = await handleAddToCart(+userId, +productId, +quantity);

    return res.status(200).json({
      ok: true,
      message: "Added to cart successfully",
      data: {
        cartQuantity: totalQuantity,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message || "Something went wrong",
    });
  }
}

export async function getCart(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;

    const items = await handleGetCart(+userId);

    return res.status(200).json({
      ok: true,
      data: items,
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message || "Something went wrong",
    });
  }
}

export async function updateCartItem(req: Request, res: Response) {
  try {
    const { cartItemId, quantity } = req.body;
    const userId = (req.user as any).id;

    const totalQuantity = await handleUpdateCartItem(
      +userId,
      +cartItemId,
      +quantity,
    );

    return res.status(200).json({
      ok: true,
      data: {
        cartQuantity: totalQuantity,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function deleteCartItem(req: Request, res: Response) {
  try {
    const { cartItemId } = req.body;
    const userId = (req.user as any).id;

    const totalQuantity = await handleDeleteCartItem(+userId, +cartItemId);

    return res.status(200).json({
      ok: true,
      data: {
        cartQuantity: totalQuantity,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}
