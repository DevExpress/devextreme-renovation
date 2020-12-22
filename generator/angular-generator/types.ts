import {
  toStringOptions as BaseToStringOptions,
  GeneratorContext,
} from "../base-generator/types";
import { Heritable } from "../base-generator/expressions/class";
import { TrackByAttribute } from "./expressions/jsx/track-by-attribute";
import { Expression } from "../base-generator/expressions/base";
import { Property } from "./expressions/class-members/property";
import {
  BaseClassMember,
  Method,
  Property as BaseProperty,
  GetAccessor,
} from "../base-generator/expressions/class-members";
import { BaseFunction } from "../base-generator/expressions/functions";
import { Identifier } from "../base-generator/expressions/common";

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
  checkSlot?: (slot: Property, options: toStringOptions) => void;
  slots?: {
    [name: string] : {
      selector: string,
      isSVG: boolean | undefined
    }
  } 
}

export type AngularGeneratorContext = GeneratorContext & {
  angularCoreImports?: string[];
};

export interface IPropsGetAccessor extends GetAccessor {
  props: BaseProperty[];
}
