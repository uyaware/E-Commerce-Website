import express, { Express } from "express";
import { jwtAuthenticate } from "@/middleware/jwt";
import { getMyOrders, getOrderDetail, placeOrder } from "@/controllers/order.controller";

const router = express.Router();

export default function orderRoutes(app: Express) {
  router.post("/", placeOrder);
  router.get("/", getMyOrders);
  router.get("/:id", getOrderDetail);

  app.use("/orders", jwtAuthenticate, router);
}

