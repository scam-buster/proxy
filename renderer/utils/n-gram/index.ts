import { relevance } from './relevance';
import { trigramify } from './trigramify';

export function ngram(text1: string, text2: string) {
  const text1Set = trigramify(text1);
  const text2Set = trigramify(text2);

  return text1.length < text2.length
    ? relevance(text2Set, text1Set)
    : relevance(text1Set, text2Set);
}
