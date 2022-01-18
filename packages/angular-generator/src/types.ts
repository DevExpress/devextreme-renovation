import {
  BaseClassMember,
  BaseFunction,
  Expression,
  GeneratorContext,
  GetAccessor,
  Heritable,
  Identifier,
  Method,
  Property as BaseProperty,
  toStringOptions as BaseToStringOptions,
} from '@devextreme-generator/core';
import { TrackByAttribute } from './expressions/jsx/track-by-attribute';
import { Property } from './expressions/class-members/property';

export interface toStringOptions extends BaseToStringOptions {
  members: Array<Property | Method>;
  hasStyle?: boolean;
  keys?: Expression[];
  trackBy?: TrackByAttribute[];
  mapItemName?: string;
  mapItemExpression?: Expression;
  templateComponents?: Heritable[];
  defaultTemplates?: {
    [name: string]: {
      variables: string[];
      initializer: BaseFunction | Identifier;
    };
  };
  forwardRefs?: BaseClassMember[];
  hasDynamicComponents?: boolean;
  isSVG?: boolean;
  isFunctionalComponent?: boolean;
  checkSlot?: (slot: Property, options: toStringOptions) => void;
}

export type AngularGeneratorContext = GeneratorContext & {
  angularCoreImports?: string[];
};

export interface IPropsGetAccessor extends GetAccessor {
  props: BaseProperty[];
}
