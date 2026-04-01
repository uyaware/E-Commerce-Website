import { esClient } from "./elasticsearch";

export async function initElasticsearch() {
  const indexName = "products";

  const exists = await esClient.indices.exists({
    index: indexName,
  });

  if (!exists) {
    await esClient.indices.create({
      index: indexName,
      mappings: {
        properties: {
          name: { type: "text" },
          detailDesc: { type: "text" },
          image: { type: "keyword" },
          price: { type: "integer" },
          categoryId: { type: "integer" },
          quantity: { type: "integer" },
          sold: { type: "integer" },
          rating: { type: "float" },
          ratingCount: { type: "integer" },
          createdAt: { type: "date" },
        },
      },
    });

    console.log("Elasticsearch: Created products index");
  } else {
    console.log("Elasticsearch: Products index already exists");
  }
}