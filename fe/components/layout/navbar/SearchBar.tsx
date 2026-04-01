"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    params.set("keyword", keyword);
    params.set("page", "1");

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="pl-9 w-64"
        />
      </form>
    </div>
  );
}