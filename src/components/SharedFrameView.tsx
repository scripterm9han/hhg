import { useEffect, useState } from 'react';
import { ArrowRight, Check, Copy, Download, Loader2, Sparkles } from 'lucide-react';
import type { Builder, CropState } from '@/types/builder';
import { getFrameFromStorage, updateOpenGraphMeta } from '@/lib/frameStorage';
import { shareToXDirect } from '@/lib/sharing';
import { frameFileName, shareCaption } from '@/lib/filename';
import { builderTitle } from '@/lib/titleGenerator';
import { renderFrame, blobToDataUrl } from '@/lib/canvasGenerator';

function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SharedFrameView({
  frameId,
  urlParams,
  onCreateNew,
}: {
  frameId: string;
  urlParams: { name: string; role: string; stack: string };
  onCreateNew: () => void;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [builder, setBuilder] = useState<Builder>({
    name: urlParams.name || 'HH Goa Builder',
    role: urlParams.role || 'Full Stack Developer',
    stack: urlParams.stack || 'React • AI • Node',
    vibe: '',
  });
  const [crop] = useState<CropState>({ zoom: 1, x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const title = builderTitle(builder);
  const fileName = frameFileName(builder.name);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    let active = true;
    setLoading(true);

    const saved = getFrameFromStorage(frameId);
    if (saved && saved.dataUrl) {
      if (active) {
        setBuilder(saved.builder);
        setDataUrl(saved.dataUrl);
        // Convert dataUrl back to Blob for download/share
        fetch(saved.dataUrl)
          .then((res) => res.blob())
          .then((b) => {
            if (active) setBlob(b);
          })
          .catch(() => {})
          .finally(() => {
            if (active) setLoading(false);
          });
      }
    } else {
      // Re-render from parameters if available
      const b: Builder = {
        name: urlParams.name || 'HH Goa Builder',
        role: urlParams.role || 'Full Stack Developer',
        stack: urlParams.stack || 'React • AI',
        vibe: '',
      };
      setBuilder(b);

      renderFrame(b, null, crop)
        .then(async (bBlob) => {
          if (!active) return;
          setBlob(bBlob);
          const dUrl = await blobToDataUrl(bBlob);
          setDataUrl(dUrl);
        })
        .catch(() => {})
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, [frameId, urlParams, crop]);

  // Update dynamic head tags for social cards
  useEffect(() => {
    const pageTitle = `${builder.name} | HH Goa 2026 Builder Frame`;
    const desc = `${builder.name} (${builder.role}) framed for HH Goa 2026 ⚡ ${title}. See you in Goa! #FrameInGoa`;
    updateOpenGraphMeta(pageTitle, desc, dataUrl ?? undefined, currentUrl);
  }, [builder, title, dataUrl, currentUrl]);

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const handleDownload = () => {
    if (!blob && !dataUrl) return;
    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl || (blob ? URL.createObjectURL(blob) : '');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleShareToX = () => {
    if (!blob && !dataUrl) return;
    setSharing(true);
    setCopiedNotice(true);

    const shareBlob = blob || new Blob([]);
    const caption = shareCaption(title, builder.name);

    void shareToXDirect(shareBlob, fileName, caption, currentUrl).finally(() => {
      setSharing(false);
      setTimeout(() => setCopiedNotice(false), 7000);
    });
  };

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-10 sm:px-8">
      <div className="mb-10 text-center">
        <div className="eyebrow mb-4 flex items-center justify-center gap-2 text-coral">
          <span className="h-px w-8 bg-coral" />
          HH GOA 2026 / SHARED BUILDER IDENTITY
          <span className="h-px w-8 bg-coral" />
        </div>
        <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-6xl">
          {builder.name.toUpperCase()}
        </h1>
        <p className="mt-2 font-mono text-sm tracking-wider text-stone uppercase">
          {builder.role} · {builder.stack}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="mx-auto w-full max-w-[430px]">
          <div className="relative">
            {loading ? (
              <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-ink/10 flex items-center justify-center text-stone">
                <Loader2 size={24} className="spin-slow" />
              </div>
            ) : dataUrl ? (
              <img
                src={dataUrl}
                alt={`${builder.name} frame preview`}
                className="w-full rounded-2xl ring-1 ring-ink/15 shadow-2xl"
              />
            ) : null}

            <div className="absolute -left-3 -top-3 hidden rotate-[-6deg] rounded bg-coral px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-cream shadow-[4px_4px_0_#111a15] sm:block">
              Frame / {frameId}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[480px] space-y-6 text-center lg:text-left">
          <div>
            <div className="eyebrow mb-3 text-coral">Builder Badge</div>
            <h2 className="font-display text-3xl font-bold leading-none tracking-tight sm:text-5xl text-ink">
              {title}
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-stone">
              This is {builder.name}’s official builder frame for Hacker House Goa 2026.
            </p>
          </div>

          {copiedNotice && (
            <div className="rounded-xl border border-lime/60 bg-lime/15 p-3.5 text-left text-xs leading-relaxed text-ink shadow-sm">
              <div className="flex items-center gap-1.5 font-semibold">
                <Check size={15} className="text-emerald-700" />
                Image downloaded & link ready!
              </div>
              <p className="mt-1 text-stone">
                Opening X... Press <kbd className="rounded bg-cream px-1 py-0.5 font-mono font-bold text-ink">Ctrl+V</kbd> (or <kbd className="rounded bg-cream px-1 py-0.5 font-mono font-bold text-ink">Cmd+V</kbd>) in X to attach the image to your post!
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleShareToX}
              disabled={sharing}
              className="btn btn-lime w-full px-6 py-4 text-[15px] font-semibold"
            >
              {sharing ? (
                <>
                  <Loader2 size={18} className="spin-slow" /> Sharing…
                </>
              ) : (
                <>
                  <XIcon className="h-4.5 w-4.5" /> Share frame on X
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyLink}
                className="btn btn-ghost border border-ink/15 px-4 py-3.5 text-xs uppercase tracking-wider text-ink"
              >
                {copiedLink ? (
                  <>
                    <Check size={15} className="text-emerald-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={15} /> Copy Unique Link
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="btn btn-ink px-4 py-3.5 text-xs uppercase tracking-wider"
              >
                <Download size={15} /> Download PNG
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-ink/15">
            <button
              onClick={onCreateNew}
              className="btn btn-coral w-full py-4 text-[15px] group"
            >
              <Sparkles size={16} /> Create your own HH Goa frame
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
