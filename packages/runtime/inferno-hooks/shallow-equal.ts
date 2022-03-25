/* eslint-disable @typescript-eslint/ban-types */
export function equal(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((x, i) => x === b[i]);
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aEntries = Object.entries(a as {});
    const bEntries = Object.entries(b as {});
    return (
      aEntries.length === bEntries.length
      && aEntries.every(([ka, va], i) => {
        const [kb, vb] = bEntries[i];
        return ka === kb && va === vb;
      })
    );
  }

  return false;
}
