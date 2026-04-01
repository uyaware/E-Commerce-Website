"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface CartItem {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

export default function CartPageClient({
  initialItems,
}: {
  initialItems: CartItem[];
}) {
  const { setUser } = useAuth();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(1);

  const [items, setItems] = useState<CartItem[]>(initialItems);

  async function handleUpdate(cartItemId: number) {
    try {
      const res = await fetch("http://localhost:8000/cart", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId,
          quantity: editQuantity,
        }),
      });

      const data = await res.json();

      if (!data.ok) throw new Error(data.message);

      setItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: editQuantity } : item,
        ),
      );

      // ⭐ CẬP NHẬT NAVBAR
      setUser((prev) =>
        prev
          ? {
              ...prev,
              cartQuantity: data.data.cartQuantity,
            }
          : prev,
      );

      setEditingId(null);
      toast.success("Updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDelete(cartItemId: number) {
    try {
      const res = await fetch("http://localhost:8000/cart", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId,
        }),
      });

      const data = await res.json();

      if (!data.ok) throw new Error(data.message);

      setItems((prev) => prev.filter((item) => item.id !== cartItemId));

      // ⭐ CẬP NHẬT NAVBAR
      setUser((prev) =>
        prev
          ? {
              ...prev,
              cartQuantity: data.data.cartQuantity,
            }
          : prev,
      );

      toast.success("Item removed");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  async function handlePlaceOrder() {
    try {
      const res = await fetch("http://localhost:8000/orders", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!data.ok) throw new Error(data.message);

      // clear local cart
      setItems([]);

      // update navbar
      setUser((prev) =>
        prev
          ? {
              ...prev,
              cartQuantity: 0,
            }
          : prev,
      );

      toast.success("Order placed successfully!");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT - Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.length === 0 && (
            <p className="text-muted-foreground">Your cart is empty.</p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 border rounded-xl p-4 items-center"
            >
              {/* Image */}
              <div className="relative w-24 h-24">
                <Link href={`/products/${item.productId}`}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </Link>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="font-semibold">
                  <Link href={`/products/${item.productId}`}>{item.name}</Link>
                </h2>
                <p className="text-muted-foreground">
                  {item.price.toLocaleString()}₫
                </p>

                {/* Quantity */}
                {editingId === item.id ? (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="number"
                      min={1}
                      max={item.stock}
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(Number(e.target.value))}
                      className="border px-2 py-1 w-20 rounded"
                    />

                    <Button size="sm" onClick={() => handleUpdate(item.id)}>
                      Update
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mt-3">
                    <span>Quantity: {item.quantity}</span>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditQuantity(item.quantity);
                      }}
                      className="hover:cursor-pointer"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="text-right space-y-3">
                <p className="font-semibold">
                  {(item.price * item.quantity).toLocaleString()}₫
                </p>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="hover:cursor-pointer"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - Order Summary */}
        <div className="border rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{subtotal.toLocaleString()}₫</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <hr className="mb-4" />

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>{subtotal.toLocaleString()}₫</span>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={items.length === 0}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
