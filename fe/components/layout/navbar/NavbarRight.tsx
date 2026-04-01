"use client";

import Link from "next/link";
import { buttonVariants } from "../../ui/button";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenuAvatar } from "./DropdownMenuAvatar";
import { ModeToggle } from "./ModeToggle";

export default function NavbarRight() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <Link href="/cart" className="relative text-lg">
            <ShoppingCart className="size-8" />

            {user.cartQuantity > 0 && (
              <span className="absolute -top-3 right-0 bg-foreground text-background text-xs font-bold px-1.5 py-0.5 rounded-full">
                {user.cartQuantity}
              </span>
            )}
          </Link>

          <DropdownMenuAvatar email={user.email} avatar={user.avatar} />

          <ModeToggle />
        </>
      ) : (
        <>
          <Link href="/sign-in" className={buttonVariants()}>
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className={buttonVariants({ variant: "secondary" })}
          >
            Sign up
          </Link>
        </>
      )}
    </div>
  );
}