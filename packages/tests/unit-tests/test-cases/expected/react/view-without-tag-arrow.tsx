import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
const view = (model: Widget): any => model.props.children;

interface WidgetInputType {
  children?: React.ReactNode;
}

const WidgetInput = {} as Partial<WidgetInputType>;
import * as React from 'react';
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetInputModel = Required<
  Omit<GetPropsType<typeof WidgetInput>, 'children'>
> &
  Partial<Pick<GetPropsType<typeof WidgetInput>, 'children'>>;
interface Widget {
  props: WidgetInputModel & RestProps;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<WidgetInputModel>(WidgetInput, inProps);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({ props: { ...props }, restAttributes: __restAttributes() });
}
