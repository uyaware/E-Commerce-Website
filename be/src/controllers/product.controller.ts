import {
  handleGetProductById,
  handleGetProducts,
} from "@/services/product.service";
import { Request, Response } from "express";

export async function getProducts(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 15, 50);

    const categoryId = req.query.categoryId
      ? Number(req.query.categoryId)
      : undefined;

    const keyword = req.query.keyword as string | undefined;
    const sort = req.query.sort as string | undefined;

    const result = await handleGetProducts({
      page,
      limit,
      categoryId,
      keyword,
      sort,
    });

    return res.status(200).json({
      ok: true,
      message: "successfully get products",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "server error",
    });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "invalid product id",
      });
    }

    const product = await handleGetProductById(id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "product not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: `successfully get product id: ${id}`,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "server error",
    });
  }
}