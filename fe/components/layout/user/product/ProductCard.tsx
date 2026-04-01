import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star20SolidIcon } from "@/components/icons/heroicons-star-20-solid";
import AddToCartButton from "../cart/AddToCartButton";

export default function ProductCard({ product }: { product: any }) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl hover:-translate-y-2 transition py-0 rounded-xl">
      <Link href={`/products/${product.id}`} className="mt-0">
        <div className="relative overflow-hidden aspect-square">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            width={500}
            height={500}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </Link>

      <CardContent className="px-4 flex flex-col flex-1">
        <Link href={`/products/${product.id}`}>
          <h2 className="font-semibold line-clamp-2 hover:text-side">
            {product.name}
          </h2>
        </Link>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Sold {product.sold}</span>
          <div className="flex items-center justify-start gap-1">
            <Star20SolidIcon className="inline w-6" />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({product.ratingCount})
            </span>
          </div>
        </div>

        <p className="text-2xl font-bold mt-4">
          {product.price.toLocaleString()}₫
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <AddToCartButton
          productId={product.id}
          maxQuantity={product.quantity}
        />
      </CardFooter>
    </Card>
  );
}
