import { prisma } from "@/config/prisma-client";

export async function handleGetCartQuantity(userId: number) {
  const result = await prisma.cartItem.aggregate({
    where: {
      cart: {
        userId: userId,
      },
    },
    _sum: {
      quantity: true,
    },
  });

  return result._sum.quantity ?? 0;
}

export async function handleAddToCart(
  userId: number,
  productId: number,
  quantity: number,
) {
  // kiểm tra product tồn tại
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.quantity < quantity) {
    throw new Error("Not enough stock");
  }

  // tìm hoặc tạo cart
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  // kiểm tra cart item đã tồn tại chưa
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    // update quantity
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  } else {
    // create new cart item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  //trả về tổng quantity
  return await handleGetCartQuantity(userId);
}

export async function handleGetCart(userId: number) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) return [];

  return cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    image: item.product.image,
    price: item.product.price,
    quantity: item.quantity,
    stock: item.product.quantity,
  }));
}

export async function handleUpdateCartItem(
  userId: number,
  cartItemId: number,
  quantity: number,
) {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: {
        userId,
      },
    },
    include: {
      product: true,
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  if (quantity > cartItem.product.quantity) {
    throw new Error("Not enough stock");
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  return await handleGetCartQuantity(userId);
}

export async function handleDeleteCartItem(userId: number, cartItemId: number) {
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: {
        userId,
      },
    },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return await handleGetCartQuantity(userId);
}
