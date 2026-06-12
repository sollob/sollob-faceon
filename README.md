# SOLLOB FACEON

SOLLOB FACEON is a premium jewelry recommendation and virtual try-on prototype built with React, TypeScript, and Tailwind CSS.

The experience is designed as a digital jewelry stylist:

- users choose a jewelry category
- complete a short personal style flow
- upload a photo or use the camera
- receive personalized necklace or earring recommendations
- preview the selected piece with a virtual try-on interface

## Highlights

- premium mobile-first UI
- multi-step Turkish onboarding flow
- mocked face analysis service abstraction
- modular recommendation scoring engine
- camera or photo based try-on flow
- draggable and adjustable jewelry overlay
- earring side toggles for left/right visibility

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

## Project Structure

```text
src/
  components/    UI building blocks and screens
  data/          mock product catalog
  services/      face analysis abstraction
  utils/         recommendation scoring logic
```

## Getting Started

```bash
npm install
npm run dev
```

Then open the local Vite URL in your browser.

## Build

```bash
npm run build
```

## Notes

- The current face analysis layer is mocked for prototype speed.
- The architecture is ready to swap in MediaPipe Face Landmarker or TensorFlow.js FaceMesh later.
- Product data is currently local mock data with placement configs for virtual try-on behavior.
