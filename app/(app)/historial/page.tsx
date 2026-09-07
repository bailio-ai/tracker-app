import { listBundlesWithSessions, type Session } from "@/lib/db";
import { getEffortLevel } from "@/components/EffortSelector";

export const dynamic = "force-dynamic";

function sortSessionsDescending(sessions: Session[]) {
  return [...sessions].sort((a, b) => {
    if (a.session_date !== b.session_date) {
      return a.session_date < b.session_date ? 1 : -1;
    }
    return b.id - a.id;
  });
}

export default async function HistorialPage() {
  const bundles = await listBundlesWithSessions();

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-10">
      <h1 className="text-lg font-semibold text-black dark:text-zinc-50">
        Historial de bonos
      </h1>
      <ul className="flex flex-col gap-4">
        {bundles.map((bundle) => {
          const sessions = sortSessionsDescending(bundle.sessions);

          return (
            <li
              key={bundle.id}
              className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-950"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-black dark:text-zinc-50">
                    {new Date(bundle.start_date).toLocaleDateString("es-ES")}
                  </span>
                  {bundle.active && (
                    <span className="rounded-full bg-green-600/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:bg-green-400/10 dark:text-green-400">
                      Activo
                    </span>
                  )}
                </div>
                <span className="text-sm text-zinc-500">
                  {bundle.price} € · {bundle.sessions.length} de{" "}
                  {bundle.total_sessions} sesiones
                </span>
              </div>
              {sessions.length > 0 && (
                <ul className="flex flex-col gap-1.5 text-sm">
                  {sessions.map((session) => {
                    const effort = getEffortLevel(session.effort);

                    return (
                      <li
                        key={session.id}
                        className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400"
                      >
                        <span className="text-zinc-500">
                          {new Date(session.session_date).toLocaleDateString(
                            "es-ES",
                          )}
                        </span>
                        {effort && (
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${effort.color}`}
                          >
                            {effort.emoji}
                          </span>
                        )}
                        {session.note && (
                          <span className="truncate">{session.note}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      {bundles.length === 0 && (
        <p className="text-zinc-500">Todavía no hay bonos registrados.</p>
      )}
    </div>
  );
}
