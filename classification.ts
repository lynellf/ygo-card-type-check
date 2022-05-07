import cards from "./cards.ts";
import archetypes from "./archetypes.ts";
import { array, pipeable } from "https://cdn.skypack.dev/fp-ts";
import * as phrases from "./phrases.ts";
import type { CardItem, ClassifiedCard as Card } from "./types.ts";

const { pipe } = pipeable;
const { map, sort } = array;

const TYPE_STARTER = "starter";
const TYPE_EXTENDER = "extender";
const TYPE_INTERRUPT = "interrupt";
const TYPE_FLOATER = "floater";
const TYPE_FLOODGATE = "floodgate";
const TYPE_BURN = "burn";

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

const phraseCheck = (phrases: string[], type: string) =>
  (card: Card): Card => {
    const hasPhrase = phrases.some((phrase) =>
      card.text.toLowerCase().includes(phrase)
    );
    return {
      ...card,
      types: {
        ...card.types,
        [type]: hasPhrase ? 1 : 0,
      },
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
    };

    return total + scoreBy[type] * value;
  }, 0);

  return {
    ...card,
    meta: {
      ...card.meta,
      rating,
    },
  };
};

const rateSpeed = (card: Card): Card => {
  const { text, meta } = card;
  const { monster: { types }, rating } = meta;
  const lowerText = `${text}`.toLowerCase();
  const lowerType = `${types.join(", ")}`.toLowerCase();
  const isPendulum = lowerType.includes("pendulum");
  const fastPhrases = [
    // 'special summon 1',
    // 'special summon 2',
    // 'special summon 3',
    // 'special summon 4',
    // 'special summon 5',
    // 'special summon as many',
    "you can special summon this card",
    "in addition to your",
  ];
  const slowPhrases = ["or destroy this card", "you can only use"];
  const canSpecialSummon = checkPhrases(fastPhrases, lowerText);
  const isSlow = checkPhrases(slowPhrases, lowerText);
  const speedCount = [
    { value: isPendulum, rating: 0.2 },
    { value: canSpecialSummon, rating: 0.9 },
    { value: isSlow, rating: -0.3 },
  ].filter((item) => item.value);
  const hasCount = speedCount.length > 0;
  const speedTotal = hasCount
    ? speedCount.reduce((sum, item) => sum + item.rating, 0) / speedCount.length
    : 0;

  return {
    ...card,
    meta: {
      ...meta,
      rating: speedTotal + rating,
    },
  };
};

const formatData = (c: CardItem): Card => ({
  name: c.name,
  text: c.description,
  types: {
    [TYPE_STARTER]: 0,
    [TYPE_EXTENDER]: 0,
    [TYPE_INTERRUPT]: 0,
    [TYPE_FLOATER]: 0,
    [TYPE_FLOODGATE]: 0,
    [TYPE_BURN]: 0,
  },
  meta: {
    monster: {
      types: c.monsterType,
      race: c.monsterType.length > 0 ? c.race : "",
      attribute: "",
      atk: 0,
      def: 0,
    },
    other: {
      type: c.monsterType.length === 0 ? c.type : "",
      kind: c.monsterType.length === 0 ? c.race : "",
    },
    decktypes: c.deckTypes,
    rating: 0,
    archetype: "",
  },
});

const classifiedCards: Card[] = pipe(
  cards,
  map(formatData),
  map(phraseCheck(phrases.starterPhrases, TYPE_STARTER)),
  map(phraseCheck(phrases.extenderPhrases, TYPE_EXTENDER)),
  map(phraseCheck(phrases.interruptPhrases, TYPE_INTERRUPT)),
  map(phraseCheck(phrases.burnPhrases, TYPE_BURN)),
  map(phraseCheck(phrases.floaterPhrases, TYPE_FLOATER)),
  map(phraseCheck(phrases.floodgatePhrases, TYPE_FLOODGATE)),
  map(checkClauses(phrases.floodgateClauses, TYPE_FLOODGATE)),
  map(compareTypes(TYPE_FLOATER, TYPE_STARTER)),
  map(applyArchetype(archetypes)),
  map(rateTypes),
  map(rateSpeed),
  sort((a: Card, z: Card) => z.meta.rating - a.meta.rating),
  // filter((card) => card.meta.level <= 4)
);

export default classifiedCards;
