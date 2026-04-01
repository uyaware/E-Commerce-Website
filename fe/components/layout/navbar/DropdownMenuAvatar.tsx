"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheckIcon, History, LogOutIcon } from "lucide-react";

interface Props {
  email: string;
  avatar?: string;
}

export function DropdownMenuAvatar({ email, avatar }: Props) {
  const router = useRouter();
  const { setUser } = useAuth(); 

  async function handleLogout() {
    try {
      const res = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      setUser(null); // 🔥 reset ngay lập tức

      toast.success("Logout successfully");

      router.push("/");
      router.refresh(); // để server layout sync lại
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full p-0 h-9 w-9"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatar} />
            <AvatarFallback>
              {email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <BadgeCheckIcon />
              <span>Account</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/orders">
              <History />
              <span>Orders history</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className="flex items-center gap-2"
        >
          <LogOutIcon className="text-destructive" />
          <span className="text-destructive">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}