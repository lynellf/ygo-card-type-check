import {
  dirname,
  fromFileUrl,
} from "https://deno.land/std@0.138.0/path/mod.ts";
import type { Archetype } from "../types.ts";
import * as fpts from "https://cdn.skypack.dev/fp-ts";

const __filename = fromFileUrl(import.meta.url);
export const __dirname = dirname(dirname(__filename));

export const TYPE_STARTER = "starter";
export const TYPE_EXTENDER = "extender";
export const TYPE_INTERRUPT = "interrupt";
export const TYPE_FLOATER = "floater";
export const TYPE_FLOODGATE = "floodgate";
export const TYPE_BURN = "burn";

export const saveAs = <T>(path: string, data: T) => {
  const encoder = new TextEncoder();
  Deno.writeFile(
    path,
    encoder.encode(JSON.stringify(data)),
  );
};

export const sort = <T>(fn: (a: T, b: T) => number) =>
  (arr: T[]) => arr.sort(fn);

export const createArchetype = (name: string): Archetype => ({
  name,
  stats: {
    [TYPE_STARTER]: 0,
    [TYPE_EXTENDER]: 0,
    averageRating: 0,
  },
});

export { fpts };
