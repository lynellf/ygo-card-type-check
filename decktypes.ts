import cards from "./cards.ts";
import type { CardItem } from "./types.ts";
import { fpts } from "./utils/modules.ts";

const { pipeable } = fpts;

const asSet = <T>(iterable: Iterable<T>) => new Set([...iterable]);
const asArr = <T>(iterable: Iterable<T>) => [...iterable];
const asTypes = (
  output: string[],
  card: CardItem,
) => [...output, ...card.deckTypes];

const decktypes: string[] = pipeable.pipe(
  cards.reduce(
    asTypes,
    [] as string[],
  ),
  asSet,
  asArr,
);

export default decktypes;
