import { PointerEvent, useEffect, useMemo, useState } from 'react';
import { FaceAnalysisResult, RecommendationItem, TryOnAdjustment } from '../types';

interface VirtualTryOnCanvasProps {
  imageSrc: string;
  recommendation: RecommendationItem;
  analysis: FaceAnalysisResult;
  onRetakePhoto: () => void;
  confidenceScore: number;
}

const defaultAdjustment: TryOnAdjustment = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};

export function VirtualTryOnCanvas({
  imageSrc,
  recommendation,
  analysis,
  onRetakePhoto,
  confidenceScore,
}: VirtualTryOnCanvasProps) {
  const [adjustment, setAdjustment] = useState<TryOnAdjustment>(defaultAdjustment);
  const [dragging, setDragging] = useState(false);
  const [showLeftEarring, setShowLeftEarring] = useState(true);
  const [showRightEarring, setShowRightEarring] = useState(true);

  useEffect(() => {
    setAdjustment(defaultAdjustment);
    setShowLeftEarring(true);
    setShowRightEarring(true);
  }, [recommendation.product.id]);

  const overlayStyle = useMemo(() => {
    const { faceBox } = analysis;
    const necklaceConfig = recommendation.product.placementConfig.necklace;
    const earringConfig = recommendation.product.placementConfig.earring;

    if (recommendation.product.type === 'necklace' && necklaceConfig) {
      return {
        left: `${faceBox.x * 100}%`,
        top: `${(faceBox.y + faceBox.height * necklaceConfig.yOffset) * 100}%`,
        width: `${faceBox.width * necklaceConfig.widthRatio * 100}%`,
        transform: `translate(-50%, -50%) translate(${adjustment.offsetX}px, ${adjustment.offsetY}px) scale(${adjustment.scale}) rotate(${necklaceConfig.rotation + adjustment.rotation}deg)`,
      };
    }

    if (earringConfig) {
      return {
        left: `${faceBox.x * 100}%`,
        top: `${(faceBox.y + faceBox.height * earringConfig.yOffset) * 100}%`,
        width: `${faceBox.width * earringConfig.scale * 100}%`,
        transform: `translate(-50%, -50%) translate(${adjustment.offsetX}px, ${adjustment.offsetY}px) scale(${adjustment.scale}) rotate(${adjustment.rotation}deg)`,
      };
    }

    return undefined;
  }, [adjustment, analysis, recommendation.product]);

  const onDragStart = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setAdjustment((current) => ({
      ...current,
      offsetX: current.offsetX + event.movementX,
      offsetY: current.offsetY + event.movementY,
    }));
  };

  const onDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  };

  return (
    <section className="grid gap-4 sm:gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[1.75rem] border border-white/60 bg-white/80 p-3 shadow-luxe sm:rounded-[2rem] sm:p-4">
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-[#f5ece7]"
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerLeave={onDragEnd}
        >
          <img src={imageSrc} alt="Sanal deneme" className="h-full w-full object-cover" />

          {recommendation.product.type === 'earring' && recommendation.product.placementConfig.earring ? (
            <>
              {showLeftEarring && (
                <img
                  src={recommendation.product.transparentPngUrl}
                  alt=""
                  className="pointer-events-none absolute select-none object-contain"
                  style={{
                    ...overlayStyle,
                    left: `${(analysis.faceBox.x + recommendation.product.placementConfig.earring.leftXOffset) * 100}%`,
                  }}
                />
              )}
              {showRightEarring && (
                <img
                  src={recommendation.product.transparentPngUrl}
                  alt=""
                  className="pointer-events-none absolute select-none object-contain"
                  style={{
                    ...overlayStyle,
                    left: `${(analysis.faceBox.x + recommendation.product.placementConfig.earring.rightXOffset) * 100}%`,
                  }}
                />
              )}
            </>
          ) : (
            <img
              src={recommendation.product.transparentPngUrl}
              alt={recommendation.product.name}
              className="pointer-events-none absolute select-none object-contain"
              style={overlayStyle}
            />
          )}

        </div>
      </div>

      <div className="space-y-4 rounded-[1.75rem] border border-white/60 bg-white/80 p-4 shadow-luxe sm:rounded-[2rem] sm:p-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55">
            FaceOn Try-On
          </span>
          <h3 className="mt-2 font-display text-3xl leading-none text-ink sm:text-4xl">{recommendation.product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:leading-7">{recommendation.reason}</p>
        </div>

        <div className="rounded-[1.4rem] bg-[#fcf7f2] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">Bu seçim için güven oranı</p>
          <p className="mt-2 font-display text-3xl text-ink sm:text-4xl">%{confidenceScore}</p>
          <p className="mt-2 text-sm leading-6 text-ink/65">
            Seçtiğin ürün değiştikçe bu oran; yüz analizi, stil eşleşmesi ve ürün uyum skoruna göre güncellenir.
          </p>
        </div>

        <button
          onClick={onRetakePhoto}
          className="w-full rounded-full border border-ink/10 px-4 py-3 text-sm font-semibold text-ink transition hover:bg-white"
        >
          Yeni Kare Çek
        </button>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <ControlButton label="Büyüt" onClick={() => setAdjustment((c) => ({ ...c, scale: c.scale + 0.08 }))} />
          <ControlButton
            label="Küçült"
            onClick={() => setAdjustment((c) => ({ ...c, scale: Math.max(0.5, c.scale - 0.08) }))}
          />
          <ControlButton
            label="Sola Kaydır"
            onClick={() => setAdjustment((c) => ({ ...c, offsetX: c.offsetX - 8 }))}
          />
          <ControlButton
            label="Sağa Kaydır"
            onClick={() => setAdjustment((c) => ({ ...c, offsetX: c.offsetX + 8 }))}
          />
          <ControlButton
            label="Yukarı Al"
            onClick={() => setAdjustment((c) => ({ ...c, offsetY: c.offsetY - 8 }))}
          />
          <ControlButton
            label="Aşağı Al"
            onClick={() => setAdjustment((c) => ({ ...c, offsetY: c.offsetY + 8 }))}
          />
          <ControlButton
            label="Hafif Döndür"
            onClick={() => setAdjustment((c) => ({ ...c, rotation: c.rotation + 3 }))}
          />
          <ControlButton label="Konumu Sıfırla" onClick={() => setAdjustment(defaultAdjustment)} />
          {recommendation.product.type === 'earring' && (
            <ControlButton
              label={showLeftEarring ? 'Solu kaldır' : 'Solu geri getir'}
              onClick={() => setShowLeftEarring((current) => !current)}
            />
          )}
          {recommendation.product.type === 'earring' && (
            <ControlButton
              label={showRightEarring ? 'Sağı kaldır' : 'Sağı geri getir'}
              onClick={() => setShowRightEarring((current) => !current)}
            />
          )}
        </div>
      </div>
    </section>
  );
}

interface ControlButtonProps {
  label: string;
  onClick: () => void;
}

function ControlButton({ label, onClick }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      className="min-h-11 rounded-full border border-ink/10 px-3 py-3 text-sm leading-5 text-ink/75 transition hover:bg-ink hover:text-white sm:px-4"
    >
      {label}
    </button>
  );
}
