import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Camera, ImagePlus, Loader2, X } from 'lucide-react';

const ACCEPT =
  'image/jpeg,image/png,image/webp,image/heic,image/heif,image/*';

export function UploadZone({
  onFile,
  error,
  loading,
  onClearError,
}: {
  onFile: (file: File) => void;
  error: string;
  loading: boolean;
  onClearError: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    pick(event.dataTransfer.files);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload your photo"
        data-active={dragging || undefined}
        onClick={() => !loading && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`dropzone-glow group flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink/25 bg-cream/70 px-6 text-center transition-colors ${
          dragging ? 'border-lime bg-lime/10' : 'hover:bg-cream'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          capture="user"
          className="hidden"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            pick(event.target.files)
          }
        />

        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-lime shadow-[4px_4px_0_#c9f24b] transition-transform duration-200 group-hover:scale-105">
          {loading ? (
            <Loader2 size={26} strokeWidth={1.5} className="spin-slow" />
          ) : (
            <ImagePlus size={26} strokeWidth={1.5} />
          )}
        </span>

        <div className="font-display text-[26px] font-bold leading-none tracking-tight text-ink">
          {loading ? 'Working your photo…' : 'DROP YOUR PHOTO'}
        </div>
        <div className="mt-3 text-sm leading-5 text-stone">
          or <span className="underline decoration-coral decoration-2 underline-offset-4">choose from device</span> — your
          camera works too.
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {['JPG', 'PNG', 'HEIC'].map((format) => (
            <span
              key={format}
              className="rounded-full border border-ink/15 bg-cream px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-stone"
            >
              {format}
            </span>
          ))}
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-stone">
            <Camera size={12} className="text-coral" /> camera
          </span>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl bg-coral/10 px-4 py-3 text-sm leading-5 text-[#a03a20]"
        >
          <X size={16} className="mt-0.5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={onClearError}
            className="eyebrow shrink-0 text-[#a03a20] underline underline-offset-2"
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </p>
      )}
    </div>
  );
}
