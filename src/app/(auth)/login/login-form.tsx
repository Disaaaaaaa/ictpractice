"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Alert } from "@/components/ui/alert";
import { signIn, type LoginState } from "./actions";

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  return (
    <form action={action} className="space-y-4">
      {notice && !state.error && <Alert tone="warning">{notice}</Alert>}
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Username" htmlFor="username">
        <Input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          defaultValue={state.username}
          required
          autoFocus
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
