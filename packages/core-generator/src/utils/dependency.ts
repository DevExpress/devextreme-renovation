import { Expression } from '../expressions/base';
import { BaseClassMember } from '../expressions/class-members';
import { toStringOptions } from '../types';

export class Dependency {
  name: string;

  members: BaseClassMember[];

  constructor(name: string, members?: BaseClassMember[]) {
    this.name = name;
    this.members = members || [];
  }

  idString(): string {
    return `name: ${this.name}; members:[${this.members.map((member) => member.name).join(', ')}]`;
  }

  toString() {
    return this.name;
  }
}

export function dependencySet(dependency: Dependency[]): Dependency[] {
  const depMap = new Map();
  dependency.forEach((dep) => depMap.set(dep.idString(), dep));
  return Array.from(depMap.values());
}

export function checkDependency(
  expression: Expression,
  properties: Array<BaseClassMember>,
  options: toStringOptions,
) {
  const dependency = expression
    .getAllDependency(options)
    .reduce((r: { [name: string]: boolean }, d) => {
      r[d.name] = true;
      return r;
    }, {});

  return properties.find((s) => dependency[s.name.toString()]);
}

const declarationsRegex = /(devextreme\/runtime\/)declarations/i;

export const replaceDeclarationPath = (path: string, platform: string): string => path.replace(declarationsRegex, `$1${platform}`);
