import Generator from "../../base-generator";
import {
  Property,
  Method,
} from "../../base-generator/expressions/class-members";
import { Expression } from "../../base-generator/expressions/base";

export default function (generator: Generator) {
  function createComponentDecorator(parameters: { [name: string]: any }) {
    return generator.createDecorator(
      generator.createCall(
        generator.createIdentifier("Component"),
        [],
        [
          generator.createObjectLiteral(
            Object.keys(parameters).map((k) =>
              generator.createPropertyAssignment(
                generator.createIdentifier(k),
                parameters[k]
              )
            ),
            false
          ),
        ]
      )
    );
  }

  function createDecorator(name: string, parameters?: { [name: string]: any }) {
    const params = !parameters
      ? []
      : [
          generator.createObjectLiteral(
            Object.keys(parameters).map((k) =>
              generator.createPropertyAssignment(
                generator.createIdentifier(k),
                parameters[k]
              )
            ),
            false
          ),
        ];
    return generator.createDecorator(
      generator.createCall(generator.createIdentifier(name), [], params)
    );
  }

  function createComponent(
    properties: Array<Property | Method> = [],
    parameters: { [name: string]: Expression } = {}
  ) {
    return generator.createComponent(
      createComponentDecorator(parameters),
      [],
      generator.createIdentifier("BaseWidget"),
      [],
      [],
      properties
    );
  }

  return {
    createComponentDecorator,
    createDecorator,
    createComponent,
  };
}
