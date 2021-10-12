import { GetAccessor as ReactGetAccessor } from '@devextreme-generator/react';
import {
  toStringOptions, Identifier, Dependency, BaseClassMember,
} from '@devextreme-generator/core';

import { compileGetterCache } from '@devextreme-generator/angular';

export class GetAccessor extends ReactGetAccessor {
  getter(componentContext?: string): string {
    return super.getter(componentContext).replace('()', '');
  }

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

  toString(options?: toStringOptions): string {
    if (options?.isComponent
       && this.body
       && this.isMemorized(options)) {
      const reactAccessor = new ReactGetAccessor(
        this.decorators,
        this.modifiers,
        new Identifier(this.name),
        this.parameters,
        this.type,
        this.body,
      );
      if (reactAccessor?.body) {
        reactAccessor.body.statements = compileGetterCache(
          this._name, this.type, this.body, this.isProvider, false,
        );
        return reactAccessor.toString(options);
      }
    }
    return super.toString(options);
  }
}
