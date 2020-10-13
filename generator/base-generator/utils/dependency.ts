import { Expression } from "../expressions/base";
import { BaseClassMember } from "../expressions/class-members";
import { toStringOptions } from "../types";

export function checkDependency(
  expression: Expression,
  properties: Array<BaseClassMember>,
  options: toStringOptions
) {
  const dependency = expression
    .getAllDependency(options)
    .reduce((r: { [name: string]: boolean }, d) => {
      r[d] = true;
      return r;
    }, {});

  return properties.find((s) => dependency[s.name.toString()]);
}
