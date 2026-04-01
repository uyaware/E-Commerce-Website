import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star20SolidIcon } from "@/components/icons/heroicons-star-20-solid";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
    avatar: string;
  };
}

export default function ProductReviews({
  reviews,
}: {
  reviews: Review[];
}) {
  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-muted-foreground">
        There are no reviews
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="px-5">
            <div className="flex gap-4 items-center">
              {/* Avatar */}
              <Avatar>
                <AvatarImage src={review.user.avatar} />
                <AvatarFallback>
                  {review.user.fullName?.[0]}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 space-y-2">
                {/* Top Row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">
                      {review.user.fullName}
                    </p>

                    <span className="text-sm text-muted-foreground">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star20SolidIcon className="w-4" />
                    <span className="text-sm font-medium">
                      {review.rating}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}