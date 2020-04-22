import { Expression, ExpressionWithOptionalExpression, ExpressionWithExpression } from "./base";
import { Identifier } from "./common";
import { Parameter } from "./functions";
import { toStringOptions } from "../types";
import { compileType } from "../utils/string";
import { Decorator } from "./decorator";

export class TypeExpression extends Expression { }

export class SimpleTypeExpression extends TypeExpression { 
    type: string;

    constructor(type: string) { 
        super();
        this.type = type;
    }

    toString() { 
        return this.type;
    }
}

export class ArrayTypeNode extends TypeExpression { 
    elementType: TypeExpression;

    constructor(elementType: TypeExpression) { 
        super();
        this.elementType = elementType;
    }

    toString() { 
        return `${this.elementType}[]`;
    }
}

export class FunctionTypeNode extends TypeExpression { 
    typeParameters: any;
    parameters: Parameter[];
    type: TypeExpression;
    constructor(typeParameters: any, parameters: Parameter[], type: TypeExpression) { 
        super();
        this.typeParameters = typeParameters;
        this.parameters = parameters;
        this.type = type;
    }

    toString() { 
        return `(${this.parameters})=>${this.type}`;
    }
}

export class IntersectionTypeNode extends TypeExpression { 
    types: TypeExpression[];
    constructor(types: TypeExpression[]) { 
        super();
        this.types = types;
    }

    toString() { 
        return this.types.join("&");
    }
}

export class UnionTypeNode extends IntersectionTypeNode{
    toString() { 
        return this.types.join("|");
    }
}

export class TypeQueryNode extends TypeExpression { 
    expression: Expression;

    constructor(expression: Expression) { 
        super();
        this.expression = expression;
    }

    toString() { 
        return `typeof ${this.expression}`;
    }
}

export class TypeReferenceNode extends TypeExpression {
    typeName: Identifier;
    typeArguments: TypeExpression[];
    constructor(typeName: Identifier, typeArguments: TypeExpression[] = []) {
        super();
        this.typeName = typeName;
        this.typeArguments = typeArguments;
    }
    toString() {
        const typeArguments = this.typeArguments.length ? `<${this.typeArguments.join(",")}>` : "";
        return `${this.typeName}${typeArguments}`;
    }
}

export class TypeLiteralNode extends TypeExpression { 
    members: PropertySignature[];
    constructor(members: PropertySignature[]) { 
        super();
        this.members = members;
    }

    toString(options?:toStringOptions) { 
        return `{${this.members.join(",")}}`;
    }
}

export class PropertySignature extends ExpressionWithOptionalExpression {
    modifiers: string[];
    name: Identifier;
    questionToken: string;
    type?: TypeExpression;

    constructor(modifiers: string[] = [], name: Identifier, questionToken: string = "", type?: TypeExpression, initializer?: Expression) {
        super(initializer);
        this.modifiers = modifiers;
        this.name = name;
        this.questionToken = questionToken;
        this.type = type;
    }

    toString(options?: toStringOptions) {
        const initializer = this.expression ? `=${this.expression.toString(options)}` : "";
        return `${this.name}${this.questionToken}${compileType(this.type?.toString())}${initializer}`;
    }

}

export class IndexSignature extends Expression {
    decorators?: Decorator[];
    modifiers: string[];
    parameters: Parameter[];
    type: TypeExpression;
    constructor(decorators: Decorator[] = [], modifiers: string[] = [], parameters: Parameter[], type: TypeExpression) {
        super();
        this.decorators = decorators;
        this.modifiers = modifiers;
        this.parameters = parameters;
        this.type = type;
    }

    toString(options?: toStringOptions) {
        return `${this.parameters.map(p => `[${p.typeDeclaration()}]`)}:${this.type}`;
    }
}

export class ExpressionWithTypeArguments extends ExpressionWithExpression {
    typeArguments: TypeReferenceNode[];
    constructor(typeArguments: TypeReferenceNode[] = [], expression: Expression) {
        super(expression);
        this.typeArguments = typeArguments;
    }

    toString() {
        const typeArgumentString = this.typeArguments.length ? `<${this.typeArguments.join(",")}>` : "";
        return `${this.expression}${typeArgumentString}`;
    }

    get typeNode() {
        return this.expression.toString();
    }

    get type() {
        if (this.typeArguments.length) {
            return this.typeArguments[0].toString();
        }
        return this.typeNode;
    }
}

export class ParenthesizedType extends TypeExpression { 
    expression: TypeExpression;
    constructor(expression: TypeExpression) { 
        super();
        this.expression = expression;
    }

    toString() { 
        return `(${this.expression})`;
    }
}

export class LiteralTypeNode extends TypeExpression { 
    expression: Expression;

    constructor(expression: Expression) { 
        super();
        this.expression = expression;
    }

    toString() { 
        return this.expression.toString();
    }
}

export class IndexedAccessTypeNode extends TypeExpression { 
    objectType: TypeExpression;
    indexType: TypeExpression;
    constructor(objectType: TypeExpression, indexType: TypeExpression) {
        super();
        this.objectType = objectType;
        this.indexType = indexType;
    }

    toString() { 
        return `${this.objectType}[${this.indexType}]`;
    }
}
