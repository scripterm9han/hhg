import { Check } from 'lucide-react';

const STEPS = ['Photo', 'Details', 'Frame'] as const;

export function Stepper({ active }: { active: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Builder progress" className="hidden items-center gap-2 sm:flex">
      {STEPS.map((label, index) => {
        const step = (index + 1) as 1 | 2 | 3;
        const done = active > step;
        const current = active === step;
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs transition-all ${
                done
                  ? 'border-ink bg-lime text-ink'
                  : current
                    ? 'border-ink bg-ink text-cream'
                    : 'border-ink/25 text-stone'
              }`}
            >
              {done ? <Check size={14} strokeWidth={3} /> : step}
            </span>
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.08em] ${
                current ? 'text-ink' : 'text-stone'
              }`}
            >
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="mx-1 h-px w-5 bg-ink/20" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
