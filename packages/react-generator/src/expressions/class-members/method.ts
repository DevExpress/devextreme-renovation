import { getLocalStateName } from './property';
import { BaseClassMember, Method as BaseMethod, toStringOptions } from '@devextreme-generator/core';

export function calculateMethodDependency(
  dependency: string[],
  members: BaseClassMember[]
): string[] {
  const twoWayProps = members.filter((m) => m.isState);
  if (twoWayProps.length && dependency.indexOf("props") !== -1) {
    return [
      ...new Set(
        dependency.concat(
          twoWayProps.map((m) => `${getLocalStateName(m.name)}`)
        )
      ),
    ];
  }
  return dependency;
}

export class Method extends BaseMethod {
  filterDependencies(dependencies: string[]): string[] {
    return dependencies.filter((d) => d !== "props");
  }

  getDependency(options: toStringOptions) {
    return calculateMethodDependency(
      super.getDependency(options),
      options.members
    );
  }
}
