interface FaceOnLandingProps {
  onStart: () => void;
}

export function FaceOnLanding({ onStart }: FaceOnLandingProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-hero-glow px-6 py-10 shadow-luxe sm:px-10 sm:py-14">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
      <div className="absolute -left-10 bottom-6 h-32 w-32 rounded-full bg-rose/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-ink/70">
            SOLLOB FACEON
          </span>
          <div className="space-y-4">
            <h1 className="max-w-xl font-display text-5xl leading-none text-ink sm:text-6xl">
              Karakterine Uygun Takını Bul
            </h1>
            <p className="max-w-xl text-base leading-7 text-ink/75 sm:text-lg">
              Yüz karakterine, ten tonuna, saç ve göz rengine göre sana en uygun
              SOLLOB FACEON kolye ve küpeleri keşfet. FaceOn, seçimini kişisel bir dijital
              stil danışmanı gibi şekillendirir.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onStart}
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
            >
              Deneyimi Başlat
            </button>
            <div className="rounded-full border border-ink/10 bg-white/70 px-5 py-3 text-sm text-ink/70">
              Kişiselleştirilmiş öneri + sanal deneme
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            'Yüz formuna göre seçilmiş oranlar',
            'Sıcak, soğuk ve nötr alt ton uyumu',
            'Stiline göre premium öneriler',
            'Fotoğraf veya canlı kamera ile try-on',
          ].map((item) => (
            <div
              key={item}
              className="rounded-[1.75rem] border border-white/60 bg-white/65 p-5 backdrop-blur"
            >
              <p className="font-display text-2xl text-ink">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
