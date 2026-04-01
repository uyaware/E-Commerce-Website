import GridProductSkeletons from "@/components/layout/user/product/GridProductSkeletons";
import ProductsSection from "@/components/layout/user/product/ProductsSection";
import { Suspense } from "react";

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    keyword?: string;
    sort?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const categoryId = params.categoryId;
  const keyword = params.keyword;
  const sort = params.sort;

  return (
    <main className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Our Products</h1>

      <Suspense key={`${page}-${categoryId}-${keyword}-${sort}`} fallback={<GridProductSkeletons />}>
        <ProductsSection
          page={page}
          categoryId={categoryId}
          keyword={keyword}
          sort={sort}
        />
      </Suspense>
    </main>
  );
}
