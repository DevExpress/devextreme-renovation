import { Property, Method } from "./expressions/class-members";
import { Heritable } from "./expressions/class";
import { ImportDeclaration, ImportClause } from "./expressions/import";
import { ArrowFunction, Function } from "./expressions/functions";
import { Component } from "./expressions/component";
import { TypeExpression } from "./expressions/type";
import { Interface } from "./expressions/interface";

export interface IExpression {
  getDependency(): string[];
  toString(options?: toStringOptions): string;
  getAllDependency(): string[];
  isJsx(): boolean;
}

export type toStringOptions = {
  members: Array<Property | Method>;
  disableTemplates?: boolean;
  componentContext?: string;
  newComponentContext?: string;
  variables?: VariableExpression;
  jsxComponent?: Component;
};

export type VariableExpression = {
  [name: string]: IExpression;
};

export type GeneratorOptions = {
  defaultOptionsModule?: string;
};

export type GeneratorCache = {
  [name: string]: any;
};

export type GeneratorContext = {
  path?: string;
  dirname?: string;
  components?: { [name: string]: Heritable };
  types?: { [name: string]: TypeExpression };
  interfaces?: { [name: string]: Interface };
  defaultOptionsImport?: ImportDeclaration;
  viewFunctions?: { [name: string]: Function | ArrowFunction };
  globals?: VariableExpression;
  importedModules?: string[];
  imports?: {
    [name: string]: ImportClause;
  };
} & GeneratorOptions;
