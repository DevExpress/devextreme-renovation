export function convertRulesToOptions<T>(rules: Rule<T>[]): T {
  return rules.reduce((options: T, rule) => {
    return {
      ...options,
      ...(rule.device() ? rule.options : {}),
    };
  }, {} as T);
}

export function createDefaultOptionRules<T>(
  options: Rule<T>[] = []
): Rule<T>[] {
  return options;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type Rule<T> = {
  device: any;
  options: RecursivePartial<T>;
};
