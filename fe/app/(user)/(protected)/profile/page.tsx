"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    avatar: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);

  // Redirect nếu chưa login
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:8000/users/profile", {
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/sign-in");
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setForm({
          fullName: data.data.fullName ?? "",
          phone: data.data.phone ?? "",
          address: data.data.address ?? "",
          avatar: data.data.avatar ?? "",
        });
      } catch (error: any) {
        console.log(error);
        toast.error("Cannot load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleUpdateProfile() {
    try {
      const res = await fetch("http://localhost:8000/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Profile updated successfully");

      setUser((prev) =>
        prev
          ? {
              ...prev,
              avatar: data.data.avatar,
            }
          : prev,
      );
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  }

  async function handleChangePassword() {
    try {
      const res = await fetch("http://localhost:8000/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Password changed successfully");

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-[200px_1fr] gap-8 ">
            {/* LEFT SIDE - AVATAR */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-40 h-40">
                <AvatarImage src={form.avatar} />
                <AvatarFallback>{form.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>

              <Input
                placeholder="Avatar URL"
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              />
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email ?? ""} disabled />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
            </div>
            
          </div>
          <Button onClick={handleUpdateProfile} className="w-full mt-6">
            Update Profile
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Old Password</Label>
            <Input
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  oldPassword: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
            />
          </div>

          <Button
            variant="destructive"
            onClick={handleChangePassword}
            className="w-full"
          >
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
