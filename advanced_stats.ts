import { ss } from "./utils/modules.ts";
import ratedArchetypes from "./stats.ts";
import {
  KEY_AVG_RARITY,
  KEY_AVG_RATING,
  KEY_RATIO,
  KEY_TOTAL_SPELLS,
  KEY_TOTAL_TRAPS,
  TYPE_EXTENDER,
  TYPE_IMMUNITY,
  TYPE_INTERRUPT,
  TYPE_REMOVAL,
  TYPE_STARTER,
} from "./utils/common.ts";

const { mean, standardDeviation, zScore } = ss;

const byKey = (keyname: string) =>
  ratedArchetypes.map((archetype) => archetype.stats[keyname]);

const [
  allRatings,
  allRarities,
  allRatios,
  allStarters,
  allExtenders,
  allInterrupts,
  allSpells,
  allTraps,
  allRemoval,
  allImmunity,
] = [
  KEY_AVG_RATING,
  KEY_AVG_RARITY,
  KEY_RATIO,
  TYPE_STARTER,
  TYPE_EXTENDER,
  TYPE_INTERRUPT,
  KEY_TOTAL_SPELLS,
  KEY_TOTAL_TRAPS,
  TYPE_REMOVAL,
  TYPE_IMMUNITY,
].map(byKey);

const applyMean = (population: number[]) => mean(population);
const applyStDev = (population: number[]) => standardDeviation(population);

export const [
  meanRatings,
  meanRarity,
  meanRatio,
  meanStarters,
  meanExtenders,
  meanInterrupts,
  meanSpells,
  meanTraps,
  meanRemoval,
  meanImmunity,
] = [
  allRatings,
  allRarities,
  allRatios,
  allStarters,
  allExtenders,
  allInterrupts,
  allSpells,
  allTraps,
  allRemoval,
  allImmunity,
].map(applyMean);

export const [
  ratingsStDev,
  rarityStDev,
  ratioStDev,
  starterStDev,
  extenderStDev,
  interruptStDev,
  spellStDev,
  trapStDev,
  removalStDev,
  immunityStDev,
] = [
  allRatings,
  allRarities,
  allRatios,
  allStarters,
  allExtenders,
  allInterrupts,
  allSpells,
  allTraps,
  allRemoval,
  allImmunity,
].map(applyStDev);

const getScore = (m: number, std: number, key: string) =>
  (stats: Record<string, number>) =>
    Math.round(parseFloat(zScore(stats[key], m, std).toFixed(2)));

const [
  getZRating,
  getZRarity,
  getZRatio,
  getZStarters,
  getZExtenders,
  getZInterrupts,
  getZSpells,
  getZTraps,
  getZRemoval,
  getZImmunity,
] = [
  {
    key: KEY_AVG_RATING,
    mean: meanRatings,
    std: ratingsStDev,
  },
  {
    key: KEY_AVG_RARITY,
    mean: meanRarity,
    std: rarityStDev,
  },
  {
    key: KEY_RATIO,
    mean: meanRatio,
    std: ratioStDev,
  },
  {
    key: TYPE_STARTER,
    mean: meanStarters,
    std: starterStDev,
  },
  {
    key: TYPE_EXTENDER,
    mean: meanExtenders,
    std: extenderStDev,
  },
  {
    key: TYPE_INTERRUPT,
    mean: meanInterrupts,
    std: interruptStDev,
  },
  {
    key: KEY_TOTAL_SPELLS,
    mean: meanSpells,
    std: spellStDev,
  },
  {
    key: KEY_TOTAL_TRAPS,
    mean: meanTraps,
    std: trapStDev,
  },
  {
    key: TYPE_REMOVAL,
    mean: meanRemoval,
    std: removalStDev,
  },
  {
    key: TYPE_IMMUNITY,
    mean: meanImmunity,
    std: immunityStDev,
  },
].map(({ key, mean, std }) => getScore(mean, std, key));

const advancedArchetypes = ratedArchetypes.map((
  { name, stats },
) => ({
  name,
  stats: {
    zRating: getZRating(stats),
    zRarity: getZRarity(stats),
    zRatio: getZRatio(stats),
    zStarters: getZStarters(stats),
    zExtenders: getZExtenders(stats),
    zInterrupts: getZInterrupts(stats),
    zSpells: getZSpells(stats),
    zTraps: getZTraps(stats),
    zRemoval: getZRemoval(stats),
    zImmunity: getZImmunity(stats),
  },
})).sort((a, z) => z.stats.zRatio - a.stats.zRatio);

export default advancedArchetypes;
