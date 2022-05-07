// import { readFile, writeFile } from 'fs/promises'
// import { fileURLToPath } from 'url'
// import { pipe } from 'ezell-toolbelt'
// import path from 'path'
// import BurnPhrases from './burn-phrases.mjs'
// import ExtenderPhrases from './extender-phrases.mjs'
// import FloaterPhrases from './floater-phrases.mjs'
// import FloodgatePhrases, { floodgateClauses } from './floodgate-phrases.mjs'
// import InterruptPhrases from './interrupt-phrases.mjs'
// import StarterPhraes from './starter-phrases.mjs'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(path.dirname(__filename))

// const TYPE_STARTER = 'starter'
// const TYPE_EXTENDER = 'extender'
// const TYPE_INTERRUPT = 'interrupt'
// const TYPE_FLOATER = 'floater'
// const TYPE_FLOODGATE = 'floodgate'
// const TYPE_BURN = 'burn'

// const checkPhrases = (phrases, text) => {
//   return phrases.some((phrase) => text.toLowerCase().includes(phrase))
// }

// const checkClauses = (phrases, type) => (card) => {
//   const hasClause = checkPhrases(phrases, card.text)
//   return {
//     ...card,
//     types: {
//       ...card.types,
//       [type]: hasClause ? 0 : card.types[type]
//     }
//   }
// }

// const phraseCheck = (phrases, type) => (card) => {
//   const hasPhrase = phrases.some((phrase) =>
//     card.text.toLowerCase().includes(phrase)
//   )
//   return {
//     ...card,
//     types: {
//       ...card.types,
//       [type]: hasPhrase ? 1 : 0
//     }
//   }
// }

// const compareTypes = (keep, remove) => (card) => {
//   const { types } = card
//   const valA = types[keep]
//   const valB = types[remove]
//   const areSame = valA === valB

//   return {
//     ...card,
//     types: {
//       ...types,
//       [remove]: areSame ? 0 : valB
//     }
//   }
// }

// const applyArchetype = (archetypes) => (card) => {
//   const archetype =
//     archetypes.find(
//       (at) => card.name.toLowerCase().includes(at) && at.length >= 3
//     ) ?? ''

//   return {
//     ...card,
//     meta: {
//       ...card.meta,
//       archetype
//     }
//   }
// }
// const rateTypes = (card) => {
//   const { types } = card
//   const rating = Object.entries(types).reduce((total, [type, value]) => {
//     const scoreBy = {
//       [TYPE_STARTER]: 0.9,
//       [TYPE_EXTENDER]: 0.5,
//       [TYPE_INTERRUPT]: 0.4,
//       [TYPE_FLOATER]: 0.3,
//       [TYPE_FLOODGATE]: 0.8,
//       [TYPE_BURN]: 0.2
//     }

//     return total + scoreBy[type] * value
//   }, 0)

//   return {
//     ...card,
//     meta: {
//       ...card.meta,
//       rating
//     }
//   }
// }

// const rateSpeed = (card) => {
//   const { text, meta } = card
//   const { type, rating } = meta
//   const lowerText = `${text}`.toLowerCase()
//   const lowerType = `${type}`.toLowerCase()
//   const isPendulum = lowerType.includes('pendulum')
//   const fastPhrases = [
//     // 'special summon 1',
//     // 'special summon 2',
//     // 'special summon 3',
//     // 'special summon 4',
//     // 'special summon 5',
//     // 'special summon as many',
//     'you can special summon this card',
//     'in addition to your'
//   ]
//   const slowPhrases = ['or destroy this card', 'you can only use']
//   const canSpecialSummon = checkPhrases(fastPhrases, lowerText)
//   const isSlow = checkPhrases(slowPhrases, lowerText)
//   const speedCount = [
//     { value: isPendulum, rating: 0.2 },
//     { value: canSpecialSummon, rating: 0.9 },
//     { value: isSlow, rating: -1 }
//   ].filter((item) => item.value)
//   const hasCount = speedCount.length > 0
//   const speedTotal = hasCount
//     ? speedCount.reduce((sum, item) => sum + item.value, 0) / speedCount.length
//     : 0

//   return {
//     ...card,
//     meta: {
//       ...meta,
//       rating: speedTotal + rating
//     }
//   }
// }

// const cards = await readFile(`${__dirname}/utils/cards.json`)
//   .then(JSON.parse)
//   .catch((e) => {
//     console.log(e)
//     return []
//   })

