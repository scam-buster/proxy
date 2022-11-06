export function ngramify(
  text: string,
  set: Set<string>,
  n: number,
  padding: string
) {
  n = n != null ? n : 3;
  if (text.length < n) {
    padding = padding != null ? padding : ' ';
    text = text + Array(n - text.length + 1).join(padding);
  }

  if (n == 1 && !set) {
    set = new Set(text);
  } else {
    set = set || new Set();
    for (let i = text.length - n + 1; i--; ) {
      set.add(text.substring(i, i + n));
    }
  }
  return set;
}
