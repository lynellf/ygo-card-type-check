import cards from "./cards.ts";
import { fpts } from "./utils/common.ts";
import type { CardItem as Card } from "./types.ts";

const { array, pipeable, string } = fpts;
const { pipe } = pipeable;
const { map, filter, flatten } = array;
const { split, toLowerCase } = string;

const toSet = <T>(iterable: Iterable<T>) => new Set(iterable);
const toArr = <T>(iterable: Iterable<T>) => [...iterable];

const archetypes: string[] = pipe(
  cards,
  map((card: Card) => {
    const { description, name } = card;
    const quotedTexts = pipe(
      description,
      split("."),
      map((sentence: string) => sentence.split('"')[1]),
      filter(Boolean),
      filter((text: string) => {
        return (
          name.toLowerCase() !== text.toLowerCase() &&
          name.toLowerCase().includes(text.toLowerCase())
        );
      }),
      map(toLowerCase),
      filter(Boolean),
    );
    return quotedTexts;
  }),
  flatten,
  filter((arr: string[]) => arr.length > 0),
  filter((at: string) => {
    const matches = cards.filter((c) => {
      const { description, name } = c;
      const lowerName = name.toLowerCase();
      const lowerText = description.toLowerCase();
      const hasMatch = lowerName.includes(at) ||
        at.includes(lowerName) ||
        lowerText.includes(at);
      return hasMatch;
    });

    return matches.length >= 8;
  }),
  toSet,
  toArr,
);

export default archetypes;
