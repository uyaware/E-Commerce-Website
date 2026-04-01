"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  _count: {
    items: number;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("http://localhost:8000/orders", {
        credentials: "include",
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.message);

      setOrders(data.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "paid":
        return "bg-blue-100 text-blue-600";
      case "shipped":
        return "bg-purple-100 text-purple-600";
      case "delivered":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {loading && <p>Loading...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-muted-foreground">You have no orders yet.</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block border rounded-xl p-6 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order._count.items} items
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {order.totalPrice.toLocaleString()}₫
                </p>
                <span
                  className={`text-xs px-3 py-1 rounded-full capitalize ${getStatusColor(
                    order.status,
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}