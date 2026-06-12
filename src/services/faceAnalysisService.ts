import {
  EarVisibility,
  FaceAnalysisResult,
  FaceShape,
  HairColor,
  NeckLength,
  SkinUndertone,
  UserProfile,
  EyeColor,
} from '../types';

export interface FaceAnalysisService {
  analyze(imageSrc: string, profile: UserProfile): Promise<FaceAnalysisResult>;
}

const faceShapes: FaceShape[] = ['oval', 'round', 'heart', 'square', 'long'];
const undertones: SkinUndertone[] = ['warm', 'cool', 'neutral'];
const neckLengths: NeckLength[] = ['short', 'medium', 'long'];
const earVisibilities: EarVisibility[] = ['low', 'medium', 'high'];
const eyeColors: EyeColor[] = ['Kahverengi', 'Ela', 'Mavi', 'Yesil', 'Gri'];
const hairColors: HairColor[] = ['Siyah', 'Koyu Kahve', 'Acik Kahve', 'Kumral', 'Sarisin', 'Kizil'];

const seededIndex = (seed: string, max: number) =>
  Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0) % max;

class MockFaceAnalysisService implements FaceAnalysisService {
  async analyze(imageSrc: string, profile: UserProfile): Promise<FaceAnalysisResult> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const seedBase = `${imageSrc.length}-${profile.personality}-${profile.hairColor}-${profile.eyeColor}`;
    const faceShape = faceShapes[seededIndex(seedBase, faceShapes.length)];
    const skinUndertone = undertones[seededIndex(profile.skinTone + seedBase, undertones.length)];
    const detectedHairColor = hairColors[seededIndex(profile.hairColor + seedBase, hairColors.length)];
    const detectedEyeColor = eyeColors[seededIndex(profile.eyeColor + seedBase, eyeColors.length)];
    const neckLength = neckLengths[seededIndex(profile.heightRange + seedBase, neckLengths.length)];
    const earVisibility = earVisibilities[seededIndex(profile.ageRange + seedBase, earVisibilities.length)];
    const confidenceSeed = seededIndex(`${seedBase}-${profile.ageRange}-${profile.skinTone}`, 22);
    const confidence = Math.min(0.97, 0.74 + confidenceSeed * 0.01);

    return {
      faceShape,
      skinUndertone,
      detectedHairColor,
      detectedEyeColor,
      neckLength,
      earVisibility,
      confidence,
      faceBox: {
        x: 0.5,
        y: 0.38,
        width: 0.34,
        height: 0.42,
      },
    };
  }
}

export const faceAnalysisService: FaceAnalysisService = new MockFaceAnalysisService();
