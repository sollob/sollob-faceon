import { useEffect, useRef, useState } from 'react';
import { FaceOnLanding } from './components/FaceOnLanding';
import { FaceOnWizard } from './components/FaceOnWizard';
import { RecommendationResult } from './components/RecommendationResult';
import { VirtualTryOnCanvas } from './components/VirtualTryOnCanvas';
import { mockProducts } from './data/mockProducts';
import { faceAnalysisService } from './services/faceAnalysisService';
import {
  FaceAnalysisResult,
  RecommendationItem,
  WizardData,
} from './types';
import { getTopRecommendations } from './utils/recommendationEngine';

const MAX_RECOMMENDATION_SCORE = 108;

const defaultWizardData: WizardData = {
  jewelryType: 'necklace',
  occasion: 'Gunluk',
  profile: {
    ageRange: '25-34',
    heightRange: '160-170',
    hairColor: 'Koyu Kahve',
    eyeColor: 'Kahverengi',
    skinTone: 'Bugday',
    personality: 'Zarif',
  },
};

function App() {
  const [started, setStarted] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>(defaultWizardData);
  const [analysis, setAnalysis] = useState<FaceAnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seenRecommendationIds, setSeenRecommendationIds] = useState<string[]>([]);
  const [wizardStepOverride, setWizardStepOverride] = useState(0);
  const [cameraRetakeSignal, setCameraRetakeSignal] = useState(0);
  const [shouldScrollToResults, setShouldScrollToResults] = useState(false);
  const tryOnRef = useRef<HTMLDivElement | null>(null);

  const analyzeAndRecommend = async (data: WizardData) => {
    if (!data.imageSrc) return;

    setWizardData(data);
    setIsAnalyzing(true);

    try {
      const nextAnalysis = await faceAnalysisService.analyze(data.imageSrc, data.profile);
      const nextRecommendations = getTopRecommendations(mockProducts, data, nextAnalysis);

      setAnalysis(nextAnalysis);
      setRecommendations(nextRecommendations);
      setSelectedRecommendation(nextRecommendations[0] ?? null);
      setSeenRecommendationIds(nextRecommendations.map((item) => item.product.id));
      setWizardStepOverride(3);
      setShouldScrollToResults(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const refreshRecommendations = () => {
    if (!analysis) return;

    const pool = getTopRecommendations(mockProducts, wizardData, analysis, seenRecommendationIds);
    const nextRecommendations = pool.length > 0 ? pool : getTopRecommendations(mockProducts, wizardData, analysis);

    setRecommendations(nextRecommendations);
    setSelectedRecommendation(nextRecommendations[0] ?? null);
    setSeenRecommendationIds((current) => {
      const combined = [...current, ...nextRecommendations.map((item) => item.product.id)];
      const eligibleCount = mockProducts.filter(
        (product) => product.type === wizardData.jewelryType,
      ).length;

      return combined.length >= eligibleCount
        ? nextRecommendations.map((item) => item.product.id)
        : combined;
    });
  };

  const handleRetakePhoto = () => {
    setAnalysis(null);
    setRecommendations([]);
    setSelectedRecommendation(null);
    setWizardData((current) => ({
      ...current,
      imageSrc: undefined,
      imageMode: 'camera',
    }));
    setWizardStepOverride(3);
    setCameraRetakeSignal((current) => current + 1);
  };

  useEffect(() => {
    if (!shouldScrollToResults || !selectedRecommendation || !wizardData.imageSrc) return;

    const timeoutId = window.setTimeout(() => {
      tryOnRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setShouldScrollToResults(false);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [selectedRecommendation, shouldScrollToResults, wizardData.imageSrc]);

  const selectedRecommendationConfidence =
    analysis && selectedRecommendation
      ? getRecommendationConfidence(selectedRecommendation.score, analysis.confidence)
      : null;

  return (
    <main className="min-h-screen px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] border border-white/60 bg-white/70 px-4 py-4 backdrop-blur sm:rounded-full sm:px-5">
          <div>
            <p className="font-display text-2xl text-ink sm:text-3xl">SOLLOB FACEON</p>
            <p className="text-xs uppercase tracking-[0.24em] text-ink/50">Jewelry Try-On Prototype</p>
          </div>
          <div className="rounded-full bg-blush px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/60 sm:px-4 sm:text-xs">
            Prototype Demo
          </div>
        </header>

        {!started ? (
          <FaceOnLanding onStart={() => setStarted(true)} />
        ) : (
          <>
            <FaceOnWizard
              initialValue={wizardData}
              onSubmit={analyzeAndRecommend}
              isAnalyzing={isAnalyzing}
              initialStep={wizardStepOverride}
              cameraRetakeSignal={cameraRetakeSignal}
            />

            {analysis && recommendations.length > 0 && (
              <div className="flex flex-col gap-4 sm:gap-6">
                <section className="rounded-[1.75rem] border border-white/60 bg-white/70 p-4 shadow-luxe sm:rounded-[2rem] sm:p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InsightCard label="Yüz Formu" value={analysis.faceShape} />
                    <InsightCard
                      label="Alt Ton"
                      value={
                        analysis.skinUndertone === 'warm'
                          ? 'Sıcak'
                          : analysis.skinUndertone === 'cool'
                            ? 'Soğuk'
                            : 'Nötr'
                      }
                    />
                  </div>
                </section>

                <RecommendationResult
                  recommendations={recommendations}
                  onTryOn={setSelectedRecommendation}
                  onRefresh={refreshRecommendations}
                />

                {selectedRecommendation && wizardData.imageSrc && (
                  <div ref={tryOnRef}>
                    <VirtualTryOnCanvas
                      imageSrc={wizardData.imageSrc}
                      recommendation={selectedRecommendation}
                      analysis={analysis}
                      onRetakePhoto={handleRetakePhoto}
                      confidenceScore={selectedRecommendationConfidence ?? Math.round(analysis.confidence * 100)}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

interface InsightCardProps {
  label: string;
  value: string;
}

function InsightCard({ label, value }: InsightCardProps) {
  const displayValue =
    label === 'Yüz Formu'
      ? {
          oval: 'Oval',
          round: 'Yuvarlak',
          heart: 'Kalp',
          square: 'Kare',
          long: 'Uzun',
        }[value] ?? value
      : value;

  return (
    <div className="rounded-[1.35rem] bg-[#fcf7f2] p-4 sm:rounded-[1.5rem] sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">{label}</p>
      <p className="mt-2 font-display text-[2rem] capitalize leading-none text-ink sm:text-3xl">{displayValue}</p>
    </div>
  );
}

function getRecommendationConfidence(score: number, analysisConfidence: number) {
  const matchRatio = Math.min(1, score / MAX_RECOMMENDATION_SCORE);
  const blendedConfidence = analysisConfidence * 0.58 + matchRatio * 0.42;

  return Math.round(Math.min(97, Math.max(72, blendedConfidence * 100)));
}

export default App;
