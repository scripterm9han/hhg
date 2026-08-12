import { useEffect, useMemo, useRef, useState } from 'react';
import type { Builder, CropState } from '@/types/builder';
import { FRAME, LAYOUT } from '@/lib/frame';
import { builderTitle } from '@/lib/titleGenerator';

const MONO = '"DM Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';

const A = LAYOUT.arch;
const W = FRAME.width;
const H = FRAME.height;

function archRadius(w: number): string {
  const rise = (w / 2) * 0.62;
  return `50% 50% 14px 14px / ${rise}px ${rise}px 14px 14px`;
}

function measureSize(
  text: string,
  font: string,
  base: number,
  min: number,
  maxWidth: number,
): number {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return base;
  let size = base;
  ctx.font = `${font}`;
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '6px';
  } catch {
    /* older engines */
  }
  while (size > min && ctx.measureText(text).width > maxWidth) size -= 2;
  return size;
}

export function FramePreview({
  builder,
  imageUrl,
  crop,
  variant = 'live',
  className = '',
}: {
  builder: Builder;
  imageUrl?: string | null;
  crop: CropState;
  variant?: 'sample' | 'live';
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setScale(width > 0 ? width / W : 1);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const title = useMemo(
    () => builderTitle(builder) || 'THE BUILDER',
    [builder],
  );
  const name = (builder.name.trim() || 'YOUR NAME').toUpperCase();
  const role = builder.role.trim();
  const stack = builder.stack.trim();

  const nameSize = useMemo(
    () => measureSize(name, `400 ${120}px ${SERIF}`, 120, 52, LAYOUT.textMaxWidth),
    [name],
  );
  const titleSize = useMemo(
    () => measureSize(title, `500 ${27}px ${MONO}`, 27, 17, LAYOUT.textMaxWidth),
    [title],
  );
  const tag = '#FrameInGoa';
  const pillW = useMemo(() => {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return 0;
    ctx.font = `500 30px ${MONO}`;
    return ctx.measureText(tag).width + 68;
  }, []);

  const hasImage = Boolean(imageUrl);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: `${W} / ${H}`, borderRadius: '18px' }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          background: FRAME.ink,
        }}
      >
        {/* backdrop decorations */}
        <div
          className="absolute"
          style={{
            left: 0,
            bottom: 0,
            width: 788,
            height: 344,
            background: FRAME.coral,
            clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
          }}
        />
        <div
          className="absolute"
          style={{
            left: 942 - 148,
            top: 200 - 148,
            width: 296,
            height: 296,
            borderRadius: '50%',
            background: FRAME.lime,
          }}
        />
        <div
          className="absolute"
          style={{
            left: 942 - 178,
            top: 200 - 178,
            width: 356,
            height: 356,
            borderRadius: '50%',
            border: '30px solid #111a15',
          }}
        />
        <div
          className="absolute"
          style={{
            left: 912 - 206,
            top: 232 - 206,
            width: 412,
            height: 412,
            borderRadius: '50%',
            border: '3px solid rgba(242,236,223,0.18)',
          }}
        />
        <div
          className="font-serif"
          style={{
            position: 'absolute',
            right: -18,
            top: 240,
            fontSize: 430,
            lineHeight: 1,
            color: 'rgba(242,236,223,0.05)',
          }}
        >
          01
        </div>

        {/* header band */}
        <div
          className="absolute"
          style={{ top: 0, left: 0, right: 0, height: LAYOUT.headerBand, background: FRAME.cream }}
        >
          <div
            className="font-mono"
            style={{ position: 'absolute', left: 86, top: 58, fontSize: 27, fontWeight: 500, letterSpacing: 4, color: FRAME.ink }}
          >
            HH GOA 2026
          </div>
          <div
            className="font-mono"
            style={{ position: 'absolute', left: 86, top: 94, fontSize: 15, letterSpacing: 3, color: 'rgba(17,26,21,0.62)' }}
          >
            BUILDER IDENTITY / 001
          </div>
          <div style={{ position: 'absolute', left: 86, top: 144, width: 44, height: 5, background: FRAME.coral }} />
          <div
            className="font-display flex items-center justify-center"
            style={{
              position: 'absolute',
              right: 86,
              top: 30,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: FRAME.lime,
              fontSize: 22,
              fontWeight: 700,
              color: FRAME.ink,
            }}
          >
            HH
          </div>
          <div
            className="font-mono"
            style={{
              position: 'absolute',
              right: 182,
              top: 34,
              fontSize: 13,
              letterSpacing: 2,
              color: 'rgba(17,26,21,0.85)',
              textAlign: 'right',
              lineHeight: 1.45,
            }}
          >
            HACKER
            <br />
            HOUSE
          </div>
        </div>

        {/* offset arch layers */}
        <div
          className="absolute"
          style={{
            left: A.x - 12,
            top: A.y - 9,
            width: A.w,
            height: A.h,
            borderRadius: archRadius(A.w),
            background: FRAME.lime,
          }}
        />
        <div
          className="absolute"
          style={{
            left: A.x + 17,
            top: A.y + 21,
            width: A.w,
            height: A.h,
            borderRadius: archRadius(A.w),
            background: FRAME.coral,
          }}
        />

        {/* main portrait arch */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: A.x,
            top: A.y,
            width: A.w,
            height: A.h,
            borderRadius: archRadius(A.w),
          }}
        >
          {hasImage ? (
            <img
              src={imageUrl ?? undefined}
              alt={name ? `${name} portrait` : 'Uploaded portrait'}
              draggable={false}
              className="absolute inset-0 h-full w-full max-w-none select-none object-cover"
              style={{
                transform: `translate(${crop.x}px, ${crop.y}px) scale(${crop.zoom})`,
                transformOrigin: 'center',
              }}
            />
          ) : variant === 'sample' ? (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#c9f24b 0%,#f25c3a 100%)' }}>
              <div
                className="absolute"
                style={{
                  left: '50%',
                  top: '16%',
                  width: 168,
                  height: 168,
                  borderRadius: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(17,26,21,0.92)',
                }}
              />
              <div
                className="absolute"
                style={{
                  left: '50%',
                  bottom: -40,
                  width: 300,
                  height: 300,
                  borderRadius: '50% 50% 0 0',
                  transform: 'translateX(-50%)',
                  background: 'rgba(17,26,21,0.92)',
                }}
              />
              <div
                className="absolute"
                style={{
                  left: '50%',
                  top: '8%',
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  transform: 'translateX(-50%)',
                  border: '3px solid rgba(242,236,223,0.35)',
                }}
              />
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center"
              style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#c9f24b 0%,#f25c3a 100%)' }}
            >
              <div className="font-serif" style={{ fontSize: 210, color: FRAME.ink, lineHeight: 1 }}>
                HH
              </div>
              <div className="font-mono" style={{ marginTop: 24, fontSize: 24, letterSpacing: 4, color: FRAME.ink }}>
                BUILDER
              </div>
            </div>
          )}
        </div>

        {/* lime arch outline */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: A.x,
            top: A.y,
            width: A.w,
            height: A.h,
            borderRadius: archRadius(A.w),
            border: '12px solid #c9f24b',
          }}
        />
        {/* inner cream line */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: A.x + 14,
            top: A.y + 14,
            width: A.w - 28,
            height: A.h - 28,
            borderRadius: archRadius(A.w - 28),
            border: '3px solid rgba(242,236,223,0.35)',
          }}
        />

        {/* text block */}
        <div
          className="font-serif"
          style={{
            position: 'absolute',
            top: LAYOUT.nameY - nameSize * 0.72,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: nameSize,
            color: FRAME.cream,
            lineHeight: 0.82,
            padding: '0 90px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </div>

        <div
          style={{
            position: 'absolute',
            left: W / 2 - 46,
            top: LAYOUT.dividerY,
            width: 92,
            height: 6,
            background: FRAME.lime,
          }}
        />

        <div
          className="font-mono"
          style={{
            position: 'absolute',
            top: LAYOUT.titleY - 22,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: titleSize,
            letterSpacing: 6,
            color: FRAME.lime,
          }}
        >
          {title}
        </div>

        <div
          className="font-mono"
          style={{
            position: 'absolute',
            top: LAYOUT.metaY - 22,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 21,
            letterSpacing: 2,
            color: FRAME.creamDim,
          }}
        >
          {(role || 'YOUR ROLE').toUpperCase()}
        </div>
        {role !== stack && (
          <div
            className="font-mono"
            style={{
              position: 'absolute',
              top: LAYOUT.metaY + 10,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 21,
              letterSpacing: 2,
              color: FRAME.creamDim,
            }}
          >
            {(stack || 'YOUR STACK').toUpperCase()}
          </div>
        )}

        {/* #FrameInGoa pill */}
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: W / 2 - pillW / 2,
            top: LAYOUT.pillY,
            width: pillW,
            height: 62,
            borderRadius: 31,
            background: FRAME.lime,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            letterSpacing: 1,
            color: FRAME.ink,
          }}
        >
          {tag}
        </div>

        {/* footer */}
        <div style={{ position: 'absolute', top: LAYOUT.footerLineY, left: 86, right: 86, height: 1, background: FRAME.creamFaint }} />
        <div className="font-mono" style={{ position: 'absolute', left: 86, top: LAYOUT.footerY - 14, fontSize: 16, letterSpacing: 2, color: FRAME.creamDim }}>
          GOA · 2026
        </div>
        <div className="font-mono" style={{ position: 'absolute', right: 86, top: LAYOUT.footerY - 14, fontSize: 16, letterSpacing: 2, color: FRAME.lime }}>
          BUILD WITH INTENT
        </div>
      </div>
    </div>
  );
}
