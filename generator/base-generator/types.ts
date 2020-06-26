import { Property, Method } from "./expressions/class-members"
import { Heritable } from "./expressions/class"
import { ImportDeclaration } from "./expressions/import"
import { ArrowFunction, Function } from "./expressions/functions"
import { Component } from "./expressions/component"
import { TypeExpression, ArrayTypeNode, TypeReferenceNode, ParenthesizedType, UnionTypeNode } from "./expressions/type"

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

export const isTypeArray = (type: string | TypeExpression | undefined) => type instanceof ArrayTypeNode || (type instanceof TypeReferenceNode && type.typeName.toString() === "Array")

export const extractComplexType = (type?: string | TypeExpression): string => {
    if (type instanceof TypeReferenceNode) {
        if (type.typeName.toString() === "Array") {
            return extractComplexType(type.typeArguments[0]);
        }
        return `${type.typeName.toString()}`;
    }
    if (type instanceof ArrayTypeNode) {
        return extractComplexType(type.elementType);
    }
    if (type instanceof ParenthesizedType) {
        return extractComplexType(type.expression)
    }
    if (type instanceof UnionTypeNode) {
        const nestedType = type.types.find(t => t instanceof TypeReferenceNode);
        if(nestedType) {
            return extractComplexType(nestedType);
        }
    }

    return 'any';
}
