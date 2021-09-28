import {
  BaseClassMember,
  Dependency,
  dependencySet,
  GetAccessor as BaseGetAccessor,
  toStringOptions,
} from '@devextreme-generator/core';
import { calculateMethodDependency } from './method';

export class GetAccessor extends BaseGetAccessor {
  getter(componentContext?: string): string {
    return `${super.getter(componentContext)}()`;
  }

  reduceDependencies(
    dependencies: Dependency[],
    options: toStringOptions,
    startingArray: Dependency[] = [],
  ): Dependency[] {
    const reduceDependencies = dependencies
      .reduce((arr: BaseClassMember[], dep) => arr.concat(dep.members), []);
    const depsReducer = (d: Dependency[], p: BaseClassMember) => {
      if (p instanceof GetAccessor) {
        return d.concat(new Dependency(p.getter(), [p]));
      }
      return d.concat(
        p!.getDependency({
          ...options,
          members: options.members.filter((p) => p.name !== this.name),
        }),
      );
    };
    return reduceDependencies.reduce(depsReducer, startingArray);
  }

  getDependency(options: toStringOptions): Dependency[] {
    const dependency = this.body?.getDependency(options) || [];
    const destructuredDependencies = dependencySet(dependency).filter((d) => d.name.includes('().'));
    // rework this ().
    return calculateMethodDependency(
      super.getDependency(options).concat(destructuredDependencies),
      options.members,
    );
  }

  baseGetDependency(options: toStringOptions): Dependency[] {
    return calculateMethodDependency(
      super.getDependency(options),
      options.members,
    );
  }
}
