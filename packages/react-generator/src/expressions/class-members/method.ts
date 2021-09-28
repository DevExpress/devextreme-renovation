import {
  BaseClassMember, Dependency, dependencySet, Method as BaseMethod, toStringOptions,
} from '@devextreme-generator/core';
import { getLocalStateName } from './property';
import { GetAccessor } from './get-accessor';

export function calculateMethodDependency(
  dependency: Dependency[],
  members: BaseClassMember[],
): Dependency[] {
  const twoWayProps = members.filter((m) => m.isState);
  if (twoWayProps.length && dependency.findIndex((dep) => dep.name === 'props') !== -1) {
    return dependencySet(
      dependency.concat(
        twoWayProps.map((m) => new Dependency(`${getLocalStateName(m.name)}`, [m])),
      ),
    );
  }
  return dependency;
}

export class Method extends BaseMethod {
  filterDependencies(dependencies: Dependency[]): Dependency[] {
    return dependencies.filter((d) => d.name !== 'props');
  }

  reduceDependencies(
    dependencies: Dependency[],
    options: toStringOptions,
    startingArray: Dependency[] = [],
  ): Dependency[] {
    const reduceDependencies = dependencies
      .reduce((arr: BaseClassMember[], dep) => arr.concat(dep.members), []);
    const depsReducer = (d: Dependency[], p: BaseClassMember) => (p instanceof GetAccessor
      ? d.concat(new Dependency(p?.getter(), [p]))
      : d.concat(
        p!.getDependency({
          ...options,
          members: options.members.filter((p) => p.name !== this.name),
        }),
      ));
    return reduceDependencies.reduce(depsReducer, startingArray);
  }

  getDependency(options: toStringOptions): Dependency[] {
    return calculateMethodDependency(
      super.getDependency(options),
      options.members,
    );
  }
}
