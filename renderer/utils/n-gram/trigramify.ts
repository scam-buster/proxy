export function trigramify(text: string) {
  text = '  ' + text.toLowerCase() + '  ';
  const set = new Set<string>();
  for (let i = text.length - 2; i--; ) {
    set.add(text.substring(i, i + 3));
  }
  return set;
}
