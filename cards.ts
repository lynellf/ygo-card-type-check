import { __dirname } from "./utils/common.ts";
import type { CardItem } from "./types.ts";

const parseData = (raw: Uint8Array): CardItem[] => {
  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(raw));
};

const printErr = (err: Error): CardItem[] => {
  console.error(err);
  return [];
};

const cards: CardItem[] = await Deno.readFile(
  `${__dirname}/data/cards.json`,
).then(parseData).catch(printErr);

export default cards;
