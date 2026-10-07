import type { Metadata } from "next";
import { Card, CardBody } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

const NOTICES: Record<string, string> = {
  disabled: "This account is disabled. Contact your teacher or the administrator.",
  signedout: "You have been signed out.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  const error = typeof sp.error === "string" ? NOTICES[sp.error] : undefined;
  return (
    <Card>
      <CardBody className="space-y-5 p-6">
        <div>
          <h2 className="text-lg font-semibold">Sign in</h2>
          <p className="text-sm text-muted">Use the username and password given by your school.</p>
        </div>
        <LoginForm next={next} notice={error} />
        <p className="text-xs text-muted">
          First time here? Sign in with your temporary password — you will be asked to choose a new one.
        </p>
      </CardBody>
    </Card>
  );
}
