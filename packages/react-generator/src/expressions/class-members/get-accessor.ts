import {
  BaseClassMember,
  GetAccessor as BaseGetAccessor,
  toStringOptions,
  Method as BaseMethod,
  Dependency,
} from '@devextreme-generator/core';

export class GetAccessor extends BaseGetAccessor {
  getter(componentContext?: string, options?: toStringOptions): string {
    const isMemorized = this.isMemorized(options, false);
    return `${super.getter(componentContext)}${isMemorized ? '' : '()'}`;
  }

  reduceDependency(
    dependencies: Dependency[],
    options: toStringOptions,
    startingDeps: Dependency[] = [],
  ): Dependency[] {
    const members = options.members;
    const depsReducer = (d: Dependency[], p: Dependency) => {
      if (p instanceof BaseClassMember) {
        if (p instanceof BaseMethod) {
          return [...d, p];
        }
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
    return dependencies.reduce((arr: string[], dep) => {
      if (dep instanceof BaseClassMember) {
        if (dep instanceof BaseMethod) {
          return [...arr, dep.name];
        }
        return [...arr, ...dep.getDependencyString(options)];
      }
      return [...arr, dep];
    },
    []);
  }
}
