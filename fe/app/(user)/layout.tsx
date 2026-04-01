import Navbar from "@/components/layout/navbar/Navbar";
import { getCurrentUser } from "@/lib/api";
import { AuthProvider } from "@/contexts/AuthContext";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <AuthProvider user={user}>
      <Navbar />
      <div className="pt-15">{children}</div>
    </AuthProvider>
  );
}
