import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import BaseProps from './component-bindings-only';
const view = (model: Widget) => <span />;

export interface PropsI {
  p: string;
}

interface WidgetI {
  onClick(): void;
}

interface WidgetInputType extends GetPropsType<typeof BaseProps> {
  p?: string;
}

const WidgetInput = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BaseProps),
    Object.getOwnPropertyDescriptors({
      p: '10',
    })
  )
) as Partial<WidgetInputType>;
import { useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

interface Widget {
  props: Required<GetPropsType<typeof WidgetInput>> & RestProps;
  onClick: () => void;
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof WidgetInput & RestProps) {
  const props = combineWithDefaultProps<
    Required<GetPropsType<typeof WidgetInput>>
  >(WidgetInput, inProps);

  const __onClick = useCallback(function __onClick(): void {}, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { data, height, info, p, ...restProps } = props;
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
