"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, changePasswordSchema, type ProfileInput } from "@/lib/validators";
import { updateProfileAction, changePasswordAction, deleteAccountAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
      phone: "",
      image: session?.user?.image ?? "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onProfileSubmit = async (data: ProfileInput) => {
    const result = await updateProfileAction(data);
    if (result.success) {
      toast.success("Profile updated");
      await update();
    } else toast.error(result.error);
  };

  const onPasswordSubmit = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    const result = await changePasswordAction(data);
    if (result.success) {
      toast.success("Password changed");
      passwordForm.reset();
    } else toast.error(result.error);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    await deleteAccountAction();
    router.push("/");
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Profile Settings</h1>
      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 max-w-md">
            <div><Label>Name</Label><Input {...profileForm.register("name")} /></div>
            <div><Label>Email</Label><Input type="email" {...profileForm.register("email")} /></div>
            <div><Label>Phone</Label><Input {...profileForm.register("phone")} /></div>
            <div><Label>Profile Photo URL</Label><Input {...profileForm.register("image")} placeholder="https://..." /></div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
            <div><Label>Current Password</Label><Input type="password" {...passwordForm.register("currentPassword")} /></div>
            <div><Label>New Password</Label><Input type="password" {...passwordForm.register("newPassword")} /></div>
            <div><Label>Confirm Password</Label><Input type="password" {...passwordForm.register("confirmPassword")} /></div>
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="border-red-200">
        <CardHeader><CardTitle className="text-red-600">Danger Zone</CardTitle></CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDelete}>Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
