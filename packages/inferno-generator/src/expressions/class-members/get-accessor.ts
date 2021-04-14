import { GetAccessor as ReactGetAccessor } from '@devextreme-generator/react';

export class GetAccessor extends ReactGetAccessor {
  getter(componentContext?: string) {
    return super.getter(componentContext).replace('()', '');
  }
}
