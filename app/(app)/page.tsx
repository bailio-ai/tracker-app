import { createNewBundle, getRemainingSessions, logSession } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const state = await getRemainingSessions();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      {state.status === "active" ? (
        <>
          <p className="text-sm text-zinc-500">Sesiones restantes</p>
          <p className="text-6xl font-semibold text-black dark:text-zinc-50">
            {state.remaining}
            <span className="text-2xl text-zinc-400">
              {" "}
              / {state.totalSessions}
            </span>
          </p>
          <form
            action={logSession}
            className="flex flex-col items-center gap-3"
          >
            <select
              name="effort"
              defaultValue="3"
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-center dark:border-white/10"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  Esfuerzo: {value}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="note"
              placeholder="Nota (opcional)"
              className="w-64 rounded-lg border border-black/10 bg-transparent px-3 py-2 text-center dark:border-white/10"
            />
            <button
              type="submit"
              className="rounded-full bg-black px-8 py-3 font-medium text-white dark:bg-white dark:text-black"
            >
              Registrar entreno
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="text-zinc-600 dark:text-zinc-400">
            No tienes ningún bono activo.
          </p>
          <form
            action={createNewBundle}
            className="flex items-center gap-3"
          >
            <input
              type="number"
              name="price"
              placeholder="Precio"
              min={0}
              step="0.01"
              required
              className="w-24 rounded-lg border border-black/10 bg-transparent px-3 py-2 text-center dark:border-white/10"
            />
            <input
              type="date"
              name="startDate"
              required
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-center dark:border-white/10"
            />
            <input
              type="number"
              name="totalSessions"
              min={1}
              defaultValue={10}
              className="w-20 rounded-lg border border-black/10 bg-transparent px-3 py-2 text-center dark:border-white/10"
            />
            <button
              type="submit"
              className="rounded-full bg-black px-6 py-2 font-medium text-white dark:bg-white dark:text-black"
            >
              Crear bono
            </button>
          </form>
        </>
      )}
    </div>
  );
}
