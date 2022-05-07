import rankedArchetypes from "./rankings.ts";
import classifiedCards from "./classification.ts";
import { __dirname, saveAs } from "./utils/common.ts";

saveAs(
  `${__dirname}/data/rankings/ranked_${Date.now()}.json`,
  rankedArchetypes,
);

saveAs(
  `${__dirname}/data/formatted/formatted${Date.now()}.json`,
  classifiedCards,
);
