import CartPageClient from "@/components/layout/user/cart/CartPageClient";
import { getCart } from "@/lib/api";

export default async function CartPage() {
  const cartItems = await getCart();

  return <CartPageClient initialItems={cartItems} />;
}