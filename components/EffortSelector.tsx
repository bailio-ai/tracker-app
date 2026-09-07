export const EFFORT_LEVELS = [
  { value: 1, emoji: "😄", color: "bg-green-500", className: "has-[:checked]:bg-green-500 has-[:checked]:text-white" },
  { value: 2, emoji: "🙂", color: "bg-lime-500", className: "has-[:checked]:bg-lime-500 has-[:checked]:text-white" },
  { value: 3, emoji: "😐", color: "bg-yellow-500", className: "has-[:checked]:bg-yellow-500 has-[:checked]:text-white" },
  { value: 4, emoji: "😣", color: "bg-orange-500", className: "has-[:checked]:bg-orange-500 has-[:checked]:text-white" },
  { value: 5, emoji: "🥵", color: "bg-red-500", className: "has-[:checked]:bg-red-500 has-[:checked]:text-white" },
] as const;

export function getEffortLevel(effort: number | null) {
  if (effort === null) return null;
  return EFFORT_LEVELS.find((level) => level.value === effort) ?? null;
}

export default function EffortSelector() {
  return (
    <div className="flex items-center gap-2">
      {EFFORT_LEVELS.map(({ value, emoji, className }) => (
        <label
          key={value}
          className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-black/10 text-2xl transition-colors dark:border-white/10 ${className}`}
        >
          <input
            type="radio"
            name="effort"
            value={value}
            className="sr-only"
          />
          <span aria-hidden>{emoji}</span>
          <span className="sr-only">Esfuerzo {value}</span>
        </label>
      ))}
    </div>
  );
}
