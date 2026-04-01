
import { getCategories } from "@/controllers/category.controller";
import express from "express";
import { Express } from "express";

const router = express.Router();

export default function productCategoryRoutes(app: Express) {
  router.get('/', getCategories);

  app.use("/categories", router);
}
