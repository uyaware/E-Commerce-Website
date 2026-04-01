import { handleGetCategories } from "@/services/category.service";
import { Request, Response } from "express";

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await handleGetCategories();

    return res.status(200).json({
      ok: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to fetch categories",
    });
  }
}