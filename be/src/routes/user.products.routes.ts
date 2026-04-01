import { getProductById, getProducts } from "@/controllers/product.controller";
import express from "express";
import { Express } from "express";

const router = express.Router();

export default function userProductsRoutes(app: Express) {
  router.get('/', getProducts);
  router.get('/:id', getProductById);

  app.use("/products", router);
}
