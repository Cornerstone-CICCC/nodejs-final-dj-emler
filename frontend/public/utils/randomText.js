import texts from "../../src/data/typing-texts.json";

export function getRandomSentence({
  wordList = "simple",
  punctuation = true,
  numbers = true,
} = {}) {
  let categoryKey;

  if (punctuation && numbers) {
    categoryKey = "punctuationAndNumbers";
  } else if (punctuation && !numbers) {
    categoryKey = "punctuationOnly";
  } else if (!punctuation && numbers) {
    categoryKey = "numbersOnly";
  } else {
    categoryKey = "base";
  }

  const sentenceArray = texts[wordList]?.[categoryKey];

  if (!sentenceArray || sentenceArray.length === 0) {
    return "Error: No sentences found.";
  }

  const randomIndex = Math.floor(Math.random() * sentenceArray.length);
  return sentenceArray[randomIndex];
}
