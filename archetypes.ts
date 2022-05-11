import cards from "./cards.ts";
import { fpts } from "./utils/modules.ts";
import type { CardItem as Card } from "./types.ts";

const { array, pipeable, string } = fpts;
const { pipe } = pipeable;
const { map, filter, flatten } = array;
const { split, toLowerCase } = string;

const toSet = <T>(iterable: Iterable<T>) => new Set(iterable);
const toArr = <T>(iterable: Iterable<T>) => [...iterable];

const parseKeyword = (sentence: string) => sentence.split('"')[1];
const validateKeyword = (name: string) =>
  (text: string) => {
    return (
      name.toLowerCase() !== text.toLowerCase() &&
      name.toLowerCase().includes(text.toLowerCase())
    );
  };

const withArchetype = (card: Card) => {
  const { description, name } = card;
  const quotedTexts: string[] = pipe(
    description,
    split("."),
    map(parseKeyword),
    filter(Boolean),
    filter(validateKeyword(name)),
    map(toLowerCase),
    filter(Boolean),
  );
  return quotedTexts;
};

const byTextMatch = (at: string) =>
  (c: Card) => {
    const { description, name } = c;
    const lowerName = name.toLowerCase();
    const lowerText = description.toLowerCase();
    const hasMatch = lowerName.includes(at) ||
      at.includes(lowerName) ||
      lowerText.includes(at);
    return hasMatch;
  };

const byTotalMatches = (minimum: number) =>
  (at: string) => {
    const matches = cards.filter(byTextMatch(at));
    return matches.length >= minimum;
  };

const archetypes: string[] = pipe(
  cards,
  map(withArchetype),
  flatten,
  filter((arr: string[]) => arr.length > 0),
  filter(byTotalMatches(8)),
  toSet,
  toArr,
);

export default archetypes;
