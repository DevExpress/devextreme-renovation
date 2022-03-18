import { GeneratorCache, GeneratorContext } from './types';

export type GeneratorResult = { path?: string; code: string };

export interface GeneratorAPI {
  setContext(context: GeneratorContext | null): void;
  generate(factory: any[], createFactoryOnly: boolean): GeneratorResult[];
  resetCache(): void;
  getPlatform: () => string;
  cache: GeneratorCache;
}
