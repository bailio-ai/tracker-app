import { listBundlesWithSessions } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HistorialPage() {
  const bundles = await listBundlesWithSessions();

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-10">
      <h1 className="text-lg font-semibold text-black dark:text-zinc-50">
        Historial de bonos
      </h1>
      <ul className="flex flex-col gap-4">
        {bundles.map((bundle) => (
          <li
            key={bundle.id}
            className="flex flex-col gap-2 rounded-lg border border-black/10 px-4 py-3 dark:border-white/10"
          >
            <div className="flex items-center justify-between">
              <span>
                {new Date(bundle.start_date).toLocaleDateString("es-ES")}
              </span>
              <span>{bundle.price} € · {bundle.total_sessions} sesiones</span>
              <span
                className={
                  bundle.active ? "text-green-600" : "text-zinc-400"
                }
              >
                {bundle.active ? "Activo" : "Completado"}
              </span>
            </div>
            {bundle.sessions.length > 0 && (
              <ul className="flex flex-col gap-1 pl-4 text-sm text-zinc-600 dark:text-zinc-400">
                {bundle.sessions.map((session) => (
                  <li key={session.id} className="flex items-center gap-2">
                    <span>
                      {new Date(session.session_date).toLocaleDateString(
                        "es-ES",
                      )}
                    </span>
                    {session.effort !== null && (
                      <span>· esfuerzo {session.effort}</span>
                    )}
                    {session.note && <span>· {session.note}</span>}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {bundles.length === 0 && (
        <p className="text-zinc-500">Todavía no hay bonos registrados.</p>
      )}
    </div>
  );
}
