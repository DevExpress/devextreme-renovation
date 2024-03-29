import {
  BaseClassMember, Dependency, Method as BaseMethod, toStringOptions, SyntaxKind, getProps, Decorators,
} from '@devextreme-generator/core';
import { getLocalStateName, Property } from './property';

export function calculateMethodDependencyString(
  method: Method,
  options: toStringOptions,
): string {
  const members = options.members;
  const props = getProps(members);
  const twoWayProps = members.filter((m) => m.isState && props.includes(m as Property));
  const deps = method.getDependency({
    members,
    componentContext: SyntaxKind.ThisKeyword,
  });
  const run = method.decorators
    .find((d) => d.name === Decorators.Effect)
    ?.getParameter('run')
    ?.valueOf();
  if (run === 'always') {
    return '';
  }
  if (deps.indexOf('props') > -1) {
    const depsWithoutProps = deps.filter(
      (d) => !(d instanceof BaseClassMember
          && props.includes(d as Property)),
    );
    const result = depsWithoutProps
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
    return `, [${result}]`;
  }
  const result = method.getDependencyString(options);
  return `, [${result}]`;
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
