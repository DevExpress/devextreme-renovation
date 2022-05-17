import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { MutableRefObject } from 'react';

interface WidgetWithRefPropInputType {
  parentRef?: MutableRefObject<any>;
  nullableRef?: MutableRefObject<any>;
}
export const WidgetWithRefPropInput = {} as Partial<WidgetWithRefPropInputType>;
import * as React from 'react';
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetWithRefPropInputModel = Required<
  Omit<GetPropsType<typeof WidgetWithRefPropInput>, 'parentRef' | 'nullableRef'>
> &
  Partial<
    Pick<
      GetPropsType<typeof WidgetWithRefPropInput>,
      'parentRef' | 'nullableRef'
    >
  >;
interface WidgetWithRefProp {
  props: WidgetWithRefPropInputModel & RestProps;
  restAttributes: RestProps;
}
export default function WidgetWithRefProp(
  inProps: typeof WidgetWithRefPropInput & RestProps
) {
  const props = combineWithDefaultProps<WidgetWithRefPropInputModel>(
    WidgetWithRefPropInput,
    inProps
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, parentRef, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}

function view(viewModel: WidgetWithRefProp) {
  return <div></div>;
}
