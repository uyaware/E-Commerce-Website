import { esClient } from "@/config/elasticsearch";
import { prisma } from "@/config/prisma-client";
import { redis } from "@/config/redis";

interface GetProductsParams {
  page: number;
  limit: number;
  categoryId?: number;
  keyword?: string;
  sort?: string;
}

export async function handleGetProducts({
  page,
  limit,
  categoryId,
  keyword,
  sort,
}: GetProductsParams) {
  let currentPage = page;
  const from = (currentPage - 1) * limit;

  /* =====================================================
     CASE 1: KHÔNG CÓ KEYWORD → DÙNG PRISMA
  ===================================================== */

  const shouldCache = currentPage === 1 && !keyword && !categoryId && !sort;
  const cacheKey = "products:homepage";

  if (!keyword) {
    if (shouldCache) {
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;

    let orderBy: any = { createdAt: "desc" };

    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "sold_desc":
        orderBy = { sold: "desc" };
        break;
      case "rating_desc":
        orderBy = { rating: "desc" };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: from,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    const result = {
      products,
      pagination: {
        page: currentPage,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    if (shouldCache) {
      await redis.set(cacheKey, JSON.stringify(result), "EX", 60);
    }

    return result;
  }

  /* =====================================================
     CASE 2: CÓ KEYWORD → DÙNG ELASTICSEARCH
  ===================================================== */

  const MAX_WINDOW = 10000;
  const maxPage = Math.floor(MAX_WINDOW / limit);

  // Nếu page vượt giới hạn ES → clamp lại
  if (currentPage > maxPage) {
    currentPage = maxPage;
  }

  const safeFrom = (currentPage - 1) * limit;

  const esResult = await esClient.search({
    index: "products",
    from: safeFrom,
    size: limit,
    query: {
      multi_match: {
        query: keyword,
        fields: ["name^2", "detailDesc"],
        fuzziness: "AUTO",
      },
    },
  });

  const hits = esResult.hits.hits;

  const products = hits.map((hit: any) => ({
    id: Number(hit._id),
    ...hit._source,
  }));

  const total =
    typeof esResult.hits.total === "number"
      ? esResult.hits.total
      : esResult.hits.total?.value || 0;

  return {
    products,
    pagination: {
      page: currentPage,
      limit,
      total,
      totalPages: Math.min(
        Math.ceil(total / limit),
        maxPage, // không cho vượt quá giới hạn ES
      ),
    },
  };
}

export async function handleGetProductById(id: number) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}
