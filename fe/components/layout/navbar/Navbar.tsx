import Link from "next/link";
import { buttonVariants } from "../../ui/button";
import { ModeToggle } from "./ModeToggle";
import { getCategories } from "@/lib/api";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ShoppingCart } from "lucide-react";
import { DropdownMenuAvatar } from "./DropdownMenuAvatar";
import NavbarRight from "./NavbarRight";
import SearchBar from "./SearchBar";

interface Category {
  id: number;
  name: string;
  slug: string;
}


export default async function Navbar() {
  const categories: Category[] = await getCategories();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-6">
          <Link href="/">
            <h1 className="text-3xl font-bold">
              Something<span className="text-blue-500">Cool</span>
            </h1>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={buttonVariants({ variant: "ghost" })}
                >
                  Category
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <ul className="grid w-30 gap-1">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/?categoryId=${category.id}`}
                            className="block select-none rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            {category.name}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link
            href="/?sort=rating_desc"
            className={buttonVariants({ variant: "ghost" })}
          >
            Top Rating
          </Link>

          <Link
            href="/?sort=sold_desc"
            className={buttonVariants({ variant: "ghost" })}
          >
            Best Seller
          </Link>
        </div>

        {/* Middle (search) */}
        <SearchBar />

        {/* Right side */}
        <NavbarRight />
        
      </div>
    </nav>
  );
}
