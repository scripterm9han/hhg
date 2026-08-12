import { Download, Loader2, RefreshCw, Share2, Sparkles } from 'lucide-react';

function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ResultView({
  dataUrl,
  fileName,
  onDownload,
  onShare,
  onNativeShare,
  onRestart,
  sharing,
}: {
  dataUrl: string | null;
  fileName: string;
  onDownload: () => void;
  onShare: () => void;
  onNativeShare?: () => void;
  onRestart: () => void;
  sharing: boolean;
}) {
  const canNativeShare = typeof navigator !== 'undefined' && Boolean(navigator.share);

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
                <XIcon className="h-4.5 w-4.5" /> Share directly to X.com
              </>
            )}
          </button>

          <button
            onClick={onDownload}
            className="btn btn-ink w-full px-6 py-4 text-[15px]"
          >
            <Download size={18} /> Download frame
          </button>

          {canNativeShare && onNativeShare && (
            <button
              onClick={onNativeShare}
              className="btn btn-ghost w-full px-6 py-3.5 text-xs tracking-wider uppercase opacity-80 hover:opacity-100"
            >
              <Share2 size={14} /> Open system share menu
            </button>
          )}

          <button
            onClick={onRestart}
            className="btn btn-ghost w-full px-6 py-4 text-sm"
          >
            <RefreshCw size={16} /> Create another
          </button>
        </div>

        <p className="mt-6 flex items-start justify-center gap-2 text-center text-sm leading-5 text-stone">
          <Sparkles size={14} className="mt-0.5 shrink-0 text-coral" />
          Sharing downloads your frame and opens x.com with your #FrameInGoa caption ready to post.
        </p>
      </div>
    </div>
  );
}

