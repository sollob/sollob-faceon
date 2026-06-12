import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Occasion, StylePersonality, WizardData } from '../types';

interface FaceOnWizardProps {
  initialValue: WizardData;
  onSubmit: (data: WizardData) => void;
  isAnalyzing: boolean;
  initialStep?: number;
  cameraRetakeSignal?: number;
}

const personalities: StylePersonality[] = [
  'Minimal',
  'Zarif',
  'Romantik',
  'Iddiali',
  'Sofistike',
  'Enerjik',
];

const occasions: Occasion[] = [
  'Gunluk',
  'Ofis',
  'Ozel Etkinlik',
  'Dugun / Nisan',
  'Hediye',
];

const stepTitles = [
  'Takı Kategorisi',
  'Profilin',
  'Kullanım Anı',
  'Fotoğraf veya Kamera',
];

export function FaceOnWizard({
  initialValue,
  onSubmit,
  isAnalyzing,
  initialStep = 0,
  cameraRetakeSignal = 0,
}: FaceOnWizardProps) {
  const [step, setStep] = useState(initialStep);
  const [form, setForm] = useState<WizardData>(initialValue);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const canContinue = useMemo(() => {
    if (step === 3) {
      return Boolean(form.imageSrc);
    }

    return true;
  }, [form.imageSrc, step]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !cameraStream || !cameraOpen || form.imageSrc) return;

    video.srcObject = cameraStream;
    void video.play().catch(() => undefined);

    return () => {
      if (video.srcObject === cameraStream) {
        video.srcObject = null;
      }
    };
  }, [cameraOpen, cameraStream, form.imageSrc]);

  useEffect(() => {
    setForm(initialValue);
  }, [initialValue]);

  const openCamera = async () => {
    try {
      setCameraError(null);
      setCameraOpen(true);
      setForm((current) => ({
        ...current,
        imageSrc: undefined,
        imageMode: 'camera',
      }));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      setCameraStream(stream);
    } catch (error) {
      setCameraError('Kameraya erişilemedi. Fotoğraf yükleyerek devam edebilirsiniz.');
      setCameraOpen(false);
      setCameraStream(null);
    }
  };

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    if (cameraRetakeSignal === 0) return;

    setStep(3);
    setForm((current) => ({
      ...current,
      imageSrc: undefined,
      imageMode: 'camera',
    }));
    void openCamera();
  }, [cameraRetakeSignal]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    const context = canvas.getContext('2d');

    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    setForm((current) => ({
      ...current,
      imageSrc: canvas.toDataURL('image/png'),
      imageMode: 'camera',
    }));
  };

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraStream(null);
      setCameraOpen(false);
      setForm((current) => ({
        ...current,
        imageSrc: reader.result as string,
        imageMode: 'upload',
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-luxe backdrop-blur sm:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {stepTitles.map((title, index) => (
          <div
            key={title}
            className={`rounded-full px-4 py-2 text-sm ${
              index === step
                ? 'bg-ink text-white'
                : index < step
                  ? 'bg-gold/20 text-ink'
                  : 'bg-ink/5 text-ink/50'
            }`}
          >
            {index + 1}. {title}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { value: 'necklace', label: 'Kolye' },
            { value: 'earring', label: 'Küpe' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  jewelryType: item.value as 'necklace' | 'earring',
                }))
              }
              className={`rounded-[1.5rem] border p-6 text-left transition ${
                form.jewelryType === item.value
                  ? 'border-gold bg-gold/10'
                  : 'border-ink/10 bg-white/80 hover:border-gold/50'
              }`}
            >
              <div className="font-display text-3xl text-ink">{item.label}</div>
              <p className="mt-2 text-sm text-ink/60">
                Sana en uygun oran ve stil eşleşmelerini bu kategoriye göre filtreleyelim.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
                {form.jewelryType === item.value ? 'Seçildi' : 'Seçmek için dokun'}
              </p>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Yaş Aralığı"
            value={form.profile.ageRange}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                profile: { ...current.profile, ageRange: value },
              }))
            }
            options={['18-24', '25-34', '35-44', '45+']}
          />
          <SelectField
            label="Boy Aralığı"
            value={form.profile.heightRange}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                profile: { ...current.profile, heightRange: value },
              }))
            }
            options={['150-160', '160-170', '170-180', '180+']}
          />
          <SelectField
            label="Saç Rengi"
            value={form.profile.hairColor}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                profile: { ...current.profile, hairColor: value as WizardData['profile']['hairColor'] },
              }))
            }
            options={['Siyah', 'Koyu Kahve', 'Acik Kahve', 'Kumral', 'Sarisin', 'Kizil']}
          />
          <SelectField
            label="Göz Rengi"
            value={form.profile.eyeColor}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                profile: { ...current.profile, eyeColor: value as WizardData['profile']['eyeColor'] },
              }))
            }
            options={['Kahverengi', 'Ela', 'Mavi', 'Yesil', 'Gri']}
          />
          <SelectField
            label="Ten Tonu"
            value={form.profile.skinTone}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                profile: { ...current.profile, skinTone: value },
              }))
            }
            options={['Acik', 'Bugday', 'Orta', 'Esmer']}
          />
          <div className="rounded-[1.5rem] border border-ink/10 bg-white/80 p-4">
            <label className="mb-3 block text-sm font-semibold text-ink">Stil Karakteri</label>
            <div className="grid grid-cols-2 gap-2">
              {personalities.map((personality) => (
                <button
                  key={personality}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      profile: { ...current.profile, personality },
                    }))
                  }
                  className={`rounded-full px-4 py-3 text-sm ${
                    form.profile.personality === personality
                      ? 'bg-ink text-white'
                      : 'bg-ink/5 text-ink/70'
                  }`}
                >
                  {personality === 'Iddiali' ? 'İddialı' : personality}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {occasions.map((occasion) => (
            <button
              key={occasion}
              onClick={() => setForm((current) => ({ ...current, occasion }))}
              className={`rounded-[1.5rem] border p-5 text-left ${
                form.occasion === occasion
                  ? 'border-gold bg-gold/10'
                  : 'border-ink/10 bg-white/80'
              }`}
            >
              <span className="font-display text-2xl text-ink">
                {occasion === 'Gunluk'
                  ? 'Günlük'
                  : occasion === 'Ofis'
                    ? 'Ofis'
                    : occasion === 'Ozel Etkinlik'
                      ? 'Özel Etkinlik'
                      : occasion === 'Dugun / Nisan'
                        ? 'Düğün / Nişan'
                        : 'Hediye'}
              </span>
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <button
              onClick={openCamera}
              className="w-full rounded-[1.25rem] border border-ink/10 bg-white/80 px-5 py-4 text-left"
            >
              <div className="font-display text-2xl text-ink">Kamerayı Aç</div>
              <p className="mt-1 text-sm text-ink/60">Canlı görüntü ile kare al ve öneriyi hızlandır.</p>
            </button>
            <label className="block cursor-pointer rounded-[1.25rem] border border-ink/10 bg-white/80 px-5 py-4">
              <div className="font-display text-2xl text-ink">Fotoğraf Yükle</div>
              <p className="mt-1 text-sm text-ink/60">Portre fotoğrafını seç ve denemeye geç.</p>
              <input className="hidden" type="file" accept="image/*" onChange={onUpload} />
            </label>
            <p className="rounded-[1.25rem] bg-blush px-4 py-3 text-sm text-ink/70">
              Görüntünüz sadece öneri ve deneme deneyimi için kullanılır.
            </p>
            {cameraError && <p className="text-sm text-rose-700">{cameraError}</p>}
          </div>

          <div className="rounded-[1.75rem] border border-ink/10 bg-[#f7efea] p-4">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white/80">
              {cameraOpen && !form.imageSrc && (
                <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
              )}
              {!cameraOpen && !form.imageSrc && (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-ink/55">
                  Kamera açıldığında veya fotoğraf yüklendiğinde önizleme burada görünecek.
                </div>
              )}
              {form.imageSrc && (
                <img src={form.imageSrc} alt="Yuklenen portre" className="h-full w-full object-cover" />
              )}
            </div>
            {cameraOpen && !form.imageSrc && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={capturePhoto}
                  className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
                >
                  Bu Kareyi Kullan
                </button>
                <button
                  onClick={openCamera}
                  className="w-full rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink"
                >
                  Yeni Kare Çek
                </button>
              </div>
            )}
            {form.imageSrc && (
              <button
                onClick={openCamera}
                className="mt-4 w-full rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink"
              >
                Yeni Kare Çek
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
          disabled={step === 0}
          className="rounded-full border border-ink/10 px-5 py-3 text-sm text-ink/65 disabled:opacity-40"
        >
          Geri
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep((current) => Math.min(current + 1, 3))}
            disabled={!canContinue}
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            Devam Et
          </button>
        ) : (
          <button
            onClick={() => onSubmit(form)}
            disabled={!canContinue || isAnalyzing}
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isAnalyzing ? 'Analiz Yapılıyor...' : 'Önerilerimi Göster'}
          </button>
        )}
      </div>
    </section>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="rounded-[1.5rem] border border-ink/10 bg-white/80 p-4">
      <span className="mb-3 block text-sm font-semibold text-ink">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-ink outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 'Sarisin'
              ? 'Sarışın'
              : option === 'Kizil'
                ? 'Kızıl'
                : option === 'Yesil'
                  ? 'Yeşil'
                  : option === 'Acik Kahve'
                    ? 'Açık Kahve'
                    : option}
          </option>
        ))}
      </select>
    </label>
  );
}
