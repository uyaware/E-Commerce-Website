import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden py-0 rounded-xl">
      {/* Image */}
      <div className="aspect-square">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content */}
      <CardContent className="px-4 space-y-3">  
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3 mt-4" />
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}