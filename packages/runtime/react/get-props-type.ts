type GetPartialType<C> = C extends Partial<infer T> ? T : unknown;

export type GetPropsType<T> = GetPartialType<T> extends Required<T> ? T : GetPartialType<T>;
