import express from "express";
import "dotenv/config";
import authRoute from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { initData } from "./config/seed";
import userProductsRoutes from "./routes/user.products.routes";
import cartRoutes from "./routes/cart.routes";
import productCategoryRoutes from "./routes/product.categories.routes";
import orderRoutes from "./routes/order.routes";
import userRoutes from "./routes/user.routes";
import { initElasticsearch } from "./config/initElasticsearch";
import { reindexProducts } from "./config/reindexProducts";

async function bootstrap() {
  const app = express();
  const port = 8000;

  // config req.body
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // config cookie
  app.use(cookieParser());

  // config cor
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );

  // routes
  authRoute(app);
  userProductsRoutes(app);
  cartRoutes(app);
  productCategoryRoutes(app);
  orderRoutes(app);
  userRoutes(app);

  // seed data
  await initData();

  // elasticsearch
  await initElasticsearch();
  await reindexProducts();

  // domain expansion
  app.listen(port, "0.0.0.0", () => {
    console.log(`App is listening on http://localhost:${port}`);
  });
}

bootstrap();
