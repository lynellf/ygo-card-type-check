import * as advanced from "./advanced_stats.ts";
import archetypes from "./archetypes.ts";
import ratedArchetypes from "./stats.ts";

console.log(
  "archetypes length",
  archetypes.length,
  "rated archetypes length",
  ratedArchetypes.length,
  "advanced",
  { ...advanced },
);
