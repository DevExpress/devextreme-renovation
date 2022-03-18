import { Property, Method } from './expressions/class-members';
import { Heritable } from './expressions/class';
import { ImportDeclaration, ImportClause } from './expressions/import';
import { ArrowFunction, Function } from './expressions/functions';
import { Component } from './expressions/component';
import { TypeExpression } from './expressions/type';
import { Interface } from './expressions/interface';
import { ComponentInput } from './expressions/component-input';
import { Dependency } from '.';

export type TypeExpressionImports = ImportDeclaration[];

export interface IExpression {
  getDependency(options: toStringOptions): Dependency[];
  toString(options?: toStringOptions): string;
  getAllDependency(options: toStringOptions): Dependency[];
  isJsx(): boolean;
  getImports(context: GeneratorContext): TypeExpressionImports;
}

export interface toStringOptions {
  members: Array<Property | Method>;
  disableTemplates?: boolean;
  componentContext?: string;
  newComponentContext?: string;
  variables?: VariableExpression;
  jsxComponent?: Component;
  usePropsSpace?: boolean;
  componentInputs?: ComponentInput[];
  isComponent?: boolean;
  fromType?: boolean;
  mutableOptions?: { hasRestAttributes?: boolean };
}

export type VariableExpression = {
  [name: string]: IExpression;
};

export type GeneratorOptions = {
  defaultOptionsModule?: string;
  lintConfig?: { [key: string]: unknown; };
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
  externalTypes?: { [name: string]: TypeExpression };
  externalInterfaces?: { [name: string]: Interface };
} & GeneratorOptions;
