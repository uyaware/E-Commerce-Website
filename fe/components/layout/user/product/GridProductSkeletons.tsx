import ProductCardSkeleton from "./ProductCardSkeleton";

export default function GridProductSkeletons() {
  return (
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
      {Array.from({ length: 10 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}