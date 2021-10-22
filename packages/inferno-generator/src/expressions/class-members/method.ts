import {
  toStringOptions, compileType, Dependency, BaseClassMember,
} from '@devextreme-generator/core';
import { Method as ReactMethod } from '@devextreme-generator/react';

export class Method extends ReactMethod {
  reduceDependency(
    dependencies: Dependency[],
    options: toStringOptions,
    startingDeps: Dependency[] = [],
  ): Dependency[] {
    const members = options.members;
    const depsReducer = (d: Dependency[], p: Dependency) => {
      if (p instanceof BaseClassMember) {
        return [...d, ...p.getDependency({
          ...options,
          members: members.filter((m) => m !== p),
        })];
      }
      const member = members.find((m) => m._name.toString() === p);
      return [...d, member || p];
    };
    return dependencies.reduce(depsReducer, startingDeps);
  }

  getDependencyString(options: toStringOptions): string[] {
    const dependencies = this.getDependency(options).filter((dep) => dep !== this);
    return dependencies.reduce((arr: string[], dep) => (dep instanceof BaseClassMember
      ? [...arr, ...dep.getDependencyString(options)]
      : [...arr, dep]),
    []);
  }

  toString(options?: toStringOptions) {
    if (options) {
      return `${this.modifiers.join(' ')} ${
        this.name
      }${this.compileTypeParameters()}(${this.parameters})${compileType(
        this.type.toString(),
      )}${this.body?.toString(options)}`;
    }

    return super.toString();
  }
}
