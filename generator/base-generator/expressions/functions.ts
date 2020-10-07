import { Expression, SimpleExpression } from "./base";
import { Identifier, Paren, Call } from "./common";
import { TypeExpression } from "./type";
import {
  toStringOptions,
  GeneratorContext,
  VariableExpression,
} from "../types";
import { Block, ReturnStatement } from "./statements";
import { BindingElement, BindingPattern } from "./binding-pattern";
import {
  variableDeclaration,
  compileType,
  compileTypeParameters,
  compileArrowTypeParameters,
} from "../utils/string";
import { Component } from "./component";
import { VariableStatement } from "./variables";
import SyntaxKind from "../syntaxKind";
import { getJsxExpression, JsxExpression, JsxElement } from "./jsx";
import { Decorator } from "./decorator";
import { Property } from "./class-members";
import { containsPortalsInStatements } from "../utils/functions";
import { TypeParameterDeclaration } from "./type-parameter-declaration";
import { PropertyAccess } from "./property-access";
export class Parameter {
  decorators: Decorator[];
  modifiers: string[];
  dotDotDotToken: string;
  name: Identifier | BindingPattern;
  questionToken: string;
  type?: TypeExpression | string;
  initializer?: Expression;
  constructor(
    decorators: Decorator[],
    modifiers: string[],
    dotDotDotToken: string = "",
    name: Identifier | BindingPattern,
    questionToken: string = "",
    type?: TypeExpression | string,
    initializer?: Expression
  ) {
    this.decorators = decorators;
    this.modifiers = modifiers;
    this.dotDotDotToken = dotDotDotToken;
    this.name = name;
    this.questionToken = questionToken;
    this.type = type;
    this.initializer = initializer;
  }

  typeDeclaration() {
    return variableDeclaration(
      this.name,
      this.type?.toString() || "any",
      undefined,
      this.questionToken
    );
  }

  toString() {
    return variableDeclaration(
      this.name,
      this.type?.toString(),
      this.initializer,
      this.questionToken,
      this.dotDotDotToken
    );
  }
}

function processGlobals(
  globals: VariableExpression | undefined,
  componentContext: string | undefined
): VariableExpression {
  return Object.keys(globals || {}).reduce(
    (variables: VariableExpression, name) => {
      const value = globals![name];

      if (value.isJsx()) {
        return variables;
      }

      const identifier = new Identifier(`global_${name}`);

      return {
        ...variables,
        [name]: componentContext
          ? new PropertyAccess(new Identifier(componentContext), identifier)
          : identifier,
      };
    },
    {
      ...globals,
    }
  );
}

export function getTemplate(
  functionWithTemplate: BaseFunction,
  options?: toStringOptions,
  doNotChangeContext = false,
  globals?: VariableExpression
) {
  const statements =
    functionWithTemplate.body instanceof Block
      ? functionWithTemplate.body.statements
      : [functionWithTemplate.body];

  const returnStatement =
    functionWithTemplate.body instanceof Block
      ? statements.find((s) => s instanceof ReturnStatement)
      : statements[0];

  if (returnStatement) {
    const componentParameter = functionWithTemplate.parameters[0];
    if (options) {
      if (
        !doNotChangeContext &&
        componentParameter &&
        componentParameter.name instanceof Identifier
      ) {
        options.componentContext = componentParameter.name.toString();
      }

      options.variables = statements.reduce(
        (v: VariableExpression, statement) => {
          if (statement instanceof VariableStatement) {
            return {
              ...statement.declarationList.getVariableExpressions(),
              ...v,
            };
          }
          return v;
        },
        {
          ...processGlobals(globals, options.componentContext),
          ...options.variables,
        }
      );

      if (
        componentParameter &&
        componentParameter.name instanceof BindingPattern
      ) {
        if (!doNotChangeContext || !options.componentContext) {
          options.componentContext = SyntaxKind.ThisKeyword;
        }
        options.variables = {
          ...componentParameter.name.getVariableExpressions(
            new SimpleExpression(options.componentContext)
          ),
          ...options.variables,
        };
      }
    }

    const argumentPattern = getViewFunctionBindingPattern(functionWithTemplate);
    if (argumentPattern && options?.variables) {
      const spreadVar = argumentPattern.elements.find(
        (p: BindingElement) => p.dotDotDotToken === "..."
      );
      if (spreadVar?.name) {
        const optionsSpreadVar = options.variables[spreadVar.name.toString()];
        if (optionsSpreadVar instanceof PropertyAccess) {
          optionsSpreadVar.expression = new SimpleExpression("this");
        }
      }
    }

    return getJsxExpression(returnStatement);
  }
}
export function getViewFunctionBindingPattern(
  viewFunction: BaseFunction | null
) {
  const noopReturn = new BindingPattern(
    [new BindingElement(undefined, undefined, "", undefined)],
    "object"
  );
  if (viewFunction) {
    const obj = viewFunction.parameters[0]?.name;
    return obj instanceof BindingPattern &&
      obj.elements[0].name instanceof BindingPattern
      ? obj.elements[0].name
      : noopReturn;
  } else return noopReturn;
}

export class BaseFunction extends Expression {
  modifiers: string[];
  typeParameters: TypeParameterDeclaration[] | undefined;
  parameters: Parameter[];
  type?: TypeExpression | string;
  body: Block | Expression;
  context: GeneratorContext;

