import express, { Express } from "express";
import { jwtAuthenticate } from "@/middleware/jwt";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "@/controllers/user.controller";

const router = express.Router();

export default function userRoutes(app: Express) {
  router.get("/profile", getProfile);
  router.put("/profile",  updateProfile);
  router.put("/change-password", changePassword);

  app.use("/users", jwtAuthenticate, router);
}