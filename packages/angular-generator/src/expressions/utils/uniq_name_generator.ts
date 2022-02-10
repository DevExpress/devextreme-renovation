let currentNames: Record<string, number> = {};

export function getUniqComponentName(componentName: string): string {
  const key = componentName.toLowerCase();
  if (!currentNames[key]) { currentNames[key] = 0; }
  currentNames[key] += 1;
  return key + currentNames[key];
}

export function reset(): void {
  currentNames = {};
}
