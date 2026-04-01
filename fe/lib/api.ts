import { cookies } from "next/headers";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = "http://backend:8000";


export async function getProductById(id: string) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.data.product;
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await res.json();
  return result.data;
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      console.log("AUTH ERROR:", data.message);
      return null;
    }

    return data.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getCart() {
  const cookieStore = await cookies();

  const res = await fetch(`${BASE_URL}/cart`, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!data.ok) {
    return [];
  }

  return data.data;
}

