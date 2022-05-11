import {
  dirname,
  fromFileUrl,
} from "https://deno.land/std@0.138.0/path/mod.ts";

const __filename = fromFileUrl(import.meta.url);
export const __dirname = dirname(dirname(__filename));

export const TYPE_STARTER = "starter";
export const TYPE_EXTENDER = "extender";
export const TYPE_INTERRUPT = "interrupt";
export const TYPE_FLOATER = "floater";
export const TYPE_FLOODGATE = "floodgate";
export const TYPE_BURN = "burn";
export const TYPE_REMOVAL = "removal";
export const TYPE_IMMUNITY = "immunity";
export const KEY_AVG_RATING = "averageRating";
export const KEY_AVG_RARITY = "averageRarity";
export const KEY_RATIO = "ratingToRarity";
export const KEY_TOTAL_SPELLS = "totalSpells";
export const KEY_TOTAL_TRAPS = "totalTraps";

export const saveAs = <T>(path: string, data: T) => {
  const encoder = new TextEncoder();
  Deno.writeFile(
    path,
    encoder.encode(JSON.stringify(data)),
  );
};
