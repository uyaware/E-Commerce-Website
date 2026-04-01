import { deleteCartItem, getCart, postCart, updateCartItem } from "@/controllers/cart.controller";
import { jwtAuthenticate } from "@/middleware/jwt";
import express from "express";
import { Express } from "express";

const router = express.Router();

export default function cartRoutes(app: Express) {
  router.get("/", getCart);
  router.post("/", postCart);
  router.put("/", updateCartItem);
  router.delete("/", deleteCartItem);

  app.use("/cart", jwtAuthenticate, router);
}
