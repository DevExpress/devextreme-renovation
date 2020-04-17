import BaseGenerator from "./base-generator";
import { Component } from "./base-generator/expressions/component";
import { Decorator, Identifier } from "./base-generator/expressions/common";
import { HeritageClause } from "./base-generator/expressions/class";
import {
    Property as BaseProperty,
    Method as BaseMethod
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
import { capitalizeFirstLetter } from "./base-generator/utils/string";
import SyntaxKind from "./base-generator/syntaxKind";
import { Expression } from "./base-generator/expressions/base";
import { ObjectLiteral, StringLiteral, NumericLiteral } from "./base-generator/expressions/literal";

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

export class Method extends BaseMethod { 

}

export class VueComponent extends Component { 

}


class VueGenerator extends BaseGenerator { 
    createComponent(componentDecorator: Decorator, modifiers: string[], name: Identifier, typeParameters: any, heritageClauses: HeritageClause[], members: Array<Property | Method>) {
        return new VueComponent(componentDecorator, modifiers, name, typeParameters, heritageClauses, members, this.getContext());
    }

    createProperty(decorators: Decorator[], modifiers: string[] | undefined, name: Identifier, questionOrExclamationToken?: string, type?: TypeExpression, initializer?: Expression) {
        return new Property(decorators, modifiers, name, questionOrExclamationToken, type, initializer);
    }


}


export default new VueGenerator();
