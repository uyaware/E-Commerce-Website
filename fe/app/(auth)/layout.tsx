import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if(user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute top-5 left-5">
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          <ArrowLeft className="size-4" />
          Go back
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  );
}
