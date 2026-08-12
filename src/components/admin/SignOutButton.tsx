"use client";

import { useFormStatus } from "react-dom";
import { Loader2, LogOut } from "lucide-react";
import { signOutAction } from "@/actions/auth";

function Submit({
  className,
  label,
  iconOnly,
}: {
  className: string;
  label: string;
  iconOnly: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
    >
      {pending ? (
        <Loader2 className={iconOnly ? "w-5 h-5 animate-spin" : "w-4 h-4 animate-spin"} />
      ) : (
        <LogOut className={iconOnly ? "w-5 h-5" : "w-4 h-4"} />
      )}
      {!iconOnly && label}
    </button>
  );
}

/**
 * Sign out via a POST to a server action, not a link to /api/auth/signout —
 * see the note on signOutAction.
 */
export function SignOutButton({
  locale,
  label,
  className,
  iconOnly = false,
}: {
  locale: string;
  label: string;
  className: string;
  iconOnly?: boolean;
}) {
  return (
    <form action={signOutAction} className={iconOnly ? "flex" : "block"}>
      <input type="hidden" name="locale" value={locale} />
      <Submit className={className} label={label} iconOnly={iconOnly} />
    </form>
  );
}
