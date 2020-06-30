
import { toStringOptions as BaseToStringOptions, GeneratorContext } from "../base-generator/types";
import { TrackByAttribute } from "./expressions/jsx/track-by-attribute";
import { Expression } from "../base-generator/expressions/base";
import { Property } from "./expressions/class-members/property";
import { Method } from "../base-generator/expressions/class-members";

export interface toStringOptions extends BaseToStringOptions {
    members: Array<Property | Method>;
    hasStyle?: boolean;
    keys?: Expression[];
    trackBy?: TrackByAttribute[];
}

export type AngularGeneratorContext = GeneratorContext & {
    angularCoreImports?: string[];
}
