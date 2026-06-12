import { RecommendationItem } from '../types';

interface RecommendationResultProps {
  recommendations: RecommendationItem[];
  onTryOn: (item: RecommendationItem) => void;
  onRefresh: () => void;
}

export function RecommendationResult({
  recommendations,
  onTryOn,
  onRefresh,
}: RecommendationResultProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/60 bg-white/70 p-4 shadow-luxe sm:rounded-[2rem] sm:p-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55">
            SOLLOB FACEON öneri sonucu
          </span>
          <h2 className="mt-2 font-display text-3xl leading-none text-ink sm:text-4xl">Senin için seçilen parçalar</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70 sm:leading-7">
            FaceOn; stil karakterin, yüz formun ve renk uyumlarına göre en dengeli
            üç parçayı öne çıkarır.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="w-full rounded-full border border-ink/10 px-5 py-3 text-sm font-semibold text-ink sm:w-auto"
        >
          Yeni Öneri Getir
        </button>
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        {recommendations.map((item) => (
          <article
            key={item.product.id}
            className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/80 shadow-luxe sm:rounded-[2rem]"
          >
            <div className="aspect-[4/3] bg-[#fbf4ef] p-4 sm:p-6">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="space-y-4 p-4 sm:p-6">
              <div>
                <h3 className="font-display text-[2rem] leading-none text-ink sm:text-3xl">{item.product.name}</h3>
                <p className="mt-1 text-sm text-gold">Uyum skoru: {item.score}</p>
              </div>
              <p className="text-sm leading-6 text-ink/70 sm:leading-7">{item.reason}</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  onClick={() => onTryOn(item)}
                  className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white sm:w-auto"
                >
                  Denemeye Başla
                </button>
                <button className="w-full rounded-full border border-ink/10 px-5 py-3 text-sm text-ink/75 sm:w-auto">
                  Sepete Ekle
                </button>
                <button className="w-full rounded-full border border-ink/10 px-5 py-3 text-sm text-ink/75 sm:w-auto">
                  WhatsApp&apos;ta Sor
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
