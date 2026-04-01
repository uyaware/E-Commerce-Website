import { Request, Response } from "express";
import { handleGetMyOrders, handleGetOrderDetail, handlePlaceOrder } from "@/services/order.service";

export async function placeOrder(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;

    const result = await handlePlaceOrder(+userId);

    return res.status(200).json({
      ok: true,
      message: "Order placed successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function getMyOrders(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;

    const result = await handleGetMyOrders(+userId);

    return res.status(200).json({
      ok: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}

export async function getOrderDetail(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;
    const orderId = +req.params.id;

    const result = await handleGetOrderDetail(+userId, orderId);

    return res.status(200).json({
      ok: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      ok: false,
      message: error.message,
    });
  }
}