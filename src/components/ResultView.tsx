import { Download, Loader2, RefreshCw, Share2, Sparkles } from 'lucide-react';

export function ResultView({
  dataUrl,
  fileName,
  onDownload,
  onShare,
  onRestart,
  sharing,
}: {
  dataUrl: string | null;
  fileName: string;
  onDownload: () => void;
  onShare: () => void;
  onRestart: () => void;
  sharing: boolean;
}) {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="eyebrow mb-4 flex items-center justify-center gap-2 text-coral">
          <span className="h-px w-8 bg-coral" />
          04 / surprise
          <span className="h-px w-8 bg-coral" />
        </div>
        <h2 className="tick font-display text-4xl font-bold leading-[0.9] tracking-tight text-ink sm:text-6xl">
          YOUR BUILDER
          <br />
          FRAME IS <span className="font-serif font-normal italic text-coral">READY.</span>
        </h2>
      </div>

      <div className="mx-auto max-w-[430px]">
        <div className="tick reveal-delay-2 relative">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="Your generated HH Goa 2026 builder frame"
              className="w-full rounded-2xl ring-1 ring-ink/15"
            />
          ) : (
            <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-ink/10" />
          )}
          <div className="absolute -left-3 -top-3 hidden rotate-[-6deg] rounded bg-coral px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-cream shadow-[4px_4px_0_#111a15] sm:block">
            Frame / 001
          </div>
        </div>

        <div className="mono-tag mt-4 text-center text-stone">
          PNG · 1080 × 1350 · {fileName}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            onClick={onDownload}
            className="btn btn-ink w-full px-6 py-4 text-[15px]"
          >
            <Download size={18} /> Download frame
          </button>

          <button
            onClick={onShare}
            disabled={sharing}
            className="btn btn-lime w-full px-6 py-4 text-[15px] disabled:cursor-wait disabled:opacity-60"
          >
            {sharing ? (
              <>
                <Loader2 size={18} className="spin-slow" /> Preparing…
              </>
            ) : (
              <>
                <Share2 size={18} /> Share to X
              </>
            )}
          </button>

          <button
            onClick={onRestart}
            className="btn btn-ghost w-full px-6 py-4 text-sm"
          >
            <RefreshCw size={16} /> Create another
          </button>
        </div>

        <p className="mt-6 flex items-start justify-center gap-2 text-center text-sm leading-5 text-stone">
          <Sparkles size={14} className="mt-0.5 shrink-0 text-coral" />
          Sharing opens the native sheet on supported devices, otherwise X
          opens with your #FrameInGoa caption ready.
        </p>
      </div>
    </div>
  );
}
