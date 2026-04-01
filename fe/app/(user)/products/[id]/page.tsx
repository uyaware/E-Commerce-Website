// app/products/[id]/page.tsx

import Image from "next/image";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Star20SolidIcon } from "@/components/icons/heroicons-star-20-solid";
import ProductReviews from "@/components/layout/user/product/ProductReviews";
import { getProductById } from "@/lib/api";
import Link from "next/link";
import AddToCartButton from "@/components/layout/user/cart/AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return notFound();

  return (
    <div className="py-10 space-y-10">
      {/* ===== Top Section ===== */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Category */}
          <Link href={`/?categoryId=${product.category.id}`}>
            <Badge variant="secondary" className="cursor-pointer mb-4 text-sm">
              {product.category.name}
            </Badge>
          </Link>

          {/* Rating + Sold + Stock */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star20SolidIcon className="w-5" />
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({product.ratingCount})
              </span>
            </div>

            <span className="text-muted-foreground">Sold: {product.sold}</span>

            <span
              className={`font-medium ${
                product.quantity > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.quantity > 0
                ? `In stock: ${product.quantity}`
                : "Out of stock"}
            </span>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-primary">
            {product.price.toLocaleString()}₫
          </p>

          <Separator />

          <p className="text-muted-foreground leading-relaxed">
            {product.detailDesc}
          </p>

          <AddToCartButton
            productId={product.id}
            maxQuantity={product.quantity}
            showQuantitySelector
            size="lg"
          />
        </div>
      </div>

      {/* ===== Reviews Section ===== */}
      <Tabs defaultValue="reviews">
        <TabsList>
          <TabsTrigger value="reviews">
            Reviews ({product.reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <ProductReviews reviews={product.reviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
