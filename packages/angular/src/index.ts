import { AngularGenerator } from './angular-generator';

export * from "./types";
export * from "./expressions/property-access";
export * from "./expressions/property-access-chain";
export * from "./expressions/variable-expression";
export * from "./expressions/functions/function";
export * from "./expressions/functions/arrow-function";
export * from "./expressions/jsx/elements";
export * from "./expressions/jsx/attribute";
export * from "./expressions/jsx/jsx-expression";
export * from "./expressions/jsx/spread-attribute";
export * from "./expressions/jsx/jsx-child-expression";
export * from "./expressions/jsx//jsx-opening-element";
export * from "./expressions/jsx/angular-directive";
export * from "./expressions/class-members/set-accessor";

export default new AngularGenerator();
