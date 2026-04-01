import ProductCard from "./ProductCard";
import ProductPagination from "./ProductPagination";


async function getProducts(params: {
  page: number;
  categoryId?: string;
  keyword?: string;
  sort?: string;
}) {
  const query = new URLSearchParams({
    page: String(params.page),
    ...(params.categoryId && { categoryId: params.categoryId }),
    ...(params.keyword && { keyword: params.keyword }),
    ...(params.sort && { sort: params.sort }),
  });

  console.log(`http://backend:8000/products?${query.toString()}`);

  const res = await fetch(
    `http://backend:8000/products?${query.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const result = await res.json();
  return result.data;
}

export default async function ProductsSection({
  page,
  categoryId,
  keyword,
  sort,
}: {
  page: number;
  categoryId?: string;
  keyword?: string;
  sort?: string;
}) {
  const result = await getProducts({
    page,
    categoryId,
    keyword,
    sort,
  });

  const products = result.products;
  const pagination = result.pagination;

  const buildUrl = (newPage: number) => {
    const params = new URLSearchParams({
      page: String(newPage),
      ...(categoryId && { categoryId }),
      ...(keyword && { keyword }),
      ...(sort && { sort }),
    });

    return `/?${params.toString()}`;
  };

  return (
    <>
      {/* Products Grid */}
      <div
        className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
        "
      >
        {products ? products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        )) : (
          <div>There are no products</div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <ProductPagination
          currentPage={page}
          totalPages={pagination.totalPages}
          buildUrl={buildUrl}
        />
      )}
    </>
  );
}