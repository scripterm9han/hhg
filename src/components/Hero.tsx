import { ArrowRight, Camera, Sparkles } from 'lucide-react';
import { FramePreview } from '@/components/FramePreview';
import { sampleBuilder } from '@/types/builder';

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-14 pt-10 sm:px-8 lg:pb-20 lg:pt-16">
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <div className="eyebrow mb-7 flex items-center gap-3 text-coral">
            <span className="h-px w-10 bg-coral" />
            01 / curious by default
          </div>

          <h1 className="max-w-[720px] text-[clamp(3.4rem,11vw,9rem)] font-bold leading-[0.8] tracking-[-0.075em] text-ink">
            FRAME
            <br />
            <span className="font-serif font-normal italic tracking-[-0.02em]">
              your
            </span>
            <br />
            BUILDER
            <br />
            <span className="text-coral">STORY.</span>
          </h1>

          <p className="mt-8 max-w-[440px] text-[15px] leading-6 text-stone">
            Your photo. Your stack. Your identity. One frame for Goa. A
            profile-ready badge for the people who turn questions into working
            things.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={onStart}
              className="btn btn-ink group px-7 py-4 text-[15px]"
            >
              Create my frame
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
            <span className="mono-tag flex items-center gap-2 text-stone">
              <Camera size={14} className="text-coral" />
              JPG · PNG · HEIC
            </span>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-stone">
            <Sparkles size={13} className="text-coral" />
            Photo
            <span className="text-ink/30">→</span>
            Details
            <span className="text-ink/30">→</span>
            Generate
            <span className="text-ink/30">→</span>
            Download
            <span className="text-ink/30">→</span>
            Share
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-[470px]">
          <div className="absolute -left-4 -top-4 z-20 rotate-[-7deg] rounded bg-lime px-3 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink shadow-[4px_4px_0_#111a15]">
            A sample identity
          </div>

          <div className="float-slow">
            <FramePreview
              builder={sampleBuilder}
              crop={{ zoom: 1, x: 0, y: 0 }}
              variant="sample"
              className="shadow-[14px_20px_0_#c9f24b] ring-1 ring-ink/10"
            />
          </div>

          <div className="absolute -bottom-6 -right-2 z-20 hidden rotate-[5deg] rounded-full border border-ink/25 bg-cream px-5 py-3 font-serif text-xl text-ink sm:block">
            What will yours say?
          </div>
        </div>
      </div>
    </section>
  );
}
