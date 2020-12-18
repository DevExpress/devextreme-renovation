import { ReactGenerator } from "../react-generator/react-generator";
import { Decorator } from "../base-generator/expressions/decorator";
import { Identifier } from "../base-generator/expressions/common";
import { HeritageClause } from "../react-generator/expressions/heritage-clause";
import { Method } from "../react-generator/expressions/class-members/method";
import { InfernoComponent } from "./expressions/inferno-component";
import { TypeExpression } from "../base-generator/expressions/type";
import { Expression } from "../base-generator/expressions/base";
import { Property } from "./expressions/class-members/property";
import { PropertyAccess } from "./expressions/property-access";
import { Parameter } from "../base-generator/expressions/functions";
import { Block } from "../base-generator/expressions/statements";
import { GetAccessor } from "./expressions/class-members/get-accessor";

export class InfernoGenerator extends ReactGenerator {
  // format(code: string) {
  //     return code;
  // }
  createComponent(
    componentDecorator: Decorator,
    modifiers: string[] | undefined,
    name: Identifier,
    typeParameters: string[],
    heritageClauses: HeritageClause[],
    members: Array<Property | Method>
  ) {
    return new InfernoComponent(
      componentDecorator,
      modifiers,
      name,
      typeParameters,
      heritageClauses,
      members,
      this.getContext()
    );
  }

  createProperty(
    decorators: Decorator[],
    modifiers: string[] | undefined,
    name: Identifier,
    questionOrExclamationToken?: string,
    type?: TypeExpression,
    initializer?: Expression
  ) {
    return new Property(
      decorators,
      modifiers,
      name,
      questionOrExclamationToken,
      type,
      initializer
    );
  }

  createGetAccessor(
    decorators: Decorator[] | undefined,
    modifiers: string[] | undefined,
    name: Identifier,
    parameters: Parameter[],
    type?: TypeExpression,
    body?: Block
  ) {
    return new GetAccessor(decorators, modifiers, name, parameters, type, body);
  }

  createPropertyAccess(expression: Expression, name: Identifier) {
    return new PropertyAccess(expression, name);
  }
}
