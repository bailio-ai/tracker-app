import { logSession } from "@/app/actions";
import EffortSelector from "@/components/EffortSelector";

function todayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function SessionForm() {
  return (
    <form action={logSession} className="flex flex-col items-center gap-4">
      <input
        type="date"
        name="date"
        defaultValue={todayLocalDate()}
        className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-center dark:border-white/10"
      />
      <EffortSelector />
      <input
        type="text"
        name="note"
        placeholder="Algo que recordar de este entreno (opcional)"
        className="w-64 rounded-lg border border-black/10 bg-transparent px-3 py-2 text-center dark:border-white/10"
      />
      <button
        type="submit"
        className="rounded-full bg-black px-8 py-3 font-medium text-white dark:bg-white dark:text-black"
      >
        Registrar entreno
      </button>
    </form>
  );
}
