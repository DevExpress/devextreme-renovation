import { JsxExpression } from "./jsx-expression";
import { Expression } from "../../../base-generator/expressions/base";
import { toStringOptions } from "../../types";

export interface JsxSpreadAttributeMeta { 
    refExpression: Expression,
    expression: Expression
}

export class JsxSpreadAttribute extends JsxExpression{
    expression: Expression;
    constructor(dotDotDotToken: string="", expression: Expression) {
        super(dotDotDotToken, expression)
        this.expression = expression;
    }

    getExpression(options?:toStringOptions) {
        return super.getExpression(options) || this.expression;
    }

    getTemplateContext() {
        // TODO: Support spread attributes in template context
        console.warn("Angular generator doesn't support spread attributes in template");
        return null;
    }

    toString(options?:toStringOptions) { 
        return "";
    }
}
