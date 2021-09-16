import {
  GetAccessor as BaseGetAccessor,
  toStringOptions,
} from '@devextreme-generator/core';
import { calculateMethodDependency, Method } from './method';
import { Property } from './property';

export class GetAccessor extends BaseGetAccessor {
  getter(componentContext?: string): string {
    return `${super.getter(componentContext)}()`;
  }

  reduceDependencies(
    dependencies: (Method | Property | undefined)[],
    options: toStringOptions,
    startingArray: string[] = [],
  ): string[] {
    const depsReducer = (d: string[], p: Method | Property | undefined) => {
      if (p instanceof GetAccessor) {
        // debugger;
        return d.concat(p.getter());
      }
      return d.concat(
        p!.getDependency({
          ...options,
          members: options.members.filter((p) => p !== this),
        }),
      );
    };
    return dependencies.reduce(depsReducer, startingArray);
  }

  getDependency(options: toStringOptions): string[] {
    const dependency = this.body?.getDependency(options);
    const destructuredDependencies = [...new Set(dependency)].filter((d) => d.includes('().'));
    return calculateMethodDependency(
      super.getDependency(options).concat(destructuredDependencies),
      options.members,
    );
  }

  baseGetDependency(options: toStringOptions): string[] {
    return calculateMethodDependency(
      super.getDependency(options),
      options.members,
    );
  }
}
