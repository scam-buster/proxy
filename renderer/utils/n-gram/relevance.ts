export function relevance(set1: Set<string>, set2: Set<string>) {
  let count = 0;
  set2.forEach(function (value) {
    if (set1.has(value)) {
      count = count + 1;
    }
  });
  return count / (set1.size + set2.size - count);
}
