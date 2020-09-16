import { Expression } from "./base";
import { toStringOptions } from "../types";
import SyntaxKind from "../syntaxKind";
import { Property } from "./class-members";
import { PropertyAccess } from "./property-access";

const isShortOperator = (operator: string) => {
  return (
    operator === SyntaxKind.PlusEqualsToken ||
    operator === SyntaxKind.MinusEqualsToken ||
    operator === SyntaxKind.SlashEqualsToken ||
    operator === SyntaxKind.AsteriskEqualsToken
  );
};

const unaryPlusOrMinus = (operator: string) => {
  return (
    operator === SyntaxKind.PlusPlusToken ||
    operator === SyntaxKind.MinusMinusToken
  );
};

export class Binary extends Expression {
  left: Expression;
  operator: string;
  right: Expression;
  constructor(left: Expression, operator: string, right: Expression) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  toString(options?: toStringOptions) {
    const dependencyMember =
      this.left instanceof PropertyAccess && this.left.getMember(options);
    if (dependencyMember) {
      let rightExpression;

      if (this.operator === SyntaxKind.EqualsToken) {
        rightExpression = this.right.toString(options);
      }

      if (isShortOperator(this.operator)) {
        const operator = this.operator[0];
        rightExpression = `${this.left.toString(
          options
        )}${operator}${this.right.toString(options)}`;
      }

      if (rightExpression) {
        if (dependencyMember.isReadOnly()) {
          throw `Error: Can't assign property use TwoWay() or Internal State - ${this.toString()}`;
        }

        return `${(this.left as PropertyAccess).compileStateSetting(
          rightExpression,
          dependencyMember as Property,
          options!
        )}`;
      }
    }
    return `${this.left.toString(options)} ${
      this.operator
    } ${this.right.toString(options)}`;
  }

  getDependency(options: toStringOptions) {
    if (this.operator === SyntaxKind.EqualsToken) {
      if (
        this.left instanceof PropertyAccess &&
        this.left.isPropsScope({
          members: [],
          componentContext: this.left.calculateComponentContext(),
        })
      ) {
        return this.left
          .getAssignmentDependency(options)
          .concat(this.right.getDependency(options));
      }
      return this.right.getDependency(options);
    }
    return this.getAllDependency(options);
  }

  getAllDependency(options: toStringOptions) {
    return this.left
      .getDependency(options)
      .concat(this.right.getDependency(options));
  }
}

export class Prefix extends Expression {
  operator: string;
  operand: Expression;
  constructor(operator: string, operand: Expression) {
    super();
    this.operator = operator;
    this.operand = operand;
  }

  compileUnaryMath(options?: toStringOptions) {
    const dependencyMember =
      this.operand instanceof PropertyAccess && this.operand.getMember(options);
    if (unaryPlusOrMinus(this.operator) && dependencyMember) {
      if (dependencyMember.isReadOnly()) {
        throw `Error: Can't assign property use TwoWay() or Internal State - ${this.toString()}`;
      }
      const operator = this.operator[0];
      const rightExpression = `${this.operand.toString(
        options
      )}${operator}${1}`;
      return `${(this.operand as PropertyAccess).compileStateSetting(
        rightExpression,
        dependencyMember as Property,
        options!
      )}`;
    }
    return "";
  }

  toString(options?: toStringOptions) {
    const unaryMath = this.compileUnaryMath(options);
    if (unaryMath) return unaryMath;

    return `${this.operator}${this.operand.toString(options)}`;
  }

  getDependency(options: toStringOptions) {
    return this.operand.getDependency(options);
  }
}

export class Postfix extends Prefix {
  toString(options?: toStringOptions) {
    const unaryMath = this.compileUnaryMath(options);
    if (unaryMath) return unaryMath;

    return `${this.operand.toString(options)}${this.operator}`;
  }
}
