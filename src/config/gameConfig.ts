export const GameConfig = {
  // Question System
  questionInterval: 15000,
  initialQuestionDelay: 2000,
  bulletTimeFactor: 0.05, // 5% speed during questions
  questionDuration: 10000, // ms

  // Consequence System
  maxStrikes: 3,
  towersToDestroy: 1,

  // Tower Stats
  mainTowerHP: 1000,
  subTowerHP: 3,
  startingSubTowers: 0,

  // Audio
  lowPassFilterFreq: 400,

  // Visuals
  colorOverlayAlpha: 0.5
};
