import { Property, Method } from "./expressions/class-members"
import { Heritable } from "./expressions/class"
import { ImportDeclaration } from "./expressions/import"

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
}

export type VariableExpression = { 
    [name: string]: IExpression;
}

export type GeneratorContext = {
    path?: string;
    dirname?: string;
    components?: { [name: string]: Heritable };
    defaultOptionsImport?: ImportDeclaration;
    defaultOptionsModule?: string
}
