"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Alert } from "@/components/ui/alert";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { changePassword, type ChangePasswordState } from "@/app/(auth)/change-password/actions";

export function ChangePasswordForm({ stay = false }: { stay?: boolean }) {
  const [state, action, pending] = useActionState<ChangePasswordState, FormData>(changePassword, {});
  return (
    <form action={action} className="space-y-4">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      {state.done && <Alert tone="success">Your password has been changed.</Alert>}
      {stay && <input type="hidden" name="redirect" value="stay" />}
      <Field label="New password" htmlFor="password" hint={`At least ${MIN_PASSWORD_LENGTH} characters, with letters and numbers.`}>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={MIN_PASSWORD_LENGTH} />
      </Field>
      <Field label="Confirm new password" htmlFor="confirm">
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={MIN_PASSWORD_LENGTH} />
      </Field>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Change password"}
      </Button>
    </form>
  );
}
