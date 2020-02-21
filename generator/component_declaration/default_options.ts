export type Rule<T> = {
    device: () => boolean;
    options: T
}

export function convertRulesToOption<T>(rules: Rule<T>[]): T {
    return rules.reduce((options: T, rule) => {
        return {
            ...options,
            ...(rule.device() ? rule.options : {})
        };
    }, {} as T);
}

export default function createDefaultRules<T>(options: Rule<T>[]=[]):Rule<T>[] { 
    return options;
}
