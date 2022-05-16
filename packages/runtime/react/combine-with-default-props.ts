export function combineWithDefaultProps<T extends Record<string, unknown>>(
  defaultProps: Record<string, unknown>, props: Record<string, unknown>,
): T {
  const result = { ...props };
  Object
    .entries(defaultProps)
    .forEach(([key, value]) => {
      if (props[key] === undefined) {
        result[key] = value;
      }
    });
  return result as T;
}
