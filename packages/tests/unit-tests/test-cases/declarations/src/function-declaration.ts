export type FunctionType<T> = (value: T) => void;

export interface FunctionInterface<T> {
  (value: T): void;
}
