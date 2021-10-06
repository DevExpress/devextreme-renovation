import {
  BaseClassMember,
  GetAccessor as BaseGetAccessor,
  toStringOptions,
} from '@devextreme-generator/core';
import { calculateMethodDependency } from './method';

export class GetAccessor extends BaseGetAccessor {
  getter(componentContext?: string): string {
    return `${super.getter(componentContext)}()`;
  }

  getDependencyString(options: toStringOptions): string[] {
    const dependencies = calculateMethodDependency(
      super.getDependency(options),
      options.members,
    );
    return dependencies.reduce((arr: string[], dep) => ([
      ...arr,
      ...(dep instanceof BaseClassMember ? dep.getDependencyString(options) : dep),
    ]),
    []);
  }
}
