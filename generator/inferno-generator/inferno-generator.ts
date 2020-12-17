import { ReactGenerator } from "../react-generator/react-generator";
import { Decorator } from "../base-generator/expressions/decorator";
import { Identifier } from "../base-generator/expressions/common";
import { HeritageClause } from "../react-generator/expressions/heritage-clause";
import { Property } from "../react-generator/expressions/class-members/property";
import { Method } from "../react-generator/expressions/class-members/method";
import { InfernoComponent } from "./expressions/inferno-component";

export class InfernoGenerator extends ReactGenerator {
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
}
