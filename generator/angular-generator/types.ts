import {
  toStringOptions as BaseToStringOptions,
  GeneratorContext,
} from "../base-generator/types";
import { Heritable } from "../base-generator/expressions/class";
import { TrackByAttribute } from "./expressions/jsx/track-by-attribute";
import { Expression } from "../base-generator/expressions/base";
import { Property } from "./expressions/class-members/property";
import { Method } from "../base-generator/expressions/class-members";
import { BaseFunction } from "../base-generator/expressions/functions";
import { PropertyAssignment } from "../base-generator/expressions/property-assignment";
import { Identifier } from "../base-generator/expressions/common";

export interface toStringOptions extends BaseToStringOptions {
  members: Array<Property | Method>;
  hasStyle?: boolean;
  keys?: Expression[];
  trackBy?: TrackByAttribute[];
  templateComponents?: Heritable[];
  defaultTemplates?: {
    [name: string]: {
      variables: string[];
      initializer: BaseFunction | Identifier;
    };
  };
}

export type AngularGeneratorContext = GeneratorContext & {
  angularCoreImports?: string[];
};
