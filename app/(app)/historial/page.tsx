import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type BonoHistorial = {
  id: number;
  total_sesiones: number;
  sesiones_usadas: number;
  activo: boolean;
  creado_en: string;
};

export default async function HistorialPage() {
  const { rows: bonos } = await query<BonoHistorial>(
    `select id, total_sesiones, sesiones_usadas, activo, creado_en
     from bonos
     order by creado_en desc`,
  );

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-10">
      <h1 className="text-lg font-semibold text-black dark:text-zinc-50">
        Historial de bonos
      </h1>
      <ul className="flex flex-col gap-3">
        {bonos.map((bono) => (
          <li
            key={bono.id}
            className="flex items-center justify-between rounded-lg border border-black/10 px-4 py-3 dark:border-white/10"
          >
            <span>{new Date(bono.creado_en).toLocaleDateString("es-ES")}</span>
            <span>
              {bono.sesiones_usadas} / {bono.total_sesiones} sesiones
            </span>
            <span
              className={bono.activo ? "text-green-600" : "text-zinc-400"}
            >
              {bono.activo ? "Activo" : "Completado"}
            </span>
          </li>
        ))}
      </ul>
      {bonos.length === 0 && (
        <p className="text-zinc-500">Todavía no hay bonos registrados.</p>
      )}
    </div>
  );
}
