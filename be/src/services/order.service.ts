import { prisma } from "@/config/prisma-client";
import { handleGetCartQuantity } from "./cart.service";

export async function handlePlaceOrder(userId: number) {
  return await prisma.$transaction(async (tx) => {
    // Lấy cart + items
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Kiểm tra stock
    for (const item of cart.items) {
      if (item.quantity > item.product.quantity) {
        throw new Error(
          `Product "${item.product.name}" does not have enough stock`,
        );
      }
    }

    // Tính totalPrice
    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    // Tạo Order
    const order = await tx.order.create({
      data: {
        userId,
        totalPrice,
        status: "pending",
      },
    });

    // Tạo OrderItems
    for (const item of cart.items) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          price: item.product.price,
          quantity: item.quantity,
        },
      });

      //  Trừ stock + tăng sold
      await tx.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
          sold: {
            increment: item.quantity,
          },
        },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return {
      orderId: order.id,
      totalPrice,
      cartQuantity: 0,
    };
  });
}

export async function handleGetMyOrders(userId: number) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      totalPrice: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  return orders;
}

export async function handleGetOrderDetail(
  userId: number,
  orderId: number,
) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}