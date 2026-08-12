import { ArrowRight } from 'lucide-react';

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-lime"
      style={{ width: size, height: size }}
    >
      <span className="font-display text-[0.62em] font-bold tracking-tight text-ink">HH</span>
    </span>
  );
}

export function Header({
  onStart,
  inFlow,
}: {
  onStart: () => void;
  inFlow: boolean;
}) {
  return (
    <header className="relative z-30 mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
      <button
        onClick={onStart}
        className="group flex items-center gap-3 text-left"
        aria-label="HH Goa 2026 builder frame — back to start"
      >
        <LogoMark />
        <span className="hidden sm:block">
          <span className="font-display text-[11px] font-bold uppercase leading-3 tracking-tight">
            Hacker
            <br />
            House
          </span>
        </span>
      </button>

      <div className="eyebrow hidden text-stone md:block">
        HH Goa 2026 / Builder Identity Lab
      </div>

      <button
        onClick={onStart}
        className="btn btn-ghost eyebrow px-4 py-2.5"
        aria-label={inFlow ? 'Restart from the beginning' : 'Start creating your frame'}
      >
        {inFlow ? 'Restart' : 'Make yours'}
        <ArrowRight size={14} />
      </button>
    </header>
  );
}
