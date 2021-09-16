import { BaseClassMember, Method as BaseMethod, toStringOptions } from '@devextreme-generator/core';
import { getLocalStateName, Property } from './property';
import { GetAccessor } from './get-accessor';

export function calculateMethodDependency(
  dependency: string[],
  members: BaseClassMember[],
): string[] {
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
  filterDependencies(dependencies: string[]): string[] {
    return dependencies.filter((d) => d !== 'props');
  }

  reduceDependencies(
    dependencies: (Method | Property | undefined)[],
    options: toStringOptions,
    startingArray: string[] = [],
  ): string[] {
    const depsReducer = (d: string[], p: Method | Property | undefined) => (p instanceof GetAccessor
      ? d.concat(p?.getter())
      : d.concat(
        p!.getDependency({
          ...options,
          members: options.members.filter((p) => p !== this),
        }),
      ));
    return dependencies.reduce(depsReducer, startingArray);
  }

  getDependency(options: toStringOptions) {
    return calculateMethodDependency(
      super.getDependency(options),
      options.members,
    );
  }
}
