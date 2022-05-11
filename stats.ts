import archetypes from "./archetypes.ts";
import formattedCards from "./classification.ts";
import type { Archetype, ClassifiedCard as Card } from "./types.ts";
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
import { fpts } from "./utils/modules.ts";

const { array, pipeable } = fpts;
const { pipe } = pipeable;
const { map, filter } = array;

const sort = <T>(fn: (a: T, b: T) => number) => (arr: T[]) => arr.sort(fn);
const byType = (cards: Card[]) =>
  (type: string) => cards.filter((c) => c.types[type] > 0);
const byNonMonsterType = (cards: Card[]) =>
  (type: string) =>
    cards.filter((c) =>
      c.meta.other.type.toLowerCase().includes(type.toLowerCase())
    );

const createArchetype = (name: string): Archetype => ({
  name,
  stats: {
    [TYPE_INTERRUPT]: 0,
    [TYPE_STARTER]: 0,
    [TYPE_EXTENDER]: 0,
    [TYPE_REMOVAL]: 0,
    [TYPE_IMMUNITY]: 0,
    [KEY_AVG_RATING]: 0,
    [KEY_AVG_RARITY]: 0,
    [KEY_RATIO]: 0,
  },
});

const countMembers = (at: Archetype): Archetype => {
  const relatedCards = formattedCards.filter(
    (c) => c.meta.archetype === at.name,
  );
  const filterByType = byType(relatedCards);
  const filterByST = byNonMonsterType(relatedCards);
  const [starters, extenders, interrupts, removal, immunity] = [
    TYPE_STARTER,
    TYPE_EXTENDER,
    TYPE_INTERRUPT,
    TYPE_REMOVAL,
    TYPE_IMMUNITY,
  ].map(filterByType);
  const traps = filterByST("trap");
  const spells = filterByST("spell");

  return {
    ...at,
    stats: {
      ...at.stats,
      [TYPE_STARTER]: starters.length,
      [TYPE_EXTENDER]: extenders.length,
      [TYPE_INTERRUPT]: interrupts.length,
      [TYPE_REMOVAL]: removal.length,
      [TYPE_IMMUNITY]: immunity.length,
      [KEY_TOTAL_SPELLS]: spells.length,
      [KEY_TOTAL_TRAPS]: traps.length,
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
  const totalRarity = members.reduce(
    (total, member) => member.meta.rarity + total,
    0,
  );
  const averageRating = parseFloat((totalRating / members.length).toFixed(2));
  const averageRarity = parseFloat((totalRarity / members.length).toFixed(2));
  const ratingToRarity = parseFloat((averageRating / averageRarity).toFixed(2));

  return {
    ...at,
    stats: {
      ...at.stats,
      [KEY_AVG_RATING]: averageRating,
      [KEY_AVG_RARITY]: averageRarity,
      [KEY_RATIO]: ratingToRarity,
    },
  };
};

const ratedArchetypes: Archetype[] = pipe(
  archetypes,
  map(createArchetype),
  map(countMembers),
  map(rateDecktype),
  filter((at: Archetype) => !isNaN(at.stats[KEY_AVG_RATING])),
  sort((a: Archetype, z: Archetype) =>
    z.stats.ratingToRarity - a.stats.ratingToRarity
  ),
);

export default ratedArchetypes;
