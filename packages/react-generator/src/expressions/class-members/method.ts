import {
  BaseClassMember, Dependency, Method as BaseMethod, toStringOptions, SyntaxKind, getProps,
} from '@devextreme-generator/core';
import { getLocalStateName, Property } from './property';

export function calculateMethodDependencyString(
  method: BaseMethod,
  options: toStringOptions,
): string[] {
  const members = options.members;
  const props = getProps(members);
  const twoWayProps = members.filter((m) => m.isState && props.includes(m as Property));
  const deps = method.getDependency({
    members,
    componentContext: SyntaxKind.ThisKeyword,
  });

  if (deps.indexOf('props') > -1) {
    const depsWithoutProps = deps.filter(
      (d) => !(d instanceof BaseClassMember
          && props.includes(d as Property)),
    );
    return depsWithoutProps
      .reduce((arr: string[], dep) => {
        if (dep instanceof BaseClassMember) {
          if (dep instanceof BaseMethod) {
            return [...arr, dep.name];
          }
          return [...arr, ...dep.getDependencyString(options)];
        }
        return [...arr, dep];
      }, [])
      .concat(twoWayProps.map((p) => getLocalStateName(p.name)));
  }
  return deps.reduce((arr: string[], dep) => {
    if (dep instanceof BaseClassMember) {
      if (dep instanceof BaseMethod) {
        return [...arr, dep.name];
      }
      return [...arr, ...dep.getDependencyString(options)];
    }
    return [...arr, dep];
  }, []);
  // return method.getDependencyString(options) -> change BaseMethod to ReactMethod
}

export class Method extends BaseMethod {
  filterDependencies(dependencies: Dependency[]): Dependency[] {
    return dependencies.filter((d) => d !== 'props');
  }

  reduceDependency(
    dependencies: Dependency[],
    options: toStringOptions,
    startingDeps: Dependency[] = [],
  ): Dependency[] {
    const members = options.members;
    const depsReducer = (d: Dependency[], p: Dependency) => {
      if (p instanceof BaseClassMember) {
        if (p instanceof BaseMethod) { // method or getAccessor?
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
