import { ArrowLeft, Sparkles } from 'lucide-react';
import type { Builder } from '@/types/builder';
import { vibeOptions } from '@/types/builder';
import { builderTitle } from '@/lib/titleGenerator';

const FIELDS: Array<{
  field: keyof Builder;
  label: string;
  placeholder: string;
  optional?: boolean;
}> = [
  { field: 'name', label: 'Name', placeholder: 'e.g. Prasanna Mate' },
  { field: 'role', label: 'Role', placeholder: 'e.g. Full Stack Developer' },
  { field: 'stack', label: 'Stack', placeholder: 'e.g. React • Node • AI' },
  {
    field: 'vibe',
    label: 'Builder vibe / interest',
    placeholder: 'e.g. Open Source',
    optional: true,
  },
];

export function BuilderForm({
  builder,
  onChange,
  onGenerate,
  onBack,
  error,
  canGenerate,
}: {
  builder: Builder;
  onChange: (field: keyof Builder, value: string) => void;
  onGenerate: () => void;
  onBack: () => void;
  error: string;
  canGenerate: boolean;
}) {
  const title = builderTitle(builder);

  return (
    <div>
      <p className="mb-8 max-w-[400px] text-[15px] leading-6 text-stone">
        The ingredients behind the work. Keep it plain, specific, and
        recognisably you.
      </p>

      <div className="space-y-6">
        {FIELDS.map(({ field, label, placeholder, optional }) => (
          <label key={field} className="block">
            <span className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-stone">
              <span>{label}</span>
              {optional && <span className="text-coral">Optional</span>}
            </span>
            <input
              value={builder[field]}
              onChange={(event) => onChange(field, event.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-ink/20 bg-cream/80 px-4 py-3.5 text-[15px] text-ink outline-none transition-all placeholder:text-stone/60 focus:border-coral focus:bg-cream focus:ring-4 focus:ring-coral/15"
            />
          </label>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {vibeOptions.map((vibe) => {
          const active = builder.vibe === vibe;
          return (
            <button
              key={vibe}
              onClick={() => onChange('vibe', active ? '' : vibe)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-all ${
                active
                  ? 'border-coral bg-coral text-cream'
                  : 'border-ink/20 text-stone hover:border-ink hover:text-ink'
              }`}
              aria-pressed={active}
            >
              {vibe}
            </button>
          );
        })}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-coral/10 px-4 py-3 text-sm leading-5 text-[#a03a20]"
        >
          {error}
        </p>
      )}

      <button
        onClick={onGenerate}
        className="btn btn-ink mt-8 w-full px-6 py-4 text-[15px]"
      >
        <Sparkles size={18} />
        Generate my frame
      </button>

      {!canGenerate && (
        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-stone">
          Name, role &amp; stack unlock your frame
        </p>
      )}

      <button
        onClick={onBack}
        className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm text-stone transition-colors hover:text-ink"
      >
        <ArrowLeft size={15} /> Back to photo
      </button>

      <div className="mt-7 flex items-center gap-3 rounded-2xl border border-lime/60 bg-lime/15 px-4 py-3">
        <Sparkles size={16} className="shrink-0 text-coral" />
        <p className="text-sm leading-5 text-ink">
          <span className="font-semibold">Your builder title:</span>{' '}
          <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-coral">
            {title}
          </span>
        </p>
      </div>
    </div>
  );
}
