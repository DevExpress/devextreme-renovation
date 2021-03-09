import { Rule } from "@devextreme-generator/declaration"

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

export { Rule };
