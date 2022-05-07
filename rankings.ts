import archetypes from "./archetypes.ts";
import formattedCards from "./classification.ts";
import type { Archetype } from "./types.ts";
import { TYPE_EXTENDER, TYPE_STARTER } from "./utils/common.ts";
import { array, pipeable } from "https://cdn.skypack.dev/fp-ts";
const { pipe } = pipeable;
const { map, filter } = array;

const sort = <T>(fn: (a: T, b: T) => number) => (arr: T[]) => arr.sort(fn);

const createArchetype = (name: string): Archetype => ({
  name,
  stats: {
    [TYPE_STARTER]: 0,
    [TYPE_EXTENDER]: 0,
    averageRating: 0,
  },
});

const countMembers = (at: Archetype): Archetype => {
  const relatedCards = formattedCards.filter(
    (c) => c.meta.archetype === at.name,
  );
  const starters = relatedCards.filter((c) => c.types[TYPE_STARTER] > 0);
  const extenders = relatedCards.filter((c) => c.types[TYPE_EXTENDER] > 0);

  return {
    ...at,
    stats: {
      ...at.stats,
      [TYPE_STARTER]: starters.length,
      [TYPE_EXTENDER]: extenders.length,
    },
  };
};

const rateDecktype = (at: Archetype): Archetype => {
  const members = formattedCards.filter((c) =>
    c.meta.archetype.includes(at.name)
  );
  const totalRating = members.reduce(
    (total, member) => member.meta.rating + total,
    0,
  );
  const averageRating = parseFloat((totalRating / members.length).toFixed(2));
  return {
    ...at,
    stats: {
      ...at.stats,
      averageRating,
    },
  };
};

const rankedArchetypes: Archetype[] = pipe(
  archetypes,
  map(createArchetype),
  map(countMembers),
  map(rateDecktype),
  filter((at: Archetype) => Boolean(at.stats.averageRating)),
  sort((a: Archetype, z: Archetype) =>
    z.stats.averageRating - a.stats.averageRating
  ),
);

export default rankedArchetypes;
