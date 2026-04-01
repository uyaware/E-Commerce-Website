import { prisma } from "@/config/prisma-client";
import { redis } from "@/config/redis";

export async function handleGetCategories() {
  const cacheKey = "categories:all";

  //  Check cache
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("GET CATEGORIES FROM REDIS");
    return JSON.parse(cached);
  }

  // Nếu chưa có → query DB
  console.log("GET CATEGORIES FROM DB");
  const categories = await prisma.category.findMany();

  // Lưu cache (TTL 60 giây)
  await redis.set(cacheKey, JSON.stringify(categories), "EX", 60);

  return categories;
}