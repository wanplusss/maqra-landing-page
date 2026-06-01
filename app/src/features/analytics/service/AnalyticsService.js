import { predictKhatam, getPace } from "./prediction.js";
import { getTargetVsAchieved, batchCheckTargets } from "./targetTracker.js";
import { getMurajaahPlan, getDecayScores } from "./murajaahPlan.js";

export const AnalyticsService = {
  predictKhatam,
  getPace,
  getTargetVsAchieved,
  batchCheckTargets,
  getMurajaahPlan,
  getDecayScores
};
