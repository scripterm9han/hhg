import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Step } from '@/types/builder';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useImageEditor } from '@/hooks/useImageEditor';
import { useBuilderForm } from '@/hooks/useBuilderForm';
import { builderTitle } from '@/lib/titleGenerator';
import { frameFileName, shareCaption } from '@/lib/filename';
import { renderFrame, blobToDataUrl } from '@/lib/canvasGenerator';
import { shareToXDirect, shareNativeFile } from '@/lib/sharing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Ticker } from '@/components/Ticker';
import { Stepper } from '@/components/Stepper';
import { FramePreview } from '@/components/FramePreview';
import { UploadZone } from '@/components/UploadZone';
import { ImageEditor } from '@/components/ImageEditor';
import { BuilderForm } from '@/components/BuilderForm';
import { ProcessingView } from '@/components/ProcessingView';
import { ResultView } from '@/components/ResultView';
import { FileImage } from 'lucide-react';

const STAGE_MS = 390;

export function BuilderStudio() {
  const [step, setStep] = useState<Step>('intro');
  const [stage, setStage] = useState(0);
  const [detailError, setDetailError] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [genFailed, setGenFailed] = useState(false);

  const { photo, error: photoError, loading: photoLoading, load, clear: clearPhoto } =
    useImageUpload();
  const { crop, setCrop, reset: resetCrop } = useImageEditor();
  const { builder, update, requiredFilled, reset: resetForm } = useBuilderForm();

  const stageTimer = useRef<number | undefined>(undefined);
  const resultBlob = useRef<Blob | null>(null);
  const minDone = useRef(false);
  const resultReady = useRef(false);

  const title = useMemo(() => builderTitle(builder), [builder]);

  useEffect(
    () => () => {
      if (stageTimer.current) window.clearInterval(stageTimer.current);
    },
    [],
  );

  const maybeFinish = useCallback(() => {
    if (minDone.current && resultReady.current) {
      if (stageTimer.current) window.clearInterval(stageTimer.current);
      setStep('result');
    }
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      void load(file).then((ok) => {
        if (ok) {
          resetCrop();
          setStep('edit');
        }
      });
    },
    [load, resetCrop],
  );

  const begin = useCallback(() => {
    setStep('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toDetails = useCallback(() => {
    setStep('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toEdit = useCallback(() => setStep('edit'), []);

  const generate = useCallback(() => {
    if (!builder.name.trim() || !builder.role.trim() || !builder.stack.trim()) {
      setDetailError('Name, role, and stack are the three things that make this yours.');
      return;
    }
    setDetailError('');
    setGenFailed(false);
    minDone.current = false;
    resultReady.current = false;
    resultBlob.current = null;
    setResultUrl(null);
    setStage(0);
    setStep('generating');

    let s = 0;
    stageTimer.current = window.setInterval(() => {
      s += 1;
      if (s >= 4) {
        if (stageTimer.current) window.clearInterval(stageTimer.current);
        minDone.current = true;
        maybeFinish();
      } else {
        setStage(s);
      }
    }, STAGE_MS);

    void renderFrame(builder, photo?.url ?? null, crop)
      .then(async (blob) => {
        resultBlob.current = blob;
        const url = await blobToDataUrl(blob);
        resultReady.current = true;
        setResultUrl(url);
        maybeFinish();
      })
      .catch(() => {
        if (stageTimer.current) window.clearInterval(stageTimer.current);
        setGenFailed(true);
        setDetailError('The frame could not be generated on this device. Please try again.');
        setStep('details');
      });
  }, [builder, photo, crop, maybeFinish]);

  const download = useCallback(() => {
    const blob = resultBlob.current;
    if (!blob) return;
    const link = document.createElement('a');
    link.download = frameFileName(builder.name);
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 4000);
  }, [builder.name]);

  const share = useCallback(() => {
    const blob = resultBlob.current;
    if (!blob) return;
    setSharing(true);
    void shareToXDirect(
      blob,
      frameFileName(builder.name),
      shareCaption(title, builder.name),
    ).finally(() => setSharing(false));
  }, [builder.name, title]);

  const handleNativeShare = useCallback(() => {
    const blob = resultBlob.current;
    if (!blob) return;
    setSharing(true);
    void shareNativeFile(
      blob,
      frameFileName(builder.name),
      shareCaption(title, builder.name),
    ).finally(() => setSharing(false));
  }, [builder.name, title]);

  const restart = useCallback(() => {
    if (stageTimer.current) window.clearInterval(stageTimer.current);
    clearPhoto();
    resetCrop();
    resetForm();
    setDetailError('');
    setGenFailed(false);
    setResultUrl(null);
    resultBlob.current = null;
    setStep('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [clearPhoto, resetCrop, resetForm]);

  const inFlow = step !== 'intro';
  const activeStep = step === 'upload' || step === 'edit' ? 1 : step === 'details' ? 2 : 3;
  const fileName = frameFileName(builder.name);

  const stepTitle =
    step === 'upload'
      ? 'Let’s make it yours.'
      : step === 'edit'
        ? 'Frame the face.'
        : step === 'details'
          ? 'Tell us who builds.'
          : step === 'generating'
            ? 'Finding your signal.'
            : 'That’s your frame.';

  return (
    <main className="paper grain min-h-[100dvh]">
      <Header onStart={restart} inFlow={inFlow} />

      {step === 'intro' && (
        <>
          <Hero onStart={begin} />
          <Ticker />
          <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-10 sm:px-8">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['01', 'Upload', 'A portrait with a little room around the head works best.'],
                ['02', 'Personalize', 'Name, role, stack. We read the rest from you.'],
                ['03', 'Ship it', 'A 1080×1350 PNG you can download and share.'],
              ].map(([num, head, body]) => (
                <div
                  key={num}
                  className="rounded-2xl border border-ink/12 bg-cream/70 p-5"
                >
                  <div className="eyebrow mb-3 text-coral">{num}</div>
                  <div className="font-display text-xl font-bold tracking-tight">{head}</div>
                  <p className="mt-1.5 text-sm leading-5 text-stone">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {inFlow && (
        <section className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-24 pt-4 sm:px-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="eyebrow mb-3 text-coral">HH GOA 2026 / create mode</div>
              <h2 className="font-display text-4xl font-bold leading-none tracking-tight sm:text-5xl">
                {stepTitle}
              </h2>
            </div>
            <Stepper active={activeStep} />
          </div>

          {step === 'upload' && (
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div>
                <p className="mb-7 max-w-[400px] text-[15px] leading-6 text-stone">
                  Start with the face people know. Any orientation works — we
                  frame it for you.
                </p>
                <UploadZone
                  onFile={handleFile}
                  error={photoError}
                  loading={photoLoading}
                  onClearError={clearPhoto}
                />
                <button
                  onClick={toDetails}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 px-4 py-3.5 text-sm text-stone transition-colors hover:border-ink hover:text-ink"
                >
                  <FileImage size={15} /> Continue without a photo
                </button>
              </div>
              <div className="mx-auto w-full max-w-[430px]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="eyebrow text-stone">What you’ll get</span>
                  <span className="mono-tag text-stone">1080 × 1350</span>
                </div>
                <FramePreview
                  builder={builder}
                  crop={crop}
                  variant="live"
                  className="ring-1 ring-ink/10"
                />
                <p className="mt-5 text-sm leading-5 text-stone">
                  No photo yet, so you’re seeing the placeholder treatment.
                  Your portrait will take centre stage once uploaded.
                </p>
              </div>
            </div>
          )}

          {step === 'edit' && (
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <ImageEditor
                  builder={builder}
                  photo={photo}
                  crop={crop}
                  setCrop={setCrop}
                  onNext={toDetails}
                  onBack={() => setStep('upload')}
                  onReset={resetCrop}
                />
              </div>
              <div className="space-y-4 lg:pt-2">
                <div className="rounded-2xl border border-ink/12 bg-cream/70 p-5">
                  <div className="eyebrow mb-2 text-coral">Quick tips</div>
                  <ul className="space-y-2 text-sm leading-5 text-stone">
                    <li>• Drag to place your face inside the frame.</li>
                    <li>• Scroll, pinch, or use the slider to zoom.</li>
                    <li>• Double-tap the preview to reset.</li>
                    <li>• A little breathing room above the head looks best.</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-lime/50 bg-lime/10 p-5">
                  <div className="font-display text-lg font-bold leading-tight">
                    Framed for the grid.
                  </div>
                  <p className="mt-1 text-sm leading-5 text-stone">
                    The arch keeps the crop flattering across portrait,
                    landscape, and square photos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-start">
              <div>
                <BuilderForm
                  builder={builder}
                  onChange={update}
                  onGenerate={generate}
                  onBack={toEdit}
                  error={detailError}
                  canGenerate={requiredFilled}
                />
              </div>
              <div className="mx-auto w-full max-w-[430px] lg:pt-2">
                <div className="mb-3 flex items-center justify-between">
                  <span className="eyebrow text-stone">Your identity, taking shape</span>
                  <span className="mono-tag text-coral">{title}</span>
                </div>
                <FramePreview
                  builder={builder}
                  imageUrl={photo?.url}
                  crop={crop}
                  variant="live"
                  className="ring-1 ring-ink/10"
                />
                <p className="mt-5 font-display text-2xl leading-[1.05] text-stone">
                  No templates. Just a little evidence of how you think.
                </p>
              </div>
            </div>
          )}

          {step === 'generating' && <ProcessingView stage={stage} />}

          {step === 'result' && (
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
              <ResultView
                dataUrl={resultUrl}
                fileName={fileName}
                onDownload={download}
                onShare={share}
                onNativeShare={handleNativeShare}
                onRestart={restart}
                sharing={sharing}
              />
              <div className="mx-auto max-w-[520px] text-center lg:text-left">
                <div className="eyebrow mb-5 text-coral">Your builder title</div>
                <h3 className="tick font-display text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.8] tracking-[-0.04em]">
                  {title}
                </h3>
                <p className="mt-8 text-[15px] leading-6 text-stone">
                  This is the part of your story that travels. Put it on your
                  profile, send it to a collaborator, or keep it as a small
                  receipt from Goa.
                </p>
                <div className="mt-8 border-t border-ink/15 pt-5 text-left">
                  <div className="font-semibold">Share it with #FrameInGoa</div>
                  <div className="mt-1 text-sm leading-5 text-stone">
                    {genFailed
                      ? 'Something went wrong while exporting. Restart and try once more.'
                      : 'Sharing directly opens X with your caption pre-filled and downloads your frame.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <Footer />
    </main>
  );
}
