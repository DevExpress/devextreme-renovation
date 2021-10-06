import {
  BaseClassMember, Dependency, Method as BaseMethod, toStringOptions,
} from '@devextreme-generator/core';
import { getLocalStateName } from './property';

export function calculateMethodDependency(
  dependency: Dependency[],
  members: BaseClassMember[],
): Dependency[] {
  const twoWayProps = members.filter((m) => m.isState);
  if (twoWayProps.length && dependency.indexOf('props') !== -1) {
    return [
      ...new Set(
        dependency.concat(
          twoWayProps.map((m) => `${getLocalStateName(m.name)}`),
        ),
      ),
    ];
  }
  return dependency;
}

export class Method extends BaseMethod {
  filterDependencies(dependencies: Dependency[]): Dependency[] {
    return dependencies.filter((d) => d !== 'props');
  }

  getDependencyString(options: toStringOptions): string[] {
    const dependencies = calculateMethodDependency(
      super.getDependency(options),
      options.members,
    ).filter((dep) => dep !== this);
    return dependencies.reduce((arr: string[], dep) => ([
      ...arr,
      ...(dep instanceof BaseClassMember ? dep.getDependencyString(options) : dep),
    ]),
    []);
  }
}
