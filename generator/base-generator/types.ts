import { Property, Method } from "./expressions/class-members"
import { Heritable } from "./expressions/class"
import { ImportDeclaration } from "./expressions/import"
import { ArrowFunction, Function } from "./expressions/functions"
import { Component } from "./expressions/component"
import { TypeExpression } from "./expressions/type"

export interface IExpression { 
    getDependency(): string[];
    getAssignmentDependency(): string[];
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
}

export type VariableExpression = { 
    [name: string]: IExpression;
}

export type GeneratorContext = {
    path?: string;
    dirname?: string;
    components?: { [name: string]: Heritable };
    types?: { [name: string]: TypeExpression };
    defaultOptionsImport?: ImportDeclaration;
    defaultOptionsModule?: string;
    viewFunctions?: { [name: string]: Function | ArrowFunction };
    globals?: VariableExpression;
    importedModules?: string[];
}
