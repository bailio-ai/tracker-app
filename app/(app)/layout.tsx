import Link from "next/link";
import { logout } from "@/app/actions";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
        <Link href="/" className="font-semibold text-black dark:text-zinc-50">
          Bono Entrenos
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/historial"
            className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Historial
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Salir
            </button>
          </form>
        </nav>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