  constructor(
    modifiers: string[] = [],
    typeParameters: TypeParameterDeclaration[] | undefined,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    body: Block | Expression,
    context: GeneratorContext
  ) {
    super();
    this.modifiers = modifiers;
    this.typeParameters = typeParameters;
    this.parameters = parameters;
    this.type = type;
    this.body = body;
    this.context = context;
  }

  getDependency(options: toStringOptions) {
    return this.body.getDependency(options);
  }

  getToStringOptions(options?: toStringOptions) {
    const componentParameter = this.parameters[0];
    const widget =
      componentParameter &&
      this.context.components?.[this.parameters[0].type?.toString() || ""];

    if (widget instanceof Component) {
      const members = (widget.members.filter(
        (m) =>
          m.isTemplate ||
          (m.isSlot && m._name.toString() !== m.name) ||
          m.isRefProp ||
          m.isRef
      ) as Property[]).map((p) => Object.create(p));

      options = {
        members,
        componentContext: componentParameter.name.toString(),
        newComponentContext: componentParameter.name.toString(),
      };

      options.variables = (this.body instanceof Block
        ? this.body.statements
        : [this.body]
      ).reduce((v: VariableExpression, statement) => {
        if (statement instanceof VariableStatement) {
          const allVars = statement.declarationList.getVariableExpressions();
          const vars: VariableExpression = {};
          for (const varName in allVars) {
            const expr =
              allVars[varName] instanceof Paren
                ? (allVars[varName] as Paren).expression
                : allVars[varName];
            if (
              members.some(
                (m) =>
                  m.isTemplate &&
                  m.getter(options!.componentContext) === expr.toString()
              )
            ) {
              vars[varName] = allVars[varName];
            }
          }
          return {
            ...vars,
            ...v,
          };
        }
        return v;
      }, {});

      if (
        componentParameter &&
        componentParameter.name instanceof BindingPattern
      ) {
        const props = componentParameter.name.elements.find(
          (e) => e.propertyName?.toString() === "props"
        );
        if (props?.name instanceof BindingPattern) {
          props.name.elements.forEach((e) => {
            const member = members.find(
              (m) =>
                m._name.toString() === (e.propertyName || e.name).toString()
            );
            if (member) {
              member.scope = "";
              if (e.propertyName) {
                member._name = e.name as Identifier;
              }
            }
          });
        }
        options.componentContext = options.newComponentContext = "";
      }
    }
    return options;
  }

  isJsx() {
    return this.body.isJsx();
  }

  processTemplateExpression(expression?: JsxExpression) {
    return expression;
  }

  getTemplate(options?: toStringOptions, doNotChangeContext = false): string {
    return (
      this.processTemplateExpression(
        getTemplate(this, options, doNotChangeContext, this.context.globals)
      )?.toString(options) || ""
    );
  }

  containsPortal() {
    const body = this.body;
    if (body instanceof Block) {
      const statement = body.statements.find(
        (state) => state instanceof ReturnStatement
      ) as ReturnStatement;
      if (statement && statement.expression) {
        return containsPortalsInStatements(
          statement.expression as Paren | JsxExpression | JsxElement
        );
      }
    }
    return false;
  }

  compileTypeParameters(): string {
    return compileTypeParameters(this.typeParameters);
  }
}

export class Function extends BaseFunction {
  decorators: Decorator[];
  asteriskToken: string;
  name?: Identifier;
  body: Block;
  constructor(
    decorators: Decorator[] = [],
    modifiers: string[] | undefined,
    asteriskToken: string,
    name: Identifier | undefined,
    typeParameters: TypeParameterDeclaration[] | undefined,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    body: Block,
    context: GeneratorContext
  ) {
    super(modifiers, typeParameters, parameters, type, body, context);
    this.decorators = decorators;
    this.asteriskToken = asteriskToken;
    this.name = name;
    this.body = body;
  }

  toString(options?: toStringOptions) {
    options = this.getToStringOptions(options);
    return `${this.modifiers.join(" ")} function ${
      this.name || ""
    }${this.compileTypeParameters()}(${this.parameters})${compileType(
      this.type?.toString()
    )}${this.body.toString(options)}`;
  }
}

export class ArrowFunction extends BaseFunction {
  typeParameters: TypeParameterDeclaration[] | undefined;
  parameters: Parameter[];
  body: Block | Expression;
  equalsGreaterThanToken: string;
  constructor(
    modifiers: string[] | undefined,
    typeParameters: TypeParameterDeclaration[] | undefined,
    parameters: Parameter[],
    type: TypeExpression | string | undefined,
    equalsGreaterThanToken: string,
    body: Block | Expression,
    context: GeneratorContext
  ) {
    super(modifiers, typeParameters, parameters, type, body, context);
    this.typeParameters = typeParameters;
    this.parameters = parameters;
    this.body = body;
    this.equalsGreaterThanToken = equalsGreaterThanToken;
  }

  compileTypeParameters() {
    return compileArrowTypeParameters(this.typeParameters);
  }

  toString(options?: toStringOptions) {
    const bodyString = this.body.toString(this.getToStringOptions(options));
    return `${this.modifiers.join(" ")} ${this.compileTypeParameters()}(${
      this.parameters
    })${compileType(this.type?.toString())} ${
      this.equalsGreaterThanToken
    } ${bodyString}`;
  }
}

export const isFunction = (
  expression: Expression
): expression is BaseFunction => expression instanceof BaseFunction;

export const isCall = (expression: Expression): expression is Call =>
  expression instanceof Call;
