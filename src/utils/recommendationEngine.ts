import {
  FaceAnalysisResult,
  JewelryProduct,
  RecommendationItem,
  WizardData,
} from '../types';

const scoreProduct = (
  product: JewelryProduct,
  wizard: WizardData,
  analysis: FaceAnalysisResult,
): RecommendationItem => {
  let score = 0;

  if (wizard.jewelryType === product.type) {
    score += 14;
  }

  if (product.personalityTags.includes(wizard.profile.personality)) {
    score += 20;
  }

  if (product.suitableOccasions.includes(wizard.occasion)) {
    score += 16;
  }

  if (product.suitableFaceShapes.includes(analysis.faceShape)) {
    score += 18;
  }

  if (product.suitableSkinUndertones.includes(analysis.skinUndertone)) {
    score += 14;
  }

  if (
    product.suitableHairColors.includes(analysis.detectedHairColor) ||
    product.suitableHairColors.includes(wizard.profile.hairColor)
  ) {
    score += 10;
  }

  if (
    product.suitableEyeColors.includes(analysis.detectedEyeColor) ||
    product.suitableEyeColors.includes(wizard.profile.eyeColor)
  ) {
    score += 8;
  }

  if (analysis.neckLength === 'long' && product.type === 'necklace') {
    score += 4;
  }

  if (analysis.earVisibility !== 'low' && product.type === 'earring') {
    score += 4;
  }

  const fragments = [
    `${wizard.profile.personality.toLowerCase()} stil seçimin`,
    `${analysis.skinUndertone === 'warm' ? 'sıcak' : analysis.skinUndertone === 'cool' ? 'soğuk' : 'dengeleyici'} alt tonun`,
    `${analysis.faceShape} yüz formun`,
  ];

  return {
    product,
    score,
    reason: `${fragments.slice(0, 2).join(' ve ')} ile uyumlu. ${fragments[2]} bu modeli daha dengeli gösterir.`,
  };
};

export const getTopRecommendations = (
  products: JewelryProduct[],
  wizard: WizardData,
  analysis: FaceAnalysisResult,
  excludedIds: string[] = [],
): RecommendationItem[] =>
  products
    .filter((product) => product.type === wizard.jewelryType)
    .filter((product) => !excludedIds.includes(product.id))
    .map((product) => scoreProduct(product, wizard, analysis))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
