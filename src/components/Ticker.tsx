const ITEMS = [
  'HH GOA 2026',
  'BUILDERS',
  'GOA ENERGY',
  '#FRAMEINGOA',
  'SHIP THE STORY',
  'FULL STACK × FULL SOUL',
  'HH GOA 2026',
  'BUILDER CULTURE',
  'SEE YOU IN GOA',
] as const;

export function Ticker() {
  const row = ITEMS.join('  ✦  ');
  return (
    <div
      className="relative z-10 overflow-hidden border-y border-ink/10 bg-ink py-3 text-cream"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max whitespace-nowrap">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-lime">
          {row}
        </span>
        <span className="ml-6 font-mono text-[11px] uppercase tracking-[0.16em] text-lime">
          {row}
        </span>
      </div>
    </div>
  );
}
