import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardBody } from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/change-password-form";
import { getCurrentProfile, homeFor } from "@/lib/auth";

export const metadata: Metadata = { title: "Change password" };

export default async function ChangePasswordPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!profile.force_password_change) redirect(homeFor(profile.role));
  return (
    <Card>
      <CardBody className="space-y-5 p-6">
        <div>
          <h2 className="text-lg font-semibold">Choose a new password</h2>
          <p className="text-sm text-muted">
            Welcome, {profile.first_name || profile.username}. Before you continue, replace your temporary password with
            one only you know.
          </p>
        </div>
        <ChangePasswordForm />
        <form action="/auth/signout" method="post" className="text-center">
          <button type="submit" className="text-sm text-muted underline-offset-2 hover:underline">
            Sign out
          </button>
        </form>
      </CardBody>
    </Card>
  );
}
