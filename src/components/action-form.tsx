"use client";
import { useActionState, type ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export type FormState = { ok?: boolean; error?: string; message?: string; details?: string[] };

/** A form bound to a server action that reports success / error inline. */
export function ActionForm({
  action,
  children,
  submitLabel = "Save",
  pendingLabel = "Saving…",
  className,
  encType,
  submitVariant = "primary",
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  children: ReactNode;
  submitLabel?: string;
  pendingLabel?: string;
  className?: string;
  encType?: "multipart/form-data";
  submitVariant?: "primary" | "secondary" | "danger" | "success";
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});
  return (
    <form action={formAction} className={className ?? "space-y-4"} encType={encType}>
      {state.error && (
        <Alert tone="danger" title={state.error}>
          {state.details && state.details.length > 0 && (
            <ul className="list-disc pl-4 text-xs">{state.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
          )}
        </Alert>
      )}
      {state.ok && state.message && (
        <Alert tone="success" title={state.message}>
          {state.details && state.details.length > 0 && (
            <ul className="list-disc pl-4 text-xs">{state.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
          )}
        </Alert>
      )}
      {children}
      <Button type="submit" variant={submitVariant} disabled={pending}>
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}

/** Small button form for one-click server actions (with optional confirmation). */
export function ConfirmButton({
  action,
  fields,
  label,
  confirm,
  variant = "secondary",
  size = "sm",
}: {
  action: (data: FormData) => Promise<void>;
  fields: Record<string, string>;
  label: ReactNode;
  confirm?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <Button type="submit" variant={variant} size={size}>
        {label}
      </Button>
    </form>
  );
}
