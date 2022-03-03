function getCurrentNames(
  context: { currentNames?: Record<string, number> },
): Record<string, number> {
  context.currentNames = context.currentNames || {};
  return context.currentNames;
}

export function getUniqComponentName(
  context: Record<string, unknown>, componentName: string,
): string {
  const currentNames = getCurrentNames(context);
  const key = componentName.toLowerCase();
  currentNames[key] = currentNames[key] || 0;
  currentNames[key] += 1;
  return key + currentNames[key];
}
