import hashPassword from "@/utils/hashPassword";
import { prisma } from "./prisma-client";

export async function initData() {
  if ((await prisma.user.count()) === 0) {
    const users = await Promise.all(
      [
        {
          fullName: "Tran User1",
          email: "user1@gmail.com",
          isAdmin: false,
        },
        {
          fullName: "Nguyen User2",
          email: "user2@gmail.com",
          isAdmin: false,
        },
        {
          fullName: "Admin User",
          email: "admin@gmail.com",
          isAdmin: true,
        },
      ].map(async (user, i) => ({
        fullName: user.fullName,
        email: user.email,
        password: await hashPassword("12345678"),
        address: "Hue, Vietnam",
        phone: `090000000${i}`,
        avatar: `https://picsum.photos/id/${i + 236}/500/500`,
        isAdmin: user.isAdmin,
      })),
    );

    await prisma.user.createMany({ data: users });
  }

  if ((await prisma.category.count()) === 0) {
    await prisma.category.createMany({
      data: [
        { name: "Phone", slug: "phone" },
        { name: "Laptop", slug: "laptop" },
        { name: "Accessory", slug: "accessory" },
      ],
    });
  }

  function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  if ((await prisma.product.count()) === 0) {
    const categories = await prisma.category.findMany();

    // ===== DATA POOL =====

    const phoneModels = [
      "iPhone 15 Pro",
      "iPhone 15 Pro Max",
      "Galaxy S24",
      "Galaxy S24 Ultra",
      "Xiaomi 14T Pro",
      "Pixel 8 Pro",
      "Find X6",
    ];

    const laptopModels = [
      "MacBook Air M3",
      "MacBook Pro M3",
      "Dell XPS 15",
      "Asus ROG Strix G16",
      "HP Spectre x360",
      "Lenovo Legion 5",
    ];

    const accessoryNames = [
      "Wireless Mouse",
      "Mechanical Keyboard",
      "USB-C Charger",
      "Laptop Stand",
      "Bluetooth Headphones",
      "Phone Case",
    ];

    const storages = ["128GB", "256GB", "512GB"];
    const ramOptions = ["8GB", "16GB", "32GB"];
    const storageOptions = ["512GB SSD", "1TB SSD"];
    const gpuOptions = ["RTX 4050", "RTX 4060", "Integrated GPU"];
    const colors = ["Black", "Silver", "Blue", "Titanium", "Purple"];

    const products = Array.from({ length: 100000 }).map((_, i) => {
      const category = categories[i % categories.length];

      let name = "";
      let detailDesc = "";
      let price = 0;

      // ===== PHONE =====
      if (category.slug === "phone") {
        name = `${randomItem(phoneModels)} ${randomItem(
          storages,
        )} ${randomItem(colors)}`;

        price = 10_000_000 + Math.floor(Math.random() * 15_000_000);

        detailDesc = `
Premium smartphone with ${randomItem([
          "powerful flagship chip",
          "advanced AI camera system",
          "120Hz AMOLED display",
          "long lasting battery",
        ])}.
Comes with ${randomItem(storages)} storage.
Available in ${randomItem(colors)} color.
Perfect for photography, gaming and daily usage.
      `.trim();
      }

      // ===== LAPTOP =====
      else if (category.slug === "laptop") {
        name = `${randomItem(laptopModels)} ${randomItem(
          ramOptions,
        )} ${randomItem(storageOptions)} ${randomItem(gpuOptions)}`;

        price = 15_000_000 + Math.floor(Math.random() * 35_000_000);

        detailDesc = `
High performance laptop featuring ${randomItem([
          "latest generation processor",
          "ultra thin and lightweight design",
          "RGB backlit keyboard",
          "high refresh rate display",
        ])}.
Equipped with ${randomItem(ramOptions)} RAM and ${randomItem(storageOptions)}.
Ideal for developers, designers and gamers.
      `.trim();
      }

      // ===== ACCESSORY =====
      else {
        name = `${randomItem(accessoryNames)} ${randomItem(colors)}`;

        price = 200_000 + Math.floor(Math.random() * 3_000_000);

        detailDesc = `
High quality accessory designed for durability and convenience.
Compatible with various devices.
Compact design and premium materials.
      `.trim();
      }

      const sold = Math.floor(Math.random() * 500);

      const ratingCount = Math.floor(sold * (0.3 + Math.random() * 0.5));

      const rating =
        ratingCount === 0 ? 0 : Number((4 + Math.random()).toFixed(1));

      return {
        name,
        price,
        image: `https://picsum.photos/id/${i + 30}/500/500`,
        detailDesc,
        quantity: 10 + Math.floor(Math.random() * 50),
        sold,
        categoryId: category.id,
        rating,
        ratingCount,
      };
    });

    await prisma.product.createMany({ data: products });
  }

  if ((await prisma.order.count()) === 0) {
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();

    for (let i = 0; i < 10; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const order = await prisma.order.create({
        data: {
          userId: randomUser.id,
          totalPrice: 0,
          status: ["pending", "paid", "shipped", "delivered", "cancelled"][
            i % 5
          ] as any,
        },
      });

      let total = 0;
      const itemCount = 1 + Math.floor(Math.random() * 4);

      for (let j = 0; j < itemCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)];

        const quantity = 1 + Math.floor(Math.random() * 3);
        total += product.price * quantity;

        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            price: product.price,
            quantity,
          },
        });
      }

      await prisma.order.update({
        where: { id: order.id },
        data: { totalPrice: total },
      });
    }
  }

  if ((await prisma.review.count()) === 0) {
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();

    const usedPairs = new Set<string>();
    let created = 0;

    while (created < 200) {
      const user = users[Math.floor(Math.random() * users.length)];
      const product = products[Math.floor(Math.random() * products.length)];

      const key = `${user.id}-${product.id}`;
      if (usedPairs.has(key)) continue;

      usedPairs.add(key);

      await prisma.review.create({
        data: {
          userId: user.id,
          productId: product.id,
          rating: 3 + Math.floor(Math.random() * 3),
          comment: [
            "Excellent product!",
            "Very good quality.",
            "Worth the price.",
            "Highly recommend.",
            "Will buy again.",
            "Five stars!",
            "Satisfied with this purchase.",
          ][Math.floor(Math.random() * 7)],
        },
      });

      created++;
    }
  }

  console.log("DATA SEEDED SUCCESSFULLY");
}
