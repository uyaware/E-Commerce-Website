"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: number;
  price: number;
  quantity: number;
  productId: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrder();
  }, []);

  async function fetchOrder() {
    try {
      const res = await fetch(`http://localhost:8000/orders/${params.id}`, {
        credentials: "include",
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.message);

      setOrder(data.data);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  if (!order) return <div className="p-10">Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 pl-0"
        onClick={() => router.push("/orders")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <h1 className="text-3xl font-bold mb-6">Order #{order.id}</h1>

      <div className="mb-6 space-y-2">
        <p>
          Status: <span className="capitalize font-medium">{order.status}</span>
        </p>
        <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="space-y-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-6 border rounded-xl p-4">
            <div className="relative w-24 h-24">
              <Link href={`/products/${item.productId}`}>
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </Link>
            </div>

            <div className="flex-1">
              <Link href={`/products/${item.productId}`}>
                <h2 className="font-semibold">{item.product.name}</h2>
              </Link>

              <p>Price: {item.price.toLocaleString()}₫</p>
              <p>Quantity: {item.quantity}</p>
            </div>

            <div className="font-semibold">
              {(item.price * item.quantity).toLocaleString()}₫
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right text-xl font-bold">
        Total: {order.totalPrice.toLocaleString()}₫
      </div>

      {/* Optional: Cancel button */}
      {order.status === "pending" && (
        <div className="mt-6 text-right">
          <Button variant="destructive">Cancel Order</Button>
        </div>
      )}
    </div>
  );
}
