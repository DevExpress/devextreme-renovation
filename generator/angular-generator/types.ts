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
} from "../base-generator/expressions/class-members";
import { BaseFunction } from "../base-generator/expressions/functions";
import { Identifier } from "../base-generator/expressions/common";
import { JsxAttribute } from "./expressions/jsx/attribute";
import { JsxSpreadAttribute } from "./expressions/jsx/spread-attribute";

export type DynamicComponent = {
  expression: Expression;
  props: (JsxAttribute | JsxSpreadAttribute)[];
  index: number;
  templates: Array<{
    propertyName: string;
    templateRef: string;
    templateRefProperty: string;
  }>;
};

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
  dynamicComponents?: DynamicComponent[];
  isSVG?: boolean;
  checkSlot?: (slot: Property, options: toStringOptions) => void;
}

export type AngularGeneratorContext = GeneratorContext & {
  angularCoreImports?: string[];
};
