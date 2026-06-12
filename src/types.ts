export type ProductType = 'necklace' | 'earring';
export type StylePersonality =
  | 'Minimal'
  | 'Zarif'
  | 'Romantik'
  | 'Iddiali'
  | 'Sofistike'
  | 'Enerjik';
export type Occasion =
  | 'Gunluk'
  | 'Ofis'
  | 'Ozel Etkinlik'
  | 'Dugun / Nisan'
  | 'Hediye';
export type FaceShape = 'oval' | 'round' | 'heart' | 'square' | 'long';
export type SkinUndertone = 'warm' | 'cool' | 'neutral';
export type HairColor =
  | 'Siyah'
  | 'Koyu Kahve'
  | 'Acik Kahve'
  | 'Kumral'
  | 'Sarisin'
  | 'Kizil';
export type EyeColor = 'Kahverengi' | 'Ela' | 'Mavi' | 'Yesil' | 'Gri';
export type NeckLength = 'short' | 'medium' | 'long';
export type EarVisibility = 'low' | 'medium' | 'high';

export interface UserProfile {
  ageRange: string;
  heightRange: string;
  hairColor: HairColor;
  eyeColor: EyeColor;
  skinTone: string;
  personality: StylePersonality;
}

export interface FaceAnalysisResult {
  faceShape: FaceShape;
  skinUndertone: SkinUndertone;
  detectedHairColor: HairColor;
  detectedEyeColor: EyeColor;
  neckLength: NeckLength;
  earVisibility: EarVisibility;
  confidence: number;
  faceBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PlacementConfig {
  necklace?: {
    widthRatio: number;
    yOffset: number;
    rotation: number;
  };
  earring?: {
    leftXOffset: number;
    rightXOffset: number;
    yOffset: number;
    scale: number;
  };
}

export interface JewelryProduct {
  id: string;
  name: string;
  type: ProductType;
  imageUrl: string;
  transparentPngUrl: string;
  metalTone: 'gold' | 'silver' | 'rose_gold';
  styleTags: string[];
  suitableFaceShapes: FaceShape[];
  suitableSkinUndertones: SkinUndertone[];
  suitableHairColors: HairColor[];
  suitableEyeColors: EyeColor[];
  suitableOccasions: Occasion[];
  personalityTags: StylePersonality[];
  placementConfig: PlacementConfig;
}

export interface WizardData {
  jewelryType: ProductType;
  profile: UserProfile;
  occasion: Occasion;
  imageSrc?: string;
  imageMode?: 'camera' | 'upload';
}

export interface RecommendationItem {
  product: JewelryProduct;
  score: number;
  reason: string;
}

export interface TryOnAdjustment {
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}
