import rankedArchetypes from "./stats.ts";
import classifiedCards from "./classification.ts";
import advancedArchetypes from "./advanced_stats.ts";

import { __dirname, saveAs } from "./utils/common.ts";
const now = Date.now();
const basePath = `${__dirname}/data`;

saveAs(
  `${basePath}/rankings/ranked_${now}.json`,
  rankedArchetypes,
);

saveAs(
  `${basePath}/formatted/formatted${now}.json`,
  classifiedCards,
);

saveAs(`${basePath}/rankings/advanced_${now}.json`, advancedArchetypes);
