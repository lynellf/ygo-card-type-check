import cards from "./cards.ts";
import archetypes from "./archetypes.ts";
import { fpts } from "./utils/modules.ts";
import * as phrases from "./phrases.ts";
import type { CardItem, ClassifiedCard as Card } from "./types.ts";
import {
  TYPE_BURN,
  TYPE_EXTENDER,
  TYPE_FLOATER,
  TYPE_FLOODGATE,
  TYPE_IMMUNITY,
  TYPE_INTERRUPT,
  TYPE_REMOVAL,
  TYPE_STARTER,
} from "./utils/common.ts";

const typesWithPhrases = [
  {
    type: TYPE_BURN,
    phrases: phrases.burnPhrases,
  },
  {
    type: TYPE_EXTENDER,
    phrases: phrases.extenderPhrases,
  },
  {
    type: TYPE_FLOATER,
    phrases: phrases.floaterPhrases,
  },
  {
    type: TYPE_IMMUNITY,
    phrases: phrases.immunityPhrases,
  },
  {
    type: TYPE_INTERRUPT,
    phrases: phrases.interruptPhrases,
  },
  {
    type: TYPE_REMOVAL,
    phrases: phrases.removalPhrases,
  },
  {
    type: TYPE_STARTER,
    phrases: phrases.starterPhrases,
  },
];

type Phrases = typeof typesWithPhrases;

const { array, pipeable } = fpts;

const { pipe } = pipeable;
const { map, sort } = array;

const applyArchetype = (archetypes: string[]) =>
  (card: Card): Card => {
    const archetype = archetypes.find(
      (at) => card.name.toLowerCase().includes(at) && at.length >= 3,
    ) ?? "";

    return {
      ...card,
      meta: {
        ...card.meta,
        archetype,
      },
    };
  };

const checkPhrases = (phrases: string[], text: string) => {
  return phrases.some((phrase) => text.toLowerCase().includes(phrase));
};

const checkClauses = (phrases: string[], type: string) =>
  (card: Card): Card => {
    const hasClause = checkPhrases(phrases, card.text);
    return {
      ...card,
      types: {
        ...card.types,
        [type]: hasClause ? 0 : card.types[type],
      },
    };
  };

const addType = (card: Card) =>
  (
    output: Record<string, number>,
    { type, phrases }: Phrases[number],
  ) => {
    const hasPhrase = phrases.some((phrase) =>
      card.text.toLowerCase().includes(phrase)
    );

    return {
      ...output,
      [type]: hasPhrase ? 1 : 0,
    };
  };

const applyTypes = (phrases: Phrases) =>
  (card: Card): Card => {
    const types = phrases.reduce(addType(card), {} as Record<string, number>);

    return {
      ...card,
      types,
    };
  };

const compareTypes = (keep: string, remove: string) =>
  (card: Card): Card => {
    const { types } = card;
    const valA = types[keep];
    const valB = types[remove];
    const areSame = valA === valB;

    return {
      ...card,
      types: {
        ...types,
        [remove]: areSame ? 0 : valB,
      },
    };
  };

const rateTypes = (card: Card): Card => {
  const { types } = card;
  const rating = Object.entries(types).reduce((total, [type, value]) => {
    const scoreBy: Record<string, number> = {
      [TYPE_STARTER]: 0.9,
      [TYPE_EXTENDER]: 0.5,
      [TYPE_INTERRUPT]: 0.4,
      [TYPE_FLOATER]: 0.3,
      [TYPE_FLOODGATE]: 0.8,
      [TYPE_BURN]: 0.2,
      [TYPE_REMOVAL]: 0.6,
      [TYPE_IMMUNITY]: 0.7,
    };
    const rating = total + scoreBy[type] * value;
    return !isNaN(rating) ? rating : 0;
  }, 0);

  return {
    ...card,
    meta: {
      ...card.meta,
      rating,
    },
  };
};
const formatData = (c: CardItem): Card => {
  const isMonster = c.monsterType.length > 0;
  const rarities = new Map([
    ["N", 1],
    ["R", 2],
    ["SR", 3],
    ["UR", 4],
  ]);

  return {
    name: c.name,
    text: c.description,
    types: {
      [TYPE_STARTER]: 0,
      [TYPE_EXTENDER]: 0,
      [TYPE_INTERRUPT]: 0,
      [TYPE_FLOATER]: 0,
      [TYPE_FLOODGATE]: 0,
      [TYPE_BURN]: 0,
      [TYPE_IMMUNITY]: 0,
      [TYPE_REMOVAL]: 0,
    },
    meta: {
      monster: {
        types: c.monsterType,
        race: isMonster ? c.race : "",
        attribute: "",
        atk: 0,
        def: 0,
      },
      other: {
        type: !isMonster ? c.type : "",
        kind: !isMonster ? c.race : "",
      },
      decktypes: c.deckTypes,
      rating: 0,
      archetype: "",
      rarity: rarities.get(c.rarity) ?? 1,
    },
  };
};

const classifiedCards: Card[] = pipe(
  cards,
  map(formatData),
  map(applyTypes(typesWithPhrases)),
  map(checkClauses(phrases.floodgateClauses, TYPE_FLOODGATE)),
  map(compareTypes(TYPE_FLOATER, TYPE_STARTER)),
  map(applyArchetype(archetypes)),
  map(rateTypes),
  sort((a: Card, z: Card) => z.meta.rating - a.meta.rating),
  // filter((card) => card.meta.level <= 4)
);

export default classifiedCards;
