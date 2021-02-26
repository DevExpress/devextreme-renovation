import { HeritageClause as BaseHeritageClause } from "../../base-generator/expressions/class";
import { GeneratorContext } from "../../base-generator/types";
import { ExpressionWithTypeArguments } from "../../base-generator/expressions/type";

export class HeritageClause extends BaseHeritageClause {
  constructor(
    token: string,
    types: ExpressionWithTypeArguments[],
    context: GeneratorContext
  ) {
    super(token, types, context);
    this.defaultProps = types.reduce(
      (defaultProps: string[], { type, isJsxComponent }) => {
        const name = type.toString().replace("typeof ", "");
        if (isJsxComponent) {
          defaultProps.push(name);
        } else {
          const component = context.components && context.components[name];
          if (component && component.compileDefaultProps() !== "") {
            defaultProps.push(
              `${component
                .defaultPropsDest()
                .replace(component.name.toString(), name)}${
                type.toString().indexOf("typeof ") === 0 ? "Type" : ""
              }`
            );
          }
        }
        return defaultProps;
      },
      []
    );
  }
}
