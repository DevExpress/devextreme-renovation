import { Expression } from '../expressions/base';
import { BaseClassMember } from '../expressions/class-members';
import { toStringOptions } from '../types';

export function checkDependency(
  expression: Expression,
  properties: Array<BaseClassMember>,
  options: toStringOptions,
) {
  const dependency = expression
    .getAllDependency(options)
    .reduce((r: { [name: string]: boolean }, d) => {
      const name = d instanceof BaseClassMember ? d._name.toString() : d;
      r[name] = true;
      return r;
    }, {});

  return properties.find((s) => dependency[s.name.toString()]);
}

export type Dependency = BaseClassMember | string;
const declarationsRegex = /(devextreme\/runtime\/)declarations/i;

export const replaceDeclarationPath = (path: string, platform: string): string => path.replace(declarationsRegex, `$1${platform}`);
