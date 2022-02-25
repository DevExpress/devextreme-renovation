export const namedFunction = () => {
  return {};
};
const b = function (a: string) {
  return a;
};
let c = (a: number, b: number): null => null;
export function plus(a: number = 45, c: any, b?: number): number {
  namedFunction();
  c(2, 3);
  namedFunction();
  c(2, 3);
  const { p } = c;
  (p as any).SomeMethod({});
  if (p != null) {
    a = p + 10;
  }
  (p as any).SomeMethod({});
  return a + (b ? b : 0);
}
export function createSelector<A, R>(deps: [A], func: (a: A) => R): R;
export function createSelector<A, B, R>(
  deps: [A, B],
  func: (a: A, b: B) => R
): R;
export function createSelector<R>(
  deps: unknown[],
  func: (...args: unknown[]) => R
): R {
  return func.apply(null, deps);
}
export default (function (): void {})();
