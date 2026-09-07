import { getRecentSessions } from "@/lib/db";
import { EFFORT_LEVELS } from "@/components/EffortSelector";

function effortDisplay(effort: number | null) {
  if (effort === null) return null;
  return EFFORT_LEVELS.find((level) => level.value === effort) ?? null;
}

export default async function RecentSessions({
  bundleId,
}: {
  bundleId: number;
}) {
  const sessions = await getRecentSessions(bundleId, 5);

  if (sessions.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Aún no hay entrenos registrados en este bono.
      </p>
    );
  }

  return (
    <ul className="flex w-full max-w-sm flex-col gap-2">
      {sessions.map((session) => {
        const effort = effortDisplay(session.effort);

        return (
          <li
            key={session.id}
            className="flex items-center gap-3 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
          >
            <span className="text-zinc-500">
              {new Date(session.session_date).toLocaleDateString("es-ES")}
            </span>
            {effort && (
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${effort.color}`}
              >
                {effort.emoji}
              </span>
            )}
            {session.note && (
              <span className="truncate text-zinc-600 dark:text-zinc-400">
                {session.note}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
