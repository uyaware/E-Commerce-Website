import { getMe, postLogin, postLogout, postRegister } from "@/controllers/auth.controller";
import { jwtAuthenticate } from "@/middleware/jwt";
import express from "express";
import { Express } from "express";

const router = express.Router();

export default function authRoutes(app: Express) {
  router.post("/register", postRegister);
  router.post("/login", postLogin);
  router.post("/logout", jwtAuthenticate, postLogout);
  router.get("/me", jwtAuthenticate, getMe);

  app.use("/auth", router);
}
