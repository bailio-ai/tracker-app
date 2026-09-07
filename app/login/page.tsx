"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <form
        action={formAction}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950"
      >
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
          Bono Entrenos
        </h1>
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          autoFocus
          required
          className="rounded-lg border border-black/10 bg-transparent px-4 py-2 text-black outline-none focus:border-black/30 dark:border-white/10 dark:text-zinc-50"
        />
        {state?.error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
