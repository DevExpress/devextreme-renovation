export function convertRulesToOptions<T>(rules: DefaultsRule<T>[]): T {
  return rules.reduce((options: T, rule) => {
    return {
      ...options,
      ...(rule.device() ? rule.options : {}),
    };
  }, {} as T);
}

export function createDefaultOptionRules<T>(
  options: DefaultsRule<T>[] = []
): DefaultsRule<T>[] {
  return options;
}

export type DefaultsRule<T> = {
  device: any;
  options: Partial<T>;
};
