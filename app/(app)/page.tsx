import { query } from "@/lib/db";
import { crearBono, registrarEntreno } from "@/app/actions";

export const dynamic = "force-dynamic";

type Bono = {
  id: number;
  total_sesiones: number;
  sesiones_usadas: number;
};

async function getBonoActivo(): Promise<Bono | null> {
  const { rows } = await query<Bono>(
    `select id, total_sesiones, sesiones_usadas
     from bonos
     where activo = true
     order by creado_en desc
     limit 1`,
  );
  return rows[0] ?? null;
}

export default async function HomePage() {
  const bono = await getBonoActivo();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      {bono ? (
        <>
          <p className="text-sm text-zinc-500">Sesiones restantes</p>
          <p className="text-6xl font-semibold text-black dark:text-zinc-50">
            {bono.total_sesiones - bono.sesiones_usadas}
            <span className="text-2xl text-zinc-400">
              {" "}
              / {bono.total_sesiones}
            </span>
          </p>
          <form action={registrarEntreno.bind(null, bono.id)}>
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
          <form action={crearBono} className="flex items-center gap-3">
            <input
              type="number"
              name="totalSesiones"
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
