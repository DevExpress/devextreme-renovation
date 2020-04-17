import BaseGenerator from "./base-generator";
import { Component } from "./base-generator/expressions/component";
import { Identifier } from "./base-generator/expressions/common";
import { HeritageClause } from "./base-generator/expressions/class";
import {
    Property as BaseProperty,
    Method as BaseMethod,
    GetAccessor as BaseGetAccessor
} from "./base-generator/expressions/class-members";
import { toStringOptions } from "./base-generator/types";
import {
    TypeExpression,
    SimpleTypeExpression,
    ArrayTypeNode,
    UnionTypeNode,
    FunctionTypeNode,
    LiteralTypeNode
} from "./base-generator/expressions/type";
import { capitalizeFirstLetter, compileType } from "./base-generator/utils/string";
import SyntaxKind from "./base-generator/syntaxKind";
import { Expression } from "./base-generator/expressions/base";
import { ObjectLiteral, StringLiteral, NumericLiteral } from "./base-generator/expressions/literal";
import { Parameter } from "./base-generator/expressions/functions";
import { Block } from "./base-generator/expressions/statements";
import { Function, ArrowFunction, VariableDeclaration } from "./angular-generator";
import { Decorator } from "./base-generator/expressions/decorator";
import { BindingPattern } from "./base-generator/expressions/binding-pattern";
import { ComponentInput } from "./base-generator/expressions/component-input";

function calculatePropertyType(type: TypeExpression): string { 
    if (type instanceof SimpleTypeExpression) {
        return capitalizeFirstLetter(type.toString());
    } else if (type instanceof ArrayTypeNode) {
        return "Array";
    } else if (type instanceof UnionTypeNode) {
        return `[${[([] as string[]).concat(type.types.map(t => calculatePropertyType(t))).join(",")]}]`;
    } else if (type instanceof FunctionTypeNode) {
        return "Function"
    } else if (type instanceof LiteralTypeNode) { 
        if (type.expression instanceof ObjectLiteral) { 
            return "Object"
        } else if (type.expression instanceof StringLiteral) { 
            return "String"
        } else if (type.expression instanceof NumericLiteral) { 
            return "Number"
        }
    }
    return "";
}

export class Property extends BaseProperty { 
    toString(options?: toStringOptions) {
        if (this.isInternalState) { 
            return `${this.getter()}: ${this.initializer}`;
        } 

        if (this.isEvent) { 
            return "";
        }
    
        const type = calculatePropertyType(this.type);
        const parts = [];
        if (type) { 
            parts.push(`type: ${type}`)
        }
        
        if (this.questionOrExclamationToken === SyntaxKind.ExclamationToken) { 
            parts.push("required: true")
        }

        if (this.initializer) { 
            parts.push(`default(){
                return ${this.initializer}
            }`)
        }

        return `${this.name}: {
            ${parts.join(",\n")}
        }`;
    }

    getter() { 
        const baseValue = super.getter();
        if (this.isInternalState) {
            return `internal_state_${baseValue}`;
        }
        return baseValue
    }
}

function compileMethod(expression: Method | GetAccessor, options?: toStringOptions): string { 
    return `${expression.name}(${expression.parameters.map(p => p.declaration()).join(",")})${compileType(expression.type.toString())}${expression.body.toString(options)}`
}

export class Method extends BaseMethod { 
    toString(options?: toStringOptions) { 
        if (!options) { 
            return super.toString();
        }
        return compileMethod(this, options)
    }
}

export class GetAccessor extends BaseGetAccessor { 
    toString(options?: toStringOptions): string { 
        if (!options) { 
            return super.toString();
        }
        return compileMethod(this, options)
    }

    getter() { 
        return `${super.getter()}()`;
    }
}

export class VueComponentInput extends ComponentInput { 
    
    toString() { 
        const members = this.baseTypes.map(t => `...${t}`)
            .concat(this.members.map(m => m.toString()));
        return `${this.modifiers.join(" ")} const ${this.name} = {
            ${members.join(",")}
        }`;
    }
}

export class VueComponent extends Component { 

}


class VueGenerator extends BaseGenerator { 
    
    createComponentBindings(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, typeParameters: string[], heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        return new VueComponentInput(decorators, modifiers, name, typeParameters, heritageClauses, members)
    }

    createComponent(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: any, heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        return new VueComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createProperty(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, questionOrExclamationToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }

    createGetAccessor(decorators: Decorator[]|undefined, modifiers: string[]|undefined, name: Identifier, parameters: Parameter[], type?: TypeExpression, body?: Block) {
        return new GetAccessor(decorators, modifiers, name, parameters, type, body);
    }

    createMethod(decorators: Decorator[]| undefined, modifiers: string[]|undefined, asteriskToken: string|undefined, name: Identifier, questionToken: string | undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, body: Block) {
        return new Method(decorators, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body);
    }

    createFunctionDeclarationCore(decorators: Decorator[] | undefined, modifiers: string[] | undefined, asteriskToken: string, name: Identifier, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, body: Block) {
        return new Function(decorators, modifiers, asteriskToken, name, typeParameters, parameters, type, body, this.getContext());
    }

    createArrowFunction(modifiers: string[] | undefined, typeParameters: any, parameters: Parameter[], type: TypeExpression | undefined, equalsGreaterThanToken: string, body: Block | Expression) {
        return new ArrowFunction(modifiers, typeParameters, parameters, type, equalsGreaterThanToken, body, this.getContext());
    }

    createVariableDeclarationCore(name: Identifier | BindingPattern, type?: TypeExpression, initializer?: Expression) {
        return new VariableDeclaration(name, type, initializer);
    }
}


export default new VueGenerator();
