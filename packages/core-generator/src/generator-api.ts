import { GeneratorCache, GeneratorContext } from './types';

export declare type GeneratorResult = { path?: string; code: string };

export interface GeneratorAPI {
  setContext(context: GeneratorContext | null): void;
  generate(factory: any[], createFactoryOnly: boolean): GeneratorResult[];
  resetCache(): void;
  getPlatform: () => string;
  cache: GeneratorCache;
}
