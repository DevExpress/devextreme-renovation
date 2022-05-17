import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
export const COMPONENT_INPUT_CLASS = 'c3';
function view(model: Widget) {
  return <div></div>;
}

interface WidgetPropsType {
  height?: number;
  width?: number;
  children?: React.ReactNode;
}
export const WidgetProps = {
  height: 10,
  width: 10,
} as Partial<WidgetPropsType>;
import * as React from 'react';
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type WidgetPropsModel = Required<
  Omit<GetPropsType<typeof WidgetProps>, 'children'>
> &
  Partial<Pick<GetPropsType<typeof WidgetProps>, 'children'>>;
interface Widget {
  props: WidgetPropsModel & RestProps;
  onClick: () => any;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetProps & RestProps) {
  const props = combineWithDefaultProps<WidgetPropsModel>(WidgetProps, inProps);

  const __onClick = useCallback(
    function __onClick(): any {
      const v = props.height;
    },
    [props.height]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, height, width, ...restProps } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    onClick: __onClick,
    restAttributes: __restAttributes(),
  });
}
