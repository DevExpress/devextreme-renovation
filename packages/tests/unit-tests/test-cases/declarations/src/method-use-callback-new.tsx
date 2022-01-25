
import {
  useCallback,
} from "@devextreme-generator/declarations";

export function Widget({ prop1 }: { prop1: number }) {
  const privateMethod = useCallback(function (a: number): number {
    return a + prop1;
  }, [prop1]);

  const method1 = useCallback((a: number): number => privateMethod(a), [prop1]);

  const method2 = useCallback((): null => null, []);

  return <div></div>;
}
