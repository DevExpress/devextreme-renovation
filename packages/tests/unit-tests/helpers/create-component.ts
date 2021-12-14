import Generator, { Expression, Method, Property } from '@devextreme-generator/core';

export default function <G extends Generator>(generator: G) {
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
    ) as ReturnType<G["createDecorator"]>;;
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
    ) as ReturnType<G["createDecorator"]>;
  }

  function createComponent(
    properties: Array<Property | Method> = [],
    parameters: { [name: string]: Expression } = {}
  ) {
    return generator.createClassDeclaration(
      [createComponentDecorator(parameters)],
      [],
      generator.createIdentifier("BaseWidget"),
      [],
      [],
      properties
    ) as ReturnType<G["createClassDeclaration"]>;
  }

  return {
    createComponentDecorator,
    createDecorator,
    createComponent,
  };
}
