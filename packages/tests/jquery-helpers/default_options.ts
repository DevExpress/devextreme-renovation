export function convertRulesToOptions<T>(rules: DefaultOptionsRule<T>[]): T {
  return rules.reduce((options: T, rule) => {
    return {
      ...options,
      ...(rule.device() ? rule.options : {}),
    };
  }, {} as T);
}

export function createDefaultOptionRules<T>(
  options: DefaultOptionsRule<T>[] = []
): DefaultOptionsRule<T>[] {
  return options;
}

export type DefaultOptionsRule<T> = {
  device: any;
  options: Partial<T>;
};
