import { Method, Property } from '../expressions/class-members';
import { VariableDeclaration, VariableStatement } from '../expressions/variables';

import {
  BaseFunction, Parameter,
} from '../expressions/functions';
import { Call, Identifier } from '../expressions/common';
import { BindingPattern } from '../expressions/binding-pattern';
import {
  SimpleTypeExpression, TypeExpression, TypeLiteralNode, TypeReferenceNode,
} from '../expressions/type';
import { Block } from '../expressions/statements';
import { Decorator } from '../expressions/decorator';
import { HeritageClause } from '../expressions/class';
import { Generator } from '../generator';
import { SyntaxKind } from '../syntaxKind';
import { Expression } from '../expressions/base';

function fillFunctionalComponentStateMembers(
  generator: Generator,
  members: (Property | Method)[],
  state: VariableDeclaration,
): void {
  if (state.name instanceof BindingPattern && state.name.elements.length > 0) {
    const stateName = state.name.elements[0].name;
    if (stateName instanceof Identifier && state.initializer instanceof Call) {
      const argumentsArray = state.initializer.argumentsArray;
      members.push(generator.createProperty(
        [generator.createDecorator(new Call(new Identifier('InternalState'), undefined, []))],
        undefined,
        stateName,
        undefined,
        undefined,
        argumentsArray[0],
      ));
      const setStateName = state.name.elements[1]?.name;

      if (setStateName instanceof Identifier) {
        members.push(generator.createMethod(
          [],
          [],
          undefined,
          setStateName,
          undefined,
          undefined,
          [new Parameter(
            [],
            [],
            undefined,
            new Identifier('__val__'),
            undefined,
            'any',
            undefined,
          )],
          new SimpleTypeExpression('void'),
          generator.createBlock(
            [generator.createExpressionStatement(generator.createBinary(
              generator.createPropertyAccess(
                generator.createThis(),
                stateName,
              ),
              generator.createToken(SyntaxKind.EqualsToken),
              generator.createIdentifier('__val__'),
            ))],
            true,
          ),
        ));
      }
    }
  }
}

function fillFunctionalComponentCallbackMembers(
  generator: Generator,
  members: (Property | Method)[],
  callback: VariableDeclaration,
): void {
  if (callback.name instanceof Identifier
    && callback.initializer instanceof Call) {
    const callbackFunc = callback.initializer.argumentsArray[0];
    if (callbackFunc instanceof BaseFunction) {
      members.push(generator.createMethod(
        [],
        [],
        undefined,
        callback.name,
        undefined,
        callbackFunc.typeParameters,
        callbackFunc.parameters,
        callbackFunc.type as TypeExpression, // TODO
        callbackFunc.body as Block, // TODO
      ));
    }
  }
}

function getDefaultValue(parameter: Parameter, name: Identifier): Expression | undefined {
  if (parameter.name instanceof BindingPattern) {
    const foundElement = parameter.name.elements.find(
      (element) => element.name.toString() === name.toString(),
    );
    if (foundElement) {
      return foundElement.initializer;
    }
  }
  return undefined;
}

function fillPropertyMembers(
  generator: Generator,
  members: (Property | Method)[],
  parameter: Parameter,
) {
  if (parameter && parameter.type instanceof TypeLiteralNode) {
    parameter.type.members.forEach((propertySignature) => {
      const defaultValue = getDefaultValue(parameter, propertySignature.name);
      members.push(generator.createProperty(
        [generator.createDecorator(generator.createCall(
          generator.createIdentifier('OneWay'),
          undefined,
          [],
        ))],
        undefined,
        propertySignature.name,
        propertySignature.questionToken,
        propertySignature.type,
        defaultValue,
      ));
    });
  }
}

function createMembers(
  generator: Generator, func: BaseFunction,
): (Property | Method)[] {
  const members: (Property | Method)[] = [];

  fillPropertyMembers(generator, members, func.parameters[0]);

  if (func.body instanceof Block) {
    const variableStatements = func.body.statements.filter(
      (statement) => statement instanceof VariableStatement,
    ) as VariableStatement[];

    variableStatements.forEach((statement: VariableStatement) => {
      statement.declarationList.declarations.forEach((variable: VariableDeclaration) => {
        if (variable.initializer instanceof Call) {
          const callbackName = variable.initializer.expression.toString();
          if (callbackName === 'useState') {
            fillFunctionalComponentStateMembers(generator, members, variable);
          }

          if (callbackName === 'useCallback') {
            fillFunctionalComponentCallbackMembers(generator, members, variable);
          }
        }
      });
    });
  }

  return members;
}

function createDecorator(
  generator: Generator, name: string,
): Decorator {
  return generator.createDecorator(generator.createCall(
    generator.createIdentifier('Component'),
    undefined,
    [generator.createObjectLiteral(
      [
        generator.createShorthandPropertyAssignment(
          generator.createIdentifier('view'),
          generator.createIdentifier(name),
        ),
        generator.createPropertyAssignment(
          generator.createIdentifier('defaultOptionRules'),
          generator.createNull(),
        ),
      ],
      true,
    )],
  ));
}

function craeteHeritageClauses(
  generator: Generator, func: BaseFunction,
): HeritageClause[] {
  const type = func.parameters[0]?.type;
  return type && type instanceof TypeReferenceNode
    ? [generator.createHeritageClause(
      SyntaxKind.ExtendsKeyword,
      [generator.createExpressionWithTypeArguments(
        undefined,
        generator.createCall(
          generator.createIdentifier('JSXComponent'),
          undefined,
          [type],
        ),
      )],
    )] : [];
}

export function createFunctionalComponentParameters(
  generator: Generator, name: string, func: BaseFunction,
): {
    members: (Property | Method)[],
    decorator: Decorator,
    heritageClauses: HeritageClause[]
  } {
  return {
    members: createMembers(generator, func),
    decorator: createDecorator(generator, name),
    heritageClauses: craeteHeritageClauses(generator, func),
  };
}
