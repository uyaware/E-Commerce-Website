import { esClient } from "./elasticsearch";
import { prisma } from "./prisma-client";

export async function reindexProducts() {
  const BATCH_SIZE = 1000;

  const total = await prisma.product.count();

  for (let skip = 0; skip < total; skip += BATCH_SIZE) {
    const products = await prisma.product.findMany({
      skip,
      take: BATCH_SIZE,
    });

    const body = products.flatMap((product) => [
      {
        index: {
          _index: "products",
          _id: product.id.toString(),
        },
      },
      {
        name: product.name,
        detailDesc: product.detailDesc,
        image: product.image,
        price: product.price,
        categoryId: product.categoryId,
        quantity: product.quantity,
        sold: product.sold,
        rating: product.rating,
        ratingCount: product.ratingCount,
        createdAt: product.createdAt,
      },
    ]);

    await esClient.bulk({
      refresh: false,
      body,
    });

    console.log(`Indexed ${skip + products.length}/${total}`);
  }

  // refresh 1 lần cuối
  await esClient.indices.refresh({ index: "products" });

  console.log("ES: Reindexed all products");
}