// const map =
//   (fn) =>
//     (arr = []) =>
//       arr.map(fn)

// const sort = (fn) => (arr) => arr.sort(fn)

// const filter = (fn) => (arr) => arr.filter(fn)
// const flat = (arr) => arr.flat()
// const split = (delimiter) => (str) => str.split(delimiter)
// const lowercase = (str) => str.toLowerCase()
// const toSet = (arr) => new Set(arr)
// const toArr = (iterable) => [...iterable]

// const formatData = (c) => ({
//   name: c.name,
//   text: c.desc,
//   types: {
//     [TYPE_STARTER]: 0,
//     [TYPE_EXTENDER]: 0,
//     [TYPE_INTERRUPT]: 0,
//     [TYPE_FLOATER]: 0,
//     [TYPE_FLOODGATE]: 0,
//     [TYPE_BURN]: 0
//   },
//   meta: {
//     type: c.type,
//     att: c.attribute,
//     level: c.level,
//     atk: c.atk,
//     def: c.def,
//     rating: 0,
//     archetype: ''
//   }
// })

// const archetypes = pipe(
//   cards,
//   map((card) => {
//     const { desc, name } = card
//     const quotedTexts = pipe(
//       desc,
//       split('.'),
//       map((sentence) => sentence.split('"')[1]),
//       filter(Boolean),
//       filter((text) => {
//         return (
//           name.toLowerCase() !== text.toLowerCase() &&
//           name.toLowerCase().includes(text.toLowerCase())
//         )
//       }),
//       map(lowercase),
//       filter(Boolean)
//     )
//     return quotedTexts
//   }),
//   flat,
//   filter((arr) => arr.length > 0),
//   filter((at) => {
//     const matches = cards.filter((c) => {
//       const { desc, name } = c
//       const lowerName = name.toLowerCase()
//       const lowerText = desc.toLowerCase()
//       const hasMatch =
//         lowerName.includes(at) ||
//         at.includes(lowerName) ||
//         lowerText.includes(at)
//       return hasMatch
//     })

//     return matches.length >= 8
//   }),
//   toSet,
//   toArr
// )

// const formattedCards = pipe(
//   cards,
//   map(formatData),
//   map(phraseCheck(StarterPhraes, TYPE_STARTER)),
//   map(phraseCheck(ExtenderPhrases, TYPE_EXTENDER)),
//   map(phraseCheck(InterruptPhrases, TYPE_INTERRUPT)),
//   map(phraseCheck(BurnPhrases, TYPE_BURN)),
//   map(phraseCheck(FloaterPhrases, TYPE_FLOATER)),
//   map(phraseCheck(FloodgatePhrases, TYPE_FLOODGATE)),
//   map(checkClauses(floodgateClauses, TYPE_FLOODGATE)),
//   map(compareTypes(TYPE_FLOATER, TYPE_STARTER)),
//   map(applyArchetype(archetypes)),
//   map(rateTypes),
//   map(rateSpeed)
//   // sort((a, z) => z.meta.rating - a.meta.rating),
//   // filter((card) => card.meta.level <= 4)
// )

// const rankedArchetypes = pipe(
//   archetypes,
//   map((at) => ({
//     name: at,
//     averageRating: 0,
//     [TYPE_STARTER]: 0,
//     [TYPE_EXTENDER]: 0
//   })),
//   map((at) => {
//     const relatedCards = formattedCards.filter(
//       (c) => c.meta.archetype === at.name
//     )
//     const starters = relatedCards.filter((c) => c.types[TYPE_STARTER] > 0)
//     const extenders = relatedCards.filter((c) => c.types[TYPE_EXTENDER] > 0)
//     return {
//       ...at,
//       [TYPE_STARTER]: starters.length,
//       [TYPE_EXTENDER]: extenders.length
//     }
//   }),
//   map((at) => {
//     const members = formattedCards.filter((c) => c.meta.archetype === at.name)
//     const totalRating = members.reduce(
//       (total, member) => member.meta.rating + total,
//       0
//     )
//     const averageRating = totalRating / members.length
//     return { ...at, averageRating }
//   }),
//   filter((at) => Boolean(at.averageRating)),
//   sort((a, z) => z.averageRating - a.averageRating)
// )

// writeFile(`${__dirname}/results.json`, JSON.stringify(formattedCards))
// writeFile(`${__dirname}/ranked.json`, JSON.stringify(rankedArchetypes))
