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

export default (function (): void {})();
