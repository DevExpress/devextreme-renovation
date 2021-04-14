import {
  GetAccessor as BaseGetAccessor,
  toStringOptions,
} from '@devextreme-generator/core';
import { calculateMethodDependency } from './method';

export class GetAccessor extends BaseGetAccessor {
  getter(componentContext?: string) {
    return `${super.getter(componentContext)}()`;
  }

  getDependency(options: toStringOptions) {
    return calculateMethodDependency(
      super.getDependency(options),
      options.members,
    );
  }
}
