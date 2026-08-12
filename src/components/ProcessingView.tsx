import { Check } from 'lucide-react';

const STAGES = ['PHOTO', 'IDENTITY', 'HH GOA 2026', 'READY'] as const;

const HEADLINES = [
  'Framing your photo…',
  'Building your identity…',
  'Adding the Goa touch…',
  'Ready.',
] as const;

export function ProcessingView({ stage }: { stage: number }) {
  const clamped = Math.min(stage, STAGES.length - 1);

  return (
    <div className="grid min-h-[480px] place-items-center overflow-hidden rounded-3xl border border-ink/15 bg-ink px-6 py-16 text-center text-cream">
      <div>
        <div className="eyebrow mb-6 flex items-center justify-center gap-2 text-lime">
          <span className="h-px w-8 bg-lime" />
          03 / signal detected
          <span className="h-px w-8 bg-lime" />
        </div>

        <h3
          key={clamped}
          className="tick font-display text-5xl font-bold leading-[0.9] tracking-tight sm:text-7xl"
        >
          {HEADLINES[clamped]}
        </h3>

        <p className="mx-auto mt-6 max-w-[330px] text-sm leading-6 text-cream/65">
          Composing your photo, your stack, and one good instinct into
          something worth sharing.
        </p>

        <div className="mx-auto mt-10 flex max-w-[360px] flex-wrap items-center justify-center gap-2.5">
          {STAGES.map((label, index) => {
            const done = index < clamped;
            const active = index === clamped;
            return (
              <div key={label} className="flex items-center gap-2.5">
                <span
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-all duration-300 ${
                    done
                      ? 'border-lime bg-lime text-ink'
                      : active
                        ? 'border-lime text-lime'
                        : 'border-cream/20 text-cream/40'
                  }`}
                >
                  {done && <Check size={11} strokeWidth={3} />}
                  {label}
                </span>
                {index < STAGES.length - 1 && (
                  <span className="h-px w-4 bg-cream/20" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 h-px w-full max-w-[280px] overflow-hidden bg-cream/15">
          <div className="scanbar h-full w-1/2 bg-lime" />
        </div>
      </div>
    </div>
  );
}
