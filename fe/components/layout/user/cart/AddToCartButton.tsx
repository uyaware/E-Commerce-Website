"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Minus, Plus } from "lucide-react";

interface Props {
  productId: number;
  maxQuantity: number;
  showQuantitySelector?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export default function AddToCartButton({
  productId,
  maxQuantity,
  showQuantitySelector = false,
  className,
  size = "default",
  disabled,
}: Props) {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  function increase() {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    }
  }

  function decrease() {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }

  async function handleAddToCart() {
    if (!user) {
      toast.error("Please sign in before adding to cart");
      router.push("/sign-in");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/cart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success("Added to cart successfully");

      setUser({
        ...user,
        cartQuantity: data.data.cartQuantity,
      });

      setQuantity(1);
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 w-full">
      {showQuantitySelector && (
        <div className="flex items-center w-fit rounded-lg border overflow-hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={decrease}
            disabled={quantity <= 1}
            className="rounded-none h-10 w-10"
          >
            <Minus />
          </Button>

          <input
            type="number"
            value={quantity}
            min={1}
            max={maxQuantity}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1 && value <= maxQuantity) {
                setQuantity(value);
              }
            }}
            className="w-14 h-10 text-center font-semibold outline-none border-x bg-background"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={increase}
            disabled={quantity >= maxQuantity}
            className="rounded-none h-10 w-10"
          >
            <Plus />
          </Button>
        </div>
      )}

      <Button
        size={size}
        onClick={handleAddToCart}
        disabled={disabled || loading}
        className="w-full"
      >
        {loading ? "Adding..." : "Add to cart"}
      </Button>
    </div>
  );
}
